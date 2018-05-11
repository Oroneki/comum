#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var comum_1 = require("./lib/comum");
var utils_1 = require("./lib/util/utils");
if (!process.argv[2] || !process.argv[3]) {
    utils_1.log("provide source folder and destination folder.");
    process.exit(1);
}
if (process.argv[4]) {
    utils_1.log("too many args");
    process.exit(1);
}
utils_1.log("\n===========================================\nSOURCE: " + process.argv[2] + "\nDESTINATION: " + process.argv[3] + "\n===========================================\n");
comum_1.comum(process.argv[2], process.argv[3]);
