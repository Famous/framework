'use strict';

var ArrayUtils = require('framework-utilities/array');

var COMPONENTS_PATH_PREFIX = './components/';
var COMPONENT_NAME_DELIMITER = ':';
var COMPONENT_FILE_SUFFIX = '.js';
var FILE_MATCHER_RE = /(\.js|\.html)$/i;
var FILE_NAME_DELIMITER = '.';
var FWD_SLASH = '/';
var BLANK_STR = '';
var STR_TYPE = 'string';
var DEPS_TEST_REGEX = /([\w-_.]+:)+(([\w-_.]+(?=[\s|>]))|([\w-_.]+(?=:)))/ig;

function componentPath(name) {
    var parts = name.split(COMPONENT_NAME_DELIMITER);
    return COMPONENTS_PATH_PREFIX.concat(parts.join(FWD_SLASH));
}

function componentURL(name) {
    var path = componentPath(name);
    var parts = path.split(FWD_SLASH);
    var lastPart = parts[parts.length - 1];
    var fullParts = parts.concat(lastPart);
    var fullPath = fullParts.join(FWD_SLASH);
    return fullPath.concat(COMPONENT_FILE_SUFFIX);
}

function findTreeDependencies(tree) {
    return (tree || BLANK_STR).match(DEPS_TEST_REGEX) || [];
}

function findBehaviorDependencies(behaviorGroups) {
    var dependencies = [];
    if (!behaviorGroups || behaviorGroups.length === 0) {
        return dependencies;
    }
    for (var selector in behaviorGroups) {
        var behaviors = behaviorGroups[selector];
        for (var behaviorName in behaviors) {
            if (DEPS_TEST_REGEX.test(behaviorName)) {
                var parts = behaviorName.split(COMPONENT_NAME_DELIMITER);
                var head = parts.splice(0, parts.length - 1);
                dependencies.push(head.join(COMPONENT_NAME_DELIMITER));
            }
        }
    }
    return dependencies;
}

function findDependencies(definition) {
    var dependencies = [];
    dependencies = dependencies.concat(findTreeDependencies(definition.tree));
    dependencies = dependencies.concat(findBehaviorDependencies(definition.behaviors));
    return ArrayUtils.union(dependencies, []);
}

function subcomponentURLs(name, definition) {
    var output = {};
    for (var key in definition) {
        var value = definition[key];
        if (typeof value === STR_TYPE) {
            if (value.match(FILE_MATCHER_RE)) {
                var basePath = componentPath(name);
                output[key] = [basePath, value].join(FWD_SLASH);
            }
        }
    }
    return output;
}

function subcomponentType(url) {
    var parts = url.split(FILE_NAME_DELIMITER);
    return parts[parts.length - 1];
}

module.exports = {
    componentURL: componentURL,
    findDependencies: findDependencies,
    subcomponentURLs: subcomponentURLs,
    subcomponentType: subcomponentType
};
