'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');

var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var IF_KEY = '$if';
var INDEX_KEY = '$index';
var REPEAT_INFO_KEY = 'repeat-info';
var REPEAT_KEY = '$repeat';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var WRAPPER_NODE_KEY = 'wrapper-node';
var YIELD_KEY = '$yield';

var CONSTANTS = {
    CONTROL_FLOW_ACTION_KEY: CONTROL_FLOW_ACTION_KEY,
    CREATE_KEY: CREATE_KEY,
    DELETE_KEY: DELETE_KEY,
    IF_KEY: IF_KEY,
    INDEX_KEY: INDEX_KEY,
    REPEAT_INFO_KEY: REPEAT_INFO_KEY,
    REPEAT_KEY: REPEAT_KEY,
    REPEAT_PAYLOAD_KEY: REPEAT_PAYLOAD_KEY,
    WRAPPER_NODE_KEY: WRAPPER_NODE_KEY,
    YIELD_KEY: YIELD_KEY
};

// Adds information to the node that is later processed by the associated
// component and saved to its state manager. The info corresponds the index
// of the node in the children array of its parent (i.e., `parentNode.children`)
// and the object that will be used to properly instantiate the child component via
// its public messaging interface.
function addRepeatInfo(node, index, payload) {
    var repeatInfo = {};
    repeatInfo[INDEX_KEY] = index;
    repeatInfo[REPEAT_PAYLOAD_KEY] = payload;
    VirtualDOM.attachAttributeFromJSON(node, repeatInfo, REPEAT_INFO_KEY);
}

// Adds information to the node signifying that an associated component should be instantiated
// and added to the scene graph.
function addCreateMessage(node, parentUID) {
    var info = {
        parentUID: parentUID,
        message: CREATE_KEY
    };
    VirtualDOM.attachAttributeFromJSON(node, info, CONTROL_FLOW_ACTION_KEY);
}

// Adds information to the node signifying that its associated component should be removed
// from the scene graph.
function addDeleteMessage(node, parentUID) {
    var info = {
        parentUID: parentUID,
        message: DELETE_KEY
    };
    VirtualDOM.attachAttributeFromJSON(node, info, CONTROL_FLOW_ACTION_KEY);
}

// Adds a new node to a component's expanded blueprint and creates a message signifying
// that an associated component should be created and added to the scene graph.
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

function setWrapperNodeAttribute(node, progenitorUID) {
    VirtualDOM.attachAttributeFromJSON(node, progenitorUID, WRAPPER_NODE_KEY);
}

module.exports = {
    addRepeatInfo: addRepeatInfo,
    addCreateMessage: addCreateMessage,
    addDeleteMessage: addDeleteMessage,
    attachNewNode: attachNewNode,
    setWrapperNodeAttribute: setWrapperNodeAttribute,
    stripMessages: stripMessages,
    CONSTANTS: CONSTANTS
};
