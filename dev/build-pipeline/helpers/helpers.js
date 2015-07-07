'use strict';

var Async = require('async');
var Fs = require('fs');
var uniq = require('lodash.uniq');
var first = require('lodash.first');
var Path = require('path');
var ReaddirRecursive = require('recursive-readdir');

var Config = require('./../config/config');

var HTTP_REGEXP = /^https?:\/\//i;
var STRING_TYPE = 'string';

function readFilesRecursive(baseDir, finish) {
    ReaddirRecursive(baseDir, function(dirErr, filePaths) {
        if (dirErr) {
            return finish(dirErr);
        }

        Async.map(filePaths, Fs.readFile, function(contentsErr, fileContents) {
            if (contentsErr) {
                return finish(contentsErr);
            }

            var resultsArray = [];

            for (var i = 0; i < fileContents.length; i++) {
                var filePath = filePaths[i].replace(baseDir, '');
                var fileContent = fileContents[i];

                // Remove the preceding slash since the users of this
                // function downstream expect the path to be relative
                if (filePath[0] === Path.sep) {
                    filePath = filePath.slice(1, filePath.length);
                }

                var fileData;
                if (doesFileLookLikeBinary(filePath)) {
                    fileData = new Buffer(fileContent).toString('base64');
                }
                else {
                    fileData = fileContent;
                }

                resultsArray.push({
                    path: filePath,
                    content: fileData
                });
            }

            return finish(null, resultsArray);
        });
    });
}

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

function doesFileLookLikeStaticAsset(fileObject) {
    return !!Config.get('assetTypes')[Path.extname(fileObject.path)];
}

function doesFileLookLikeBinary(fileObject) {
    return !!Config.get('binaryTypes')[Path.extname(fileObject.path)];
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

function buildIncludesArray(data, skipURLExpansion) {
    var moduleConfigObjects = data.moduleConfigObjects;
    var inlinedFiles = data.inlinedFiles || [];
    var includesArray = [];

    for (var i = 0; i < moduleConfigObjects.length; i++) {
        var moduleConfig = moduleConfigObjects[i];

        if (moduleConfig.includes) {
            for (var j = 0; j < moduleConfig.includes.length; j++) {
                var includeStr = moduleConfig.includes[j];
                // Someone might want to get the 'raw' includes array without
                // any expansion e.g. ['foo.js', 'bar.css']
                if (skipURLExpansion) {
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
                            console.warn('Ambiguous include string ', includeStr);
                        }
                    }
                }
            }
        }
    }

    return uniq(includesArray);
}

function moduleNameToNamespace(moduleName) {
    return first(moduleName.split(Config.get('componentDelimiter')));
}

module.exports = {
    buildIncludesArray: buildIncludesArray,
    dependencyStringToModuleName: dependencyStringToModuleName,
    doesFileLookLikeStaticAsset: doesFileLookLikeStaticAsset,
    doesFileLookLikeBinary: doesFileLookLikeBinary,
    doesStringLookLikeDependency: doesStringLookLikeDependency,
    eachDependencyStringInString: eachDependencyStringInString,
    importsObjectToFlatImportsObject: importsObjectToFlatImportsObject,
    moduleNameToNamespace: moduleNameToNamespace,
    moduleNamespaceAndBasenameToModuleName: moduleNamespaceAndBasenameToModuleName,
    moduleNameToEntrypointBasename: moduleNameToEntrypointBasename,
    moduleNameToModuleNameSegments: moduleNameToModuleNameSegments,
    readFilesRecursive: readFilesRecursive
};
