'use strict';

var Async = require('async');
var Chalk = require('chalk');
var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');

var Extra = require('./extra');
var FileHelpers = require('./file-helpers');
var PathingHelpers = require('./pathing');
var BuildHelpers = require('./../build-helpers');

var NO_ASSET_PATH = ''; // e.g. if we just want to get the folder where version files are contained

function buildFromBlocksFolder(localBlocksFolder, attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        cb(null, attemptInfo);
    }
    else {
        var versionPathRel = PathingHelpers.buildAssetPath.call(this, attemptInfo.name, attemptInfo.explicitVersion, NO_ASSET_PATH, true);
        var versionPathAbs = Path.join(localBlocksFolder, versionPathRel);
        FileHelpers.readFilesRecursive(versionPathAbs, function(readFilesErr, versionFilesFound) {
            if (!readFilesErr && versionFilesFound) {
                this.buildModule({
                    subDependencyCall: true,
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

function buildFromRawSourceFolder(localRawSourceFolder, attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        cb(null, attemptInfo);
    }
    else {
        var componentPathRel = attemptInfo.name.split(this.options.componentDelimiter).join(Path.sep);
        var componentPathAbs = Path.join(localRawSourceFolder, componentPathRel);
        FileHelpers.readFilesRecursive(componentPathAbs, function(readFilesErr, versionFilesFound) {
            if (!readFilesErr && versionFilesFound) {
                this.buildModule({
                    subDependencyCall: true,
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

function attemptToBuildDependenciesLocally(localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, cb) {
    var attemptActions = [];
    var attemptInfo = { name: dependencyName, explicitVersion: dependencyVersion };
    if (localBlocksFolder) {
        attemptActions.push(buildFromBlocksFolder.bind(this, localBlocksFolder));
    }
    if (localRawSourceFolder) {
        attemptActions.push(buildFromRawSourceFolder.bind(this, localRawSourceFolder));
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

// In some cases, such as locally developing a bunch of components,
// it's useful to try to recursively build components that may
// be missing. ABANDON HOPE ALL YE WHO ENTER HERE
function maybeAttemptToBootstrapComponentsLocally(localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, cb) {
    if (this.options.doAttemptToBuildDependenciesLocally && (localBlocksFolder || localRawSourceFolder)) {
        console.log(Chalk.gray('famous'), 'Let\'s try to bootstrap ' + dependencyName + ' ~> ' + dependencyVersion + ' locally...');
        attemptToBuildDependenciesLocally.call(this, localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, function(localBuildErr, localBuildInfo) {
            if (!localBuildErr && localBuildInfo) {
                cb(null, localBuildInfo.parcelHash);
            }
            else {
                cb(localBuildErr);
            }
        });
    }
    else {
        // new Error('No such local dependency `' + dependencyName + '` (' + dependencyVersion + ')')
        cb(null);
    }
}

function loadDependencies(localBlocksFolder, localRawSourceFolder, dependenciesWanted, dependenciesFound, finish) {
    var dependenciesMissing = Extra.getDependenciesMissing(dependenciesWanted, dependenciesFound);
    var dependencyKeys = Lodash.uniq(Object.keys(dependenciesMissing));
    Async.map(dependencyKeys, function(dependencyName, cb) {
        var dependencyVersion = dependenciesMissing[dependencyName];
        var parcelRelPath = PathingHelpers.buildAssetPath.call(this, dependencyName, dependencyVersion, this.options.parcelAssetPath, true);

        if (localBlocksFolder) {
            var parcelAbsPath = Path.join(localBlocksFolder, parcelRelPath);
            Fs.readFile(parcelAbsPath, this.options.fileOptions, function(parcelReadErr, parcelJSONData) {
                if (!parcelReadErr && parcelJSONData) {
                    // The parcel hash is an object that looks like this:
                    // {name:'',version:'',includes:[],dependencies:[]}
                    var parcelHash = JSON.parse(parcelJSONData || '{}');
                    cb(null, parcelHash);
                }
                else {
                    if (localRawSourceFolder) {
                        maybeAttemptToBootstrapComponentsLocally.call(this,
                            localBlocksFolder, 
                            localRawSourceFolder, 
                            dependencyName, 
                            dependencyVersion,
                            cb
                        );
                    }
                    else {
                        throw new Error('No source folders were given for loading dependencies locally!');
                    }
                }
            }.bind(this));
        }
        else if (localRawSourceFolder) {
            maybeAttemptToBootstrapComponentsLocally.call(this,
                localBlocksFolder, 
                localRawSourceFolder, 
                dependencyName, 
                dependencyVersion,
                cb
            );
        }
        else {
            throw new Error('No source folders were given for loading dependencies locally!');
        }

    }.bind(this), function(localDepLoadErr, parcelsLoaded) {
        if (localDepLoadErr) {
            finish(localDepLoadErr, dependenciesWanted, dependenciesFound);
        }
        else {
            for (var i = 0; i < parcelsLoaded.length; i++) {
                var loadedDependencyName = dependencyKeys[i];
                dependenciesFound[loadedDependencyName] = parcelsLoaded[i];
            }
            finish(null, dependenciesWanted, dependenciesFound);
        }
    });
}

function saveAssets(baseDir, info, finish) {
    // If a version ref has already been assigned, that's because we
    // have already saved to Code Manager and we have an 'official'
    // ref that we want to refer to this build with.
    //
    // If an explicit version has been passed in, we'll go ahead and
    // attempt to write to that version folder. This can occur in the
    // case that we are recursively building out the dependencies
    // for a given module.
    var versionRef = info.versionRef || info.explicitVersion || this.options.defaultDependencyVersion;
    var versionRelPath = PathingHelpers.buildAssetPath.call(this, info.name, versionRef, NO_ASSET_PATH, true);
    var versionAbsPath = Path.join(baseDir, versionRelPath);
    Async.each(info.assetSaveableFiles, function(file, cb) {
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
        info.versionRef = versionRef;
        info.versionPath = versionRelPath;
        info.versionURL = PathingHelpers.buildAssetURL.call(this, info.name, versionRef, NO_ASSET_PATH);
        finish(null, info);
    }.bind(this));
}

function saveBundle(baseDir, info, finish) {
    var bundleFiles = [];

    // If a bundle version ref has already been assigned, that's because we
    // have already saved to Code Manager and we have an 'official'
    // ref that we want to refer to this build with.
    var bundleRef = info.bundleVersionRef || info.explicitVersion || this.options.defaultDependencyVersion;
    var bundleRelPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleRef, this.options.bundleAssetPath, true);
    var parcelRelPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleRef, this.options.parcelAssetPath, true);

    bundleFiles.push({
        path: this.options.bundleAssetPath,
        content: info.bundleString
    });
    bundleFiles.push({
        path: this.options.parcelAssetPath,
        content: JSON.stringify(info.parcelHash, null, 4)
    });
    bundleFiles.push({
        path: this.options.bundleExecutableAssetPath,
        content: info.bundleExecutableString
    });
    bundleFiles.push({
        path: this.options.frameworkLibraryAssetPath,
        content: info.frameworkLibraryString
    });
    bundleFiles.push({
        path: this.options.frameworkExecutablePageAssetPath,
        content: info.frameworkExecutablePageString
    });
    bundleFiles = bundleFiles.concat(info.assetSaveableFiles);

    Async.each(bundleFiles, function(file, cb) {

        var relPath = PathingHelpers.buildAssetPath.call(this, info.name, bundleRef, file.path, true);
        var absPath = Path.join(baseDir, relPath);
        var baseDirFull = Path.dirname(absPath);

        Mkdirp(baseDirFull, function(mkdirErr) {
            Fs.writeFile(absPath, file.content, this.options.fileOptions, cb);
        }.bind(this));

    }.bind(this), function(bundleSaveErr) {
        info.bundleVersionRef = bundleRef;
        info.bundlePath = bundleRelPath;
        info.bundleURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleRef, this.options.bundleAssetPath);
        // info.bundleExecutablePageURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleRef, this.options.frameworkExecutablePageAssetPath);
        info.parcelPath = parcelRelPath;
        info.parcelURL = PathingHelpers.buildAssetURL.call(this, info.name, bundleRef, this.options.parcelAssetPath);
        finish(null, info);
    }.bind(this));
}

module.exports = {
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
