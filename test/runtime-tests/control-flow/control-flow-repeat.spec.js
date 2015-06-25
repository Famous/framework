'use strict';

var test = require('tape');
var VirtualDomStub = require('./../helpers/virtual-dom-stub');
var ControlFlow = require('./../../../lib/control-flow/control-flow');

var CONTROL_FLOW_CONSTANTS = require('./../../../lib/control-flow/control-flow-utils').CONSTANTS;
var REPEAT_INFO_KEY = CONTROL_FLOW_CONSTANTS.REPEAT_INFO_KEY;
var REPEAT_PAYLOAD_KEY = CONTROL_FLOW_CONSTANTS.REPEAT_PAYLOAD_KEY;
var CONTROL_FLOW_ACTION_KEY = CONTROL_FLOW_CONSTANTS.CONTROL_FLOW_ACTION_KEY;
var CREATE_KEY = CONTROL_FLOW_CONSTANTS.CREATE_KEY;
var DELETE_KEY = CONTROL_FLOW_CONSTANTS.DELETE_KEY;

/*
Repeat Data Format:
this.repeatData = {
    '.selector' :
        initialized: false,
        parentUIDs: [{
            uid: uid1
            blueprint: node,
            repeatedNodes: [node1, node2, node3]
        }],
        payload: [{}, {}, {}],
        payloadEquality: [true, true, false]
};
 */

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



