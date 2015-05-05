'use strict';

/**
 * When developing both the core framework library and
 * within the core components, it's convenient to be able
 * to synchronize files from here to the remote storage
 * service. These functions will push modules discovered
 * in the 'data/modules' folder up to storage.
 */

var Fs = require('fs');
var Lodash = require('lodash');
var Path = require('path');

var Validate = require('./validate');
var Version = require('./../lib/version/version');

var BLANK = '';
var COMPONENT_DELIMITER = ':';
var FILE_OPTIONS = { encoding: 'utf8' };
var SLASH = '/';

function push(files, base, location, prefix) {
    var fullpath = Path.join(base, location);
    var entries = Fs.readdirSync(fullpath);
    entries.forEach(function(entryPath) {
        var entryPartialPath = Path.join(location, entryPath);
        var entryFullPath = Path.join(fullpath, entryPath);
        var entryStat = Fs.lstatSync(entryFullPath);
        var finalPath = Path.join(prefix, entryPath);
        if (!entryStat.isDirectory()) {
            var entryContent = Fs.readFileSync(entryFullPath, FILE_OPTIONS);
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
    if (!tag) throw new Error('You must supply a release tag');
    var moduleName = location.split(SLASH).join(COMPONENT_DELIMITER);
    var files = [];
    push(files, base, location, BLANK);
    var version = new Version();
    version.save(moduleName, tag, files, function(err, result) {
        if (err) throw new Error('Error saving version');
        console.log('Success!', result);
    });
}

function recursive(base, subdir, tag, cb) {
    var mainpath = Path.join(base, subdir);
    var entries = Fs.readdirSync(mainpath);
    entries.forEach(function(entryPath) {
        var fullEntryPath = Path.join(mainpath, entryPath);
        var entryStat = Fs.lstatSync(fullEntryPath);
        if (entryStat.isDirectory()) {
            var partialPath = Path.join(subdir, entryPath);
            if (Validate.isModule(fullEntryPath)) {
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
