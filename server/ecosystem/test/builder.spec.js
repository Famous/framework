'use strict';

var Tape = require('tape');
var Builder = require('./../lib/builder/builder');
var Compiler = require('./../lib/compiler/compiler');
var content = require('./fixtures/entrypoint-contents');

Tape('compiler', function(t) {
    t.plan(2);
    t.ok(Compiler, 'exports');
    t.ok(new Compiler(), 'instance');
    var compiler = new Compiler();
    var builder = new Builder();
    compiler.compileModule(content.name, content.files, function(err, compilation) {
        builder.buildBundle(compilation, function(err, bundle) {
            // console.log(err, bundle);
        });
    });
});
