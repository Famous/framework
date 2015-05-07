'use strict';

var Tape = require('tape');
var Version = require('./../lib/version/version');
var content = require('./fixtures/entrypoint-contents');

Tape('version', function(t) {
    t.plan(2);
    t.ok(Version, 'exports');
    t.ok(new Version(), 'instance');
    var version = new Version();
    version.save(content.name, content.files, function(err, result) {
        console.log(result);
    });
});
