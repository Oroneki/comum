#!/usr/bin/env node
// import {test} from './lib/comum';
import {comum} from "./lib/comum";
import {log} from "./lib/util/utils";

// test();

if (!process.argv[2] || !process.argv[3]) {
    log("provide source folder and destination folder.");
    process.exit(1);
}

if (process.argv[4]) {
    log("too many args");
    process.exit(1);
}

log(`
===========================================
SOURCE: ${process.argv[2]}
DESTINATION: ${process.argv[3]}
===========================================
`);

comum(
    process.argv[2],
    process.argv[3],
);
