'use strict';

var Path = require('path');

function build(info, assetFiles) {
    var collection = [];

    collection.push({
        path: this.options.bundleAssetPath,
        content: info.bundleString
    });

    collection.push({
        path: this.options.parcelAssetPath,
        content: JSON.stringify(info.parcelHash, null, 4)
    });

    if (!this.options.doSkipExecutableBuild) {
        collection.push({
            path: this.options.bundleIndexPath,
            content: info.bundleIndexString
        });
        collection.push({
            path: this.options.bundleExecutablePath,
            content: info.bundleExecutableString
        });
    }

    // Also include all of the normal files, not just the
    // ones we built specifically for the bundle, but make sure to
    // prefix them with the ~bundles directory so relative pathing
    // works
    collection = collection.concat(assetFiles.map(function(file) {
        return {
            path: Path.join(this.options.bundleBasePath, file.path),
            content: file.content
        };
    }.bind(this)));

    return collection;
}

module.exports = {
    build: build
};
