'use strict';

var Path = require('path');

var BuildHelpers = require('./../build-helpers');
var EsprimaHelpers = require('./../esprima-helpers');
var PathingHelpers = require('./../storage-helpers/pathing');

var PIPE = '|';

var BEHAVIOR_STR = 'behavior';
var EVENT_STR = 'event';
var SETTER_STR = 'setter';
var IDENTITY_STR = 'identity';

function interpolateAssetStrings(moduleName, moduleVersionRef, moduleDefinitionAST) {
    EsprimaHelpers.eachStringLiteral(moduleDefinitionAST, function(stringValue, node) {
        var fullPath;
        var moduleCDNMatch = BuildHelpers.stringToModuleCDNMatch.call(this, stringValue);
        if (moduleCDNMatch) {
            var assetModuleName = moduleCDNMatch.value.split(PIPE)[1] || moduleName;
            fullPath = PathingHelpers.buildAssetURL.call(this, assetModuleName, moduleVersionRef, '');
            node.value = stringValue.split(moduleCDNMatch.match).join(fullPath);
        }
        else {
            var matches = 0;
            BuildHelpers.eachAssetStringMatchInString.call(this, stringValue, function(match, replaced) {
                fullPath = PathingHelpers.buildAssetURL.call(this, moduleName, moduleVersionRef, replaced);
                stringValue = stringValue.split(match).join(fullPath);
                matches++;
            }.bind(this));
            if (matches > 0) {
                node.value = stringValue;
            }
        }
    }.bind(this));
}

function expandBehaviorsObject(behaviorsAST) {
    EsprimaHelpers.eachObjectProperty(behaviorsAST, function(_0, _1, _2, valueObj) {
        EsprimaHelpers.eachObjectProperty(valueObj, function(keyName, _1, subValueVal, subValueObj, eventProp) {
            if (EsprimaHelpers.isStringLiteral(subValueObj) && subValueVal.match(this.options.behaviorSetterRegex)) {
                eventProp.value = buildFunctionAST(keyName, subValueVal, behaviorFnStringTemplate, errorFnTemplate, BEHAVIOR_STR);
            }
        }.bind(this));
    }.bind(this));
}

function behaviorFnStringTemplate(stateName) {
    return '(function(' + stateName + '){ return ' + stateName + '; })';
}

function eventFnStringTemplate(stateName) {
    return '(function($state,$payload){$state.set(\'' + stateName + '\',$payload);})';
}

function errorFnTemplate(type, wrongShorthand, rightShorthand) {
    return '(function(){console.warn(\'Cannot use ' + wrongShorthand + ' shorthand in ' + type + 's. Use ' + rightShorthand + ' instead.\');})';
}

var FUNCTION_FILTERS = {};
// Camel-case the given hyphen-separated string
FUNCTION_FILTERS.camel = function(str) {
    return str.replace(/-([a-z])/g, function(g) {
        return g[1].toUpperCase();
    });
};
// Alias
FUNCTION_FILTERS['camel-case'] = FUNCTION_FILTERS.camel;

function allEventFunctionFilters(key, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (FUNCTION_FILTERS[filter]) {
            key = FUNCTION_FILTERS[filter](key);
        }
    }
    return key;
}

