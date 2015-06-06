'use strict';

var Lodash = require('lodash');
var Path = require('path');

var BuildHelpers = require('./build-helpers');
var EsprimaHelpers = require('./esprima-helpers');

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

// BEST.module('a:b:c', {})
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
            var propNames = Lodash.map(methodChain, function(meth) { return meth.prop; });
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

function extractModuleDefinitionASTs(entrypointAST) {
    var moduleDefinitions = {};
    var libraryInvocations = findLibraryInvocations.call(this, entrypointAST);
    for (var moduleName in libraryInvocations) {
        var libraryInvocation = libraryInvocations[moduleName];
        var moduleDefinition = EsprimaHelpers.EMPTY_OBJECT_EXPRESSION; // Fallback in case no object is present
        if (libraryInvocation.arguments) {
            moduleDefinition = libraryInvocation.arguments[this.options.indexOfModuleDefinitionArgument];
        }
        moduleDefinitions[moduleName] = moduleDefinition;
    }
    return moduleDefinitions;
}

function extractEntrypointAST(entrypointFile) {
    return EsprimaHelpers.parse(entrypointFile.content);
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

function extractCoreObjects(info, cb) {
    info.entrypointFile = findEntrypointFile.call(this, info.name, info.files);
    info.entrypointAST = extractEntrypointAST.call(this, info.entrypointFile);
    info.libraryInvocations = findLibraryInvocations.call(this, info.entrypointAST);
    info.moduleDefinitionASTs = extractModuleDefinitionASTs.call(this, info.entrypointAST);
    info.moduleConfigASTs = extractModuleConfigASTs.call(this, info.entrypointAST);
    info.moduleConfigs = getRawConfigObjects(info.moduleConfigASTs);
    cb(null, info);
}

module.exports = extractCoreObjects;
