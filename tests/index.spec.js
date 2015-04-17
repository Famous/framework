'use strict';
window.Famous = require('../node_modules/famous');
var test = require('tape');
var index = require('../lib');

test('index', function(t) {
    t.plan(1);
    t.ok(index, 'exports');
});
