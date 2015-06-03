'use strict';

var Test = require('tape');
var Path = require('path');

process.env.CODE_MANAGER_HOST = 'http://localhost:3000';
process.env.FRAMEWORK_LOCAL_DEPENDENCIES_SOURCE_FOLDER = Path.join(__dirname, '..', 'public');

var Builder = require('./../lib/builder');
var Assistant = require('./../../../local/assistant/lib/assistant');

Test('builder', function(t) {
    t.plan(3);
    t.ok(Builder, 'exports');
    t.ok(new Builder(), 'instance');

    var assistant = new Assistant();
    var baseDir = Path.join(__dirname, '..', '..', '..', 'components');
    var subDir = Path.join('famous', 'core', 'components');
    assistant.buildSingle(baseDir, subDir, function(err, result) {
        t.ok(result);
    });
});
