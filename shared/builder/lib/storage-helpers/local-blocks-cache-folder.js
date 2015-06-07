'use strict';

function loadDependencies(baseDir, dependenciesWanted, dependenciesFound, cb) {
    // TODO
    console.warn('Local dependency cache loading not yet implemented');
    cb(null, dependenciesWanted, dependenciesFound);
}

module.exports = {
    loadDependencies: loadDependencies
};
