'use strict';

var Lodash = require('lodash');

var StorageHelpers = require('./../storage-helpers/storage-helpers');

var Config = require('./../config');

function saveAssets(info, cb) {
    info.assetSaveableFiles = Lodash.reject(info.files, function(file) {
        return !!(file.path in Config.get('assetBlacklist'));
    });

    // The storage helpers will append the necessary data to the info
    // object, e.g. info.versionRef, etc.
    StorageHelpers.saveAssets(info, function(saveErr) {
        if (saveErr) {
            console.error(saveErr);
        }

        // console.log('Built version `' + info.name + '` (' + info.versionRef + ') to ' + info.versionPath);
        return cb(null, info);
    });
}

module.exports = saveAssets;
