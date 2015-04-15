'use strict';

function importDependencies(definition) {
    if (definition.tree) importTreeDependencies(definition);
    if (definition.events) importEventDependencies(definition);
}

function importTreeDependencies(definition) {
    var tree = definition.tree;
    var imports = definition.imports;

    for (var prefix in imports) {
        var suffixList = imports[prefix];
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