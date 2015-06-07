'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Request = require('request');

var PathingHelpers = require('./pathing');

var SHA_LENGTH = 64;
var SHA_REGEXP = /^([a-zA-Z0-9])+$/i;

function loadDependencies(assetReadHost, dependenciesWanted, dependenciesFound, cb) {
    // TODO
    cb(null, dependenciesWanted, dependenciesFound);
}

function derefDependency(refTuple, cb) {
    var depName = refTuple[0];
    var depRef = refTuple[1];
    if (depRef && depRef.length === SHA_LENGTH && SHA_REGEXP.test(depRef)) {
        // The dependency version already looks like a ref, so we will
        // assume that it has previously been dereferenced
        cb(null, refTuple);
    }
    else {
        var versionURL = PathingHelpers.buildVersionInfoURL.call(this, depName, depRef);
        Request({
            method: 'GET',
            uri: versionURL,
        }, function(reqErr, response, body) {
            console.log('Error resolving dependency for `' + depName + '` (' + depRef + ')');
            cb(null, refTuple);
        });
    }
}

function derefDependencies(versionInfoHost, depRefTable, cb) {
    var refTuples = Lodash.pairs(depRefTable);
    Async.map(refTuples, derefDependency.bind(this), function(derefErr, dereffedTuples) {
        var dereffedTable = Lodash.zipObject(dereffedTuples);
        cb(null, dereffedTable);
    });
}

module.exports = {
    derefDependencies: derefDependencies,
    loadDependencies: loadDependencies
};
