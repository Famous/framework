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
        for (parentUID in data.parentUIDs) {
            ControlFlowUtils.attachNewNode(
                data.parentUIDs[parentUID], expandedBlueprint, parentUID
            );
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
