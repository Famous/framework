var Config = require('./../config');
var Osenv = require('osenv');
var Path = require('path');
var Fs = require('fs');

function getSystemFiles(info, cb) {
    var home = Osenv.home();
    var globalFamousFilePath = Path.join(home, Config.get('authConfigFilePath'));

    Fs.readFile(globalFamousFilePath, function(fileErr, fileData) {
        if (fileErr) {
            return cb(null, info);
        }

        var famousHash;
        try {
            famousHash = JSON.parse(fileData.toString());
        }
        catch (e) {
            famousHash = null;
        }

        if (famousHash) {
            info.globalFamousInfo = famousHash;
        }

        cb(null, info);
    });
}

module.exports = getSystemFiles;
