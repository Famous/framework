'use strict';

var Async = require('async');
var Fs = require('fs');

var ReaddirRecursive = require('recursive-readdir');

function readFilesRecursive(baseDir, finish) {
    ReaddirRecursive(baseDir, function(dirErr, filePaths) {
        if (dirErr) {
            finish(dirErr);
        }
        else {
            Async.map(filePaths, Fs.readFile, function(contentsErr, fileContents) {
                if (contentsErr) {
                    finish(contentsErr);
                }
                else {
                    var resultsArray = [];
                    for (var i = 0; i < fileContents.length; i++) {
                        var filePath = filePaths[i];
                        resultsArray.push({
                            path: filePath.replace(baseDir, ''),
                            content: fileContents[i].toString()
                        });
                    }
                    finish(null, resultsArray);
                }
            });
        }
    });
}

module.exports = {
    readFilesRecursive: readFilesRecursive
};
