import { EFileDirectoryNotExists } from './interfaces';
export declare const folderOrFileExists: (folderOrFile: string) => Promise<{}>;
export declare const parentExists: (fullpath: string) => Promise<string | null>;
export declare const isFile1OrDirectory2OrNotExists0: (fullpath: string) => Promise<EFileDirectoryNotExists>;
export declare const notExistTailList: (fullpath: string) => Promise<string[] | null>;
export declare const createBaseDirectories: (dstFullPath: string) => Promise<boolean>;
