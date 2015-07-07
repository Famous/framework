'use strict';

var find = require('lodash.find');
var map = require('lodash.map');
var Path = require('path');

var Helpers = require('./helpers/helpers');
var EsprimaHelpers = require('./helpers/esprima');
var Config = require('./config/config');

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
//   .lala()
//   .config({}) <~ The AST of that object is what we want
//   .other()
//   .timelines({})
//   .etc(...)
function extractModuleConfigASTs(entrypointAST) {
    var moduleConfigASTs = {};

    EsprimaHelpers.eachChainedMethodCall(entrypointAST, function(methodName, methodArgs, node, parent) {
        if (methodName === Config.get('configMethodIdentifier')) {
            var methodChain = extractMethodChain([], node, parent);

            var propNames = map(methodChain, function(meth) {
                return meth.prop;
            });

            var doesChainFromIdentifier = propNames.indexOf(Config.get('libraryMainNamespace')) !== -1;

            if (doesChainFromIdentifier) {
                var firstCall = methodChain[methodChain.length - 2];
                var firstArgs = firstCall.args;

                if (firstArgs) {
                    var moduleName = firstArgs[Config.get('indexOfModuleNameArgument')].value;

                    if (node.arguments) {
                         var configAST = node.arguments[Config.get('indexOfModuleConfigArgument')];

                         if (configAST) {
                            moduleConfigASTs[moduleName] = configAST;
                         }
                    }
                }
            }
        }
    });

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

function findlibraryInvocationASTs(entrypointAST) {
    var libraryInvocationASTs = {};

    EsprimaHelpers.traverse(entrypointAST, function(node, parent) {
        if (isASTNodeALibraryInvocation(node, Config.get('libraryMainNamespace'), Config.get('libraryInvocationIdentifiers'))) {
            if (node.arguments) {
                var moduleName = node.arguments[Config.get('indexOfModuleNameArgument')].value;
                libraryInvocationASTs[moduleName] = node;
            }
        }
    });

    return libraryInvocationASTs;
}

function extractModuleDefinitionArg(argsAST) {
    if (!argsAST) {
        return EsprimaHelpers.EMPTY_OBJECT_EXPRESSION; // Fallback in case no object is present
    }

    var moduleDefinition = argsAST[Config.get('indexOfModuleDefinitionArgument')];

    if (moduleDefinition.type !== 'ObjectExpression') {
        console.warn('Incorrect args to `FamousFramework.scene` were given');
    }

    return moduleDefinition;
}

function extractModuleDefinitionASTs(entrypointAST) {
    var moduleDefinitions = {};

    var libraryInvocationASTs = findlibraryInvocationASTs(entrypointAST);

    for (var moduleName in libraryInvocationASTs) {
        var libraryInvocation = libraryInvocationASTs[moduleName];
        var moduleDefinition = extractModuleDefinitionArg(libraryInvocation.arguments);
        moduleDefinitions[moduleName] = moduleDefinition;
    }

    return moduleDefinitions;
}

function extractEntrypointAST(data) {
    try {
        return EsprimaHelpers.parse(data.entrypointFile.content);
    }
    catch(e) {
        console.error('Could not find entrypoint file for ', data.name);
        return EsprimaHelpers.parse('console.error("No entrypoint found for this module!");');
    }
}

function findEntrypointFile(moduleName, files) {
    var entrypointBasename = Helpers.moduleNameToEntrypointBasename(moduleName);
    var entrypointExtnames = Config.get('entrypointExtnames');

    return find(files, function(file) {
        var extname = Path.extname(file.path);

        if (extname in entrypointExtnames) {
            return entrypointBasename === Path.basename(file.path, extname);
        }
        else {
            return false;
        }
    });
}

function getRawConfigObjects(configASTs) {
    return map(configASTs, function(configAST) {
        return EsprimaHelpers.getObjectValue(configAST);
    });
}

function extractArtifacts(name, files, data, finish) {
    data.entrypointFile = findEntrypointFile(name, files);
    data.entrypointAST = extractEntrypointAST(data);
    data.libraryInvocationASTs = findlibraryInvocationASTs(data.entrypointAST);
    data.moduleDefinitionASTs = extractModuleDefinitionASTs(data.entrypointAST);
    data.moduleConfigASTs = extractModuleConfigASTs(data.entrypointAST);
    data.moduleConfigObjects = getRawConfigObjects(data.moduleConfigASTs);

    return finish(null, name, files, data);
}

module.exports = extractArtifacts;
