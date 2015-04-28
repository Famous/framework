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

module.exports = {
    addRepeatInfo: addRepeatInfo,
    addCreateMessage: addCreateMessage,
    addDeleteMessage: addDeleteMessage
}