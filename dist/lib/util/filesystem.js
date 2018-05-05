"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var utils_1 = require("./utils");
var interfaces_1 = require("./interfaces");
exports.folderOrFileExists = function (folderOrFile) { return new Promise(function (resolve, reject) {
    fs.access(folderOrFile, fs.constants.R_OK, function (err) {
        if (err) {
            resolve(false);
        }
        resolve(true);
    });
}); };
exports.parentExists = function (fullpath) { return __awaiter(_this, void 0, void 0, function () {
    var menosum;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.folderOrFileExists(fullpath)];
            case 1:
                if (_a.sent()) {
                    return [2 /*return*/, fullpath];
                }
                ;
                if (fullpath.split(path.sep).length <= 1) {
                    return [2 /*return*/, null];
                }
                ;
                menosum = path.dirname(fullpath);
                return [4 /*yield*/, exports.parentExists(menosum)];
            case 2: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.isFile1OrDirectory2OrNotExists0 = function (fullpath) {
    return new Promise(function (resolve, reject) {
        fs.stat(fullpath, function (err, stats) {
            if (err) {
                resolve(interfaces_1.EFileDirectoryNotExists.notExists);
                return;
            }
            if (stats.isDirectory()) {
                resolve(interfaces_1.EFileDirectoryNotExists.directory);
                return;
            }
            if (stats.isFile()) {
                resolve(interfaces_1.EFileDirectoryNotExists.file);
                return;
            }
            // impossible ??? :)
            reject('Not a directory nor a file!');
            return;
        });
    });
};
exports.notExistTailList = function (fullpath) { return __awaiter(_this, void 0, void 0, function () {
    var parentThatExists, srcList, fullpathList;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.parentExists(fullpath)];
            case 1:
                parentThatExists = _a.sent();
                if (parentThatExists === null) {
                    return [2 /*return*/, null];
                }
                srcList = parentThatExists.split(path.sep);
                fullpathList = fullpath.split(path.sep);
                return [2 /*return*/, fullpathList.slice(srcList.length)];
        }
    });
}); };
exports.createBaseDirectories = function (dstFullPath) { return __awaiter(_this, void 0, void 0, function () {
    var tailList, dirBase, newPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, exports.notExistTailList(dstFullPath)];
            case 1:
                tailList = _a.sent();
                return [4 /*yield*/, exports.parentExists(dstFullPath)];
            case 2:
                dirBase = _a.sent();
                if (tailList === null || dirBase === null) {
                    return [2 /*return*/, true];
                }
                newPath = dirBase;
                tailList.slice(0, -1).forEach(function (pedaco) {
                    newPath = path.resolve(newPath, pedaco);
                    utils_1.log(newPath);
                    fs.mkdir(newPath, function (err) {
                        if (err) {
                            console.log(err);
                            return false;
                        }
                    });
                });
                return [2 /*return*/, true];
        }
    });
}); };
