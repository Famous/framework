'use strict';

var StorageHelpers = require('./../storage-helpers');

function loadDependencies(info, cb) {
    StorageHelpers.loadDependencies.call(this, info, function(err, dependenciesFound) {
        if (err) {
            console.error(err);
            cb(err, info);
        }
        else {
            info.dependenciesFound = dependenciesFound;
            cb(null, info);
        }
    });
}

module.exports = loadDependencies;
