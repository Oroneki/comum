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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
var chalk_1 = __importDefault(require("chalk"));
var chokidar = __importStar(require("chokidar"));
var crypto = __importStar(require("crypto"));
var debug_1 = __importDefault(require("debug"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
exports.print = function (event, file) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log(chalk_1.default.bold.green.bgYellow(event), " ", chalk_1.default.bgYellowBright.magenta(file), " > ", chalk_1.default.green.apply(chalk_1.default, args));
};
exports.deb = debug_1.default("comum");
exports.log = function (a) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (args) {
        console.log(chalk_1.default.green.apply(chalk_1.default, [a].concat(args)));
    }
    else {
        console.log(chalk_1.default.green(a));
    }
};
exports.returnAbsolutePath = function (strPath) {
    if (!path.isAbsolute(strPath)) {
        var absPath = path.normalize(strPath);
        exports.log(absPath);
        return absPath;
    }
    return strPath;
};
exports.makeWatcher = function (folder) {
    var folderAbs = exports.returnAbsolutePath(folder);
    exports.log("folderAbs", folderAbs);
    return chokidar.watch(folderAbs, {
        awaitWriteFinish: {
            pollInterval: 300,
            stabilityThreshold: 1500,
        },
        binaryInterval: 400,
        interval: 200,
        persistent: true,
    });
};
exports.getDiffPath = function (src, fullpath) {
    var srcList = src.split(path.sep);
    var fullpathList = fullpath.split(path.sep);
    var lisDiff = fullpathList.slice(srcList.length);
    return lisDiff.join(path.sep);
};
exports.getDestFileMaker = function (src, dst) { return function (fullpath) {
    var diff = exports.getDiffPath(src, fullpath);
    return path.resolve(dst, diff);
}; };
exports.filesAreEqual = function (file1, file2) { return __awaiter(_this, void 0, void 0, function () {
    var _a, hash1, hash2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, Promise.all([
                    checksumFile(file1),
                    checksumFile(file2),
                ])];
            case 1:
                _a = _b.sent(), hash1 = _a[0], hash2 = _a[1];
                return [2 /*return*/, hash1 === hash2];
        }
    });
}); };
function checksumFile(entryPath, hashName) {
    if (hashName === void 0) { hashName = "md5"; }
    return new Promise(function (resolve, reject) {
        var hash = crypto.createHash(hashName);
        var stream = fs.createReadStream(entryPath);
        stream.on("error", function (err) { return reject(err); });
        stream.on("data", function (chunk) { return hash.update(chunk); });
        stream.on("end", function () { return resolve(hash.digest("hex")); });
    });
}
