'use strict';

var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');

var Config = require('./../config');

function saveFrameworkInfo(info, cb) {
    var frameworkFile;

    frameworkFile = Lodash.find(info.files, function(file) {
        return file.path === Config.get('frameworkFilename');
    });

    if (!frameworkFile) {
        frameworkFile = {
            path: Config.get('frameworkFilename')
        };
        info.files.push(frameworkFile);
    }

    var frameworkHash;
    if (frameworkFile.content) {
        frameworkHash = JSON.parse(frameworkFile.content || '{}');
    }
    else {
        frameworkHash = {};
    }

    if (Config.get('doFreezeDependencies')) {
        frameworkHash.dependencies = info.dereffedDependencyTable;
    }
    else {
        frameworkHash.dependencies = {};
    }

    if (info.frameworkInfo.block) {
        frameworkHash.block = info.frameworkInfo.block;
    }

    frameworkFile.content = JSON.stringify(frameworkHash, null, 4);

    // If we're building a component from a local source folder, we
    // need to write the dependencies back to that folder so that subsequent
    // saves have the correct dependency data we gathered in the build
    //
    // In the condition here, the source directory is the specific directory from
    // which we got the files data in the first place, probably passed to
    // us via the framework 'assistant' watcher
    if (!info.sourceDirectory) {
        return cb(null, info);
    }

    var frameworkFilePath = Path.join(info.sourceDirectory, frameworkFile.path);
    var baseDirectory = Path.dirname(frameworkFilePath);

    // Minor point: we need to ensure that the .famous directory actually exists
    // before attempting to write to it
    Mkdirp(baseDirectory, function(mkdirErr) {
        if (mkdirErr) {
            return cb(mkdirErr);
        }

        Fs.writeFile(frameworkFilePath, frameworkFile.content, Config.get('fileOptions'), function(fileWriteErr) {
            if (fileWriteErr) {
                return cb(fileWriteErr);
            }

            return cb(null, info);
        });
    });
}

module.exports = saveFrameworkInfo;
