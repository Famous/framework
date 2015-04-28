var VirtualDOM = require('./../virtual-dom/virtual-dom');
var UID = require('framework-utilities/uid');
var Tree = require('./../tree/tree');
var ControlFlowUtils = require('./control-flow-utils');

function process(expandedBlueprint, data) {
    for (var payloadIndex = 0; payloadIndex < data.payloadEquality.length; payloadIndex++) {
        if (data.payloadEquality[payloadIndex]) {
            continue;
        }

        var payload = data.payload[payloadIndex];
        var parentData;
        var parentNode;
        var payload;
        for (var parentIndex = 0; parentIndex < data.parentUIDs.length; parentIndex++) {
            parentData = data.parentUIDs[parentIndex];

            // Delete existing node since payload is different
            if (parentData.repeatedNodes[payloadIndex]) {
                ControlFlowUtils.addDeleteMessage(parentData.repeatedNodes[payloadIndex]);
                parentData.repeatedNodes[payloadIndex] = null;
            }

            // Create new node if payload exists
            // (payload equality can be false if payload is missing)
            if (payload) {
                var clone = VirtualDOM.clone(parentData.blueprint);
                // Assign new UIDs to newly created elements to avoid collisions
                Tree.setUID(clone);
                Tree.assignChildUIDs(clone);

                ControlFlowUtils.addRepeatInfo(clone, payloadIndex, payload);
                ControlFlowUtils.addCreateMessage(clone, parentData.uid);
                parentNode = VirtualDOM.getNodeByUID(expandedBlueprint, parentData.uid);

                // Query selector only checks children but parent of repeat node may be the
                // top level node.
                if (!parentNode && parentData.uid === VirtualDOM.getUID(expandedBlueprint)) {
                    parentNode = expandedBlueprint;
                }
                VirtualDOM.addNode(clone, parentNode);
                parentData.repeatedNodes[payloadIndex] = clone;
            }
        }
    }

    return expandedBlueprint;
}

function findParentNodes(blueprint, expandedBlueprint, selector, data) {
    var targets = VirtualDOM.query(blueprint, selector);
    data.parentUIDs = [];
    var parentUID;
    var parentDataObj;
    var processedParentUIDs = {};
    var repeatedNode;
    for (var i = 0; i < targets.length; i++) {
        repeatedNode = targets[i]
        parentUID = VirtualDOM.getParentUID(repeatedNode);
        if (!processedParentUIDs[parentUID]) {
            data.parentUIDs.push({
                uid: parentUID,
                blueprint: VirtualDOM.clone(repeatedNode),
                repeatedNodes: []
            });

            // Manually remove manually repeated node from expandedBlueprint
            // to avoid overhead of creating unnecessary component
            var repeatedNodeFromExpandedBlueprint = VirtualDOM.getNodeByUID(expandedBlueprint, VirtualDOM.getUID(repeatedNode));
            VirtualDOM.deleteNode(repeatedNodeFromExpandedBlueprint);

            processedParentUIDs[parentUID] = true;
        }
    }
}

module.exports = {
    findParentNodes: findParentNodes,
    process: process
};
