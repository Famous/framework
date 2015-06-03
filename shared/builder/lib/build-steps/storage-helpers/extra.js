'use strict';

function getNotYetLoadedDependencies(dependencies) {
    var notYetLoaded = [];
    for (var depName in dependencies) {
        var dependency = dependencies[depName];
        if (dependency.data === this.options.defaultDependencyData) {
            notYetLoaded.push([depName, dependency.version]);
        }
    }
    return notYetLoaded;
}

module.exports = {
    getNotYetLoadedDependencies: getNotYetLoadedDependencies
};
