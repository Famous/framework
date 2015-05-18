'use strict';

var VirtualDOM = require('../virtual-dom/virtual-dom');
var ControlFlowUtils = require('./control-flow-utils');

function addDeleteMessages(expandedBlueprint, selector) {
    var targets = VirtualDOM.query(expandedBlueprint, selector);
    for (var i = 0; i < targets.length; i++) {
        ControlFlowUtils.addDeleteMessage(targets[i]);
    }
}


// Updates the virtual dom (expanded bluepint) by either adding 'delete'
// messages on to nodes if the payload is false or attached new nodes
// with 'create' messages to notify system that components will need to be
// instantiated.
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

module.exports = {
    process: process
};
