'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var ControlFlowUtils = require('./control-flow-utils');

function process(expandedBlueprint, data) {
    for (var payloadIndex = 0; payloadIndex < data.payloadEquality.length; payloadIndex++) {
        if (data.payloadEquality[payloadIndex]) {
            continue;
        }

        var payload = data.payload[payloadIndex];
        var parentData;
        var newNode;
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
                newNode = ControlFlowUtils.attachNewNode(
                    parentData.blueprint, expandedBlueprint, parentData.uid
                );
                ControlFlowUtils.addRepeatInfo(newNode, payloadIndex, payload);
                parentData.repeatedNodes[payloadIndex] = newNode;
            }
        }
    }

    return expandedBlueprint;
}

function findParentNodes(blueprint, expandedBlueprint, selector, data) {
    var targets = VirtualDOM.query(expandedBlueprint, selector);
    data.parentUIDs = [];
    var parentUID;
    var processedParentUIDs = {};
    var repeatedNode;
    var blueprintNode;
    for (var i = 0; i < targets.length; i++) {
        repeatedNode = targets[i];
        parentUID = VirtualDOM.getParentUID(repeatedNode);
        if (!processedParentUIDs[parentUID]) {
            blueprintNode = VirtualDOM.clone(repeatedNode);
            ControlFlowUtils.stripMessages(blueprintNode);
            data.parentUIDs.push({
                uid: parentUID,
                blueprint: blueprintNode,
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
