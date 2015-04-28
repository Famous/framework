'use strict';

var tape = require('tape');
var mod = require('./../lib/module');

//tape('module', function(t) {
//    t.plan(3);
//    t.ok(mod, 'exports');
//
//    var name = 'famous:tests:foo:bar';
//    var files = [{ path: 'bar.js', content: 'alert(1);' }];
//    mod.commit(name, files, function(err, result) {
//        t.ok(result, 'committed module');
//    });
//
//    var name = 'famous:tests:foo:baz';
//    var files = [{ path: 'qux.js', content: 'alert(2);' }];
//    var tag = '0.1.1';
//    mod.release(name, tag, files, function(err, result) {
//        t.ok(result, 'released module');
//    });
//});
