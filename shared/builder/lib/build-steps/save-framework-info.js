'use strict';

var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');

function saveFrameworkInfo(info, cb) {
    var frameworkFile;

    frameworkFile = Lodash.find(info.files, function(file) {
        return file.path === this.options.frameworkFilename;
    }.bind(this));

    if (!frameworkFile) {
        frameworkFile = {
            path: this.options.frameworkFilename
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

    frameworkHash.dependencies = info.dereffedDependencyTable;

    if (info.frameworkInfo.block) {
        frameworkHash.block = info.frameworkInfo.block;
    }

    frameworkFile.content = JSON.stringify(frameworkHash, null, 4);

    // If we're building a component from a local source folder, we
    // need to write the dependencies back to that folder so that subsequent
    // saves have the correct dependency data we gathered in this build
    //
    // In this condition, the source directory is the specific directory from
    // which we got the files data in the first place, probably passed to
    // us via the framework 'assistant' watcher
    if (info.sourceDirectory) {
        var frameworkFilePath = Path.join(info.sourceDirectory, frameworkFile.path);
        var baseDirectory = Path.dirname(frameworkFilePath);

        // Minor point: we need to ensure that the .famous directory actually exists
        // before attempting to write to it
        Mkdirp(baseDirectory, function(mkdirErr) {
            if (!mkdirErr) {
                Fs.writeFile(frameworkFilePath, frameworkFile.content, this.options.fileOptions, function(fileWriteErr) {
                    if (!fileWriteErr) {
                        cb(null, info);
                    }
                    else {
                        cb(fileWriteErr);
                    }
                });
            }
            else {
                cb(mkdirErr);
            }
        }.bind(this));
    }
    else {
        cb(null, info);
    }
}

module.exports = saveFrameworkInfo;
