'use strict';

var async = require('async');
var version = require('./version');

var FOLDER = '~dependants';

function manifestFiles(name, tag) {
    return [{ path: FOLDER + '/' + name + '#' + tag, content: '' }];
}

function write(name, tag, pairs, cb) {
    async.map(pairs, function(pair, cb) {
        var depName = pair[0];
        var depTag = pair[1];
        var filesToWrite = manifestFiles(name, tag);
        version.persist(depName, depTag, filesToWrite, function(err, res) {
            cb(null, filesToWrite);
        });
    }, function(err, result) {
        cb(err, result);
    });
}

module.exports = {
    write: write
};
