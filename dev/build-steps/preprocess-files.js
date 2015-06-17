'use strict';

var Async = require('async');
var Lodash = require('lodash');

var AssetCompilers = require('./../asset-compilers/asset-compilers');
var BuildHelpers = require('./../build-helpers/build-helpers');

function compileFile(file, cb) {
    if (BuildHelpers.doesFileLookLikeAsset(file)) {
        return cb(null, file);
    }

    // In case file content is a buffer object, stringify it
    var content = file.content.toString();
    file.content = content;

    AssetCompilers.compileSource(file.content, file.path, cb);
}

function mergeCompiledFiles(rawFiles, compiledFiles) {
    for (var i = 0; i < compiledFiles.length; i++) {
        var compiledFile = compiledFiles[i];

        var existingFile = Lodash.find(rawFiles, { path: compiledFile.path });

        if (existingFile) {
            // Overwrite the existing file with compiled content
            // in the case that the compiled file path is the same,
            // e.g. foo.js -> foo.js
            existingFile.content = compiledFile.content;
        }
        else {
            rawFiles.push(compiledFile);
        }
    }
}

function preprocessFiles(info, cb) {
    Async.map(info.files, compileFile, function(compileErr, compiledFiles) {
        mergeCompiledFiles(info.files, compiledFiles);
        cb(null, info);
    });
}

module.exports = preprocessFiles;
