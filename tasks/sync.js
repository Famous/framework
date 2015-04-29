'use strict';

/**
 * When developing both the core framework library and
 * within the core components, it's convenient to be able
 * to synchronize files from here to the remote storage
 * service. These functions will push modules discovered
 * in the 'data/modules' folder up to storage.
 */

var bundle = require('./../lib/bundle');
var fs = require('fs');
var lodash = require('lodash');
var path = require('path');
var validate = require('./validate');
var version = require('./../lib/version');

var BLANK = '';
var COMPONENT_DELIMITER = ':';
var FILE_OPTIONS = { encoding: 'utf8' };
var SLASH = '/';

function push(files, base, location, prefix) {
    var fullpath = path.join(base, location);
    var entries = fs.readdirSync(fullpath);
    entries.forEach(function(entryPath) {
        var entryPartialPath = path.join(location, entryPath);
        var entryFullPath = path.join(fullpath, entryPath);
        var entryStat = fs.lstatSync(entryFullPath);
        var finalPath = path.join(prefix, entryPath);
        if (!entryStat.isDirectory()) {
            var entryContent = fs.readFileSync(entryFullPath, FILE_OPTIONS);
            files.push({
                path: finalPath,
                content: entryContent
            });
        }
        else {
            push(files, base, entryPartialPath, finalPath); // Recursive
        }
    });
}

function single(base, location, tag, cb) {
    if (!tag) {
        throw new Error('You must supply a release tag!');
    }
    var moduleName = location.split(SLASH).join(COMPONENT_DELIMITER);
    var files = [];
    push(files, base, location, '');
    version.release(moduleName, tag, files, function(err, result) {
        if (err) {
            throw new Error('Error releasing version');
        }
        bundle.create(moduleName, tag, files, function(err, bundled) {
            cb(err, bundled);
        });
    });
}

function recursive(base, subdir, tag, cb) {
    var mainpath = path.join(base, subdir);
    var entries = fs.readdirSync(mainpath);
    entries.forEach(function(entryPath) {
        var fullEntryPath = path.join(mainpath, entryPath);
        var entryStat = fs.lstatSync(fullEntryPath);
        if (entryStat.isDirectory()) {
            var partialPath = path.join(subdir, entryPath);
            if (validate.isModule(fullEntryPath)) {
                single(base, partialPath, tag, cb);
            }
            recursive(base, partialPath, tag, cb); // Recursive
        }
    });
}

module.exports = {
    single: single,
    recursive: recursive
};
