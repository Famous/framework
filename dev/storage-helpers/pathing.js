'use strict';

var Path = require('path');

var Config = require('./../config');

var PIPE = '|';
var FSLASH = '/';
var ROUTE_VAR_PREFIX = ':'; // Follows the Rails convention

function persistencePathTemplate(route, locals, makeRelative) {
    var routeSegments = route.split(PIPE);
    var mainRoute = routeSegments[routeSegments.length - 1];

    for (var localName in locals) {
        var localValue = locals[localName];
        mainRoute = mainRoute.replace(ROUTE_VAR_PREFIX + localName, localValue);
    }

    if (makeRelative) {
        // Remove the preceding path separator if there is one.
        if (mainRoute[0] === Path.sep) {
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
    return persistencePathTemplate(Config.get('codeManagerVersionGetRoute'), {
        apiVersion: Config.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, !!makeRelative);
}

function buildVersionInfoURL(moduleName, moduleVersion) {
    var versionPath = persistencePathTemplate(Config.get('codeManagerVersionGetRoute'), {
        apiVersion: Config.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, true);

    return Config.get('codeManagerVersionInfoHost') + FSLASH + versionPath.replace(Path.sep, FSLASH);
}

function buildAssetPath(moduleName, moduleVersion, assetPath, makeRelative) {
    return persistencePathTemplate(Config.get('codeManagerAssetGetRoute'), {
        apiVersion: Config.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion,
        assetPath: assetPath
    }, !!makeRelative);
}

function buildAssetURL(moduleName, moduleVersion, assetPath) {
    var assetPathRelative = buildAssetPath(moduleName, moduleVersion, assetPath, true);

    return Config.get('codeManagerAssetReadHost') + FSLASH + assetPathRelative.replace(Path.sep, FSLASH);
}

function getBlockCreateMethod() {
    return persistencePathMethod(Config.get('codeManagerBlockCreateRoute'));
}

function getVersionCreateMethod() {
    return persistencePathMethod(Config.get('codeManagerVersionCreateRoute'));
}

function getVersionGetMethod() {
    return persistencePathMethod(Config.get('codeManagerVersionGetRoute'));
}

function buildBlockCreateURI() {
    return Config.get('codeManagerAssetWriteHost') + '/v1/blocks';
}

function getVersionCreateURI(blockName) {
    var pathRelative = persistencePathTemplate(Config.get('codeManagerVersionCreateRoute'), {
        apiVersion: Config.get('codeManagerApiVersion'),
        blockIdOrName: blockName
    });

    return Config.get('codeManagerAssetWriteHost') + pathRelative.replace(Path.sep, FSLASH);
}

function getVersionPath(blockName, versionRef) {
    return buildVersionPath(blockName, versionRef, true);
}

function getVersionURL(blockName, versionRef) {
    var versionPath = getVersionPath(blockName, versionRef);

    return Config.get('codeManagerAssetReadHost') + FSLASH + versionPath.replace(Path.sep, FSLASH);
}

/**
 * Pathing for auth-related actions
 */
function getAuthStatusMethod() {
    return persistencePathMethod(Config.get('authStatusRoute'));
}

function getUserInfoMethod() {
    return persistencePathMethod(Config.get('authUserInfoRoute'));
}

function getAuthStatusURI() {
    var pathRelative = persistencePathTemplate(Config.get('authStatusRoute'), {
        apiVersion: Config.get('authApiVersion')
    });

    return Config.get('authHost') + pathRelative.replace(Path.sep, FSLASH);
}

function getUserInfoURI() {
    var pathRelative = persistencePathTemplate(Config.get('authUserInfoRoute'), {
        apiVersion: Config.get('authApiVersion')
    });

    return Config.get('authHost') + pathRelative.replace(Path.sep, FSLASH);
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
