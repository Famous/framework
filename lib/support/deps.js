var HTTP = require('framework-utilities/HTTP');
var array = require('framework-utilities/array');

var DEPS_TEST_RE = /:/;
var TREE_DEPS_TEST = /[\w-_.]+:[\w-_.]+/ig;
var BEHAVIOR_DEPS_TEST_RE = /[\w-_.]+:[\w-_.]+:[\w-_.]+$/i; // string1:string2:string3 format
var DEPS_NAMESPACE_DELIM = /:/g;
var FWD_SLASH = '/';
var DEPS_PATH_PREFIX = './components/';
var NAME_DELIM = ':';
var FILE_SUFFIX = '.js';
var STR_TYPE = 'string';
var OBJ_TYPE = 'object';
var NOT_LOADABLE_RE = /^\$/;
var TREE_FILE_RE = /\.html$/i;
var BLANK_STR = '';
var LEAF_NODES = { 'famous:html-element': true };
var RESERVED_ATTRIBUTE_NAMES = { 'id': true, 'class': true };
var LOCAL_DEPENDENCY_PREFIX = '$self';

// Given the name of a dependency, infer the path
// that it can be accessed over HTTP.
function inferPath(name) {
    return DEPS_PATH_PREFIX +
           name.replace(DEPS_NAMESPACE_DELIM, FWD_SLASH) +
           FWD_SLASH +
           name.substring(name.lastIndexOf(NAME_DELIM)+1) +
           FILE_SUFFIX;
}

// Find all dependency strings from within the tree string.
function findTreeDeps(treeStr) {
    var matches = treeStr.match(TREE_DEPS_TEST);
    return matches || [];
}

// Traverse behavior program and return an
// array of strings matching dependency format.
function findBehaviorDeps(behaviorGroups, deps) {
    deps || (deps = []);

    if (!behaviorGroups || behaviorGroups.length === 0) {
        return deps;
    }

    for (var selector in behaviorGroups) {
        var behaviors = behaviorGroups[selector];
        for (var behaviorName in behaviors) {
            if (BEHAVIOR_DEPS_TEST_RE.test(behaviorName)) {
                // string1:string2:string3 -> string1:string2
                var lastIndex = behaviorName.lastIndexOf(':');
                deps.push(behaviorName.slice(0, lastIndex));
            }
        }
    }

    return deps;
}

// Load the tree file for the given component, if
// the tree string is a file path.
function loadTree(componentName, givenTree, cb) {
    if (TREE_FILE_RE.test(givenTree)) {
        var partialPath = componentName.replace(DEPS_NAMESPACE_DELIM, FWD_SLASH);
        var componentPath = DEPS_PATH_PREFIX + partialPath;
        var fullPath = componentPath + FWD_SLASH + givenTree;
        HTTP.get(fullPath, function(data) {
            cb(data + BLANK_STR);
        });
    }
    else {
        cb(givenTree);
    }
}

// Given a list of dependencies, load all of them, and
// pass them to the given callback.
function load(deps, skipTable, cb) {
    var urls = [];

    for (var i = 0; i < deps.length; i++) {
        var name = deps[i];
        if (!skipTable[name]) {
            var path = inferPath(name);
            urls.push(path);
        }
    }

    HTTP.join(urls, function(results) {
        if (cb) {
            cb(results);
        }
    });
}

module.exports = {
    load: load,
    loadTree: loadTree,
    findTreeDeps: findTreeDeps,
    findBehaviorDeps: findBehaviorDeps
};
