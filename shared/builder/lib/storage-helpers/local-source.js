'use strict';

var Async = require('async');
var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');

var Extra = require('./extra');
var FileHelpers = require('./file-helpers');
var PathingHelpers = require('./pathing');
var BuildHelpers = require('./../build-helpers');

function buildDependencyFromLocalDependenciesSourceFolder(attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        cb(null, attemptInfo);
    }
    else {
        var versionPathRel = PathingHelpers.buildAssetPath.call(this, attemptInfo.name, attemptInfo.explicitVersion, '', true);
        var versionPathAbs = Path.join(this.options.localDependenciesSourceFolder, versionPathRel);
        FileHelpers.readFilesRecursive(versionPathAbs, function(readFilesErr, versionFilesFound) {
            if (!readFilesErr && versionFilesFound) {
                this.buildModule({
                    name: attemptInfo.name,
                    files: versionFilesFound,
                    explicitVersion: attemptInfo.explicitVersion,
                    doSkipAssetSaveStep: true
                }, function(buildErr, buildInfo) {
                    cb(buildErr, buildInfo);
                });
            }
            else {
                // Don't raise here because there may be a fallback available.
                cb(null, attemptInfo);
            }
        }.bind(this));
    }
}

function buildDependencyFromLocalComponentSourceFolder(attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        cb(null, attemptInfo);
    }
    else {
        var componentPathRel = attemptInfo.name.split(this.options.componentDelimiter).join(Path.sep);
        var componentPathAbs = Path.join(this.options.localComponentsSourceFolder, componentPathRel);
        FileHelpers.readFilesRecursive(componentPathAbs, function(readFilesErr, versionFilesFound) {
            if (!readFilesErr && versionFilesFound) {
                this.buildModule({
                    name: attemptInfo.name,
                    files: versionFilesFound,
                    explicitVersion: attemptInfo.explicitVersion
                }, function(buildErr, buildInfo) {
                    cb(buildErr, buildInfo);
                });
            }
            else {
                // Don't raise here because there may be a fallback available.
                cb(null, attemptInfo);
            }
        }.bind(this));
    }
}

function attemptToBuildDependenciesLocally(dependencyName, dependencyVersion, cb) {
    var attemptActions = [];
    var attemptInfo = { name: dependencyName, explicitVersion: dependencyVersion };
    if (this.options.localDependenciesSourceFolder) {
        attemptActions.push(buildDependencyFromLocalDependenciesSourceFolder.bind(this));
    }
    if (this.options.localComponentsSourceFolder) {
        attemptActions.push(buildDependencyFromLocalComponentSourceFolder.bind(this));
    }
    Async.seq.apply(Async, attemptActions)(attemptInfo, function(loadErr, populatedAttemptInfo) {
        if (!loadErr && populatedAttemptInfo && Extra.looksLikeComponentWasAlreadyBuilt(populatedAttemptInfo)) {
            cb(null, populatedAttemptInfo);
        }
        else {
            cb(new Error('Failed to build dependencies locally for `' + dependencyName + '` (' + dependencyVersion + ')'));
        }
    });
}

