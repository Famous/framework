'use strict';

function loadDependenciesFromLocalCacheFolder(baseDir, dependenciesWanted, dependenciesFound, cb) {
    // TODO
    console.warn('Local dependency cache loading not yet implemented');
    cb(null, dependenciesWanted, dependenciesFound);
}

module.exports = {
    loadDependenciesFromLocalCacheFolder: loadDependenciesFromLocalCacheFolder
};
