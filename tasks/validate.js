'use strict';

var Path = require('path');
var Fs = require('fs');

var ENTRYPOINT_EXTNAMES = { '.js': true };

function isModule(folder) {
    var isModule = false;
    var folderBasename = Path.basename(folder);
    var entries = Fs.readdirSync(folder);
    entries.forEach(function(entryPath) {
        var entryFullPath = Path.join(folder, entryPath);
        var entryStat = Fs.lstatSync(entryFullPath);
        if (!entryStat.isDirectory()) {
            var entryExtname = Path.extname(entryFullPath);
            var entryBasename = Path.basename(entryFullPath, entryExtname);
            if (entryBasename === folderBasename) {
               if (entryExtname in ENTRYPOINT_EXTNAMES) {
                   isModule = true;
               }
            }
        }
    });
    return isModule;
}

module.exports = {
    isModule: isModule
};
