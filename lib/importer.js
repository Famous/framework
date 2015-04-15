'use strict';

var EVENTS_PREFIX = 'famous:events';
var CORE_PREFIX = 'famous:core';

var DEFAULT_IMPORTS = {
    'famous:core': ['view', 'dom-element', 'ui-element'],
    'famous:events': ['click', 'mouseover', 'mouseenter', 'mouseout']
}

function importDependencies(definition) {
    definition.imports = definition.imports || DEFAULT_IMPORTS;

    if (definition.tree) importTreeDependencies(definition);
    if (definition.events) importEventDependencies(definition);
}

function importTreeDependencies(definition) {
    for (var prefix in definition.imports) {
        var suffixList = definition.imports[prefix];
        for (var i = 0; i < suffixList.length; i++) {
            var re = new RegExp(suffixList[i], "g"); // replace all instances of view globally
            var expandedName = prefix + ':' + suffixList[i];
            definition.tree = definition.tree.replace(re, expandedName); // view -> famous:core:view
        }
    }
}

function importEventDependencies(definition) {
    for (var selector in definition.events) {
        if (selector[0] === '#') {
            var selectorEvents = definition.events[selector];
            for (var event in selectorEvents) {
                if (definition.imports[EVENTS_PREFIX]) {
                    for (var i = 0; i < definition.imports[EVENTS_PREFIX].length; i++) {
                        var suffix = definition.imports[EVENTS_PREFIX][i];
                        if (event === suffix) {
                            var expandedName = EVENTS_PREFIX + ':' + suffix
                            definition.events[selector][expandedName] = definition.events[selector][event];
                            delete definition.events[selector].event;
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    importDependencies: importDependencies
}