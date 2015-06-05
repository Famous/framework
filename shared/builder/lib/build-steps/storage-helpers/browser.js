'use strict';

function loadDependenciesFromBrowser(dependenciesWanted, dependenciesFound, cb) {
    // TODO
    console.warn('Browser dependency loading not yet implemented');
    cb(null, dependenciesWanted, dependenciesFound);
}

module.exports = {
    loadDependenciesFromBrowser: loadDependenciesFromBrowser
};
