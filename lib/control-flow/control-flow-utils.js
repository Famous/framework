'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var REPEAT_INFO_KEY = 'repeat-info';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';

var CONSTANTS = {
    IF_KEY: IF_KEY,
    REPEAT_KEY: REPEAT_KEY,
    YIELD_KEY: YIELD_KEY,
    REPEAT_INFO_KEY: REPEAT_INFO_KEY,
    INDEX_KEY: INDEX_KEY,
    REPEAT_PAYLOAD_KEY: REPEAT_PAYLOAD_KEY,
    CREATE_KEY: CREATE_KEY,
    DELETE_KEY: DELETE_KEY,
    CONTROL_FLOW_ACTION_KEY: CONTROL_FLOW_ACTION_KEY
};

function addRepeatInfo(node, index, payload) {
    var repeatInfo = {};
    repeatInfo[INDEX_KEY] = index;
    repeatInfo[REPEAT_PAYLOAD_KEY] = payload;
    VirtualDOM.attachAttributeFromJSON(node, repeatInfo, REPEAT_INFO_KEY);
}

function addCreateMessage(node, parentUID) {
    var info = {
        parentUID: parentUID,
        message: CREATE_KEY
    };
    VirtualDOM.attachAttributeFromJSON(node, info, CONTROL_FLOW_ACTION_KEY);
}

function addDeleteMessage(node) {
    var info = {
        message: DELETE_KEY
    };
    VirtualDOM.attachAttributeFromJSON(node, info, CONTROL_FLOW_ACTION_KEY);
}

function attachNewNode(blueprintNode, expandedBlueprint, parentUID) {
    var clone = VirtualDOM.clone(blueprintNode);

    // Assign new UIDs to newly created elements to avoid collisions
    VirtualDOM.setUID(clone);
    VirtualDOM.assignChildUIDs(clone);

    var parentNode = VirtualDOM.getNodeByUID(expandedBlueprint, parentUID);

    // Query selector only checks children but parent of repeat node may be the
    // top level node.
    if (!parentNode && parentUID === VirtualDOM.getUID(expandedBlueprint)) {
        parentNode = expandedBlueprint;
    }
    if (!parentNode) {
        throw new Error('ParentNode with UID `' + parentUID + '` does not exist.' +
                        ' Unable to process $if/$repeat');
    }

    VirtualDOM.addNode(clone, parentNode);
    addCreateMessage(clone, parentUID);
    return clone;
}

function removeMessageFromNode(node) {
    node.removeAttribute(CONTROL_FLOW_ACTION_KEY);
}

function stripMessages(node) {
    removeMessageFromNode(node);
    for (var i = 0; i < node.children.length; i++) {
        stripMessages(node.children[i]);
    }
}

module.exports = {
    addRepeatInfo: addRepeatInfo,
    addCreateMessage: addCreateMessage,
    addDeleteMessage: addDeleteMessage,
    attachNewNode: attachNewNode,
    stripMessages: stripMessages,
    CONSTANTS: CONSTANTS
};
