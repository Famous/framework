'use strict';

function getDependenciesMissing(wanted, found) {
    var missing = {};
    for (var depName in wanted) {
        if (!found[depName]) {
            missing[depName] = wanted[depName];
        }
    }
    return missing;
}

function areAnyDependenciesMissing(wanted, found) {
    var missing = getDependenciesMissing(wanted, found);
    return Object.keys(missing).length > 0;
}

function looksLikeComponentWasAlreadyBuilt(info) {
    return !!info.bundleString;
}

module.exports = {
    areAnyDependenciesMissing: areAnyDependenciesMissing,
    getDependenciesMissing: getDependenciesMissing,
    looksLikeComponentWasAlreadyBuilt: looksLikeComponentWasAlreadyBuilt
};
