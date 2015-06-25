'use strict';

var test = require('tape');

var ControlFlowUtils = require('./../../../lib/control-flow/control-flow-utils');
var VirtualDOM = require('./../../../lib/virtual-dom/virtual-dom');
var VirtualDomStub = require('./../helpers/virtual-dom-stub');

var CONSTANTS = ControlFlowUtils.CONSTANTS;
var REPEAT_INFO_KEY = CONSTANTS.REPEAT_INFO_KEY;
var INDEX_KEY = CONSTANTS.INDEX_KEY;
var REPEAT_PAYLOAD_KEY = CONSTANTS.REPEAT_PAYLOAD_KEY;
var CONTROL_FLOW_ACTION_KEY = CONSTANTS.CONTROL_FLOW_ACTION_KEY;
var CREATE_KEY = CONSTANTS.CREATE_KEY;
var DELETE_KEY = CONSTANTS.DELETE_KEY;

test('----- Control Flow Utilities', function(t) {
    t.plan(6);

    t.test('exports', function(st) {
        st.plan(6);
        st.ok(ControlFlowUtils, 'ControlFlowUtils exports');
        st.ok(ControlFlowUtils.addRepeatInfo, 'ControlFlowUtils.addRepeatInfo exports');
        st.ok(ControlFlowUtils.addCreateMessage, 'ControlFlowUtils.addCreateMessage exports');
        st.ok(ControlFlowUtils.addDeleteMessage, 'ControlFlowUtils.addDeleteMessage exports');
        st.ok(ControlFlowUtils.attachNewNode, 'ControlFlowUtils.attachNewNode exports');
        st.ok(ControlFlowUtils.stripMessages, 'ControlFlowUtils.stripMessages exports');
    });

    t.test('adds repeat info to node', function(st) {
        st.plan(2);
        var node = VirtualDOM.create('alpha:beta');
        var INDEX = 4;
        var REPEAT_PAYLOAD = {positionX: 50};
        ControlFlowUtils.addRepeatInfo(node, 4, REPEAT_PAYLOAD);
        var repeatDataStr = VirtualDOM.getAttribute(node, REPEAT_INFO_KEY);
        st.ok(repeatDataStr, 'repeat data attached to node');
        var repeatData = JSON.parse(repeatDataStr);

        st.ok(
            repeatData[INDEX_KEY] === INDEX && repeatData[REPEAT_PAYLOAD_KEY].positionX === REPEAT_PAYLOAD.positionX,
            'correct values attaches to repeat data string'
        );
    });

    t.test('adds create message to node', function(st) {
        st.plan(2);
        var node =  VirtualDOM.create('alpha:beta');
        var PARENT_UID = 'uid-1';
        ControlFlowUtils.addCreateMessage(node, PARENT_UID);
        var controlFlowActionMsg = VirtualDOM.getAttribute(node, CONTROL_FLOW_ACTION_KEY);
        st.ok(controlFlowActionMsg, 'attaches CONTROL_FLOW_ACTION message');
        var parsedMsg = JSON.parse(controlFlowActionMsg);
        st.ok(
            parsedMsg.message === CREATE_KEY && parsedMsg.parentUID === PARENT_UID,
            'CONTROL_FLOW_ACTION message value is set to CREATE_KEY & parent UID is attached'
        );
    });

    t.test('adds delete message to node', function(st) {
        st.plan(2);
        var node = VirtualDOM.create('alpha:beta');
        ControlFlowUtils.addDeleteMessage(node);
        var controlFlowActionMsg = VirtualDOM.getAttribute(node, CONTROL_FLOW_ACTION_KEY);
        st.ok(controlFlowActionMsg, 'attaches CONTROL_FLOW_ACTION message');
        st.equal(JSON.parse(controlFlowActionMsg).message, DELETE_KEY, 'CONTROL_FLOW_ACTION message value is set to DELETE_KEY');
    });

    /*
    Virtual DOM Stub One:

    wrapper
        parent:element#PARENT
            child:element.FIRST_CHILD(uid=0)
                grandchild:element
                    greatgrandchild:element
            child:element(uid=1)
                grandchild:element
            child:element(uid=2)
                grandchild:element
            child:element(uid=3)
            child:element(uid=4)
            child:element(uid=5)
     */
    t.test('attaches new nodes to dom tree', function(st){
        st.plan(4);

        var stub = VirtualDomStub.getStubOne();
        var PARENT_UID = '5';
        var newNode = VirtualDOM.create('alpha:beta');

        ControlFlowUtils.attachNewNode(newNode, stub, PARENT_UID);
        var clonedNode = VirtualDOM.query(stub, 'alpha:beta')[0];
        st.ok(clonedNode, 'new node is attached to tree');
        st.equal(VirtualDOM.getParentUID(clonedNode), PARENT_UID, 'new node is attached to correct parent');
        st.notEqual(clonedNode, newNode, 'newly attached node is a clone');
        var controlFlowAction = JSON.parse(VirtualDOM.getAttribute(clonedNode, CONTROL_FLOW_ACTION_KEY));
        st.ok(
            controlFlowAction.message === CREATE_KEY && controlFlowAction.parentUID === PARENT_UID,
            'create message attached to newly attached node'
        );
    });

    t.test('strips messages from node', function(st) {
        st.plan(2);
        var node1 = VirtualDOM.create('node-one');
        ControlFlowUtils.addDeleteMessage(node1);
        var node2 = VirtualDOM.create('node-two');
        ControlFlowUtils.addDeleteMessage(node2);
        node1.appendChild(node2);
        ControlFlowUtils.stripMessages(node1);
        st.notOk(VirtualDOM.getAttribute(node1, CONTROL_FLOW_ACTION_KEY), 'strips messages from passed in node');
        st.notOk(VirtualDOM.getAttribute(node2, CONTROL_FLOW_ACTION_KEY), 'strips messages from passed in node\'s descendants');
    });
});
