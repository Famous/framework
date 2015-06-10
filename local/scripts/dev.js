#!/usr/bin/env node

'use strict';

var Express = require('express');
var Livereload = require('livereload');
var Path = require('path');
var Program = require('commander');

var Assistant = require('./../assistant/lib/assistant');

var livereloadOptions = {
    port: 35729,
    exts: ['html','css','js','png','gif','jpg','coffee','jade','less','json'],
    applyJSLive: false,
    applyCSSLive: false,
    exclusions: [/\\node_modules\//,/\\.git\//,/\\.svn\//,/\\.hg\//],
    interval: 1000
};

// e.g. npm run dev.js local-bootstrap --sourceDirectory=$PWD/components --blocksDirectory=$pwd/local/workspace/build --port=1618
Program.command('local-only-bootstrap')
    .description('Bootstrap local development, recursively building _only local_ components')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory')
    .option('-p, --port [port]')
    .action(function(info) {
        var assistant = new Assistant({
            builderOptions: {
                localRawSourceFolder: info.sourceDirectory,
                localBlocksFolder: info.blocksDirectory,
                localBlocksCacheFolder: null,
                codeManagerAssetReadHost: 'http://localhost:' + info.port,
                codeManagerAssetWriteHost: null,
                codeManagerVersionInfoHost: null,
                authHost: null,
                doWriteToCodeManager: false,
                doSkipDependencyDereferencing: true,
                doAttemptToBuildDependenciesLocally: true
            }
        });

        assistant.buildAll(info.sourceDirectory, '', function(buildAllErr) {
            if (!buildAllErr) {
                assistant.watchDirectory(info.sourceDirectory, '');

                var livereloadServer = Livereload.createServer(livereloadOptions);
                livereloadServer.watch([info.blocksDirectory]);

                var server = Express();
                server.use(Express.static(info.blocksDirectory));
                server.listen(info.port);
            }
            else {
                console.log(buildAllErr);
            }
        });
    });

Program.parse(process.argv);
