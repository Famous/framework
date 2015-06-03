'use strict';

var StorageHelpers = require('./storage-helpers');

function loadDependencies(info, cb) {
    StorageHelpers.loadDependencies.call(this, info.dereffedDependencyTable, function(err, dependencies) {
        if (err) {
            console.error(err);
            cb(err, info);
        }
        else {
            info.dependencies = dependencies;
            cb(null, info);
        }
    });
}

module.exports = loadDependencies;
