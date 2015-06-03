'use strict';

var StorageHelpers = require('./storage-helpers');

function saveAssets(where, info, cb) {
    StorageHelpers.saveAssets.call(this, where, info.name, info.files, function(localSaveErr, localSaveInfo) {
        info.versionRef = localSaveInfo.versionRef;
        info.versionPath = localSaveInfo.versionPath;
        info.versionURL = localSaveInfo.versionURL;
        console.log('Built version `' + info.name + '` (' + info.versionRef + ') to ' + info.versionPath);
        cb(null, info);
    });
}

module.exports = saveAssets;
