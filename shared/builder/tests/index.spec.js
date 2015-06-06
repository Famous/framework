'use strict';

var Test = require('tape');
var Path = require('path');
var Fs = require('fs');

process.env.CODE_MANAGER_HOST = 'http://localhost:3000';
process.env.FRAMEWORK_LOCAL_DEPENDENCIES_SOURCE_FOLDER = Path.join(__dirname, '..', 'public');

var Builder = require('./../lib/builder');
var Assistant = require('./../../../local/assistant/lib/assistant');

Test('builder', function(t) {
    t.plan(3);
    t.ok(Builder, 'exports');
    t.ok(new Builder(), 'instance');

    var baseDir = Path.join(__dirname, 'fixtures');

    var assistant = new Assistant({
        builderOptions: {
            doSkipAssetSaveStep: true,
            doSkipBundleSaveStep: true,
            localComponentsSourceFolder: baseDir
        }
    });
    
    var subDir = Path.join('a');
    var buildResult = Fs.readFileSync(Path.join(__dirname, 'fixtures', '__data', 'a-build.js'), {encoding:'utf8'});

    assistant.buildSingle(baseDir, subDir, function(err, result) {
        if (err) {
            console.error(err);
        }
        else {
            t.equals(result.bundleString, buildResult, 'freshly generated bundle string matches a previously generated build result');
        }
    });
});
