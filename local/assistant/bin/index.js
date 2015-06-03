#!/usr/bin/env node

'use strict';

var Program = require('commander');
var Assistant = require('./../lib/assistant');

var assistant = new Assistant();

Program
    .command('watch')
    .description('Watch for changes and then synchronize')
    .option('-b, --baseDir [baseDir]', 'Base directory to watch', process.cwd())
    .option('-s, --subDir [subDir]', 'Subdirectory to watch', '')
    .action(function(info) {
        var baseDir = info.baseDir;
        var subDir = info.subDir || '';
        assistant.watchDirectory(baseDir, subDir);
    });

Program
    .command('build-all')
    .description('Build all the components to a local source folder')
    .option('-b, --baseDir [baseDir]', 'Base directory to watch', process.cwd())
    .option('-s, --subDir [subDir]', 'Subdirectory to watch', '')
    .action(function(info) {
        var baseDir = info.baseDir;
        var subDir = info.subDir || '';
        assistant.buildAll(baseDir, subDir, function(err, result) {
            if (err) {
                console.error(err);
            }
        });
    });

Program.parse(process.argv);
