'use strict';

var Chalk = require('chalk');

var StorageHelpers = require('./../storage-helpers');

function derefDependencies(info, cb) {
    console.log(Chalk.gray('famous'), 'Resolving dependencies for ' + info.name + '...');
    StorageHelpers.derefDependencies.call(this, info.dependencyTable, function(err, dereffedDeps) {
        if (err) {
            console.error(err);
            cb(err, info);
        }
        else {
            info.dereffedDependencyTable = dereffedDeps;
            cb(null, info);
        }
    });
}

module.exports = derefDependencies;
