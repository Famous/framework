var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Tree = require('./../tree/tree');

var REPEAT_INFO_KEY = 'repeat-info';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var PARENT_UID_KEY = 'parentUID';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';

function attachAttributeFromDataObj(node, dataObj, key) {
    var info = JSON.stringify(dataObj);
    node.setAttribute(key, info);
}

function addRepeatInfo(node, index, payload, parentUID) {
    var repeatInfo = {};
    repeatInfo[INDEX_KEY] = index;
    repeatInfo[REPEAT_PAYLOAD_KEY] = payload;
    attachAttributeFromDataObj(node, repeatInfo, REPEAT_INFO_KEY);
}

function addCreateMessage(node, parentUID) {
    var info = {
        parentUID: parentUID,
        message: CREATE_KEY
    }
    attachAttributeFromDataObj(node, info, CONTROL_FLOW_ACTION_KEY);
}

function addDeleteMessage(node) {
    var info = {
        message: DELETE_KEY
    };
    attachAttributeFromDataObj(node, info, CONTROL_FLOW_ACTION_KEY);
}

function attachNewNode(blueprintNode, expandedBlueprint, parentUID) {
    var clone = VirtualDOM.clone(blueprintNode);

    // Assign new UIDs to newly created elements to avoid collisions
    Tree.setUID(clone);
    Tree.assignChildUIDs(clone);

    var parentNode = VirtualDOM.getNodeByUID(expandedBlueprint, parentUID);

    // Query selector only checks children but parent of repeat node may be the
    // top level node.
    if (!parentNode && parentUID === VirtualDOM.getUID(expandedBlueprint)) {
        parentNode = expandedBlueprint;
    }
    if (!parentNode) {
        throw new Error('ParentNode with UID `'+ parentUID +'` does not exist.' +
                        ' Unable to process $if/$repeat');
    }

    VirtualDOM.addNode(clone, parentNode);
    addCreateMessage(clone, parentUID);
    return clone;
}

module.exports = {
    addRepeatInfo: addRepeatInfo,
    addCreateMessage: addCreateMessage,
    addDeleteMessage: addDeleteMessage,
    attachNewNode: attachNewNode
}