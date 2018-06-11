"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./util/utils");
var listeners_1 = require("./listeners/listeners");
exports.comum = function (sharedFolder, dstFolder) {
    var src = utils_1.returnAbsolutePath(sharedFolder);
    var dst = utils_1.returnAbsolutePath(dstFolder);
    var watcher = utils_1.makeWatcher(src);
    watcher.on("ready", listeners_1.readyListener(src, dst));
    watcher.on("add", listeners_1.addListener(src, dst));
    watcher.on("unlink", listeners_1.unLinkListener(src, dst));
    watcher.on("change", listeners_1.changeListener(src, dst));
    watcher.on("addDir", listeners_1.addDirListener(src, dst));
    watcher.on("unlinkDir", listeners_1.unLinkDirListener(src, dst));
    return watcher;
};
exports.test = function () {
    exports.comum("../../Downloads/teste/src", "../../Downloads/teste/dst");
};