function loadDependenciesFromLocalSourceFolder(baseDir, dependenciesWanted, dependenciesFound, finish) {
    var dependenciesMissing = Extra.getDependenciesMissing(dependenciesWanted, dependenciesFound);
    var dependencyKeys = Lodash.uniq(Object.keys(dependenciesMissing));
    Async.map(dependencyKeys, function(dependencyName, cb) {
        var dependencyVersion = dependenciesMissing[dependencyName];
        var parcelRelPath = PathingHelpers.buildAssetPath.call(this, dependencyName, dependencyVersion, this.options.parcelAssetPath, true);
        var parcelAbsPath = Path.join(baseDir, parcelRelPath);
        Fs.readFile(parcelAbsPath, this.options.fileOptions, function(parcelReadErr, parcelJSONData) {
            if (!parcelReadErr && parcelJSONData) {
                // The parcel hash is an object that looks like this:
                // {name:'',version:'',includes:[],dependencies:[]}
                var parcelHash = JSON.parse(parcelJSONData || '{}');
                cb(null, parcelHash);
            }
            else {
                // In some cases, such as locally developing a bunch of components,
                // it's useful to try to recursively build components that may
                // be missing. ABANDON HOPE ALL YE WHO ENTER HERE
                if (this.options.doAttemptToBuildDependenciesLocally) {
                    attemptToBuildDependenciesLocally.call(this, dependencyName, dependencyVersion, function(localBuildErr, localBuildInfo) {
                        if (!localBuildErr && localBuildInfo) {
                            cb(null, localBuildInfo.parcelHash);
                        }
                        else {
                            cb(localBuildErr);
                        }
                    });
                }
                else {
                    cb(new Error('No such local dependency `' + dependencyName + '` (' + dependencyVersion + ')'));
                }
            }
        }.bind(this));
    }.bind(this), function(localDepLoadErr, parcelsLoaded) {
        if (localDepLoadErr) {
            finish(localDepLoadErr, dependenciesWanted, dependenciesFound);
        }
        else {
            for (var i = 0; i < parcelsLoaded.length; i++) {
                var loadedDependencyName = dependencyKeys[i];
                var loadedDependencyVersion = dependenciesMissing[loadedDependencyName];
                dependenciesFound[loadedDependencyName] = parcelsLoaded[i];
            }
            finish(null, dependenciesWanted, dependenciesFound);
        }
    });
}

function saveAssets(baseDir, info, finish) {
    // If an explicit version has been passed in, we'll go ahead and
    // attempt to write to that version folder. This can occur in the
    // case that we are recursively building out the dependencies
    // for a given module.
    var versionRef = info.explicitVersion || this.options.defaultDependencyVersion;
    var versionRelPath = PathingHelpers.buildAssetPath.call(this, info.name, versionRef, '', true);
    var versionAbsPath = Path.join(baseDir, versionRelPath);
    Async.each(info.files, function(file, cb) {
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
            });
        }.bind(this));
    }.bind(this), function(versionSaveErr) {
        finish(null, {
            versionRef: versionRef,
            versionPath: versionRelPath,
            versionURL: PathingHelpers.buildAssetURL.call(this, info.name, versionRef, '')
        });
    }.bind(this));
}

function saveBundle(baseDir, info, finish) {
    var bundleRef = info.explicitVersion || this.options.defaultDependencyVersion;
    var bundleAssetPath = this.options.bundleAssetPath;
    var bundleRelPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleRef, bundleAssetPath, true);
    var bundleAbsPath = Path.join(baseDir, bundleRelPath);

    var parcelAssetPath = this.options.parcelAssetPath;
    var parcelRelPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleRef, parcelAssetPath, true);
    var parcelAbsPath = Path.join(baseDir, parcelRelPath);
    var parcelString = JSON.stringify(info.parcelHash, null, 4); // <~ JSON prettify controls

    var fileOptions = this.options.fileOptions;
    var baseDirFull = Path.dirname(bundleAbsPath);

    Mkdirp(baseDirFull, function(mkdirErr) {
        Fs.writeFile(bundleAbsPath, info.bundleString, fileOptions, function(bundleWriteErr) {
            Fs.writeFile(parcelAbsPath, parcelString, fileOptions, function(parcelWriteErr) {
                finish(null, {
                    bundleVersionRef: bundleRef,
                    bundlePath: bundleRelPath,
                    bundleURL: PathingHelpers.buildAssetURL.call(this, info.name, bundleRef, bundleAssetPath),
                    parcelPath: parcelRelPath,
                    parcelURL: PathingHelpers.buildAssetURL.call(this, info.name, bundleRef, parcelAssetPath)
                });
            }.bind(this));
        }.bind(this));
    }.bind(this));
}

module.exports = {
    loadDependenciesFromLocalSourceFolder: loadDependenciesFromLocalSourceFolder,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
