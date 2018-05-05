// import * as chalk from 'chalk';
import * as chokidar from "chokidar";
// import * as path from 'path';
import * as fs from 'fs';

import {
    log,
    makeWatcher,
    returnAbsolutePath,
    getDestFileMaker,
    filesAreEqual,
} from '../util/utils';

import {IStats} from '../util/interfaces';

import {
    createBaseDirectories,
    folderOrFileExists,
} from '../util/filesystem';

export const readyListener = (src: string, dst: string) => () => {
    log('Monitoring ', src, '-->', dst);
}

export const unLinkDirListener = (src: string, dst: string) => (targetPath: string) => {
    const dstDir = getDestFileMaker(src, dst)(targetPath);
    log(`Deleted ${targetPath} -> ${dstDir}`);
    fs.rmdir(dstDir, (err) => {
        if (err) {
            log('ERRO', err);
            return
        }
        log('OK')
    });
}

export const unLinkListener = (src: string, dst: string) => (targetPath: string) => {
    const dstDir = getDestFileMaker(src, dst)(targetPath);
    log(`Deleted ${targetPath} -> ${dstDir}`);
    fs.unlink(dstDir, (err) => {
        if (err) {
            log('ERRO', err);
            return
        }
        log('OK')
    });
}

export const changeListener = (src: string, dst: string) => (targetPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(targetPath);
    log(`File changed: ${targetPath} --> ${dstDir}`);
    fs.copyFile(targetPath, dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })

}

export const addListener = (src: string, dst: string) => async (targetPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(targetPath);
    log(`File created: ${targetPath} --> ${dstDir}`);
    if (await folderOrFileExists(dstDir)) {
        log(` Exists ${dstDir}. Compare...`);
        if (await filesAreEqual(dstDir, targetPath)) {
            log(' Arquivos iguais... pula');
            return
        }
        log('diff!');
        fs.unlink(dstDir, (err) => err ? null : log('apagou pra copiar'))
    }
    const ok = await createBaseDirectories(dstDir);
    if (!ok) {
        log('Erro na criacao dos subdiretorios')
    }
    fs.copyFile(targetPath, dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })
}

export const addDirListener = (src: string, dst: string) => (targetPath: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(targetPath);
    log(`File created: ${targetPath} --> ${dstDir}`);
    fs.mkdir(dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })    
}