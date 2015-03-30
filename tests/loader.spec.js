'use strict';
var test = require('tape');
var Loader = require('../lib/loader');

test('Loader', function(t) {
    t.plan(1);
    t.ok(Loader, 'exports');
});
