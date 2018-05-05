import { IStats } from '../util/interfaces';
export declare const readyListener: (src: string, dst: string) => () => void;
export declare const unLinkDirListener: (src: string, dst: string) => (path: string) => void;
export declare const unLinkListener: (src: string, dst: string) => (path: string) => void;
export declare const changeListener: (src: string, dst: string) => (path: string, stats: IStats) => void;
export declare const addListener: (src: string, dst: string) => (path: string, stats: IStats) => Promise<void>;
export declare const addDirListener: (src: string, dst: string) => (path: string, stats: IStats) => void;
