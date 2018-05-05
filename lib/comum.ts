// import * as chalk from 'chalk';
import * as chokidar from 'chokidar';
import * as path from 'path';

import {
    log,
    makeWatcher,
    returnAbsolutePath,
} from './util/utils';

import {
    readyListener,
    changeListener,
    unLinkDirListener,
    addDirListener,
    addListener,
    unLinkListener,
} from './listeners/listeners'

export const comum = (sharedFolder: string, dstFolder: string) => {
    const src = returnAbsolutePath(sharedFolder);
    const dst = returnAbsolutePath(dstFolder);
    
    const watcher = makeWatcher(src);

    watcher.on('ready', readyListener(src, dst));
    watcher.on('change', changeListener(src, dst));
    watcher.on('add', addListener(src, dst));
    watcher.on('addDir', addDirListener(src, dst));
    watcher.on('unlinkDir', unLinkDirListener(src, dst));
    watcher.on('unlink', unLinkListener(src, dst));
}

export const test = () => {
    comum(
        '../../Downloads/teste/src',
        '../../Downloads/teste/dst',
    );
};
