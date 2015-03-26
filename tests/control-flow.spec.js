'use strict';

var test = require('tape');
var BEST = require('../lib/index');

test('Control Flow', function(t) {
    t.plan(1);
    BEST.deploy('famous-demos:if-repeat', 'body', function(app){
        t.ok(app.DOMNode, 'Root DOMNode exists');
    });
});
