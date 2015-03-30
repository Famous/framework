'use strict';
var test = require('tape');
var Finder = require('../lib/finder');

test('Finder', function(t) {
    t.plan(6);
    t.ok(Finder, 'exports');
    t.ok(Finder.componentURL, 'exports componentURL');

    var componentURL = Finder.componentURL('foo:bar:baz:qux');
    t.equals(componentURL, './components/foo/bar/baz/qux/qux.js');

    var deps = Finder.findDependencies({
        tree: '<famous:view><famous:foo:bar famous:events:click="yaya"></famous:foo:bar></famous:view>',
        behaviors: {
            '#foo': {
                'famous:bla:bleep:bloop': true
            }
        }
    });
    t.deepEquals(deps, ['famous:foo:bar', 'famous:events', 'famous:foo', 'famous:bla:bleep']);

    var urls = Finder.subcomponentURLs('foo:bar:baz', {
        tree: 'sha.html',
        behaviors: 'yay.js'
    });
    t.deepEquals(urls, { behaviors: './components/foo/bar/baz/yay.js', tree: './components/foo/bar/baz/sha.html' });

    var type = Finder.subcomponentType('bla/blee.js');
    t.equals(type, 'js');
});
