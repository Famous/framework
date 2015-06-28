'use strict';

var Path = require('path');
var Test = require('tape');

var LocalAssistant = require('./../../dev/local-assistant/local-assistant');

var COMPONENTS_BASE_FOLDER = Path.join(__dirname, '..', '..', 'lib', 'core-components');
var DESTINATION_FOLDER = Path.join(__dirname, '..', '..', 'dev', 'local-workspace', 'build');

Test('build pipeline', function(t) {
    t.plan(3);

    var la = new LocalAssistant({
        sourceFolder: COMPONENTS_BASE_FOLDER,
        destinationFolder: DESTINATION_FOLDER
    });

    var componentFolder = Path.join('famous-demos', 'clickable-square');

    la.buildSingle(COMPONENTS_BASE_FOLDER, componentFolder, function(buildSingleErr, moduleName, files, data) {
        if (buildSingleErr) {
            return console.error(buildSingleErr);
        }

        t.ok(moduleName, 'module name was output');
        t.ok(files, 'files were output');
        t.ok(data, 'data was output');
    });
});
