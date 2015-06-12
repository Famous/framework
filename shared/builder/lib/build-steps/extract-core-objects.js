'use strict';

var Chalk = require('chalk');
var Lodash = require('lodash');
var Path = require('path');

var BuildHelpers = require('./../build-helpers');
var EsprimaHelpers = require('./../esprima-helpers');

function extractMethodChain(chain, node, parent) {
    if (EsprimaHelpers.isCallExpression(node)) {
        chain.push({ args: node.arguments });
        extractMethodChain(chain, node.callee, node.callee.object);
    }
    else if (EsprimaHelpers.isMemberExpression(node)) {
        chain[chain.length - 1].prop = node.property.name;
        extractMethodChain(chain, node.object, node.object.callee);
    }
    else if (EsprimaHelpers.isIdentifier(node)) {
        chain.push({ prop: node.name});
    }
    return chain;
}

// FamousFramework.module('a:b:c', {})
// .lala()
// .config({}) <~ The AST of that object is what we want
// .other()
// .timelines({})
// .etc(...)
function extractModuleConfigASTs(entrypointAST) {
    var moduleConfigASTs = {};
    EsprimaHelpers.eachChainedMethodCall(entrypointAST, function(methodName, methodArgs, node, parent) {
        if (methodName === this.options.configMethodIdentifier) {
            var methodChain = extractMethodChain([], node, parent);
            var propNames = Lodash.map(methodChain, function(meth) {
                return meth.prop;
            });
            var doesChainFromIdentifier = propNames.indexOf(this.options.libraryMainNamespace) !== -1;
            if (doesChainFromIdentifier) {
                var firstCall = methodChain[methodChain.length - 2];
                var firstArgs = firstCall.args;
                if (firstArgs) {
                    var moduleName = firstArgs[this.options.indexOfModuleNameArgument].value;
                    if (node.arguments) {
                         var configAST = node.arguments[this.options.indexOfModuleConfigArgument];
                         if (configAST) {
                            moduleConfigASTs[moduleName] = configAST;
                         }
                    }
                }
            }
        }
    }.bind(this));
    return moduleConfigASTs;
}

function isASTNodeALibraryInvocation(node, libNamespace, libWhitelist) {
    if (EsprimaHelpers.isCallExpression(node)) {
        if (EsprimaHelpers.isMemberExpression(node.callee)) {
            var calleeObject = node.callee.object;
            var calleeProperty = node.callee.property;
            if (EsprimaHelpers.isIdentifier(calleeObject)) {
                if (EsprimaHelpers.isIdentifier(calleeProperty)) {
                    return (calleeObject.name === libNamespace) && (calleeProperty.name in libWhitelist);
                }
            }
        }
    }
    return false;
}

function findLibraryInvocations(entrypointAST) {
    var libraryInvocations = {};
    EsprimaHelpers.traverse(entrypointAST, function(node, parent) {
        if (isASTNodeALibraryInvocation(node, this.options.libraryMainNamespace, this.options.libraryInvocationIdentifiers)) {
            if (node.arguments) {
                var moduleName = node.arguments[this.options.indexOfModuleNameArgument].value;
                libraryInvocations[moduleName] = node;
            }
        }
    }.bind(this));
    return libraryInvocations;
}

function extractModuleDefinitionArg(argsAST) {
    if (!argsAST) {
        return EsprimaHelpers.EMPTY_OBJECT_EXPRESSION; // Fallback in case no object is present
    }

    var moduleDefinition = argsAST[this.options.indexOfModuleDefinitionArgument];
    if (moduleDefinition.type !== 'ObjectExpression') {
        console.warn(Chalk.gray('famous'), Chalk.yellow('warn'), 'Incorrect args to `FamousFramework.scene` were given');
    }

    return moduleDefinition;
}

function extractModuleDefinitionASTs(entrypointAST) {
    var moduleDefinitions = {};
    var libraryInvocations = findLibraryInvocations.call(this, entrypointAST);
    for (var moduleName in libraryInvocations) {
        var libraryInvocation = libraryInvocations[moduleName];
        var moduleDefinition = extractModuleDefinitionArg.call(this, libraryInvocation.arguments);
        moduleDefinitions[moduleName] = moduleDefinition;
    }
    return moduleDefinitions;
}

