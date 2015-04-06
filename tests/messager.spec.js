'use strict';
var test = require('tape');
var BEST = require('../lib/index');
var VirtualDOM = require('../lib/virtual-dom');
var NodeStore = require('../lib/node-store');

var LABEL_SELECTOR = '#label';
var INITIAL_LABEL = '<div>Clickable Square</div>';


test('Messager', function(t) {
    t.plan(2);

    t.test('Messager sends messages to self (i.e., \'$root\' selector)', function(st){
        st.plan(2);

        BEST.Application.deploy('famous:core:dom-element', 'body', function(app) {
            var rootNode;
            var newContent = 'hello world';

            rootNode = app.graph.rootNode;
            st.equal(rootNode.stateManager.get('content'), '', 'Initial state of famous:dom-element is empty string');

            app.send('$root', 'content', newContent);
            st.equal(rootNode.stateManager.get('content'), newContent, 'State changes after message w/ "$root" selector');
        });
    });

    t.test('Messager sends messages using CSS selector', function(st){
        st.plan(2);

        BEST.Application.deploy('famous:examples:demos:clickable-square-with-label', 'body', function(app) {
            var labelUID = VirtualDOM.getUID(app.graph.virtualDOM.querySelector(LABEL_SELECTOR));
            var labelNode = NodeStore.findNode(labelUID);
            st.equals(labelNode.stateManager.get('content'), INITIAL_LABEL, 'Initial label is set');

            var newContent = 'new label';
            app.send(LABEL_SELECTOR, 'content', newContent);
            st.equals(labelNode.stateManager.get('content'), newContent, 'Label updates after msg w/ CSS selector');
        });
    });
});
