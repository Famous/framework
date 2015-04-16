'use strict';

var VirtualDOM = require('./virtual-dom');

var DEFAULT_IMPORTS = {
    'famous:core': ['view', 'dom-element', 'ui-element'],
    'famous:events': ['click', 'mouseover', 'mouseenter', 'mouseout']
}

/**
 * Used by Loader class - loadComponent.
 *
 * Imports the dependencies based on config imports.
 * If no imports are provided, the default imports are used.
 */
function importDependencies(definition, options) {
    var imports = getFlatMapping(options.imports || DEFAULT_IMPORTS);

    if (definition.tree)
        definition.tree = importTreeDependencies(definition.tree, imports);

    if (definition.events)
        definition.events = importEventDependencies(definition.events, imports);

    if (definition.behaviors)
        definition.behaviors = importBehaviorDependencies(definition.behaviors, imports);
}

/**
 * Used by fixTree.
 *
 * Replaces child node with a new node with
 * the expanded tagname. Copies over html
 * and other attributes from the old node.
 */
function fixChildNode(node, tree, imports) {
    // fix the node's tree
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

/**
 * Used by importTreeDependencies.
 *
 * Replaces tree with new tree;
 */
function fixTree(tree, imports) {
    // loop through children and fix each child node
    for (var i = 0; i < tree.children.length; i++) {
        fixChildNode(tree.children[i], tree, imports);
    }

    return tree.innerHTML
}

/**
 * Used by importDependencies.
 *
 * Imports tree dependencies based on imports.
 */
function importTreeDependencies(treeStr, imports) {
    // fix parsed tree
    var tree = VirtualDOM.parse(treeStr);
    return fixTree(tree, imports);
}

/**
 * Used by importDependencies.
 *
 * Imports event dependencies based on imports.
 * Replaces old events object with new events with
 * expanded selectors. Also, replaces old events
 * associated with each selector. Copies over
 * each event function associated with old events.
 */
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

            // determine event name
            var newEvent = imports[event] || event;
            newEvents[newSelector][newEvent] = selectorEvents[event];
        }
    }

    return newEvents;
}

/**
 * Used by importDependencies.
 *
 * Imports behaviors dependencies based on imports.
 * Replaces old behaviors object with new behaviors
 * with expanded selectors. Copies over old behavior
 * functions/states associated with the selectors.
 */
function importBehaviorDependencies(oldBehaviors, imports) {
    var newBehaviors = {};

    // loop through main behaviors obj
    for (var selector in oldBehaviors) {
        // determine selector name and copy over
        var newSelector = imports[selector] || selector;
        newBehaviors[newSelector] = oldBehaviors[selector];
    }

    return newBehaviors;
}

/**
 * Used by importDependencies.
 *
 * Returns a flat mapping based on imports
 * for easier dependency lookup.
 *
 * Input:
 * {
 *      'famous:core': ['view', 'dom-element'],
 *      'famous:events': ['click', 'mouseover']
 * }
 *
 * Output:
 * {
 *      'view': 'famous:core:view',
 *      'dom-element': 'famous:core:dom-element',
 *      'click': 'famous:events:click',
 *      'mouseover': 'famous:events:mouseover'
 * }
 */
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
