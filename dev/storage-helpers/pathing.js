'use strict';

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

function persistencePathMethod(route) {
    var routeSegments = route.split(PIPE);
    return routeSegments[0];
}

function buildVersionPath(moduleName, moduleVersion, makeRelative) {
    return persistencePathTemplate.call(this, this.options.codeManagerVersionGetRoute, {
        apiVersion: this.options.codeManagerApiVersion,
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, !!makeRelative);
}

function buildVersionInfoURL(moduleName, moduleVersion) {
    var versionPath = persistencePathTemplate.call(this, this.options.codeManagerVersionGetRoute, {
        apiVersion: this.options.codeManagerApiVersion,
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, true);
    return this.options.codeManagerVersionInfoHost + SLASH + versionPath;
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

function getBlockCreateMethod() {
    return persistencePathMethod.call(this, this.options.codeManagerBlockCreateRoute);
}

function getVersionCreateMethod() {
    return persistencePathMethod.call(this, this.options.codeManagerVersionCreateRoute);
}

function getVersionGetMethod() {
    return persistencePathMethod.call(this, this.options.codeManagerVersionGetRoute);
}

function buildBlockCreateURI() {
    return this.options.codeManagerAssetWriteHost + '/v1/blocks';
}

function getVersionCreateURI(blockName) {
    var pathRelative = persistencePathTemplate.call(this, this.options.codeManagerVersionCreateRoute, {
        apiVersion: this.options.codeManagerApiVersion,
        blockIdOrName: blockName
    });
    return this.options.codeManagerAssetWriteHost + pathRelative;
}

function getVersionPath(blockName, versionRef) {
    return buildVersionPath.call(this, blockName, versionRef, true);
}

function getVersionURL(blockName, versionRef) {
    var versionPath = getVersionPath.call(this, blockName, versionRef);
    return this.options.codeManagerAssetReadHost + SLASH + versionPath;
}

/**
 * Pathing for auth-related actions
 */
function getAuthStatusMethod() {
    return persistencePathMethod.call(this, this.options.authStatusRoute);
}

function getUserInfoMethod() {
    return persistencePathMethod.call(this, this.options.authUserInfoRoute);
}

function getAuthStatusURI() {
    var pathRelative = persistencePathTemplate.call(this, this.options.authStatusRoute, {
        apiVersion: this.options.authApiVersion
    });
    return this.options.authHost + pathRelative;
}

function getUserInfoURI() {
    var pathRelative = persistencePathTemplate.call(this, this.options.authUserInfoRoute, {
        apiVersion: this.options.authApiVersion
    });
    return this.options.authHost + pathRelative;
}

module.exports = {
    buildAssetPath: buildAssetPath,
    buildAssetURL: buildAssetURL,
    buildBlockCreateURI: buildBlockCreateURI,
    buildVersionInfoURL: buildVersionInfoURL,
    buildVersionPath: buildVersionPath,
    getAuthStatusMethod: getAuthStatusMethod,
    getAuthStatusURI: getAuthStatusURI,
    getBlockCreateMethod: getBlockCreateMethod,
    getUserInfoMethod: getUserInfoMethod,
    getUserInfoURI: getUserInfoURI,
    getVersionCreateMethod: getVersionCreateMethod,
    getVersionCreateURI: getVersionCreateURI,
    getVersionGetMethod: getVersionGetMethod,
    getVersionPath: getVersionPath,
    getVersionURL: getVersionURL,
    persistencePathMethod: persistencePathMethod,
    persistencePathTemplate: persistencePathTemplate
};
