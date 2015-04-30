'use strict';

var tape = require('tape');
var manifest = require('./../lib/manifest');

tape('manifest', function(t) {
   t.plan(1);
   t.ok(manifest, 'exports');

});
