'use strict';
var test = require('tape');
var UID = require('../lib/helpers/uid');

test('UID', function(t) {
    t.plan(5);
    t.ok(UID, 'exports');
    t.ok(UID.generate, 'exports function');
    t.ok(UID.generate(), 'runs function');
    t.ok(UID.generate('foo'), 'runs function with prefix');

    var uid = UID.generate('bar');
    var slice = uid.slice(0, 6);
    t.equals(slice, 'bar-0-');
});
