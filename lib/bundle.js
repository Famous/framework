'use strict';

/**
 * The 'bundle' is the buildfile that has everything that
 * a component needs in order to run on the client, including
 * expanded syntax, external libraries, dependencies, all
 * presented with a syntax that the client-side lib knows
 * how to handle.
 */

var async = require('async');
var compiler = require('./compiler');
var path = require('./support/path');
var store = require('./support/store');

var FOLDER = '~bundles';

function fullpath(name, tag, filepath)  {
    var base = path.base(name);
    return path.join(base, FOLDER, tag, filepath);
}

function compile(name, files, finish) {
    compiler.compile(name, files, finish);
}

function persist(name, tag, file, finish) {
    var full = fullpath(name, tag, file.path);
    store.putFile(full, file.content, function(err, result) {
        finish(err, {
            tag: tag,
            result: result
        });
    });
}

function create(name, tag, files, finish) {
    async.waterfall([
        function(cb) {
            compile(name, files, cb);
        },
        function(compiled, cb) {
            persist(name, tag, compiled, finish);
        }
    ]);
}

module.exports = {
    create: create
};