function extractEntrypointAST(info) {
    try {
        return EsprimaHelpers.parse(info.entrypointFile.content);
    }
    catch(e) {
        console.error(Chalk.gray('famous'), Chalk.red('err'), 'Could not find entrypoint file for ', info.name);
        return EsprimaHelpers.parse('console.error("No entrypoint found for this module!");');
    }
}

function findEntrypointFile(moduleName, files) {
    var entrypointBasename = BuildHelpers.moduleNameToEntrypointBasename.call(this, moduleName);
    var entrypointExtnames = this.options.entrypointExtnames;
    return Lodash.find(files, function(file) {
        var extname = Path.extname(file.path);
        if (extname in entrypointExtnames) {
            var basename = Path.basename(file.path, extname);
            return basename === entrypointBasename;
        }
        else {
            return false;
        }
    });
}

function getRawConfigObjects(configASTs) {
    return Lodash.map(configASTs, function(configAST) {
        return EsprimaHelpers.getObjectValue(configAST);
    });
}

function extractCodeManagerConfig(files) {
    var configFile = Lodash.find(files, function(file) {
        return file.path === this.options.authConfigFilePath;
    }.bind(this));

    if (configFile) {
        try {
            return JSON.parse(configFile.content);
        }
        catch (e) {
            return {};
        }
    }
    else {
        return {};
    }
}

function getExplicitDependencies(info) {
    var explicitDependencies = {};

    var depName;
    var depRef;

    // TODO change this to use the plain 'moduleConfigs' object instead of
    // re-traversing the ASTs
    for (var moduleName in info.moduleDefinitionASTs) {
        // var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        var moduleConfigAST = info.moduleConfigASTs[moduleName] || { properties: [] };

        // Some explicit deps/refs may live in the config object
        var configObject = EsprimaHelpers.getObjectValue(moduleConfigAST);
        var inlineDependencyTable = configObject[this.options.dependenciesKeyName] || {};
        for (depName in inlineDependencyTable) {
            depRef = inlineDependencyTable[depName];
            explicitDependencies[depName] = depRef;
        }
    }

    // Look for any dependencies that may already be defined inside of the
    // framework.json file
    var dependenciesHash = info.frameworkInfo.dependencies;
    if (!dependenciesHash) {
        dependenciesHash = {};
    }
    for (depName in dependenciesHash) {
        depRef = dependenciesHash[depName];
        explicitDependencies[depName] = depRef;
    }

    return explicitDependencies;
}

function getFrameworkInfo(info) {
    var frameworkFile = Lodash.find(info.files, function(file) {
        return file.path === this.options.frameworkFilename;
    }.bind(this));

    var frameworkFileHash;

    if (frameworkFile) {
        try {
            frameworkFileHash = JSON.parse(frameworkFile.content || '{}');
        }
        catch (err) {
            frameworkFileHash = {};
        }
    }
    else {
        frameworkFileHash = {};
    }

    return frameworkFileHash;
}

function extractCoreObjects(info, cb) {
    info.codeManagerConfig = extractCodeManagerConfig.call(this, info.files);
    info.entrypointFile = findEntrypointFile.call(this, info.name, info.files);
    info.entrypointAST = extractEntrypointAST.call(this, info);
    info.libraryInvocations = findLibraryInvocations.call(this, info.entrypointAST);
    info.moduleDefinitionASTs = extractModuleDefinitionASTs.call(this, info.entrypointAST);
    info.moduleConfigASTs = extractModuleConfigASTs.call(this, info.entrypointAST);
    info.moduleConfigs = getRawConfigObjects(info.moduleConfigASTs);
    info.frameworkInfo = getFrameworkInfo.call(this, info);
    info.explicitDependencies = getExplicitDependencies.call(this, info);
    cb(null, info);
}

module.exports = extractCoreObjects;
