'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Request = require('request');

var Browser = require('./browser');
var LocalSourceFolder = require('./local-source');
var LocalCacheFolder = require('./local-cache');
var Hub = require('./hub');

function derefDependencies(depReferenceTable, cb) {
    // TODO - Actually fetch the referenced dependencies (SHAs)
    cb(null, depReferenceTable);
}

function loadDependencies(depTable, cb) {
    var dependencies = {};
    for (var depName in depTable) {
        dependencies[depName] = {
            version: depTable[depName],
            data: this.options.defaultDependencyData
        };
    }

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

    Async.seq.apply(Async, loadAttemptActions)(dependencies, cb);
}

function saveAssets(where, name, files, cb) {
    if (where === 'local') {
        if (this.options.localDependenciesSourceFolder) {
            LocalSourceFolder.saveAssets.call(this, this.options.localDependenciesSourceFolder, name, files, function(localSourceSaveErr, localSourceSaveInfo) {
                cb(null, localSourceSaveInfo);
            });
        }
    }
}

function saveBundle(where, name, content, cb) {
    if (where === 'local') {
        if (this.options.localDependenciesSourceFolder) {
            LocalSourceFolder.saveBundle.call(this, this.options.localDependenciesSourceFolder, name, content, function(localSourceSaveErr, localSourceSaveInfo) {
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
