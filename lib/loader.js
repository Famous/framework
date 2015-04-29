'use strict';

var async = require('async');
var lodash = require('lodash');
var path = require('./support/path');
var version = require('./version');

function load(deps, parentTag, packages, finish) {
    var output = {};
    var pairs = [];
    for (var depName in deps) {
        var tags = deps[depName];
        for (var tagName in tags) {
            pairs.push([depName, tagName]);
        }
    }
    async.map(pairs, function(pair, cb) {
        (function(moduleName, tagName) {
            version.files(moduleName, tagName, function(err, files) {
                if (!output[moduleName]) {
                    output[moduleName] = {};
                }
                output[moduleName][tagName] = files;
                cb(err, files);
            });
        }(pair[0], pair[1]));
    }, function(err) {
        finish(err, output);
    });
}

module.exports = {
    load: load
};
