'use strict';

var Chalk = require('chalk');

var StorageHelpers = require('./../storage-helpers/storage-helpers');

function saveBundle(info, cb) {
    StorageHelpers.saveBundle(info, function(bundleSaveErr) {
        if (bundleSaveErr) {
            return cb(bundleSaveErr);
        }

        console.log(Chalk.gray('famous'), Chalk.green('ok'), 'Built bundle ' + info.name + ' ~> ' + info.bundleVersionRef);
        console.log(Chalk.gray('famous'), '  ', 'Bundle URL:', Chalk.magenta(info.bundleURL));

        return cb(null, info);
    });
}

module.exports = saveBundle;
