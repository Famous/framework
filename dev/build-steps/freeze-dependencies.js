'use strict';

var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');
var Chalk = require('chalk');

var conf = require('./../conf');

function logFormattedDeps(depTable) {
    for (var depName in depTable) {
        var depRef = depTable[depName];

        console.log(Chalk.gray('famous'), '  ', depName, '~>', depRef);
    }
}

function freezeDependencies(info, cb) {
    var frameworkFile;

    console.log(Chalk.gray('famous'), 'Freezing dependencies for ' + info.name + '...');

    if (Object.keys(info.dereffedDependencyTable).length > 0) {
        logFormattedDeps(info.dereffedDependencyTable);
    }

    frameworkFile = Lodash.find(info.files, function(file) {
        return file.path === conf.get('frameworkFilename');
    });

    // If no dependencies file exists, add it to the collection so it
    // gets saved along with everything else during persistence
    if (!frameworkFile) {
        frameworkFile = {
            path: conf.get('frameworkFilename')
        };
        info.files.push(frameworkFile);
    }

    if (conf.get('doFreezeDependencies')) {
        // And set the file's content to the JSON of the dependencies
        // that we've resolved in a previous step
        frameworkFile.content = JSON.stringify({
            // It's kind of hacky to put in here, but we need to store
            // the block info for future requests.
            block: info.frameworkInfo.block,

            dependencies: info.dereffedDependencyTable
        }, null, 4);
    }
    else {
        frameworkFile.content = JSON.stringify({
            block: info.frameworkInfo.block,
            dependencies: {}
        }, null, 4);
    }

    // If we're building a component from a local source folder, we
    // need to write the dependencies back to that folder so that subsequent
    // saves have the correct dependency data we gathered in the build
    //
    // Her, the source directory is the specific directory from
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

        return Fs.writeFile(frameworkFilePath, frameworkFile.content, conf.get('fileOptions'), cb);
    });
}

module.exports = freezeDependencies;
