'use strict';

var StorageHelpers = require('./storage-helpers');

function loadDependencies(info, cb) {
    StorageHelpers.loadDependencies.call(this, info.dereffedDependencyTable, function(err, dependencies) {
        info.dependencies = dependencies;
        cb(null, info);
    });
}

module.exports = loadDependencies;
