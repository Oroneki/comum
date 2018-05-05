import * as chokidar from 'chokidar';
export declare const log: (a: any, ...args: any[]) => void;
export declare const returnAbsolutePath: (strPath: string) => string;
export declare const makeWatcher: (folder: string) => chokidar.FSWatcher;
export declare const getDiffPath: (src: string, fullpath: string) => string;
export declare const getDestFileMaker: (src: string, dst: string) => (fullpath: string) => string;
export declare const filesAreEqual: (file1: string, file2: string) => Promise<boolean>;