test('----- Control Flow: Repeat', function(t) {
    t.plan(4);

    t.test('Creates elements, zero to many, single parent', function(st) {
        st.plan(7);
        var PARENT_UID = 3;
        var PAYLOAD = [{index: 0}, {index: 1}, {index: 2}];
        var PAYLOAD_EQUALITY = [false, false, false];
        var REPEAT_COUNT = PAYLOAD.length;
        var virtualDom = VirtualDomStub.getStubOne();
        var parentNode = virtualDom.querySelector('[uid="' + PARENT_UID + '"]');
        st.ok(parentNode.children.length === 0, 'parent node found, initially has 0 children');
        var blueprintNode = document.createElement('repeated-element');
        var dataStub = {
            initialized: true,
            parentUIDs: [{
                uid: PARENT_UID,
                blueprint: blueprintNode,
                repeatedNodes: []
            }],
            payload: PAYLOAD,
            payloadEquality: PAYLOAD_EQUALITY
        };
        ControlFlow.applyRepeatBehaviorToVirtualDOM(virtualDom, dataStub);
        st.ok(parentNode.children.length === REPEAT_COUNT, 'number of repeated elements matches length of payload array');
        st.ok(virtualDom.querySelectorAll('['+REPEAT_INFO_KEY+']').length === REPEAT_COUNT, 'repeat info attached to repeated elements');
        st.ok(virtualDom.querySelectorAll('['+CONTROL_FLOW_ACTION_KEY+']').length === REPEAT_COUNT, 'control flow info attached to repeated elements');
        var firstRepeatInfo = JSON.parse(parentNode.children[0].getAttribute(REPEAT_INFO_KEY));
        var firstRepeatPayload = firstRepeatInfo[REPEAT_PAYLOAD_KEY];
        st.ok(PAYLOAD[0].index === firstRepeatPayload.index, 'repeat info assigned');
        var lastControlFlowInfo = JSON.parse(parentNode.children[REPEAT_COUNT - 1].getAttribute(CONTROL_FLOW_ACTION_KEY));
        st.ok(lastControlFlowInfo.message === CREATE_KEY, 'create message added');
        var parentData = dataStub.parentUIDs[0];
        st.ok(
            parentData.uid === PARENT_UID && parentData.repeatedNodes.length === 3 && parentData.repeatedNodes[1].getAttribute(CONTROL_FLOW_ACTION_KEY),
            'repeated node added to repeat data object'
        );
    });

    t.test('Creates elements, zero to many, multiple parents', function(st) {
        st.plan(6);
        var PARENT_UIDS = [3, 4];
        var PAYLOAD = [{index: 0}, {index: 1}, {index: 2}];
        var PAYLOAD_EQUALITY = [false, false, false];
        var REPEAT_COUNT = PAYLOAD.length;
        var virtualDom = VirtualDomStub.getStubOne();
        var parentNodeOne = virtualDom.querySelector('[uid="' + PARENT_UIDS[0] + '"]');
        var parentNodeTwo = virtualDom.querySelector('[uid="' + PARENT_UIDS[1] + '"]');
        st.ok(
            parentNodeOne.children.length === 0 && parentNodeTwo.children.length === 0,
            'parent nodes found, initially have 0 children'
        );
        var blueprintNode1 = document.createElement('repeated-element-one');
        var blueprintNode2 = document.createElement('repeated-element-two');
        var dataStub = {
            initialized: true,
            parentUIDs: [
                {
                    uid: PARENT_UIDS[0],
                    blueprint: blueprintNode1,
                    repeatedNodes: []
                },
                {
                    uid: PARENT_UIDS[1],
                    blueprint: blueprintNode2,
                    repeatedNodes: []
                }
            ],
            payload: PAYLOAD,
            payloadEquality: PAYLOAD_EQUALITY
        };
        ControlFlow.applyRepeatBehaviorToVirtualDOM(virtualDom, dataStub);
        st.ok(
            parentNodeOne.children.length === REPEAT_COUNT && parentNodeTwo.children.length === REPEAT_COUNT,
            'number of repeated elements matches length of payload array'
        );
        st.ok(
            virtualDom.querySelectorAll('['+REPEAT_INFO_KEY+']').length === REPEAT_COUNT * PARENT_UIDS.length,
            'repeat info attached to repeated elements'
        );
        st.ok(
            virtualDom.querySelectorAll('['+CONTROL_FLOW_ACTION_KEY+']').length === REPEAT_COUNT * PARENT_UIDS.length,
            'control flow info attached to repeated elements'
        );
        var firstRepeatInfo = JSON.parse(parentNodeOne.children[0].getAttribute(REPEAT_INFO_KEY));
        var firstRepeatPayload = firstRepeatInfo[REPEAT_PAYLOAD_KEY];
        st.ok(PAYLOAD[0].index === firstRepeatPayload.index, 'repeat info assigned');
        var lastControlFlowInfo = JSON.parse(parentNodeTwo.children[REPEAT_COUNT - 1].getAttribute(CONTROL_FLOW_ACTION_KEY));
        st.ok(lastControlFlowInfo.message === CREATE_KEY, 'create message added');
    });

    t.test('Adds remove message, one parent', function(st) {
        st.plan(3);
        var PARENT_UID = 2;
        var PAYLOAD = [];
        var PAYLOAD_EQUALITY = [false];
        var virtualDom = VirtualDomStub.getStubOne();
        var parentNode = virtualDom.querySelector('[uid="' + PARENT_UID + '"]');
        st.ok(parentNode.children.length === 1, 'parent node found, initially has 1 child');
        var dataStub = {
            initialized: true,
            parentUIDs: [{
                uid: PARENT_UID,
                blueprint: null,
                repeatedNodes: [parentNode.children[0]]
            }],
            payload: PAYLOAD,
            payloadEquality: PAYLOAD_EQUALITY
        };
        ControlFlow.applyRepeatBehaviorToVirtualDOM(virtualDom, dataStub);
        var removedNodes = virtualDom.querySelectorAll('['+CONTROL_FLOW_ACTION_KEY+']');
        var removeMessage = JSON.parse(removedNodes[0].getAttribute(CONTROL_FLOW_ACTION_KEY));
        st.ok(removeMessage.message === DELETE_KEY, 'remove message attached');
        st.ok(removedNodes.length === 1, 'remove messages only assigned to no longer repeated elements');
    });

    t.test('Adds remove message, multiple parents', function(st) {
        st.plan(4);
        var PARENT_UIDS = [0, 1];
        var PAYLOAD = [];
        var PAYLOAD_EQUALITY = [false];
        var virtualDom = VirtualDomStub.getStubOne();
        var parentNodeOne = virtualDom.querySelector('[uid="' + PARENT_UIDS[0] + '"]');
        var parentNodeTwo = virtualDom.querySelector('[uid="' + PARENT_UIDS[1] + '"]');
        st.ok(
            parentNodeOne.children.length === 1 && parentNodeTwo.children.length === 1,
            'parent nodes found, initially have 1 child'
        );
        var dataStub = {
            initialized: true,
            parentUIDs: [
                {
                    uid: PARENT_UIDS[0],
                    blueprint: null,
                    repeatedNodes: [parentNodeOne.children[0]]
                },
                {
                    uid: PARENT_UIDS[1],
                    blueprint: null,
                    repeatedNodes: [parentNodeTwo.children[0]]
                }
            ],
            payload: PAYLOAD,
            payloadEquality: PAYLOAD_EQUALITY
        };
        ControlFlow.applyRepeatBehaviorToVirtualDOM(virtualDom, dataStub);
        var removedNodes = virtualDom.querySelectorAll('['+CONTROL_FLOW_ACTION_KEY+']');
        var removeMessage = JSON.parse(removedNodes[0].getAttribute(CONTROL_FLOW_ACTION_KEY));
        st.ok(removeMessage.message === DELETE_KEY, 'remove message attached');
        st.ok(removedNodes.length === 2, 'remove messages only assigned to no longer repeated elements');
        st.ok(
            removedNodes[0].getAttribute(CONTROL_FLOW_ACTION_KEY) && !removedNodes[0].children[0].getAttribute(CONTROL_FLOW_ACTION_KEY),
            'remove message is not added to subchildren of removed elements');
    });
});
