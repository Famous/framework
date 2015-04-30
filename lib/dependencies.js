'use strict';

var loader = require('./loader');
var lodash = require('lodash');
var parser = require('./parser');
var manifest = require('./manifest');

var BLANK = '';
var COMPONENT_DELIMITER = ':';
var DEPENDENCY_REGEXP = /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig;
var DEPENDENCY_BLACKLIST = { 'localhost': true };
var DEFAULT_VERSION = 'HEAD';

function findDependencyKeys(objExpr, dependencies) {
    parser.eachProperty(objExpr, function(key, value, prop) {
        if (DEPENDENCY_REGEXP.test(key)) {
            var parts = key.split(COMPONENT_DELIMITER);
            var head = parts.splice(0, parts.length - 1);
            dependencies.push(head.join(COMPONENT_DELIMITER));
        }
        if (parser.isObjectExpression(value)) {
            findDependencyKeys(value, dependencies);
        }
    });
}

function find(definition, config) {
    var dependencies = [];
    // Step 1: Collect dependencies from the definition objects.
    parser.eachProperty(definition, function(key, value, property) {
        if (parser.isObjectExpression(value)) {
            findDependencyKeys(value, dependencies);
        }
    });

    // Step 2: Get dependencies from the tree.
    var treeNode = parser.getTreeNode(definition);
    if (treeNode) {
        var treeMatches = (treeNode.value || BLANK).match(DEPENDENCY_REGEXP) || [];
        var fixedMatches = [];
        for (var i = 0; i < treeMatches.length; i++) {
           if (!(treeMatches[i] in DEPENDENCY_BLACKLIST)) {
               dependencies.push(treeMatches[i]);
           }
        }
    }

    // Step 3: Remove any repeats from the list.
    var uniq = lodash.uniq(dependencies);

    // Step 4: Create a hash map from deps to versions, if any were supplied.
    var versionMap = parser.getDependencies(config);
    for (var i = 0; i < uniq.length; i++) {
        var depName = uniq[i];
        if (!versionMap[depName]) {
            versionMap[depName] = DEFAULT_VERSION;
        }
    }

    return versionMap;
}

function load(name, definition, config, tag, packages, options, cb) {
    options || (options = {});
    var depMap = find(definition, config);
    var filtered = {};
    for (var depName in depMap) {
        var depTag = depMap[depName];
        if (!packages[depName] || !packages[depName][depTag]) {
            if (!filtered[depName]) {
                filtered[depName] = {};
            }
            filtered[depName][depTag] = true;
        }
    }
    if (options.writeManifests) {
        manifest.write(name, tag, pairs(filtered), function(err) {
            if (err) {
                console.error('Unable to write manifest');
            }
            loader.load(filtered, tag, packages, cb);
        });
    }
    else {
        loader.load(pairs(filtered), tag, packages, cb);
    }
}

function pairs(deps) {
    var ps = [];
    for (var depName in deps) {
        var tags = deps[depName];
        for (var tagName in tags) {
            ps.push([depName, tagName]);
        }
    }
    return ps;
}

module.exports = {
    load: load,
    pairs: pairs
};
