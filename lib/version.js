'use strict';

/**
 * A 'version' is the collection of all files for a given
 * component as of a specific 'save'. It may include
 * everything from the component's main file itself, to
 * facet files, to static assets, to metadata files and
 * even a populated node_modules folder. Versions are the
 * state of the code *before* processing.
 */

var async = require('async');
var path = require('./support/path');
var sha1 = require('crypto-js/sha1');
var store = require('./support/store');

var BLANK = '';
var FOLDER = '~versions';

function tagger(files) {
    return sha1(JSON.stringify(files)).toString();
}

function fullpath(name, tag, filepath)  {
    var base = path.base(name);
    return path.join(base, FOLDER, tag, filepath);
}

function persist(name, tag, files, finish) {
    async.map(files, function(file, cb) {
        var full = fullpath(name, tag, file.path);
        store.putFile(full, file.content, cb);
    }, function(err, results) {
        finish(err, {
            tag: tag,
            results: results
        });
    });
}

function files(name, tag, finish) {
    list(name, tag, function(err, entries) {
        console.log(entries);
    });
}

function list(name, tag, finish) {
    var full = fullpath(name, tag, BLANK);
    store.listFiles(full, function(err, result) {
        finish(err, result.Contents);
    });
}

function create(name, files, finish) {
    var tag = tagger(files);
    persist(name, tag, files, finish);
}

function release(name, tag, files, finish) {
    persist(name, tag, files, finish);
}

module.exports = {
    create: create,
    list: list,
    files: files,
    release: release
};
