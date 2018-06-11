#!/usr/bin/env node
import * as path from "path";
import {parser} from "./lib/parser";
import {log} from "./lib/util/utils";

const returnComum = () => {
    if (!process.argv[2]) {
        return parser(path.resolve(process.cwd(), "comum.json"));
    } else {
        return parser(path.resolve(process.cwd(), process.argv[2]));
    }
};

if (process.argv[3]) {
    log("too many args");
    process.exit(1);
}

returnComum();
