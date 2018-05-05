import * as chokidar from 'chokidar';
import * as path from 'path';
import * as crypto from 'crypto';
import * as fs from 'fs';

export const log = (a: any, ...args: any[]) => {    
    if (args) {
        console.log(a, ...args);
    } else {
        console.log(a);
    }
} 
    

export const returnAbsolutePath = (strPath: string) => {    
    if (!path.isAbsolute(strPath)) {
        const absPath = path.normalize(strPath);
        log(absPath);
        return absPath;
    }
    return strPath;
}

export const makeWatcher = (folder: string) => {
    const folderAbs = returnAbsolutePath(folder);
    log('folderAbs', folderAbs);
    return chokidar.watch(folderAbs, {
        persistent: true,
        interval: 200,
        binaryInterval: 400,               
        awaitWriteFinish: {
          stabilityThreshold: 1500,
          pollInterval: 300
        },
      });
}

export const getDiffPath = (src: string, fullpath: string) => {
    const srcList = src.split(path.sep);
    const fullpathList = fullpath.split(path.sep);
    const lisDiff = fullpathList.slice(srcList.length)
    return lisDiff.join(path.sep);
}

export const getDestFileMaker = (src: string, dst: string) => (fullpath: string) => {
    const diff = getDiffPath(src, fullpath);
    return path.resolve(dst, diff);
}

export const filesAreEqual = async (file1: string, file2: string) => {
    const [hash1, hash2] = await Promise.all([
        checksumFile(file1),
        checksumFile(file2),
    ])
    return hash1 === hash2;
}

function checksumFile(path: string, hashName: string = 'md5') {
    return new Promise((resolve, reject) => {
      let hash = crypto.createHash(hashName);
      let stream = fs.createReadStream(path);
      stream.on('error', err => reject(err));
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }
