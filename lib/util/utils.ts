import chalk from "chalk";
import * as chokidar from "chokidar";
import * as crypto from "crypto";
import debug from "debug";
import * as fs from "fs";
import * as path from "path";

export const print = (event: string, file: string,  ...args: any[]) => {
    console.log(
        chalk.bold.green.bgYellow(event),
        " ",
        chalk.bgYellowBright.magenta(file),
        " > ",
        chalk.green(...args),
    );
};

export const deb = debug("comum");

export const log = (a: any, ...args: any[]) => {
    if (args) {
        console.log(chalk.green(a, ...args));
    } else {
        console.log(chalk.green(a));
    }
};

export const returnAbsolutePath = (strPath: string) => {
    if (!path.isAbsolute(strPath)) {
        const absPath = path.normalize(strPath);
        log(absPath);
        return absPath;
    }
    return strPath;
};

export const makeWatcher = (folder: string) => {
    const folderAbs = returnAbsolutePath(folder);
    log("folderAbs", folderAbs);
    return chokidar.watch(folderAbs, {
        awaitWriteFinish: {
            pollInterval: 300,
            stabilityThreshold: 1500,
        },
        binaryInterval: 400,
        interval: 200,
        persistent: true,
      });
};

export const getDiffPath = (src: string, fullpath: string) => {
    const srcList = src.split(path.sep);
    const fullpathList = fullpath.split(path.sep);
    const lisDiff = fullpathList.slice(srcList.length);
    return lisDiff.join(path.sep);
};

export const getDestFileMaker = (src: string, dst: string) => (fullpath: string) => {
    const diff = getDiffPath(src, fullpath);
    return path.resolve(dst, diff);
};

export const filesAreEqual = async (file1: string, file2: string) => {
    const [hash1, hash2] = await Promise.all([
        checksumFile(file1),
        checksumFile(file2),
    ]);
    return hash1 === hash2;
};

function checksumFile(entryPath: string, hashName: string = "md5") {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash(hashName);
      const stream = fs.createReadStream(entryPath);
      stream.on("error", (err) => reject(err));
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
    });
  }
