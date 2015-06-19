#!/usr/bin/env node

'use strict';

var Browserify = require('browserify');
var Child_Process = require('child_process');
var Envify = require('envify/custom');
var exec = Child_Process.exec;
var Express = require('express');
var Fs = require('fs');
var Livereload = require('livereload');
var Ncp = require('ncp').ncp
var Path = require('path');
var Program = require('commander');
var Watchify = require('watchify');

var Assistant = require('./../dev/assistant/assistant');
var Config = require('./../dev/config');

var livereloadOptions = {
    port: 35729,
    exts: ['html','css','js','png','gif','jpg','coffee','less','json'],
    applyJSLive: false,
    applyCSSLive: false,
    exclusions: [/\\node_modules\//,/\\.git\//,/\\.svn\//,/\\.hg\//],
    interval: 1000
};

Program.command('copy-core-components')
    .option('-d, --destinationFolder [destinationFolder]')
    .action(function(info) {
        var coreComponentsFolder = Path.join(__dirname, '..', 'lib', 'core-components', 'famous');
        Ncp(coreComponentsFolder, info.destinationFolder, function(copyErr) {
            if (copyErr) {
                return console.error('Couldn\'t copy core components!');
            }
        });
    });

Program.command('watch-runtime')
    .option('-i, --inputFile [inputFile]')
    .option('-s, --serverHost [serverHost]')
    .option('-o, --outputFile [outputFile]')
    .action(function(info) {
        var b = Browserify(info.inputFile, { cache: {}, packageCache: {} });
        var w = Watchify(b);
        w.transform(Envify({ FF_ASSET_READ_HOST: info.serverHost }));
        function bundle() { w.bundle().pipe(Fs.createWriteStream(info.outputFile)); }
        w.on('update', function() { bundle(); });
        w.on('bytes', function(bytes) { console.log('Wrote ' + bytes + ' bytes to ' + info.outputFile); });
        bundle();
    });

Program.command('local-only-bootstrap')
    .description('Bootstrap local development, recursively building _only local_ components')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory]')
    .option('-r, --rebuildEverythingOnChange [rebuildEverythingOnChange]')
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

        var doRebuildEverythingOnChange = info.rebuildEverythingOnChange === 'yes';

        assistant.buildAll(info.sourceDirectory, '', function(buildAllErr) {
            if (!buildAllErr) {
                assistant.watchDirectoryRecursive(info.sourceDirectory, '', doRebuildEverythingOnChange);

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

Program.command('snapshot-component')
    .option('-n, --componentName [componentName]')
    .option('-s, --sourceDirectory [sourceDirectory]')
    .option('-b, --blocksDirectory [blocksDirectory]')
    .option('-d, --destinationDirectory [destinationDirectory]')
    .action(function(info) {
        var assistant = new Assistant({
            builderOptions: {
                localRawSourceFolder: info.sourceDirectory,
                localBlocksFolder: info.blocksDirectory,
                codeManagerAssetReadHost: 'https://api-te.famo.us/codemanager',
                codeManagerAssetWriteHost: 'https://api-te.famo.us/codemanager',
                codeManagerVersionInfoHost: null,
                authHost: 'https://api-te.famo.us/auth',
                doWriteToCodeManager: true,
                doSkipDependencyDereferencing: false,
                doAttemptToBuildDependenciesLocally: true,
                doSkipExecutableBuild: false
            }
        });

        var baseDir = info.sourceDirectory;
        var subDir = info.componentName.split(Config.get('componentDelimiter')).join(Path.sep);

        assistant.buildSingle(baseDir, subDir, function(buildErr, buildInfo) {
            var destPath = Path.join(info.destinationDirectory, buildInfo.name);

            Fs.mkdir(destPath, function(destDirErr) {
                if (destDirErr) {
                    return console.error(destDirErr);
                }

                var executablePath = Path.join(destPath, 'build.js');
                Fs.writeFile(executablePath, buildInfo.bundleExecutableString, function(executableWriteErr) {
                    if (executableWriteErr) {
                        return console.error(executableWriteErr);
                    }

                    var indexPath = Path.join(destPath, 'index.html');
                    Fs.writeFile(indexPath, buildInfo.bundleIndexString, function(indexWriteErr) {
                        if (indexWriteErr) {
                            return console.error(indexWriteErr);
                        }
                    });
                });
            });
        });
    });

function execAndLog(cmd) {
    exec(cmd, function(err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.log(stderr);
    });
}

Program.command('test-runtime').action(function() {
    var testPath = Path.join(__dirname, "tests", "runtime-tests", "**", "*.spec.js");
    var testCmd = "browserify " + testPath + " -t [ envify ] -d | tap-closer | smokestack";
    execAndLog(testCmd);
});

Program.command('test-state-manager').action(function () {
    var testPath = Path.join(__dirname, "tests", "state-manager-tests", "*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
});

Program.command('test-utilities').action(function() {
    var testPath = Path.join(__dirname, "tests", "utilities-tests", "*.spec.js");
    var testCmd = "browserify " + testPath + " | tap-closer | smokestack";
    execAndLog(testCmd);
});

Program.parse(process.argv);
