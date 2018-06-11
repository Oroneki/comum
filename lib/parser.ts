import * as fs from "fs";
import * as path from "path";
import {comum} from "./comum";

export const parser = async (file: string) => {
    fs.readFile(file, (err, data) => {
        if (err) {
            throw err;
        }
        const parsed = JSON.parse(data.toString());
        comum(parsed.sharedFolder, parsed.dstFolder);
    });
};
