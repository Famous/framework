'use strict';
var test = require('tape');
var Finder = require('../lib/finder');

test('Finder', function(t) {
    t.plan(3);
    t.ok(Finder, 'exports');
    t.ok(Finder.componentURL, 'exports componentURL');

    var componentURL = Finder.componentURL('foo:bar:baz:qux');
    t.equals(componentURL, './components/foo/bar/baz/qux/qux.js');
});
