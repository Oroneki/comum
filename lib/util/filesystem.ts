import * as fs from "fs";
import * as path from "path";
import {
    deb,
    log,
} from "./utils";

import { EFileDirectoryNotExists } from "./interfaces";

export const folderOrFileExists = (folderOrFile: string) => new Promise(
    (resolve, reject) => {
        fs.access(folderOrFile, fs.constants.R_OK, (err) => {
            if (err) {
                resolve(false);
            }
            resolve(true);
        });
    },
);

export const parentExists = async (fullpath: string): Promise<string | null> => {
    if (await folderOrFileExists(fullpath)) {
        return fullpath;
    }

    if (fullpath.split(path.sep).length <= 1) {
        return null;
    }

    const menosum = path.dirname(fullpath);
    return await parentExists(menosum);
};

export const isFile1OrDirectory2OrNotExists0 = (fullpath: string): Promise<EFileDirectoryNotExists> => {
    return new Promise((resolve, reject) => {
        fs.stat(fullpath, (err, stats) => {
            if (err) {
                deb("[isFile1OrDirectory2OrNotExists0] NotExists %s", fullpath);
                resolve(EFileDirectoryNotExists.notExists);
                return;
            }
            if (stats.isDirectory()) {
                deb("[isFile1OrDirectory2OrNotExists0] %s is directory", fullpath);
                resolve(EFileDirectoryNotExists.directory);
                return;

            }
            if (stats.isFile()) {
                deb("[isFile1OrDirectory2OrNotExists0] %s is file", fullpath);
                resolve(EFileDirectoryNotExists.file);
                return;
            }
            // impossible ??? :)
            deb("[isFile1OrDirectory2OrNotExists0] OH NOO! -> %s {impossible!!!}", fullpath);
            reject("Not a directory nor a file!");
            return;
        });
    });
};

export const notExistTailList = async (fullpath: string) => {
    const parentThatExists = await parentExists(fullpath);
    if (parentThatExists === null) {
        return null;
    }
    const srcList = parentThatExists.split(path.sep);
    const fullpathList = fullpath.split(path.sep);
    return fullpathList.slice(srcList.length);

};

export const createBaseDirectories = async (dstFullPath: string): Promise<boolean> => {
    const tailList = await notExistTailList(dstFullPath);
    const dirBase = await parentExists(dstFullPath);
    if (tailList === null || dirBase === null) {
        return true;
    }
    let newPath = dirBase;
    tailList.slice(0, -1).forEach((pedaco) => {
        newPath = path.resolve(newPath, pedaco);
        log(newPath);
        fs.mkdir(newPath, (err) => {
            if (err) {
                log(err);
                return false;
            }
        });
    });
    return true;
};

export const listAllInsideDir = (fullpath: string): Promise<string[]> => {
    let level = 0;
    // deb(" --- listAllInsideDir --- ");
    return new Promise((resolve, reject) => {
        fs.readdir(fullpath, (err, files) => {
            if (err) {
                deb("err readdir %o", err);
                reject(err);
            }
            // deb("readdir -> files:\n%0", files);
            level = level + files.length;
            // deb("level %d", level);
            resolve(files);
        });
    });
};

export const recursiveListInsideDir = async (
    fullpath: string,
): Promise<[string[], string[]]> => {
    const initialPath = fullpath;
    let listaoArquivos: string[] = [];
    let listaoDirectories: string[] = [];
    const lista = await listAllInsideDir(initialPath);
    deb("recursive -> Path: %s ---> lista: %O", initialPath, lista);
    for (const element of lista) {
        const childFullPath = path.resolve(initialPath, element);
        deb("     childFullPath -> %s", childFullPath);
        const classification = await isFile1OrDirectory2OrNotExists0(childFullPath);
        deb("     %s eh %d", childFullPath, classification);
        switch (classification) {
            case EFileDirectoryNotExists.file:
                listaoArquivos = listaoArquivos.concat(childFullPath);
                deb("                arquivo");
                break;
            case EFileDirectoryNotExists.directory:
                const [
                    novaListaArquivos,
                    novaListaDirectories,
                ] = await recursiveListInsideDir(childFullPath);
                deb("                diretorio (%O)", novaListaArquivos);
                listaoArquivos = listaoArquivos.concat(...novaListaArquivos);
                listaoDirectories = listaoDirectories.concat(childFullPath, ...novaListaDirectories);
                break;
            default:
                break;
        }
    }
    deb("retornar de %s com listao %O", fullpath, listaoArquivos);
    return [listaoArquivos, listaoDirectories];
};

export const awaitableRmDir = (directory: string) => {
    deb("awaitableRmDir");
    return new Promise((res, rej) => {
        deb("awaitableRmDir - inside Promise");
        fs.rmdir(directory, (err) => {
            if (err) {
                deb("Err deleting directory: %s --> %O", directory, err);
                rej(err);
                return;
            }
            deb("Directory deleted: %s", directory);
            res();
            return;
        });
    });
};

export const recursiveDeleteDirectory = async (fullpath: string) => {
    let allFiles: string[];
    let allSubDirs: string[];
    try {
        [allFiles, allSubDirs] = await recursiveListInsideDir(fullpath);
    } catch (err) {
        deb("error: recursiveDeleteDirectory: %o", err);
        return;
    }
    allFiles = allFiles
        .sort((a, b) => a.length > b.length ? -1 : 1);
    for (const file of allFiles) {
        fs.unlink(file, (err) => {
            if (err) {
                deb("Err deleting file: %s --> %O", file, err);
                return;
            }
            deb("File deleted: %s", file);
        });
    }

    allSubDirs = allSubDirs
        .sort((a, b) => a.length > b.length ? -1 : 1);
    for (const dir of allSubDirs) {
        try {
            await awaitableRmDir(dir);
        } catch (error) {
            deb("error: recursiveDeleteDirectory: %s ->> %o", dir, error);
        }
    }
    try {
        await awaitableRmDir(fullpath);
    } catch (error) {
        deb("error: recursiveDeleteDirectory: [%s] %o", fullpath, error);
    }
};