function buildFunctionAST(key, value, fnStringTemplate, errorFnTemplate, type) {
    if (value[0] !== '[' && value[1] !== '[') {
        // Warn developer and correct syntax for backward compatibility
        console.warn('Please use the correct shorthand syntax for ' + key + ' denoted by double brackets. [[' + value + ']] rather than ' + value);
        value = '[[' + value + ']]';
    }

    var subValueVal = value.substr(2, value.length - 4); // Remove brackets
    var functionParts = subValueVal.split(PIPE);
    var functionKey = functionParts[0];
    var filters = functionParts.slice(1, functionParts.length);

    var stateName;
    var fnString;
    var body;

    switch (functionKey) {
        case SETTER_STR:
            // 'setter'
            if (filters.length === 0) {
                stateName = key;
            }
            // 'setter|something'
            else {
                // 'setter|camel'
                if (filters[0] === 'camel') {
                    stateName = allEventFunctionFilters(key, filters);
                }
                // 'setter|state'
                else {
                    stateName = filters.splice(-1);
                    stateName = allEventFunctionFilters(stateName, filters);
                }
            }

            if (type === BEHAVIOR_STR) {
                fnString = errorFnTemplate(type, SETTER_STR, IDENTITY_STR);
            }
            else {
                fnString = fnStringTemplate(stateName);
            }

            body = EsprimaHelpers.parse(fnString).body[0];
            return body.expression;
        case IDENTITY_STR:
            // 'identity'
            if (filters.length === 0) {
                stateName = key;
            }
            //'identity|something'
            else {
                // 'identity|camel'
                if (filters[0] === 'camel') {
                    stateName = allEventFunctionFilters(key, filters);
                }
                // 'identity|state'
                else {
                    stateName = filters.splice(-1);
                    stateName = allEventFunctionFilters(stateName, filters);
                }
            }

            if (type === EVENT_STR) {
                fnString = errorFnTemplate(type, IDENTITY_STR, SETTER_STR);
            }
            else {
                fnString = behaviorFnStringTemplate(stateName);
            }

            body = EsprimaHelpers.parse(fnString).body[0];
            return body.expression;
        default:
            throw new Error('`' + functionKey + '` is not a valid value for an event.');
    }
}

function expandEventsObject(eventsAST) {
    EsprimaHelpers.eachObjectProperty(eventsAST, function(keyName, _1, valueVal, valueObj, eventProp) {
        if (EsprimaHelpers.isLiteral(valueObj)) {
            // Whitelist of event string values are processed on client
            if (!(valueVal in this.options.reservedEventValues)) {
                eventProp.value = buildFunctionAST(keyName, valueVal, eventFnStringTemplate, errorFnTemplate, EVENT_STR);
            }
        }
        else if (EsprimaHelpers.isObjectExpression(valueObj)) {
            if (keyName !== this.options.passThroughKey) {
                expandEventsObject.call(this, valueObj);
            }
        }
    }.bind(this));
}

function processSyntacticSugar(moduleName, moduleDefinitionAST, moduleConfigAST) {
    EsprimaHelpers.eachObjectProperty(moduleDefinitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === this.options.behaviorsFacetKeyName) {
            expandBehaviorsObject.call(this, valueObj);
        }
        else if (facetName === this.options.eventsFacetKeyName) {
            expandEventsObject.call(this, valueObj);
        }
    }.bind(this));
}

function buildExtensionsArray(info, moduleName, configObject) {
    var extensions = configObject.extends || this.options.defaultExtends;
    var result = [];
    for (var i = 0; i < extensions.length; i++) {
        result.push({
            name: extensions[i],
            version: info.dependencyTable[extensions[i]]
        });
    }
    return result;
}

function buildOptionsArgAST(info, moduleName) {
    var optionsObject = {};
    var configObject = EsprimaHelpers.getObjectValue(info.moduleConfigASTs[moduleName] || { properties: [] });
    optionsObject.dependencies = info.dereffedDependencyTable;
    optionsObject.famousNodeConstructorName = configObject.famousNodeConstructorName || '';
    optionsObject.extensions = buildExtensionsArray.call(this, info, moduleName, configObject);

    var optionsJSON = JSON.stringify(optionsObject);
    var optionsString = '(' + optionsJSON + ')';
    var optionsAST = EsprimaHelpers.parse(optionsString);
    var optionsExpr = optionsAST.body[0].expression;
    return optionsExpr;
}

