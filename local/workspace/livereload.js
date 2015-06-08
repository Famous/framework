#!/usr/bin/env node

var Livereload = require('livereload');
var Path = require('path');

var server = Livereload.createServer({
    port: 35729,
    exts: ['html', 'css', 'js', 'png', 'gif', 'jpg', 'coffee', 'jade', 'less', 'json'],
    applyJSLive: false,
    applyCSSLive: false,
    exclusions: [
        /\\node_modules\//,
        /\\.git\//,
        /\\.svn\//,
        /\\.hg\//
    ],
    interval: 1000
});

server.watch([
    Path.join(__dirname, 'build')
]);
