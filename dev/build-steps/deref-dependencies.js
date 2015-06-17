'use strict';

var Chalk = require('chalk');

var StorageHelpers = require('./../storage-helpers/storage-helpers');

var Config = require('./../config');

function derefDependencies(info, cb) {
    if (Config.get('doSkipDependencyDereferencing')) {
        // The downstream functions expect a 'dereffedDependencyTable' which is
        // basically a table with all of the "true" dependency versions as keys
        info.dereffedDependencyTable = info.dependencyTable;

        return cb(null, info);
    }

    console.log(Chalk.gray('famous'), 'Resolving dependencies for ' + info.name + '...');

    StorageHelpers.derefDependencies(info.dependencyTable, function(err, dereffedDeps) {
        if (err) {
            console.error(err);
            return cb(err, info);
        }

        info.dereffedDependencyTable = dereffedDeps;

        return cb(null, info);
    });
}

module.exports = derefDependencies;
