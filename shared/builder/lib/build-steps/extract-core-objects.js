'use strict';

var Lodash = require('lodash');
var Path = require('path');

var BuildHelpers = require('./build-helpers');
var EsprimaHelpers = require('./esprima-helpers');

function extractModuleConfigASTs(entrypointAST) {
    var moduleConfigASTs = {};
    EsprimaHelpers.eachChainedMethodCall(entrypointAST, function(methodName, methodArgs, node, parent) {
        if (methodName === this.options.configMethodIdentifier) {
            if (parent && parent.expression && parent.expression.callee && parent.expression.callee.object) {
                var parentCallee = parent.expression.callee.object.callee;
                if (parentCallee.object.name === this.options.libraryMainNamespace) {
                    var parentArguments = parent.expression.callee.object.arguments;
                    var moduleName = parentArguments[this.options.indexOfModuleNameArgument].value;
                    var configObjectExpression = node.arguments[this.options.indexOfModuleConfigArgument];
                    moduleConfigASTs[moduleName] = configObjectExpression;
                }
            }
        }
    }.bind(this));
    return moduleConfigASTs;
};

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
};

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
