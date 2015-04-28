'use strict';

var tape = require('tape');
var compiler = require('./../lib/compiler');
var fs = require('fs');
var path = require('path');

tape('compiler', function(t) {
    t.plan(2);
    t.ok(compiler, 'exports');

    var name = 'fixtures:entrypoint';
    var content = fs.readFileSync(path.join(__dirname, 'fixtures', 'entrypoint.js'), { encoding: 'utf-8' });
    var files = [
        { path: 'entrypoint.js', content: content },
        { path: 'foo.html', content: '<div></div>'},
        { path: 'foo.jade', content: '#foo'},
        { path: 'foo.js', content: 'alert(1);'}
    ];
    var intermediateCb = null;
    var tag = 'HEAD';
    var packages = {};
    compiler.compile(name, tag, files, packages, intermediateCb, function(err, result) {
        console.log(result);
        t.ok(result, 'compiles');
    });
});
