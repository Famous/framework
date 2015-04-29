var VirtualDOM = require('../virtual-dom/virtual-dom');
var ControlFlowUtils = require('./control-flow-utils');
var Tree = require('../tree/tree');

function addDeleteMessages(expandedBlueprint, selector) {
    var targets = VirtualDOM.query(expandedBlueprint, selector);
    for (var i = 0; i < targets.length; i++) {
        ControlFlowUtils.addDeleteMessage(targets[i]);
    }
}

function process(payload, selector, expandedBlueprint, data) {
    // Add elements to expandedBlueprint
    if (payload) {
        var parentUID;
        var parentNode;
        var blueprint;
        var clone;
        for (parentUID in data.parentUIDs) {
            parentNode = VirtualDOM.getNodeByUID(expandedBlueprint, parentUID);
            // Query selector only checks children but parent of repeat node may be the
            // top level node.
            if (!parentNode && parentUID === VirtualDOM.getUID(expandedBlueprint)) {
                parentNode = expandedBlueprint;
            }

            blueprint = data.parentUIDs[parentUID];
            clone = VirtualDOM.clone(blueprint);

            // Assign new UIDs to newly created elements to avoid collisions
            Tree.setUID(clone);
            Tree.assignChildUIDs(clone);

            ControlFlowUtils.addCreateMessage(clone, parentUID);
            VirtualDOM.addNode(clone, parentNode);
        }
    }
    // Remove elements from expandedBlueprint
    else {
        addDeleteMessages(expandedBlueprint, selector);
    }
}

function findParentNodes(blueprint, selector, data) {
    var targets = VirtualDOM.query(blueprint, selector);
    var parentUID;
    var target;
    data.parentUIDs = {};
    for (var i = 0; i < targets.length; i++) {
        target = targets[i];
        parentUID = VirtualDOM.getParentUID(target);
        data.parentUIDs[parentUID] = VirtualDOM.clone(target);
    }
}

module.exports = {
    process: process,
    findParentNodes: findParentNodes
};
