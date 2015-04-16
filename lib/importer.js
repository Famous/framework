'use strict';

var VirtualDOM = require('./virtual-dom');

var EVENTS_PREFIX = 'famous:events';
var CORE_PREFIX = 'famous:core';

var DEFAULT_IMPORTS = {
    'famous:core': ['view', 'dom-element', 'ui-element'],
    'famous:events': ['click', 'mouseover', 'mouseenter', 'mouseout']
}

// do replacement here
function importDependencies(definition, options) {
    var imports = getFlatMapping(options.imports || DEFAULT_IMPORTS);

    if (definition.tree) definition.tree = importTreeDependencies(definition.tree, imports);
    if (definition.events) definition.events = importEventDependencies(definition.events, imports);
}

function fixChildNode(node, tree, imports) {
    // first the node's tree
    fixTree(node, imports);

    // determine tagName and create new node
    var newTagName = imports[node.tagName.toLowerCase()] || node.tagName;
    var newNode = VirtualDOM.create(newTagName);

    // copy over innerHTML
    newNode.innerHTML = node.innerHTML;

    // copy over attributes
    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        newNode.setAttribute(attr.nodeName, attr.nodeValue);
    }

    // replace node with newNode
    tree.replaceChild(newNode, node);
}

function fixTree(tree, imports) {
    // loop through children and fix each child
    for (var i = 0; i < tree.children.length; i++) {
        fixChildNode(tree.children[i], tree, imports);
    }

    return tree.innerHTML
}

function importTreeDependencies(treeStr, imports) {
    var tree = VirtualDOM.parse(treeStr);
    return fixTree(tree, imports);
}

function importEventDependencies(oldEvents, imports) {
    var newEvents = {};

    // loop through main events obj
    for (var selector in oldEvents) {

        // determine selector name
        var newSelector = imports[selector] || selector;
        newEvents[newSelector] = {};

        // loop through each selectorEvent
        var selectorEvents = oldEvents[selector];
        for (var event in selectorEvents) {

            // determine event name;
            var newEvent = imports[event] || event;
            newEvents[newSelector][newEvent] = selectorEvents[event];
        }
    }

    return newEvents;
}

// TODO:
//      - handle new feat of replacing behaviors selectors
//          (split into separate fn so events can use it)
//      - build new behaviors
function importBehaviorDependencies(behaviors, imports) {}

function getFlatMapping(imports) {
    var flatMapping = {};
    for (var selector in imports) {
        var array = imports[selector];
        for (var i = 0; i < array.length; i++) {
            flatMapping[array[i]] = selector + ':' + array[i]
        }
    }
    return flatMapping;
}

module.exports = {
    importDependencies: importDependencies
}
