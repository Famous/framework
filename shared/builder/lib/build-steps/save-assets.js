'use strict';

var Lodash = require('lodash');

var StorageHelpers = require('./../storage-helpers');

function saveAssets(info, cb) {
    info.assetSaveableFiles = Lodash.reject(info.files, function(file) {
        return !!(file.path in this.options.assetBlacklist);
    }.bind(this));

    // The storage helpers will append the necessary data to the info
    // object, e.g. info.versionRef, etc.
    StorageHelpers.saveAssets.call(this, info, function(saveErr) {
        if (!saveErr) {
            // console.log('Built version `' + info.name + '` (' + info.versionRef + ') to ' + info.versionPath);
            cb(null, info);
        }
        else {
            console.error(saveErr);
        }
    });
}

module.exports = saveAssets;
