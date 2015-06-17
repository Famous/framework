'use strict';

var Async = require('async');
var Chalk = require('chalk');
var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');

var BundleCollection = require('./bundle-collection');
var Extra = require('./extra');
var FileHelpers = require('./file-helpers');
var PathingHelpers = require('./pathing');
var BuildHelpers = require('./../build-helpers/build-helpers');

var Config = require('./../config');

var NO_ASSET_PATH = ''; // e.g. if we just want to get the folder where version files are contained

function buildModule(options, cb) {
    var fn = Config.get('buildModuleFunction');
    return fn(options, cb);
}

function buildFromBlocksFolder(localBlocksFolder, attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        return cb(null, attemptInfo);
    }

    var versionPathRel = PathingHelpers.buildAssetPath(attemptInfo.name, attemptInfo.explicitVersion, NO_ASSET_PATH, true);
    var versionPathAbs = Path.join(localBlocksFolder, versionPathRel);

    FileHelpers.readFilesRecursive(versionPathAbs, function(readFilesErr, versionFilesFound) {
        if (!readFilesErr && versionFilesFound) {

            return buildModule({
                subDependencyCall: true,
                name: attemptInfo.name,
                files: versionFilesFound,
                explicitVersion: attemptInfo.explicitVersion,
                doSkipAssetSaveStep: true
            }, cb);

        }

        // Don't raise here because there may be a fallback available.
        return cb(null, attemptInfo);
    });
}

function buildFromRawSourceFolder(localRawSourceFolder, attemptInfo, cb) {
    if (Extra.looksLikeComponentWasAlreadyBuilt(attemptInfo)) {
        return cb(null, attemptInfo);
    }

    var componentPathRel = attemptInfo.name.split(Config.get('componentDelimiter')).join(Path.sep);
    var componentPathAbs = Path.join(localRawSourceFolder, componentPathRel);

    FileHelpers.readFilesRecursive(componentPathAbs, function(readFilesErr, versionFilesFound) {
        if (!readFilesErr && versionFilesFound) {

            return buildModule({
                subDependencyCall: true,
                name: attemptInfo.name,
                files: versionFilesFound,
                explicitVersion: attemptInfo.explicitVersion
            }, cb);

        }

        // Don't raise here because there may be a fallback available.
        return cb(null, attemptInfo);
    });
}

function attemptToBuildDependenciesLocally(localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, cb) {
    var attemptActions = [];
    var attemptInfo = { name: dependencyName, explicitVersion: dependencyVersion };

    if (localBlocksFolder) {
        attemptActions.push(buildFromBlocksFolder.bind(null, localBlocksFolder));
    }

    if (localRawSourceFolder) {
        attemptActions.push(buildFromRawSourceFolder.bind(null, localRawSourceFolder));
    }

    Async.seq.apply(Async, attemptActions)(attemptInfo, function(loadErr, populatedAttemptInfo) {
        if (!loadErr && populatedAttemptInfo && Extra.looksLikeComponentWasAlreadyBuilt(populatedAttemptInfo)) {
            return cb(null, populatedAttemptInfo);
        }

        return cb(new Error('Failed to build dependencies locally for `' + dependencyName + '` (' + dependencyVersion + ')'));
    });
}

// In some cases, such as locally developing a bunch of components,
// it's useful to try to recursively build components that may
// be missing. ABANDON HOPE ALL YE WHO ENTER HERE
function maybeAttemptToBootstrapComponentsLocally(localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, cb) {
    if (Config.get('doAttemptToBuildDependenciesLocally') && (localBlocksFolder || localRawSourceFolder)) {
        console.log(Chalk.gray('famous'), 'Let\'s try to bootstrap ' + dependencyName + ' ~> ' + dependencyVersion + ' locally...');

        return attemptToBuildDependenciesLocally(localBlocksFolder, localRawSourceFolder, dependencyName, dependencyVersion, function(localBuildErr, localBuildInfo) {
            if (localBuildErr || !localBuildInfo) {
                return cb(localBuildErr);
            }

            return cb(null, localBuildInfo.parcelHash);
        });
    }

    return cb(null);
}

