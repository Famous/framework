'use strict';

var VirtualDOM = require('./../../virtual-dom');
var ArrayUtils = require('framework-utilities/array');

var MESSAGES_ATTR_KEY = 'data-messages';
var REPEAT_INFO_KEY = 'repeat-info';
var TREE_SIG_ATTR_KEY = 'tree_sig';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';

function initializeRepeat(info) {
    var data = info.controlFlowData.repeat;
    data[info.selector] = {};
    data[info.selector].payload = info.payload;

    var elements = VirtualDOM.query(info.domStore.childrenRoot, info.selector);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var parent = element.parentNode;
        parent.removeChild(element);
        for (var j = 0; j < info.payload.length; j++) {
            var clone = VirtualDOM.clone(element);
            attachAttributeFromDataObj(clone, info.payload[j], MESSAGES_ATTR_KEY);
            parent.appendChild(clone);
        }
    }
}

function attachAttributeFromDataObj(node, dataObj, key) {
    var info = JSON.stringify(dataObj);
    node.setAttribute(key, info);
}

function verifyPayload(payload) {
    if (!(payload instanceof Array)) {
        throw new Error('Unsupported payload type for $repeat');
    }
}

function initialization(info) {
    verifyPayload(info.payload);
    initializeRepeat(info);
}

function runTime(info) {
    verifyPayload(info.payload);

    // Bucket elemets by parent UID
    var repeatedElements = info.domStore.treeSignature.querySelectorAll(info.selector);
    var parentData = {};
    var uids = [];
    var parent;
    var parentUID;
    var i;
    for (i = 0; i < repeatedElements.length; i++) {
        parentUID = VirtualDOM.getUID(repeatedElements[i].parentNode);
        if (!parentData[parentUID]) {
            uids.push(parentUID);
            parentData[parentUID] = {};
            parentData[parentUID].nodes = [];
        }
        parentData[parentUID].nodes.push(repeatedElements[i]);
    }

    // Attach 'blueprint' to parent
    var blueprints = info.domStore.childrenSnapShot.querySelectorAll(info.selector);
    for (i = 0; i < blueprints.length; i++) {
         parentData[uids[i]].blueprint = blueprints[i];
    }

    // Diff. payloads
    var data = info.controlFlowData.repeat[info.selector];
    var payloadEquality = ArrayUtils.checkElementEquality(data.payload, info.payload);
    data.payload = info.payload;

    // Add nodes to add/remove stack based on payload diff.
    var result = {
        'add'    : [],
        'remove' : []
    };
    var clone;
    for (i = 0; i < payloadEquality.length; i++) {
        if (!payloadEquality[i]) {
            for (parentUID in parentData) {
                if (parentData[parentUID].nodes[i]) {
                    result.remove.push(parentData[parentUID].nodes[i])
                }
                else {
                    clone = VirtualDOM.clone(parentData[parentUID].blueprint);
                    attachAttributeFromDataObj(clone, info.payload[i], MESSAGES_ATTR_KEY);

                    VirtualDOM.attachAttributeToNodes(
                        clone,
                        TREE_SIG_ATTR_KEY,
                        VirtualDOM.getUID(info.domStore.treeSignature)
                    );

                    result.add.push({
                        parentUID: parentUID,
                        blueprintDOMNode: clone
                    });
                }
            }
        }
    }

    return result;
}

module.exports = {
    initialization: initialization,
    runTime: runTime
};
