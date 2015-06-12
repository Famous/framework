#!/usr/bin/env node

'use strict';

var Browserify = require('browserify');
var Envify = require('envify/custom');
var Fs = require('fs');
var Path = require('path');
var Program = require('commander');

Program.command('build-runtime')
    .description('Build the runtime, writing the output to the given filename')
    .option('-o, --outputFile [outputFile]')
    .action(function(info) {

        var inputFile = Path.join(__dirname, '..', '..', 'browser', 'runtime', 'lib', 'index.js');
        var b = Browserify(inputFile);
        b.transform(Envify({
           FF_ASSET_READ_HOST: 'http://localhost:1618'
        }));
        b.bundle().pipe(Fs.createWriteStream(info.outputFile));

    });

Program.parse(process.argv);
