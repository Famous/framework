var VirtualDOM = require('./../virtual-dom/virtual-dom');
var UID = require('framework-utilities/uid');
var Tree = require('./../tree/tree');

var Repeat = {};

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

Repeat.process = function process(expandedBlueprint, data) {
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
                addDeleteMessage(parentData.repeatedNodes[payloadIndex]);
            }

            // Create new node if payload exists
            // (payload equality can be false if payload is missing)
            if (payload) {
                var clone = VirtualDOM.clone(parentData.blueprint);
                // Assign new UIDs to newly created elements to avoid collisions
                Tree.setUID(clone);
                Tree.assignChildUIDs(clone);

                addRepeatInfo(clone, payloadIndex, payload);
                addCreateMessage(clone, parentData.uid);
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

Repeat.findParentNodes  = function(blueprint, expandedBlueprint, selector, data) {
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

module.exports = Repeat;
