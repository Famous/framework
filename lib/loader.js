'use strict';

var async = require('async');
var lodash = require('lodash');
var path = require('./support/path');
var version = require('./version');

function load(names, tag, packages, finish) {
    var output = {};
    async.map(names, function(name, cb) {
        (function(moduleName) {
            version.files(moduleName, tag, function(err, files) {
                output[moduleName] = files;
                cb(err, files);
            });
        }(name));
    }, function(err) {
        finish(err, output);
    });
}

module.exports = {
    load: load
};
