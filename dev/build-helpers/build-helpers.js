'use strict';

var Lodash = require('lodash');
var Path = require('path');

var Config = require('./../config');

var BLANK = '';
var PIPE = '|';
var FSLASH = '/';
var STRING_TYPE = 'string';

function dependencyStringToModuleName(str) {
    var parts = moduleNameToModuleNameSegments(str);
    var head = parts.slice(0, parts.length - 1);
    var moduleName = head.join(Config.get('componentDelimiter'));
    return moduleName;
}

function doesStringLookLikeDependency(str) {
    // Object keys might be numbers, so we have to check here.
    if (typeof str === STRING_TYPE) {
        return str.indexOf(Config.get('componentDelimiter')) !== -1;  
    }
    else {
        return false;
    }
}

function eachDependencyStringInString(str, iterator) {
    var matches = str.match(Config.get('dependencyRegexp'));
    for (var i = 0; i < matches.length; i++) {
        if (!(matches[i] in Config.get('dependencyBlacklist'))) {
            iterator(matches[i]);
        }
    }
}

function eachAssetStringMatchInString(str, iterator) {
    var matches = str.match(Config.get('assetRegexp')) || [];
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var tmpStr = match + BLANK;
        tmpStr = tmpStr.replace(Config.get('assetPrefixRegexp'), BLANK)
                 .replace(Config.get('assetSuffixRegexp'), BLANK)
                 .replace(Config.get('componentDelimiterRegexp'), FSLASH)
                 .replace(PIPE, FSLASH);
        iterator(match, tmpStr);
    }
}

function doesFileLookLikeAsset(fileObject) {
    var extname = Path.extname(fileObject.path);
    return !!Config.get('assetTypes')[extname];
}

function doesFileLookLikeBinary(fileObject) {
    var extname = Path.extname(fileObject.path);
    return !!Config.get('binaryTypes')[extname];
}

function moduleNameToEntrypointBasename(moduleName) {
    var moduleNameParts = moduleNameToModuleNameSegments(moduleName);
    return moduleNameParts[moduleNameParts.length - 1];
}

function moduleNameToModuleNameSegments(moduleName) {
  return moduleName.split(Config.get('componentDelimiter'));
}

function importsObjectToFlatImportsObject(importsObj) {
    var flatImports = {};
    for (var selector in importsObj) {
        var array = importsObj[selector];
        for (var i = 0; i < array.length; i++) {
            flatImports[array[i]] = selector + Config.get('componentDelimiter') + array[i];
        }
    }
    return flatImports;
}

function moduleNamespaceAndBasenameToModuleName(moduleNamespace, moduleEntrypointBasename) {
    return moduleNamespace + Config.get('componentDelimiter') + moduleEntrypointBasename;
}

function stringToModuleCDNMatch(string) {
    var matches = string.match(Config.get('moduleCDNRegexp'));
    if (matches) {
        return {
            match: matches,
            value: matches[0].replace(Config.get('assetPrefixRegexp'), BLANK)
                             .replace(Config.get('assetSuffixRegexp'), BLANK)
        };
    }
    else {
        return null;
    }
}

var HTTP_REGEXP = /^https?:\/\//i;

function buildIncludesArray(info, skipURLExpansion) {
    var versionURL = info.versionURL;
    var moduleConfigs = info.moduleConfigs;
    var inlinedFiles = info.inlinedFiles || [];
    var includesArray = [];
    for (var i = 0; i < moduleConfigs.length; i++) {
        var moduleConfig = moduleConfigs[i];
        if (moduleConfig.includes) {
            for (var j = 0; j < moduleConfig.includes.length; j++) {
                var includeStr = moduleConfig.includes[j];
                // Someone might want to get the 'raw' includes array without
                // any expansion e.g. ['foo.js', 'bar.css']
                // Also don't bother trying to expand the URL if there isn't
                // a version URL to begin with, since then we'll end up with
                // a bunch of useless ['undefinedb.css'] includes in the list.
                if (skipURLExpansion || !versionURL) {
                    includesArray.push(includeStr);
                }
                else {
                    // No need to 'include' any files that have been already
                    // inlined inside of the entrypoint
                    if (inlinedFiles.indexOf(includeStr) === -1) {
                        // If a full URL was given, don't prefix it with the version URL
                        if (HTTP_REGEXP.test(includeStr)) {
                            includesArray.push(includeStr);
                        }
                        else {
                            // Note that version URL is an absolute path to the version
                            // folder on HTTP
                            includesArray.push(versionURL + includeStr);
                        }
                    }
                }
            }
        }
    }
    return Lodash.uniq(includesArray);
}

function moduleNameToNamespace(moduleName) {
    return Lodash.first(moduleName.split(Config.get('componentDelimiter')));
}

module.exports = {
    buildIncludesArray: buildIncludesArray,
    dependencyStringToModuleName: dependencyStringToModuleName,
    doesFileLookLikeAsset: doesFileLookLikeAsset,
    doesFileLookLikeBinary: doesFileLookLikeBinary,
    doesStringLookLikeDependency: doesStringLookLikeDependency,
    eachAssetStringMatchInString: eachAssetStringMatchInString,
    eachDependencyStringInString: eachDependencyStringInString,
    importsObjectToFlatImportsObject: importsObjectToFlatImportsObject,
    moduleNameToNamespace: moduleNameToNamespace,
    moduleNamespaceAndBasenameToModuleName: moduleNamespaceAndBasenameToModuleName,
    moduleNameToEntrypointBasename: moduleNameToEntrypointBasename,
    moduleNameToModuleNameSegments: moduleNameToModuleNameSegments,
    stringToModuleCDNMatch: stringToModuleCDNMatch
};
