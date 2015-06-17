'use strict';

var Path = require('path');

var Config = require('./../config');

function assetMapper(file) {
    return {
        path: Path.join(Config.get('bundleBasePath'), file.path),
        content: file.content
    };
}

function build(info, assetFiles) {
    var collection = [];

    collection.push({
        path: Config.get('bundleAssetPath'),
        content: info.bundleString
    });

    collection.push({
        path: Config.get('parcelAssetPath'),
        content: JSON.stringify(info.parcelHash, null, 4)
    });

    if (!Config.get('doSkipExecutableBuild')) {
        collection.push({
            path: Config.get('bundleIndexPath'),
            content: info.bundleIndexString
        });

        collection.push({
            path: Config.get('bundleExecutablePath'),
            content: info.bundleExecutableString
        });
    }

    // Also include all of the normal files, not just the
    // ones we built specifically for the bundle, but make sure to
    // prefix them with the ~bundles directory so relative pathing
    // works
    collection = collection.concat(assetFiles.map(assetMapper));

    return collection;
}

module.exports = {
    build: build
};
