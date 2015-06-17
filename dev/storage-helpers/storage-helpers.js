'use strict';

var Async = require('async');

var Browser = require('./browser');
var Extra = require('./extra');
var LocalBlocksFolder = require('./local-blocks-folder');
var LocalBlocksCacheFolder = require('./local-blocks-cache-folder');
var Hub = require('./hub');

var Config = require('./../config');

function derefDependencies(depReferenceTable, cb) {
    if (!Config.get('codeManagerVersionInfoHost')) {
        // Just return the normal reference table for now
        return cb(null, depReferenceTable);
    }

    Hub.derefDependencies(Config.get('codeManagerVersionInfoHost'), depReferenceTable, cb);
}

function loadDependencies(info, cb) {
    // We're going to accumulate dependencies into the dependency
    // array, recursively loading the dependencies of dependencies, etc.
    var dependenciesWanted = info.dereffedDependencyTable;

    if (Object.keys(dependenciesWanted).length < 1) {
        // Don't bother doing any of the logic below if we don't actually
        // need to reach out to find dependencies
        return cb(null, {});
    }

    var dependenciesFound = {};
    var loadAttemptActions = [];

    if (Config.get('doLoadDependenciesFromBrowser')) {
        loadAttemptActions.push(Browser.loadDependenciesFromBrowser);
    }
    else {
        if (Config.get('localBlocksFolder') || Config.get('localRawSourceFolder')) {
            loadAttemptActions.push(LocalBlocksFolder.loadDependencies.bind(null,
                Config.get('localBlocksFolder'),
                Config.get('localRawSourceFolder')
            ));
        }

        if (Config.get('localBlocksCacheFolder')) {
            loadAttemptActions.push(LocalBlocksCacheFolder.loadDependencies.bind(null,
                Config.get('localBlocksCacheFolder')
            ));
        }
    }

    if (Config.get('codeManagerAssetReadHost') || Config.get('codeManagerVersionInfoHost')) {
        loadAttemptActions.push(Hub.loadDependencies.bind(null,
            Config.get('codeManagerAssetReadHost'),
            Config.get('codeManagerVersionInfoHost')
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

        return cb(null, dependenciesFound);
    });
}

function saveAssets(info, cb) {
    var saveAssetsActions = [];

    if (Config.get('codeManagerAssetWriteHost') && Config.get('doWriteToCodeManager')) {
        saveAssetsActions.push(Hub.saveAssets.bind(null,
            Config.get('codeManagerAssetWriteHost')
        ));
    }

    if (Config.get('localBlocksFolder')) {
        saveAssetsActions.push(LocalBlocksFolder.saveAssets.bind(null,
            Config.get('localBlocksFolder')
        ));
    }

    var composedSaveFn = Async.seq.apply(Async, saveAssetsActions);

    composedSaveFn(info, cb);
}

function saveBundle(info, cb) {
    var saveBundleActions = [];

    if (Config.get('codeManagerAssetWriteHost') && Config.get('doWriteToCodeManager')) {
        saveBundleActions.push(Hub.saveBundle.bind(null,
            Config.get('codeManagerAssetWriteHost')
        ));
    }

    if (Config.get('localBlocksFolder')) {
        saveBundleActions.push(LocalBlocksFolder.saveBundle.bind(null,
            Config.get('localBlocksFolder')
        ));
    }

    var composedBundleSaveFn = Async.seq.apply(Async, saveBundleActions);

    composedBundleSaveFn(info, cb);
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies,
    saveAssets: saveAssets,
    saveBundle: saveBundle
};
