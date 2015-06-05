'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Request = require('request');

var Browser = require('./browser');
var Extra = require('./extra');
var LocalSourceFolder = require('./local-source');
var LocalCacheFolder = require('./local-cache');
var Hub = require('./hub');

function derefDependencies(depReferenceTable, cb) {
    // TODO - Actually fetch the referenced dependencies (SHAs)
    cb(null, depReferenceTable);
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
        if (this.options.localDependenciesSourceFolder) {
            loadAttemptActions.push(LocalSourceFolder.loadDependenciesFromLocalSourceFolder.bind(this, this.options.localDependenciesSourceFolder));
        }
        if (this.options.localDependenciesCacheFolder) {
            loadAttemptActions.push(LocalCacheFolder.loadDependenciesFromLocalCacheFolder.bind(this, this.options.localDependenciesCacheFolder));
        }
    }
    if (this.options.codeManagerHost) {
        loadAttemptActions.push(Hub.loadDependenciesFromHub.bind(this, this.options.codeManagerHost));
    }
    // After attempting to load the dependencies from all of the
    // possible sources, check to see if we succeeded overall
    var composedLoadFn = Async.seq.apply(Async, loadAttemptActions);
    composedLoadFn(dependenciesWanted, dependenciesFound, function(depLoadErr) {
        var dependenciesMissing = Extra.getDependenciesMissing(dependenciesWanted, dependenciesFound);
        if (depLoadErr || Object.keys(dependenciesMissing).length > 0) {
            console.error('Unable to load dependencies ' + JSON.stringify(dependenciesMissing));
        }
        cb(null, dependenciesFound);
    });
}

function saveAssets(where, info, cb) {
    if (where === 'local') {
        if (this.options.localDependenciesSourceFolder) {
            LocalSourceFolder.saveAssets.call(this, this.options.localDependenciesSourceFolder, info, function(localSourceSaveErr, localSourceSaveInfo) {
                cb(null, localSourceSaveInfo);
            });
        }
    }
}

function saveBundle(where, info, cb) {
    if (where === 'local') {
        if (this.options.localDependenciesSourceFolder) {
            LocalSourceFolder.saveBundle.call(this, this.options.localDependenciesSourceFolder, info, function(localSourceSaveErr, localSourceSaveInfo) {
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
