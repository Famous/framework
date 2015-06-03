'use strict';

function loadDependenciesFromLocalCacheFolder(baseDir, dependencies, cb) {
    // TODO
    console.warn('Local dependency cache loading not yet implemented');
    cb(null, dependencies);
}

module.exports = {
    loadDependenciesFromLocalCacheFolder: loadDependenciesFromLocalCacheFolder
};
