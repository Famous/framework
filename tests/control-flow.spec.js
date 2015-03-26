'use strict';

var test = require('tape');
var BEST = require('../lib/index');
var UID_KEY = 'uid';


test('Control Flow', function(t) {
    t.plan(3);
    BEST.deploy('famous-demos:if-repeat', 'body', function(app){
        t.ok(app.DOMNode, 'Root DOMNode exists');

        var rootUID = app.DOMNode.getAttribute(UID_KEY);
        var rootBestNode = app.getBestNode(rootUID);

        var initialCount = rootBestNode.stateManager.get('count');
        var repeatedNodes = app.DOMNode.querySelectorAll('#repeat');
        t.equal(repeatedNodes.length, initialCount, 'Initial repeat reflects initial state');

        app.send('$root', 'update-count', 6);
        repeatedNodes = app.DOMNode.querySelectorAll('#repeat');
        t.equal(repeatedNodes.length, 6, 'Repeat updates DOMNode count based on state change');
    });
});
