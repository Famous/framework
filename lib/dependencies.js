'use strict';

var loader = require('./loader');
var lodash = require('lodash');
var parser = require('./parser');

var BLANK = '';
var COMPONENT_DELIMITER = ':';
var DEPENDENCY_REGEXP = /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig;
var DEPENDENCY_BLACKLIST = { 'localhost': true };

function find(definition) {
    var dependencies = [];
    // Step 1: Collect dependencies from the definition objects.
    parser.eachProperty(definition, function(key, value, property) {
        if (parser.isObjectExpression(value)) {
            parser.eachProperty(value, function(innerKey, innerValue, innerProp) {
                if (DEPENDENCY_REGEXP.test(innerKey)) {
                    var parts = innerKey.split(COMPONENT_DELIMITER);
                    var head = parts.splice(0, parts.length - 1);
                    dependencies.push(head.join(COMPONENT_DELIMITER));
                }
            });
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
    return lodash.uniq(dependencies);
}

function load(definition, config, tag, packages, cb) {
    var dependencies = find(definition);
    var filtered = [];
    for (var i = 0; i < dependencies.length; i++) {
        if (!packages[dependencies[i]]) {
            filtered.push(dependencies[i]);
        }
    }
    loader.load(filtered, tag, packages, cb);
}

module.exports = {
    load: load
};
