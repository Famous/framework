'use strict';

var Path = require('path');

var Helpers = require('./helpers/helpers');
var EsprimaHelpers = require('./helpers/esprima');
var Config = require('./config/config');

var PIPE = '|';
var BEHAVIOR_STR = 'behavior';
var EVENT_STR = 'event';
var SETTER_STR = 'setter';
var IDENTITY_STR = 'identity';

function expandBehaviorsObject(behaviorsAST) {
    EsprimaHelpers.eachObjectProperty(behaviorsAST, function(_0, _1, _2, valueObj) {
        EsprimaHelpers.eachObjectProperty(valueObj, function(keyName, _1, subValueVal, subValueObj, eventProp) {
            if (EsprimaHelpers.isStringLiteral(subValueObj) && subValueVal.match(Config.get('behaviorSetterRegex'))) {
                eventProp.value = buildFunctionAST(keyName, subValueVal, behaviorFnStringTemplate, errorFnTemplate, BEHAVIOR_STR);
            }
        });
    });
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
            if (!(valueVal in Config.get('reservedEventValues'))) {
                eventProp.value = buildFunctionAST(keyName, valueVal, eventFnStringTemplate, errorFnTemplate, EVENT_STR);
            }
        }
        else if (EsprimaHelpers.isObjectExpression(valueObj)) {
            if (keyName !== Config.get('passThroughKey')) {
                expandEventsObject(valueObj);
            }
        }
    });
}

function processSyntacticSugar(moduleName, moduleDefinitionAST, moduleConfigAST) {
    EsprimaHelpers.eachObjectProperty(moduleDefinitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === Config.get('behaviorsFacetKeyName')) {
            expandBehaviorsObject(valueObj);
        }
        else if (facetName === Config.get('eventsFacetKeyName')) {
            expandEventsObject(valueObj);
        }
    });
}

function buildExtensionsArray(data, moduleName, configObject) {
    var extensions = configObject.extends || Config.get('defaultExtends');

    var result = [];

    for (var i = 0; i < extensions.length; i++) {
        var extension = extensions[i];

        result.push({
            name: extension,
            version: data.dependencyTable[extension]
        });
    }

    return result;
}

function buildOptionsArgAST(data, moduleName) {
    var optionsObject = {};
    var configObject = EsprimaHelpers.getObjectValue(data.moduleConfigASTs[moduleName] || { properties: [] });

    optionsObject.dependencies = data.dependencyTable;
    optionsObject.famousNodeConstructorName = configObject.famousNodeConstructorName || '';
    optionsObject.extensions = buildExtensionsArray(data, moduleName, configObject);
    optionsObject.expose = configObject.expose || EsprimaHelpers.EMPTY_OBJECT_EXPRESSION;

    var optionsJSON = JSON.stringify(optionsObject);
    var optionsString = '(' + optionsJSON + ')';
    var optionsAST = EsprimaHelpers.parse(optionsString);
    var optionsExpr = optionsAST.body[0].expression;

    return optionsExpr;
}

function expandLibraryInvocation(data, moduleName, libraryInvocationAST) {
    if (!libraryInvocationAST.arguments) {
        libraryInvocationAST.arguments = [];
    }

    // Make the version ref the second argument to FamousFramework.scene(...)
    // since the client-side uses the ref internally for managing objects
    var moduleNameArgAST = EsprimaHelpers.buildStringLiteralAST(moduleName);
    var versionRefArgAST = EsprimaHelpers.buildStringLiteralAST(Config.get('defaultDependencyVersion'));
    var optionsArgAST = buildOptionsArgAST(data, moduleName);
    var definitionArgAST = data.moduleDefinitionASTs[moduleName] || EsprimaHelpers.EMPTY_OBJECT_EXPRESSION;

    libraryInvocationAST.arguments[0] = moduleNameArgAST;
    libraryInvocationAST.arguments[1] = versionRefArgAST;
    libraryInvocationAST.arguments[2] = optionsArgAST;
    libraryInvocationAST.arguments[3] = definitionArgAST;
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
        if (isAttachmentInvocation(node, Config.get('libraryMainNamespace'), Config.get('attachmentIdentifiers'))) {
            if (node.arguments) {
                attachmentInvocations.push(node);
            }
        }
    });

    return attachmentInvocations;
}

function expandAttachmentSyntax(data, moduleName, ast) {
    var attachmentInvocations = findAttachmentInvocations(ast);

    for (var i = 0; i < attachmentInvocations.length; i++) {
        var attachmentInvocation = attachmentInvocations[i];

        attachmentInvocation.arguments.unshift(EsprimaHelpers.buildStringLiteralAST(Config.get('defaultDependencyVersion')));
        attachmentInvocation.arguments.unshift(EsprimaHelpers.buildStringLiteralAST(moduleName));
    }
}

function inlineJavaScriptFile(data, moduleName, file) {
    var parsedContent = EsprimaHelpers.parse(file.content);

    expandAttachmentSyntax(data, moduleName, parsedContent);

    for (var i = parsedContent.body.length - 1; i > 0; i--) {
        var bodyExpr = parsedContent.body[i];

        data.entrypointAST.body.unshift(bodyExpr);
    }
}

function expandSyntax(name, files, data, finish) {
    var moduleName;

    for (moduleName in data.moduleDefinitionASTs) {
        var moduleDefinitionAST = data.moduleDefinitionASTs[moduleName];
        var moduleConfigAST = data.moduleConfigASTs[moduleName];

        processSyntacticSugar(moduleName, moduleDefinitionAST, moduleConfigAST);
    }

    for (moduleName in data.libraryInvocationASTs) {
        var libraryInvocationAST = data.libraryInvocationASTs[moduleName];

        expandLibraryInvocation(data, moduleName, libraryInvocationAST);
    }

    // Accumulate a list of files that have been inlined so
    // we can avoid including them via AJAX on the client
    var inlinedFiles = [];

    // Includes without the path expansion
    var includes = Helpers.buildIncludesArray(data, true);

    for (var i = 0; i < files.length; i++) {

        var file = files[i];
        var extname = Path.extname(file.path);

        if (extname === '.js') {
            var basename = Path.basename(file.path, extname);
            var entrypointBasename = Helpers.moduleNameToEntrypointBasename(name);

            // We don't want to inline a file into itself.
            if (basename !== entrypointBasename) {
                // Only push files that are explicitly 'includes' into the bundle
                if (includes.indexOf(file.path) !== -1) {
                    inlineJavaScriptFile(data, name, file);
                    inlinedFiles.push(file.path);
                }
            }
        }
    }

    data.inlinedFiles = inlinedFiles;

    return finish(null, name, files, data);
}

module.exports = expandSyntax;
