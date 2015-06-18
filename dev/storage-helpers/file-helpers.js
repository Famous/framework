'use strict';

var Async = require('async');
var Fs = require('fs');
var Path = require('path');
var ReaddirRecursive = require('recursive-readdir');

function readFilesRecursive(baseDir, finish) {
    ReaddirRecursive(baseDir, function(dirErr, filePaths) {
        if (dirErr) {
            return finish(dirErr);
        }

        Async.map(filePaths, Fs.readFile, function(contentsErr, fileContents) {
            if (contentsErr) {
                return finish(contentsErr);
            }

            var resultsArray = [];

            for (var i = 0; i < fileContents.length; i++) {
                var filePath = filePaths[i];
                filePath = filePath.replace(baseDir, '');
                // Remove the preceding slash since the users of this
                // function downstream expect the path to be relative
                if (filePath[0] === Path.sep) {
                    filePath = filePath.slice(1, filePath.length);
                }
                resultsArray.push({
                    path: filePath,
                    content: fileContents[i].toString()
                });
            }

            return finish(null, resultsArray);
        });
    });
}

module.exports = {
    readFilesRecursive: readFilesRecursive
};
