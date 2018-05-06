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
// import * as path from 'path';
var fs = __importStar(require("fs"));
var utils_1 = require("../util/utils");
var filesystem_1 = require("../util/filesystem");
exports.readyListener = function (src, dst) { return function () {
    utils_1.print("Watcher Ready !", src, dst);
}; };
exports.unLinkDirListener = function (src, dst) { return function (observedPath) { return __awaiter(_this, void 0, void 0, function () {
    var dstDir, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dstDir = utils_1.getDestFileMaker(src, dst)(observedPath);
                utils_1.print("UnlinkDir", observedPath, dstDir);
                return [4 /*yield*/, !filesystem_1.folderOrFileExists(dstDir)];
            case 1:
                if (_a.sent()) {
                    utils_1.deb("%s already handled.", dstDir);
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, filesystem_1.recursiveDeleteDirectory(dstDir)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                utils_1.deb("error deleting directory: %s", dstDir);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); }; };
exports.unLinkListener = function (src, dst) { return function (observedPath) { return __awaiter(_this, void 0, void 0, function () {
    var dstDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dstDir = utils_1.getDestFileMaker(src, dst)(observedPath);
                utils_1.print("Unlink", observedPath, dstDir);
                return [4 /*yield*/, !filesystem_1.folderOrFileExists(dstDir)];
            case 1:
                if (_a.sent()) {
                    utils_1.deb("%s already handled.", dstDir);
                    return [2 /*return*/];
                }
                fs.unlink(dstDir, function (err) {
                    if (err) {
                        utils_1.deb("ERR unlink %o", err);
                        return;
                    }
                    utils_1.deb("Unlink %s OK", dstDir);
                });
                return [2 /*return*/];
        }
    });
}); }; };
exports.changeListener = function (src, dst) { return function (observedPath, stats) {
    var dstDir = utils_1.getDestFileMaker(src, dst)(observedPath);
    utils_1.print("Change", observedPath, dstDir);
    fs.copyFile(observedPath, dstDir, function (err) {
        if (err) {
            utils_1.deb("ERR change -> copy %o", err);
            return;
        }
        utils_1.deb("change > copy %s OK", dstDir);
    });
}; };
exports.addListener = function (src, dst) { return function (observedPath, stats) { return __awaiter(_this, void 0, void 0, function () {
    var dstDir, ok;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dstDir = utils_1.getDestFileMaker(src, dst)(observedPath);
                utils_1.print("Add", observedPath, dstDir);
                return [4 /*yield*/, filesystem_1.folderOrFileExists(dstDir)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                utils_1.deb("Exists %s. Compare...", dstDir);
                return [4 /*yield*/, utils_1.filesAreEqual(dstDir, observedPath)];
            case 2:
                if (_a.sent()) {
                    utils_1.deb("Same file %s and %s. SKIP ADD", observedPath, dstDir);
                    return [2 /*return*/];
                }
                utils_1.deb("add - files are different %s - %s", observedPath, dstDir);
                fs.unlink(dstDir, function (err) {
                    if (err) {
                        utils_1.deb("File %s not unlinked.", dstDir);
                    }
                    else {
                        utils_1.deb("File %s successfully unlinked... Ready to copy the new version", dstDir);
                    }
                });
                _a.label = 3;
            case 3: return [4 /*yield*/, filesystem_1.createBaseDirectories(dstDir)];
            case 4:
                ok = _a.sent();
                if (!ok) {
                    utils_1.deb("Error creating base directories for %s", dstDir);
                }
                fs.copyFile(observedPath, dstDir, function (err) {
                    if (err) {
                        utils_1.deb("ERR add | -> copy %o", err);
                        return;
                    }
                    utils_1.deb("add > copy %s OK", dstDir);
                });
                return [2 /*return*/];
        }
    });
}); }; };
exports.addDirListener = function (src, dst) { return function (observedPath, stats) { return __awaiter(_this, void 0, void 0, function () {
    var dstDir;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dstDir = utils_1.getDestFileMaker(src, dst)(observedPath);
                utils_1.print("AddDirectory", observedPath, dstDir);
                return [4 /*yield*/, filesystem_1.folderOrFileExists(dstDir)];
            case 1:
                if (_a.sent()) {
                    utils_1.deb("Dir %s already exists. SKIP MKDIR.", dstDir);
                    return [2 /*return*/];
                }
                fs.mkdir(dstDir, function (err) {
                    if (err) {
                        utils_1.deb("ERR mkdir %o", err);
                        return;
                    }
                    utils_1.deb("mkdir %s OK", dstDir);
                });
                return [2 /*return*/];
        }
    });
}); }; };
