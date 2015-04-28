'use strict';

var async = require('async');
var bundle = require('./bundle');
var version = require('./version');

function commit(name, files, finish) {
    async.waterfall([
        function(cb) {
            version.create(name, files, cb);
        },
        function(info, cb) {
            bundle.create(name, info.tag, files, finish);
        }
    ]);
};

function release(name, tag, files, finish) {
    async.waterfall([
        function(cb) {
            version.release(name, tag, files, cb);
        },
        function(cb) {
            bundle.create(name, tag, files, finish);
        }
    ]);
};

module.exports = {
    commit: commit,
    release: release
};
