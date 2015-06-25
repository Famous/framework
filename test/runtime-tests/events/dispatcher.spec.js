'use strict';

var test = require('tape');
var Dispatcher = require('./../../../lib/events/dispatcher');
var VirtualDOM = require('./../../../lib/virtual-dom/virtual-dom');
var VirtualDOMStub = require('./../helpers/virtual-dom-stub');

var CONSTANTS = VirtualDOMStub.stubOneInfo;
var GRANDCHILD_NAME = CONSTANTS.GRANDCHILD_NAME;
var FIRST_CHILD_CLASS_NAME = CONSTANTS.FIRST_CHILD_CLASS_NAME;
var PARENT_ID = CONSTANTS.PARENT_ID;
var EVENT_NAME = 'custom-event';
var EVENT_PAYLOAD = 'payload';

test('----- Dispatcher', function(t) {
    t.plan(4);

    t.test('exports', function(st){
        st.plan(1);
        st.ok(Dispatcher, 'Dispatcher');
    });

    t.test('Dispatcher listens to events', function(st){
        st.plan(2);
        var node = VirtualDOM.create('alpha:beta');
        var dispatcher = new Dispatcher(node);
        
        var eventHandler = function(payload) {
            st.pass('dispatcher.on callback triggered by event');
            st.equal(payload.detail, EVENT_PAYLOAD, 'event callback triggered with payload');
        };
        dispatcher.on(EVENT_NAME, eventHandler);
        var event = new CustomEvent(EVENT_NAME, {
            detail: EVENT_PAYLOAD
        });
        node.dispatchEvent(event);
    });

    // wrapper
    // parent:element#PARENT
    //     child:element.FIRST_CHILD(uid=0)
    //         grandchild:element
    //             greatgrandchild:element
    //     child:element(uid=1)
    //         grandchild:element
    //     child:element(uid=2)
    //         grandchild:element
    //     child:element(uid=3)
    //     child:element(uid=4)
    //     child:element(uid=5)


    t.test('Dispatcher emits events [environment bubbles events]', function(st) {
        st.plan(3);

        var virtualDOM = VirtualDOMStub.getStubOne();
        var parent = VirtualDOM.query(virtualDOM, '#' + PARENT_ID)[0];
        var firstChild = VirtualDOM.query(virtualDOM, '.' + FIRST_CHILD_CLASS_NAME)[0];
        var grandChild = VirtualDOM.query(virtualDOM, GRANDCHILD_NAME)[0];

        st.ok(parent && firstChild && grandChild, 'target elements found');
        var firstChildDispatcher = new Dispatcher(parent);
        firstChildDispatcher.on(EVENT_NAME, function(){
            st.pass('emitted event captured by parent');
        });
        var parentDispatcher = new Dispatcher(parent);
        parentDispatcher.on(EVENT_NAME, function(){
            st.pass('emitted event captured by grand parent');
        });

        var dispatcher = new Dispatcher(grandChild);
        dispatcher.emit(EVENT_NAME, EVENT_PAYLOAD);
    });

    t.test('Dispatcher broadcasts events [environment trickles events]', function(st) {
        st.plan(3);

        var virtualDOM = VirtualDOMStub.getStubOne();

        var parent = VirtualDOM.query(virtualDOM, '#' + PARENT_ID)[0];
        var firstChild = VirtualDOM.query(virtualDOM, '.' + FIRST_CHILD_CLASS_NAME)[0];
        var grandChild = VirtualDOM.query(virtualDOM, GRANDCHILD_NAME)[0];

        var parentDispatcher = new Dispatcher(parent);
        var firstChildDispatcher = new Dispatcher(firstChild);
        var grandChildDispatcher = new Dispatcher(grandChild);

        st.ok(parent && firstChild && grandChild, 'target elements found');

        firstChildDispatcher.on(EVENT_NAME, function() {
            st.pass('broadcasted event captured by child');
        });

        grandChildDispatcher.on(EVENT_NAME, function() {
            st.pass('broadcasted event captured by grandchild');
        });

        parentDispatcher.broadcast(EVENT_NAME, EVENT_PAYLOAD);
    });

    // TODO: add trigger tests
});
