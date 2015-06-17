'use strict';

var StorageHelpers = require('./../storage-helpers/storage-helpers');

function loadDependencies(info, cb) {
    StorageHelpers.loadDependencies(info, function(err, dependenciesFound) {
        if (err) {
            console.error(err);
            return cb(err, info);
        }

        info.dependenciesFound = dependenciesFound;

        return cb(null, info);
    });
}

module.exports = loadDependencies;
