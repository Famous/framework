'use strict';

var tape = require('tape');
var store = require('./../lib/support/store');

tape('store', function(t) {
    t.plan(5);
    t.ok(store, 'exports');

    var filename = 'foo/bar.js';
    var content = 'alert(1);';

    store.putFile(filename, content, function(err, result) {
        t.ok(result, 'file created');
        store.getFile(filename, function(err, result) {
            t.ok(result, 'file loaded');
            store.getData(filename, function(err, data) {
                t.equals(data, content);
                store.listFiles('foo', function(err, result) {
                    t.equals(result.Contents.length, 1);
                });
            });
        });
    });
});
