'use strict';

var Chalk = require('chalk');

var StorageHelpers = require('./../storage-helpers');

function saveBundle(info, cb) {
    StorageHelpers.saveBundle.call(this, info, function(bundleSaveErr) {
        if (!bundleSaveErr) {
            console.log(Chalk.gray('famous'), Chalk.green('ok'), 'Built bundle ' + info.name + '~>' + info.bundleVersionRef);
            cb(null, info);
        }
        else {
            cb(bundleSaveErr);
        }
    });
}

module.exports = saveBundle;
