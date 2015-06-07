'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Request = require('request');

var Browser = require('./browser');
var Extra = require('./extra');
var LocalBlocksFolder = require('./local-blocks-folder');
var LocalBlocksCacheFolder = require('./local-blocks-cache-folder');
var Hub = require('./hub');

function derefDependencies(depReferenceTable, cb) {
    if (this.options.codeManagerVersionInfoHost) {
        Hub.derefDependencies.call(this, this.options.codeManagerVersionInfoHost, depReferenceTable, cb);
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
    if (this.options.codeManagerAssetReadHost) {
        loadAttemptActions.push(Hub.loadDependencies.bind(this,
            this.options.codeManagerAssetReadHost
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

function saveAssets(where, info, cb) {
    if (where === 'local') {
        if (this.options.localBlocksFolder) {
            LocalBlocksFolder.saveAssets.call(this, this.options.localBlocksFolder, info, function(localSourceSaveErr, localSourceSaveInfo) {
                cb(null, localSourceSaveInfo);
            });
        }
    }
}

function saveBundle(where, info, cb) {
    if (where === 'local') {
        if (this.options.localBlocksFolder) {
            LocalBlocksFolder.saveBundle.call(this, this.options.localBlocksFolder, info, function(localSourceSaveErr, localSourceSaveInfo) {
                cb(null, localSourceSaveInfo);
            });
        }
    }
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
