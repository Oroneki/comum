// import * as chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as path from 'path';
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

export const unLinkDirListener = (src: string, dst: string) => (path: string) => {
    const dstDir = getDestFileMaker(src, dst)(path);
    log(`Deleted ${path} -> ${dstDir}`);
    fs.rmdir(dstDir, (err) => {
        if (err) {
            log('ERRO', err);
            return
        }
        log('OK')
    });
}

export const unLinkListener = (src: string, dst: string) => (path: string) => {
    const dstDir = getDestFileMaker(src, dst)(path);
    log(`Deleted ${path} -> ${dstDir}`);
    fs.unlink(dstDir, (err) => {
        if (err) {
            log('ERRO', err);
            return
        }
        log('OK')
    });
}

export const changeListener = (src: string, dst: string) => (path: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(path);
    log(`File changed: ${path} --> ${dstDir}`);
    fs.copyFile(path, dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })

}

export const addListener = (src: string, dst: string) => async (path: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(path);
    log(`File created: ${path} --> ${dstDir}`);
    if (await folderOrFileExists(dstDir)) {
        log(` Exists ${dstDir}. Compare...`);
        if (await filesAreEqual(dstDir, path)) {
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
    fs.copyFile(path, dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })
}

export const addDirListener = (src: string, dst: string) => (path: string, stats: IStats) => {
    const dstDir = getDestFileMaker(src, dst)(path);
    log(`File created: ${path} --> ${dstDir}`);
    fs.mkdir(dstDir, (err) => {
        if (err) {
            log('Erro copia', err)
            return
        }
        log('OK')
    })    
}