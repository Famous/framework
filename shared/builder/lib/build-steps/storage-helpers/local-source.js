'use strict';

var Async = require('async');
var Fs = require('fs');
var Mkdirp = require('mkdirp');
var Path = require('path');

var Extra = require('./extra');
var PathingHelpers = require('./pathing');
var BuildHelpers = require('./../build-helpers');

function loadDependenciesFromLocalSourceFolder(baseDir, dependencies, finish) {
    var depsToLoad = Extra.getNotYetLoadedDependencies.call(this, dependencies);
    Async.map(depsToLoad, function(dependency, cb) {
        var depName = dependency[0];
        var depVersion = dependency[1];
        var bundleRelPath = PathingHelpers.buildAssetPath.call(this, depName, depVersion, this.options.bundleAssetPath, true);
        var bundleAbsPath = Path.join(baseDir, bundleRelPath);
        Fs.readFile(bundleAbsPath, function(err, bundleData) {
            if (err) {
                // If we weren't able to locate a dependency in the
                // local folder, or if we errored when doing the operation,
                // assume that we just couldn't discover the file
            }
            var output = {
                name: depName,
                version: depVersion,
                data: bundleData
            };
            cb(null, output);
        });
    }.bind(this), function(localDepLoadErr, dependencyDatas) {
        for (var i = 0; i < dependencyDatas.length; i++) {
            var dependencyData = dependencyDatas[i];
            dependencies[dependencyData.name].data = dependencyData.data;
        }
        finish(null, dependencies);
    }.bind(this));
}

function saveAssets(baseDir, name, files, finish) {
    var versionRef = this.options.defaultDependencyVersion;
    var versionRelPath = PathingHelpers.buildAssetPath.call(this, name, versionRef, '', true);
    var versionAbsPath = Path.join(baseDir, versionRelPath);
    Async.each(files, function(file, cb) {
        var fileData;
        if (BuildHelpers.doesFileLookLikeBinary.call(this, file)) {
            // Ensure that we convert assets like images to binary
            // buffers instead of mangling them by writing the plain
            // strings
            fileData = new Buffer(file.content, 'binary');
        }
        else {
            fileData = file.content;
        }
        var fullPath = Path.join(versionAbsPath, file.path);
        var baseDir = Path.dirname(fullPath);
        Mkdirp(baseDir, function(mkdirErr) {
            Fs.writeFile(fullPath, fileData, this.options.fileOptions, function(fileWriteErr) {
                cb(null);
            }.bind(this));
        }.bind(this));
    }.bind(this), function(versionSaveErr) {
        finish(null, {
            versionRef: versionRef,
            versionPath: versionRelPath,
            versionURL: PathingHelpers.buildAssetURL.call(this, name, versionRef, '')
        });
    }.bind(this));
}

function saveBundle(baseDir, name, content, finish) {
    var bundleRef = this.options.defaultDependencyVersion;
    var bundleAssetPath = this.options.bundleAssetPath;
    var bundleRelPath = PathingHelpers.buildAssetPath.call(this, name, bundleRef, bundleAssetPath, true);
    var bundleAbsPath = Path.join(baseDir, bundleRelPath);
    var baseDir = Path.dirname(bundleAbsPath);
    Mkdirp(baseDir, function(mkdirErr) {
        Fs.writeFile(bundleAbsPath, content, this.options.fileOptions, function(fileWriteErr) {
            finish(null, {
                bundleVersionRef: bundleRef,
                bundlePath: bundleRelPath,
                bundleURL: PathingHelpers.buildAssetURL.call(this, name, bundleRef, bundleAssetPath)
            });
        }.bind(this));
    }.bind(this));
}

module.exports = {
    loadDependenciesFromLocalSourceFolder: loadDependenciesFromLocalSourceFolder,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
