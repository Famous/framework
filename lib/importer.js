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

// TODO:
//      - implement
//      - build new tree
//      - return new tree
function importTreeDependencies(oldTree, imports) {
    var oldTreeArray = VirtualDOM.query(VirtualDOM.parse(oldTree), '*');
    console.log('oldTreeArray: ', oldTreeArray);

    var newTree = "";

    for (var i = 0; i < oldTreeArray.length; i++) {
        var oldNode = oldTreeArray[i];
        var oldTagName = oldNode.tagName;
        var newTagName = imports[oldTagName.toLowerCase()] || oldTagName;
        var newNode = VirtualDOM.create(newTagName);
    }

    return newTree;
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
