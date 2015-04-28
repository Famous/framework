'use strict';

var path = require('path');
var fs = require('fs');

var ENTRYPOINT_EXTNAMES = { '.js': true };

function isModule(folder) {
    var isModule = false;
    var folderBasename = path.basename(folder);
    var entries = fs.readdirSync(folder);
    entries.forEach(function(entryPath) {
        var entryFullPath = path.join(folder, entryPath);
        var entryStat = fs.lstatSync(entryFullPath);
        if (!entryStat.isDirectory()) {
            var entryExtname = path.extname(entryFullPath);
            var entryBasename = path.basename(entryFullPath, entryExtname);
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
