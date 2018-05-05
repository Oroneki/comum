import * as fs from 'fs';
import * as path from 'path';
import {log} from './utils'

import { EFileDirectoryNotExists } from './interfaces'

export const folderOrFileExists = (folderOrFile: string) => new Promise(
    (resolve, reject) => {
        fs.access(folderOrFile, fs.constants.R_OK, (err) => {
            if (err) {
                resolve(false);
            }
            resolve(true);
          });
    }
);

export const parentExists = async (fullpath: string): Promise<string|null> => {
    if (await folderOrFileExists(fullpath)) {
        return fullpath;
    };

    if (fullpath.split(path.sep).length <= 1) {
        return null;
    };

    const menosum = path.dirname(fullpath);    
    return await parentExists(menosum);
}

export const isFile1OrDirectory2OrNotExists0 = (fullpath: string): Promise<EFileDirectoryNotExists> => {
    return new Promise((resolve, reject) => {
        fs.stat(fullpath, (err, stats) => {
            if (err) {                
                resolve(EFileDirectoryNotExists.notExists);                
                return
            }
            if (stats.isDirectory()) {                          
                resolve(EFileDirectoryNotExists.directory);                
                return
                
            }
            if (stats.isFile()) {
                resolve(EFileDirectoryNotExists.file);
                return
            }
            // impossible ??? :)
            reject('Not a directory nor a file!');
            return
        })
    })
}

export const notExistTailList = async (fullpath: string) => {
    const parentThatExists = await parentExists(fullpath);
    if (parentThatExists === null) {
        return null
    }
    const srcList = parentThatExists.split(path.sep);
    const fullpathList = fullpath.split(path.sep);
    return fullpathList.slice(srcList.length)

}

export const createBaseDirectories = async (dstFullPath:string): Promise<boolean> => {
    const tailList = await notExistTailList(dstFullPath);
    const dirBase = await parentExists(dstFullPath);
    if (tailList === null || dirBase === null) {
        return true;
    }
    let newPath = dirBase
    tailList.slice(0, -1).forEach(pedaco => {
        newPath = path.resolve(newPath, pedaco);
        log(newPath)
        fs.mkdir(newPath, (err) => {
            if (err) {
                console.log(err)
                return false;
            }
        })
    });
    return true;
}

