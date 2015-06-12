#!/usr/bin/env node

'use strict';

var Express = require('express');
var Livereload = require('livereload');
var Program = require('commander');

var Assistant = require('./../assistant/lib/assistant');

var livereloadOptions = {
    port: 35729,
    exts: ['html','css','js','png','gif','jpg','coffee','less','json'],
    applyJSLive: false,
    applyCSSLive: false,
    exclusions: [/\\node_modules\//,/\\.git\//,/\\.svn\//,/\\.hg\//],
    interval: 1000
};

// e.g. npm run dev.js local-only-bootstrap --sourceDirectory=$PWD/components --blocksDirectory=$pwd/local/workspace/build --port=1618
Program.command('local-only-bootstrap')
    .description('Bootstrap local development, recursively building _only local_ components')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory]')
    .option('-p, --port [port]')
    .action(function(info) {
        var assistant = new Assistant({
            builderOptions: {
                localRawSourceFolder: info.sourceDirectory,
                localBlocksFolder: info.blocksDirectory,
                codeManagerAssetReadHost: 'http://localhost:' + info.port,
                doSkipDependencyDereferencing: true,
                doAttemptToBuildDependenciesLocally: true
            }
        });

        assistant.buildAll(info.sourceDirectory, '', function(buildAllErr) {
            if (!buildAllErr) {
                assistant.watchDirectoryRecursive(info.sourceDirectory, '');

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

// e.g. npm run dev.js develop-component --sourceDirectory=$PWD/components/foo/bar/baz --blocksDirectory=$pwd/local/workspace/build --port=1618
Program.command('develop-component')
    .description('Develop the component in the given directory, using Code Manager for dependency resolution')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory]')
    .option('-p, --port [port]')
    .action(function(info) {
        var assistant = new Assistant({
            builderOptions: {
                localRawSourceFolder: info.sourceDirectory,
                localBlocksFolder: info.blocksDirectory,
                codeManagerAssetReadHost: 'http://localhost:' + info.port,
                codeManagerVersionInfoHost: 'https://api-te.famo.us/codemanager',
                doWriteToCodeManager: false,
                doSkipDependencyDereferencing: false,
                doAttemptToBuildDependenciesLocally: false
            }
        });

        assistant.buildSingle(info.sourceDirectory, '', function(buildSingleErr) {
            if (!buildSingleErr) {
                assistant.watchDirectory(info.sourceDirectory, '');

                var livereloadServer = Livereload.createServer(livereloadOptions);
                livereloadServer.watch([info.blocksDirectory]);

                var server = Express();
                server.use(Express.static(info.blocksDirectory));
                server.listen(info.port);
            }
            else {
                console.log(buildSingleErr);
            }
        });
    });

// e.g. npm run dev.js publish-component --sourceDirectory=$PWD/components/foo/bar/baz --blocksDirectory=$pwd/local/workspace/build
Program.command('publish-component')
    .description('Publish the component in the given directory to Famous Hub')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory]')
    .action(function(info) {
        var assistant = new Assistant({
            builderOptions: {
                localRawSourceFolder: info.sourceDirectory,
                localBlocksFolder: info.blocksDirectory,
                authHost: 'https://api-te.famo.us/auth',
                codeManagerAssetReadHost: 'https://api-te.famo.us/codemanager',
                codeManagerAssetWriteHost: 'https://api-te.famo.us/codemanager',
                codeManagerVersionInfoHost: 'https://api-te.famo.us/codemanager',
                doWriteToCodeManager: true,
                doSkipDependencyDereferencing: false,
                doAttemptToBuildDependenciesLocally: false
            }
        });

        assistant.buildSingle(info.sourceDirectory, '', function(buildSingleErr) {
            if (buildSingleErr) {
                console.log(buildSingleErr);
            }
        });
    });

Program.parse(process.argv);
