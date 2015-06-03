'use strict';

function loadDependenciesFromBrowser(dependencies, cb) {
    // TODO
    console.warn('Browser dependency loading not yet implemented');
    cb(null, dependencies);
}

module.exports = {
    loadDependenciesFromBrowser: loadDependenciesFromBrowser
};
