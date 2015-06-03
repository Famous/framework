'use strict';

function loadDependenciesFromHub(codeManagerHost, dependencies, cb) {
    // TODO
    console.warn('Famous Hub-based dependency loading not yet implemented');
    cb(null, dependencies);
}

module.exports = {
    loadDependenciesFromHub: loadDependenciesFromHub
};
