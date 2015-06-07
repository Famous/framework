'use strict';

var Path = require('path');

var PIPE = '|';
var SLASH = '/';
var ROUTE_VAR_PREFIX = ':'; // Follows the Rails convention

function persistencePathTemplate(route, locals, makeRelative) {
    var routeSegments = route.split(PIPE);
    var mainRoute = routeSegments[routeSegments.length - 1];
    for (var localName in locals) {
        var localValue = locals[localName];
        mainRoute = mainRoute.replace(ROUTE_VAR_PREFIX + localName, localValue);
    }
    if (makeRelative) {
        // Remove the preceding slash if there is one.
        if (mainRoute[0] === SLASH) {
            mainRoute = mainRoute.slice(1, mainRoute.length);
        }
    }
    return mainRoute;
}

function buildVersionPath(moduleName, moduleVersion, makeRelative) {
    return persistencePathTemplate.call(this, this.options.codeManagerVersionGetRoute, {
        apiVersion: this.options.codeManagerApiVersion,
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, !!makeRelative);
}

function buildComponentSourceCodePath(moduleName, moduleVersion, assetPath) {
    var relPath = moduleName.split(this.options.componentDelimiter).join(Path.sep);
    var absPath = Path.join(this.options.componentSourceCodeRoute, relPath);
    return absPath;
}

function buildAssetPath(moduleName, moduleVersion, assetPath, makeRelative) {
    return persistencePathTemplate.call(this, this.options.codeManagerAssetGetRoute, {
        apiVersion: this.options.codeManagerApiVersion,
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion,
        assetPath: assetPath
    }, !!makeRelative);
}

function buildAssetURL(moduleName, moduleVersion, assetPath) {
    var assetPathRelative = buildAssetPath.call(this, moduleName, moduleVersion, assetPath, true);
    return this.options.codeManagerAssetReadHost + SLASH + assetPathRelative;
}

module.exports = {
    buildAssetPath: buildAssetPath,
    buildAssetURL: buildAssetURL,
    buildComponentSourceCodePath: buildComponentSourceCodePath,
    buildVersionPath: buildVersionPath   
};
