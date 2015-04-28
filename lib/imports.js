var jsdom = require('jsdom');
var lodash = require('lodash');
var parser = require('./parser');

var COMPONENT_DELIMITER = ':';
var IMPORTS_KEY = 'imports';
var QUOTE = '\'';
var TREE_FACET_KEY = 'tree';

var DEFAULT_IMPORTS = {
    'famous:core': ['components', 'dom-element', 'ui-element', 'view', 'wrapper'],
    'famous:events': ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup']
};

function getFlatMapping(imports) {
    var flatMapping = {};
    for (var selector in imports) {
        var array = imports[selector];
        for (var i = 0; i < array.length; i++) {
            flatMapping[array[i]] = selector + COMPONENT_DELIMITER + array[i];
        }
    }
    return flatMapping;
}

function fixChildNode(node, tree, imports, doc) {
    fixTree(node, imports, doc);
    var newTagName = imports[node.tagName.toLowerCase()] || node.tagName;
    var newNode = doc.createElement(newTagName);
    newNode.innerHTML = node.innerHTML;
    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        newNode.setAttribute(attr.nodeName, attr.nodeValue);
    }
    tree.replaceChild(newNode, node);
}

function fixTree(tree, imports, doc) {
    for (var i = 0; i < tree.children.length; i++) {
        fixChildNode(tree.children[i], tree, imports, doc);
    }
    return tree.innerHTML;
}

function expand(definition, config) {
    // Step 1: Get a simplified (complete) imports object.
    var existing = {};
    parser.eachProperty(config, function(configKey, configValue) {
        if (configKey === IMPORTS_KEY) {
            parser.eachProperty(configValue, function(importKey, importValue) {
                var elements = [];
                parser.eachElement(importValue, function(elementValue) {
                    elements.push(elementValue);
                });
                existing[importKey] = elements;
            });
        }
    });

    // Step 2: Merge provided imports with defaults.
    var full = lodash.defaults(existing, DEFAULT_IMPORTS);

    // Step 3: Replace shorthand references in all but the tree.
    parser.eachProperty(definition, function(defKey, defValue, defProp) {
        if (defKey !== TREE_FACET_KEY) {
            if (parser.isObjectExpression(defValue)) {
                parser.eachProperty(defValue, function(elKey, elValue, elProp) {
                    for (var importNamespace in full) {
                        var importItems = full[importNamespace];
                        for (var i = 0; i < importItems.length; i++) {
                            var importItem = importItems[i];
                            if (elKey === importItem) {
                                var newKey = importNamespace + COMPONENT_DELIMITER + importItem;
                                elProp.key.value = newKey;
                                elProp.key.raw = QUOTE + newKey + QUOTE;
                            }
                        }
                    }
                });
            }
        }
    });

    // Step 4: Expand the tree from shorthand to long-form.
    var treeNode = parser.getTreeNode(definition);
    if (treeNode) {
        var virtualDOM = jsdom.jsdom(treeNode.value);
        var doc = virtualDOM.defaultView.document;
        var flatImports = getFlatMapping(full);
        var newTree = fixTree(doc.body, flatImports, doc);
        treeNode.value = newTree;
    }
}

module.exports = {
    expand: expand
};
