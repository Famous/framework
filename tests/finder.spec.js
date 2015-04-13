'use strict';
var test = require('tape');
var Finder = require('../lib/finder');
var finder = new Finder();

test('Finder', function(t) {
    t.plan(6);
    t.ok(finder, 'exports');
    t.ok(finder.componentURL, 'exports componentURL');

    var componentURL = finder.componentURL('foo:bar:baz:qux');
    t.equals(componentURL, 'http://localhost:8357/foo/bar/baz/qux/qux.js');

    var deps = finder.findDependencies({
        tree: '<famous:view><famous:foo:bar famous:events:click="yaya"><la:lee:loo/></famous:foo:bar></famous:view>',
        behaviors: {
            '#foo': {
                'famous:bla:bleep:bloop': true
            }
        }
    });
    t.deepEquals(deps, ['famous:view', 'famous:foo:bar', 'famous:events', 'la:lee:loo', 'famous:bla:bleep']);

    var urls = finder.subcomponentURLs('foo:bar:baz', {
        tree: 'sha.html',
        behaviors: 'yay.js'
    });
    t.deepEquals(urls, { behaviors: 'http://localhost:8357/foo/bar/baz/yay.js', tree: 'http://localhost:8357/foo/bar/baz/sha.html' });

    var type = finder.subcomponentType('bla/blee.js');
    t.equals(type, 'js');
});