function loadDependencies(localBlocksFolder, localRawSourceFolder, dependenciesWanted, dependenciesFound, finish) {
    var dependenciesMissing = Extra.getDependenciesMissing(dependenciesWanted, dependenciesFound);
    var dependencyKeys = Lodash.uniq(Object.keys(dependenciesMissing));

    Async.map(dependencyKeys, function(dependencyName, cb) {
        var dependencyVersion = dependenciesMissing[dependencyName];
        var parcelRelPath = PathingHelpers.buildAssetPath(dependencyName, dependencyVersion, Config.get('parcelAssetPath'), true);

        if (localBlocksFolder) {
            var parcelAbsPath = Path.join(localBlocksFolder, parcelRelPath);
            Fs.readFile(parcelAbsPath, Config.get('fileOptions'), function(parcelReadErr, parcelJSONData) {
                if (!parcelReadErr && parcelJSONData) {
                    // The parcel hash is an object that looks like this:
                    // {name:'',version:'',includes:[],dependencies:[]}
                    var parcelHash = JSON.parse(parcelJSONData || '{}');
                    cb(null, parcelHash);
                }
                else {
                    if (!localRawSourceFolder) {
                        throw new Error('No source folders were given for loading dependencies locally!');
                    }

                    maybeAttemptToBootstrapComponentsLocally(
                        localBlocksFolder, 
                        localRawSourceFolder, 
                        dependencyName, 
                        dependencyVersion,
                        cb
                    );
                }
            });
        }
        else if (localRawSourceFolder) {

            maybeAttemptToBootstrapComponentsLocally(
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

    }, function(localDepLoadErr, parcelsLoaded) {
        if (localDepLoadErr) {
            return finish(localDepLoadErr, dependenciesWanted, dependenciesFound);
        }

        for (var i = 0; i < parcelsLoaded.length; i++) {
            var loadedDependencyName = dependencyKeys[i];
            dependenciesFound[loadedDependencyName] = parcelsLoaded[i];
        }

        return finish(null, dependenciesWanted, dependenciesFound);
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
    var versionRef = info.versionRef || info.explicitVersion || Config.get('defaultDependencyVersion');
    var versionRelPath = PathingHelpers.buildAssetPath(info.name, versionRef, NO_ASSET_PATH, true);
    var versionAbsPath = Path.join(baseDir, versionRelPath);

    Async.each(info.assetSaveableFiles, function(file, cb) {
        var fileData;

        if (BuildHelpers.doesFileLookLikeBinary(file)) {
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
            Fs.writeFile(fullPath, fileData, Config.get('fileOptions'), function(fileWriteErr) {
                cb(null);
            });
        });

    }, function(versionSaveErr) {

        info.versionRef = versionRef;
        info.versionPath = versionRelPath;
        info.versionURL = PathingHelpers.buildAssetURL(info.name, versionRef, NO_ASSET_PATH);

        finish(null, info);

    });
}

function saveBundle(baseDir, info, finish) {
    // If a bundle version ref has already been assigned, that's because we
    // have already saved to Code Manager and we have an 'official'
    // ref that we want to refer to this build with.
    var bundleRef = info.bundleVersionRef || info.explicitVersion || Config.get('defaultDependencyVersion');
    var bundleRelPath = PathingHelpers.buildAssetPath(info.name, bundleRef, Config.get('bundleAssetPath'), true);
    var parcelRelPath = PathingHelpers.buildAssetPath(info.name, bundleRef, Config.get('parcelAssetPath'), true);

    var bundleFiles = BundleCollection.build(info, info.files);

    Async.each(bundleFiles, function(file, cb) {

        var relPath = PathingHelpers.buildAssetPath(info.name, bundleRef, file.path, true);
        var absPath = Path.join(baseDir, relPath);
        var baseDirFull = Path.dirname(absPath);

        Mkdirp(baseDirFull, function(mkdirErr) {
            Fs.writeFile(absPath, file.content, Config.get('fileOptions'), cb);
        });

    }, function(bundleSaveErr) {

        info.bundleVersionRef = bundleRef;
        info.bundlePath = bundleRelPath;
        info.bundleURL = PathingHelpers.buildAssetURL(info.name, bundleRef, Config.get('bundleAssetPath'));
        info.bundleExecutablePageURL = PathingHelpers.buildAssetURL(info.name, bundleRef, Config.get('bundleIndexPath'));
        info.parcelPath = parcelRelPath;
        info.parcelURL = PathingHelpers.buildAssetURL(info.name, bundleRef, Config.get('parcelAssetPath'));
        
        return finish(null, info);

    });
}

module.exports = {
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
