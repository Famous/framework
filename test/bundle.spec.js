'use strict';

var tape = require('tape');
var bundle = require('./../lib/bundle');
var fs = require('fs');
var path = require('path');

tape('bundle', function(t) {
    t.plan(2);
    t.ok(bundle, 'exports');

    var name = 'fixtures:entrypoint';
    var content = fs.readFileSync(path.join(__dirname, 'fixtures', 'entrypoint.js'), { encoding: 'utf-8' });
    var files = [
        { path: 'entrypoint.js', content: content },
        { path: 'foo.html', content: '<div></div>'},
        { path: 'foo.jade', content: '#foo'},
        { path: 'foo.js', content: 'alert(1);'}
    ];
    var tag = 'HEAD';
    bundle.create(name, tag, files, function(err, result) {
        console.log(result);
        t.ok(result, 'bundles');
    });
});
