'use strict';

var Jsdom = require('jsdom');
var Lodash = require('lodash');

var BuildHelpers = require('./../build-helpers');
var EsprimaHelpers = require('./../esprima-helpers');

var QUOTE = '\'';
var EXTENDS_KEY = 'extends';

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

function expandObjectKeyShorthands(facetObj, imports) {
    EsprimaHelpers.eachObjectProperty(facetObj, function(keyName, _2, _3, valueObj, property) {
        if (EsprimaHelpers.isObjectExpression(valueObj)) {
            expandObjectKeyShorthands.call(this, valueObj, imports);
        }
        for (var importNamespace in imports) {
            var importItems = imports[importNamespace];
            for (var i = 0; i < importItems.length; i++) {
                var importItem = importItems[i];
                if (keyName === importItem) {
                    var newKey = BuildHelpers.moduleNamespaceAndBasenameToModuleName.call(this, importNamespace, importItem);
                    property.key.value = newKey;
                    property.key.raw = QUOTE + newKey + QUOTE;
                }
            }
        }
    }.bind(this));
}

function expandExtendsShorthand(facetArray, imports) {
    EsprimaHelpers.eachArrayElement(facetArray, function(elementValue, elementObject){
        for (var importNamespace in imports) {
            var importItems = imports[importNamespace];
            for (var i = 0; i < importItems.length; i++) {
                if (importItems[i] === elementValue) {
                    var expandedExtends = BuildHelpers.moduleNamespaceAndBasenameToModuleName.call(this, importNamespace, elementValue);
                    elementObject.value = expandedExtends;
                    elementObject.raw = QUOTE + expandedExtends + QUOTE;
                }
            }
        }
    }.bind(this));
}

function expandImportsShorthand(info, cb) {
    for (var moduleName in info.moduleDefinitionASTs) {
        var moduleDefinitionAST = info.moduleDefinitionASTs[moduleName];
        var moduleConfigAST = info.moduleConfigASTs[moduleName];

        // Step 1: Get a simplified (complete) imports object.
        var configObject = EsprimaHelpers.getObjectValue(moduleConfigAST || { properties: [] });
        var imports = Lodash.defaults(configObject[this.options.importsKeyName] || {}, this.options.defaultImports);

        // Step 2: Replace shorthand references in the object keys
        var treeNode;
        EsprimaHelpers.eachObjectProperty(moduleDefinitionAST, function(facetName, _1, _2, valueObj) {
            if (facetName === this.options.treeFacetKeyName) {
                treeNode = valueObj;
            }
            else if (EsprimaHelpers.isObjectExpression(valueObj)) {
                expandObjectKeyShorthands.call(this, valueObj, imports);
            }
        }.bind(this));

        // Step 3: Expand the tree from shorthand to long-form.
        if (treeNode) {
            var virtualDOM = Jsdom.jsdom(treeNode.value);
            var doc = virtualDOM.defaultView.document;
            var flatImports = BuildHelpers.importsObjectToFlatImportsObject.call(this, imports);
            var newTree = fixTree(doc.body, flatImports, doc);
            treeNode.value = newTree;
        }

        // Step 4: Expand values in extends array from configuration object
        if (moduleConfigAST) {
            EsprimaHelpers.eachObjectProperty(info.moduleConfigASTs[moduleName], function(keyName, _1, _2, valueObj) {
                if (keyName === EXTENDS_KEY) {
                    expandExtendsShorthand.call(this, valueObj, imports);
                }
            }.bind(this));
        }
    }
    cb(null, info);
}

module.exports = expandImportsShorthand;
