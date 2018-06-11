#!/usr/bin/env node
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var parser_1 = require("./lib/parser");
var utils_1 = require("./lib/util/utils");
var returnComum = function () {
    if (!process.argv[2]) {
        return parser_1.parser(path.resolve(process.cwd(), "comum.json"));
    }
    else {
        return parser_1.parser(path.resolve(process.cwd(), process.argv[2]));
    }
};
if (process.argv[3]) {
    utils_1.log("too many args");
    process.exit(1);
}
returnComum();
