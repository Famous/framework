'use strict';

var StorageHelpers = require('./storage-helpers');

function derefDependencies(info, cb) {
    StorageHelpers.derefDependencies.call(this, info.dependencyTable, function(err, dereffedDeps) {
        info.dereffedDependencyTable = dereffedDeps;
        cb(null, info);
    });
}

module.exports = derefDependencies;