function expandLibraryInvocation(info, moduleName, libraryInvocation) {
    if (!libraryInvocation.arguments) {
        libraryInvocation.arguments = [];
    }
    // Make the version ref the second argument to FamousFramework.scene(...)
    // since the client-side uses the ref internally for managing objects
    var moduleNameArgAST = EsprimaHelpers.buildStringLiteralAST(moduleName);
    var versionRefArgAST = EsprimaHelpers.buildStringLiteralAST(info.versionRef || this.options.defaultDependencyVersion);
    var optionsArgAST = buildOptionsArgAST.call(this, info, moduleName);
    var definitionArgAST = info.moduleDefinitionASTs[moduleName] || EsprimaHelpers.EMPTY_OBJECT_EXPRESSION;

    libraryInvocation.arguments[0] = moduleNameArgAST;
    libraryInvocation.arguments[1] = versionRefArgAST;
    libraryInvocation.arguments[2] = optionsArgAST;
    libraryInvocation.arguments[3] = definitionArgAST;
}

function isAttachmentInvocation(node, libNamespace, libWhitelist) {
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

function findAttachmentInvocations(entrypointAST) {
    var attachmentInvocations = [];
    EsprimaHelpers.traverse(entrypointAST, function(node, parent) {
        if (isAttachmentInvocation.call(this, node, this.options.libraryMainNamespace, this.options.attachmentIdentifiers)) {
            if (node.arguments) {
                attachmentInvocations.push(node);
            }
        }
    }.bind(this));
    return attachmentInvocations;
}

function expandAttachmentSyntax(info, ast) {
    var attachmentInvocations = findAttachmentInvocations.call(this, ast);
    for (var i = 0; i < attachmentInvocations.length; i++) {
        var attachmentInvocation = attachmentInvocations[i];
        attachmentInvocation.arguments.unshift(EsprimaHelpers.buildStringLiteralAST(info.versionRef || this.options.defaultDependencyVersion));
        attachmentInvocation.arguments.unshift(EsprimaHelpers.buildStringLiteralAST(info.name));
    }
}

function inlineJavaScriptFile(info, file) {
    var parsedContent = EsprimaHelpers.parse(file.content);
    expandAttachmentSyntax.call(this, info, parsedContent);
    for (var i = parsedContent.body.length - 1; i > 0; i--) {
        var bodyExpr = parsedContent.body[i];
        info.entrypointAST.body.unshift(bodyExpr);
    }
}

function expandSyntax(info, cb) {
    var moduleName;
    for (moduleName in info.moduleDefinitionASTs) {
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        var moduleConfigAST = info.moduleConfigASTs[moduleName];
        interpolateAssetStrings.call(this, moduleName, ((info.versionRef || info.explicitVersion) || this.options.defaultDependencyVersion), moduleDefinitionAST);
        processSyntacticSugar.call(this, moduleName, moduleDefinitionAST, moduleConfigAST);
    }
    for (moduleName in info.libraryInvocations) {
        var libraryInvocation = info.libraryInvocations[moduleName];
        expandLibraryInvocation.call(this, info, moduleName, libraryInvocation);
    }

    // Accumulate a list of files that have been inlined so
    // we can avoid including them via AJAX on the client
    var inlinedFiles = [];

    // Includes without the path expansion
    var includes = BuildHelpers.buildIncludesArray(info, true);
    for (var i = 0; i < info.files.length; i++) {
        var file = info.files[i];
        var extname = Path.extname(file.path);
        if (extname === '.js') {
            var basename = Path.basename(file.path, extname);
            var entrypointBasename = BuildHelpers.moduleNameToEntrypointBasename.call(this, info.name);
            // We don't want to inline a file into itself.
            if (basename !== entrypointBasename) {
                // Only push files that are explicitly 'includes' into the bundle
                if (includes.indexOf(file.path) !== -1) {
                    inlineJavaScriptFile.call(this, info, file);
                    inlinedFiles.push(file.path);
                }
            }
        }
    }

    info.inlinedFiles = inlinedFiles;
    cb(null, info);
}

module.exports = expandSyntax;
