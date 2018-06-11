// import * as chalk from 'chalk';
import * as chokidar from "chokidar";
// import * as path from 'path';
import * as fs from "fs";

import {
    deb,
    filesAreEqual,
    getDestFileMaker,
    print,
} from "../util/utils";

import {IStats} from "../util/interfaces";

import {
    createBaseDirectories,
    folderOrFileExists,
    recursiveDeleteDirectory,
} from "../util/filesystem";

export const readyListener = (src: string, dst: string) => () => {
    print("Watcher Ready !", src, dst);
};

export const unLinkDirListener = (src: string, dst: string) => async (observedPath: string) => {
    const dstDir = getDestFileMaker(src, dst)(observedPath);
    print("UnlinkDir", observedPath, dstDir);
    if (await !folderOrFileExists(dstDir)) {
        deb("%s already handled.", dstDir);
        return;
    }
    try {
        await recursiveDeleteDirectory(dstDir);
    } catch (error) {
        deb("error deleting directory: %s", dstDir);
    }
};

export const unLinkListener = (src: string, dst: string) => async (observedPath: string) => {
    const dstDir = getDestFileMaker(src, dst)(observedPath);
    print("Unlink", observedPath, dstDir);
    fs.unlink(dstDir, async (err) => {
        if (err) {
            const exists = await folderOrFileExists(dstDir);
            if (!exists) {
                deb("Unlink already handled %s OK", dstDir);
                return;
            }
            deb("ERR unlink %o", err);
            return;
        } else {
            deb("Unlink %s OK", dstDir);
        }
    });
};

export const changeListener = (src: string, dst: string) => (observedPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(observedPath);
    print("Change", observedPath, dstDir);
    fs.copyFile(observedPath, dstDir, (err) => {
        if (err) {
            deb("ERR change -> copy %o", err);
            return;
        }
        deb("change > copy %s OK", dstDir);
    });

};

export const addListener = (src: string, dst: string) => async (observedPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(observedPath);
    print("Add", observedPath, dstDir);
    if (await folderOrFileExists(dstDir)) {
        deb("Exists %s. Compare...", dstDir);
        if (await filesAreEqual(dstDir, observedPath)) {
            deb("Same file %s and %s. SKIP ADD", observedPath, dstDir);
            return;
        }
        deb("add - files are different %s - %s", observedPath, dstDir);
        fs.unlink(dstDir, (err) => {
            if (err) {
                deb("File %s not unlinked.", dstDir);
            } else {
                deb("File %s successfully unlinked... Ready to copy the new version", dstDir);
            }

        });
    }
    const ok = await createBaseDirectories(dstDir);
    if (!ok) {
        deb("Error creating base directories for %s", dstDir);
    }
    fs.copyFile(observedPath, dstDir, (err) => {
        if (err) {
            deb("ERR add | -> copy %o", err);
            return;
        }
        deb("add > copy %s OK", dstDir);
    });
};

export const addDirListener = (src: string, dst: string) => async (observedPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(observedPath);
    print("AddDirectory", observedPath, dstDir);
    if (await folderOrFileExists(dstDir)) {
        deb("Dir %s already exists. SKIP MKDIR.", dstDir);
        return;
    }
    fs.mkdir(dstDir, (err) => {
        if (err) {
            deb("ERR mkdir %o", err);
            return;
        }
        deb("mkdir %s OK", dstDir);
    });
};
