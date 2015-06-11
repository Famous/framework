'use strict';

var Async = require('async');

var Browser = require('./browser');
var Extra = require('./extra');
var LocalBlocksFolder = require('./local-blocks-folder');
var LocalBlocksCacheFolder = require('./local-blocks-cache-folder');
var Hub = require('./hub');

function derefDependencies(depReferenceTable, cb) {
    if (this.options.codeManagerVersionInfoHost) {
        Hub.derefDependencies.call(this, this.options.codeManagerVersionInfoHost, depReferenceTable, function(derefErr, depTable) {
            cb(null, depTable);
        });
    }
    else {
        // Just return the normal reference table for now
        cb(null, depReferenceTable);
    }
}

function loadDependencies(info, cb) {
    // We're going to accumulate dependencies into this dependency
    // array, recursively loading the dependencies of dependencies, etc.
    var dependenciesWanted = info.dereffedDependencyTable;

    if (Object.keys(dependenciesWanted).length < 1) {
        // Don't bother doing any of the logic below if we don't actually
        // need to reach out to find dependencies
        cb(null, {});
    }
    else {
        var dependenciesFound = {};
        var loadAttemptActions = [];
        if (this.options.doLoadDependenciesFromBrowser) {
            loadAttemptActions.push(Browser.loadDependenciesFromBrowser.bind(this));
        }
        else {
            if (this.options.localBlocksFolder || this.options.localRawSourceFolder) {
                loadAttemptActions.push(LocalBlocksFolder.loadDependencies.bind(this,
                    this.options.localBlocksFolder,
                    this.options.localRawSourceFolder
                ));
            }
            if (this.options.localBlocksCacheFolder) {
                loadAttemptActions.push(LocalBlocksCacheFolder.loadDependencies.bind(this,
                    this.options.localBlocksCacheFolder
                ));
            }
        }
        if (this.options.codeManagerAssetReadHost || this.options.codeManagerVersionInfoHost) {
            loadAttemptActions.push(Hub.loadDependencies.bind(this,
                this.options.codeManagerAssetReadHost,
                this.options.codeManagerVersionInfoHost
            ));
        }
        // After attempting to load the dependencies from all of the
        // possible sources, check to see if we succeeded overall
        var composedLoadFn = Async.seq.apply(Async, loadAttemptActions);
        composedLoadFn(dependenciesWanted, dependenciesFound, function(depLoadErr) {
            var dependenciesMissing = Extra.getDependenciesMissing(dependenciesWanted, dependenciesFound);
            if (depLoadErr || Object.keys(dependenciesMissing).length > 0) {
                console.error('Got error when trying to load dependencies:', depLoadErr);
                console.error('Unable to load `' + info.name + '`\'s dependencies ' + JSON.stringify(dependenciesMissing));
            }
            cb(null, dependenciesFound);
        });
    }
}

function saveAssets(info, cb) {
    var saveAssetsActions = [];
    if (this.options.codeManagerAssetWriteHost && this.options.doWriteToCodeManager) {
        saveAssetsActions.push(Hub.saveAssets.bind(this,
            this.options.codeManagerAssetWriteHost
        ));
    }
    if (this.options.localBlocksFolder) {
        saveAssetsActions.push(LocalBlocksFolder.saveAssets.bind(this,
            this.options.localBlocksFolder
        ));
    }
    var composedSaveFn = Async.seq.apply(Async, saveAssetsActions);
    composedSaveFn(info, function(saveErr, saveInfo) {
        if (!saveErr) {
            cb(null, saveInfo);
        }
        else {
            cb(saveErr);
        }
    });
}

function saveBundle(info, cb) {
    var saveBundleActions = [];
    if (this.options.codeManagerAssetWriteHost && this.options.doWriteToCodeManager) {
        saveBundleActions.push(Hub.saveBundle.bind(this,
            this.options.codeManagerAssetWriteHost
        ));
    }
    if (this.options.localBlocksFolder) {
        saveBundleActions.push(LocalBlocksFolder.saveBundle.bind(this,
            this.options.localBlocksFolder
        ));
    }
    var composedBundleSaveFn = Async.seq.apply(Async, saveBundleActions);
    composedBundleSaveFn(info, function(bundleSaveErr, bundleSaveInfo) {
        if (!bundleSaveErr) {
            cb(null, bundleSaveInfo);
        }
        else {
            cb(bundleSaveErr);
        }
    });
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
