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
var utils_1 = require("../util/utils");
var filesystem_1 = require("../util/filesystem");
exports.readyListener = function (src, dst) { return function () {
    utils_1.log('Monitoring ', src, '-->', dst);
}; };
exports.unLinkDirListener = function (src, dst) { return function (path) {
    var dstDir = utils_1.getDestFileMaker(src, dst)(path);
    utils_1.log("Deleted " + path + " -> " + dstDir);
    fs.rmdir(dstDir, function (err) {
        if (err) {
            utils_1.log('ERRO', err);
            return;
        }
        utils_1.log('OK');
    });
}; };
exports.unLinkListener = function (src, dst) { return function (path) {
    var dstDir = utils_1.getDestFileMaker(src, dst)(path);
    utils_1.log("Deleted " + path + " -> " + dstDir);
    fs.unlink(dstDir, function (err) {
        if (err) {
            utils_1.log('ERRO', err);
            return;
        }
        utils_1.log('OK');
    });
}; };
exports.changeListener = function (src, dst) { return function (path, stats) {
    var dstDir = utils_1.getDestFileMaker(src, dst)(path);
    utils_1.log("File changed: " + path + " --> " + dstDir);
    fs.copyFile(path, dstDir, function (err) {
        if (err) {
            utils_1.log('Erro copia', err);
            return;
        }
        utils_1.log('OK');
    });
}; };
exports.addListener = function (src, dst) { return function (path, stats) { return __awaiter(_this, void 0, void 0, function () {
    var dstDir, ok;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dstDir = utils_1.getDestFileMaker(src, dst)(path);
                utils_1.log("File created: " + path + " --> " + dstDir);
                return [4 /*yield*/, filesystem_1.folderOrFileExists(dstDir)];
            case 1:
                if (!_a.sent()) return [3 /*break*/, 3];
                utils_1.log(" Exists " + dstDir + ". Compare...");
                return [4 /*yield*/, utils_1.filesAreEqual(dstDir, path)];
            case 2:
                if (_a.sent()) {
                    utils_1.log(' Arquivos iguais... pula');
                    return [2 /*return*/];
                }
                utils_1.log('diff!');
                fs.unlink(dstDir, function (err) { return err ? null : utils_1.log('apagou pra copiar'); });
                _a.label = 3;
            case 3: return [4 /*yield*/, filesystem_1.createBaseDirectories(dstDir)];
            case 4:
                ok = _a.sent();
                if (!ok) {
                    utils_1.log('Erro na criacao dos subdiretorios');
                }
                fs.copyFile(path, dstDir, function (err) {
                    if (err) {
                        utils_1.log('Erro copia', err);
                        return;
                    }
                    utils_1.log('OK');
                });
                return [2 /*return*/];
        }
    });
}); }; };
exports.addDirListener = function (src, dst) { return function (path, stats) {
    var dstDir = utils_1.getDestFileMaker(src, dst)(path);
    utils_1.log("File created: " + path + " --> " + dstDir);
    fs.mkdir(dstDir, function (err) {
        if (err) {
            utils_1.log('Erro copia', err);
            return;
        }
        utils_1.log('OK');
    });
}; };
