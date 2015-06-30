#!/usr/bin/env node

'use strict';

var Program = require('commander');

var LocalAssistant = require('./../dev/local-assistant/local-assistant');

Program.command('copy-core-components')
    .option('-d, --destinationFolder [destinationFolder]')
    .action(function(info) {
        var la = new LocalAssistant();
        la.copyCoreComponents(info);
    });

Program.command('watch-runtime')
    .option('-i, --inputFile [inputFile]')
    .option('-o, --outputFile [outputFile]')
    .action(function(info) {
        var la = new LocalAssistant();
        la.watchRuntime(info);
    });

Program.command('local-only-bootstrap')
    .option('-s, --sourceFolder [sourceFolder]')
    .option('-d, --destinationFolder [destinationFolder]')
    .option('-e, --entrypointModuleName [entrypointModuleName]')
    .option('-f, --servedFolder [servedFolder]')
    .option('-r, --rebuildEverythingOnChange [rebuildEverythingOnChange]')
    .option('-w, --watchAfterBuild [watchAfterBuild]')
    .option('-p, --port [port]')
    .action(function(info) {
        var la = new LocalAssistant();
        la.localOnlyBootstrap(info);
    });

Program.parse(process.argv);
