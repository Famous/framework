'use strict';

var StorageHelpers = require('./storage-helpers');

function saveBundle(where, info, cb) {
    StorageHelpers.saveBundle.call(this, where, info, function(localSaveErr, localSaveInfo) {
        info.bundleVersionRef = localSaveInfo.bundleVersionRef;
        info.bundlePath = localSaveInfo.bundlePath;
        info.bundleURL = localSaveInfo.bundleURL;
        info.parcelPath = localSaveInfo.parcelPath;
        info.parcelURL = localSaveInfo.parcelURL;
        console.log('Built bundle of `' + info.name + '` (' + info.bundleVersionRef + ') to ' + info.bundlePath);
        cb(null, info);
    });
}

module.exports = saveBundle;
