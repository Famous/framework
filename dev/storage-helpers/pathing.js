'use strict';

var conf = require('./../conf');

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
    return persistencePathTemplate(conf.get('codeManagerVersionGetRoute'), {
        apiVersion: conf.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, !!makeRelative);
}

function buildVersionInfoURL(moduleName, moduleVersion) {
    var versionPath = persistencePathTemplate(conf.get('codeManagerVersionGetRoute'), {
        apiVersion: conf.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion
    }, true);

    return conf.get('codeManagerVersionInfoHost') + SLASH + versionPath;
}

function buildAssetPath(moduleName, moduleVersion, assetPath, makeRelative) {
    return persistencePathTemplate(conf.get('codeManagerAssetGetRoute'), {
        apiVersion: conf.get('codeManagerApiVersion'),
        blockIdOrName: moduleName,
        versionRefOrTag: moduleVersion,
        assetPath: assetPath
    }, !!makeRelative);
}

function buildAssetURL(moduleName, moduleVersion, assetPath) {
    var assetPathRelative = buildAssetPath(moduleName, moduleVersion, assetPath, true);

    return conf.get('codeManagerAssetReadHost') + SLASH + assetPathRelative;
}

function getBlockCreateMethod() {
    return persistencePathMethod(conf.get('codeManagerBlockCreateRoute'));
}

function getVersionCreateMethod() {
    return persistencePathMethod(conf.get('codeManagerVersionCreateRoute'));
}

function getVersionGetMethod() {
    return persistencePathMethod(conf.get('codeManagerVersionGetRoute'));
}

function buildBlockCreateURI() {
    return conf.get('codeManagerAssetWriteHost') + '/v1/blocks';
}

function getVersionCreateURI(blockName) {
    var pathRelative = persistencePathTemplate(conf.get('codeManagerVersionCreateRoute'), {
        apiVersion: conf.get('codeManagerApiVersion'),
        blockIdOrName: blockName
    });

    return conf.get('codeManagerAssetWriteHost') + pathRelative;
}

function getVersionPath(blockName, versionRef) {
    return buildVersionPath(blockName, versionRef, true);
}

function getVersionURL(blockName, versionRef) {
    var versionPath = getVersionPath(blockName, versionRef);

    return conf.get('codeManagerAssetReadHost') + SLASH + versionPath;
}

/**
 * Pathing for auth-related actions
 */
function getAuthStatusMethod() {
    return persistencePathMethod(conf.get('authStatusRoute'));
}

function getUserInfoMethod() {
    return persistencePathMethod(conf.get('authUserInfoRoute'));
}

function getAuthStatusURI() {
    var pathRelative = persistencePathTemplate(conf.get('authStatusRoute'), {
        apiVersion: conf.get('authApiVersion')
    });

    return conf.get('authHost') + pathRelative;
}

function getUserInfoURI() {
    var pathRelative = persistencePathTemplate(conf.get('authUserInfoRoute'), {
        apiVersion: conf.get('authApiVersion')
    });

    return conf.get('authHost') + pathRelative;
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
