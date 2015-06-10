'use strict';

var Test = require('tape');
var Path = require('path');
var Fs = require('fs');

var Builder = require('./../lib/builder');
var Assistant = require('./../../../local/assistant/lib/assistant');

Test('builder', function(t) {
    t.plan(3);
    t.ok(Builder, 'exports');
    t.ok(new Builder(), 'instance');

    var baseDir = Path.join(__dirname, 'fixtures');
    var subDir = Path.join('a');
    var buildResult = Fs.readFileSync(Path.join(__dirname, 'fixtures', '__data', 'a-build.js'), {encoding:'utf8'});

    var assistant = new Assistant({
        builderOptions: {
            codeManagerAssetReadHost: 'http://localhost:1618',
            doSkipAssetSaveStep: true,
            doSkipBundleSaveStep: true,
            localRawSourceFolder: baseDir
        }
    });
    
    assistant.buildSingle(baseDir, subDir, function(err, result) {
        if (err) {
            console.error(err);
        }
        else {
            t.equals(result.bundleString, buildResult, 'freshly generated bundle string matches a previously generated build result');
            // console.log(result.bundleString);
        }
    });
});
