'use strict';

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
    var events = definition.events;
    // TODO
}

module.exports = {
    importDependencies: importDependencies
}