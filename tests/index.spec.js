'use strict';

var test = require('tape');
var path = require('path');

var stateManager = require('./../lib');

test('stateManager', function(t) {
  t.plan(1);
  t.ok(stateManager, 'exports');
});
