'use strict';

var Path = require('path');
var Watch = require('node-watch');

var Sync = require('./sync');
var Validate = require('./validate');

var ROOT_DIR = Path.join(__dirname, '..');
var DATA_DIR = Path.join(ROOT_DIR, 'data');
var MODULES_DIR = Path.join(DATA_DIR, 'modules');

var DEFAULT_TAG = 'HEAD';

// Given a directory, find the directory that is the
// parent BEST module directory of this one.
function getModuleDir(dir) {
    if (Validate.isModule(dir)) {
        return dir;
    }
    else {
        // No need to drop any further down than the
        // base modules folder.
        if (dir === MODULES_DIR) {
            return false;
        }
        else {
            return getModuleDir(Path.join(dir, '..'));
        }
    }
}

Watch(MODULES_DIR, function(filename) {
    var fullDir = Path.dirname(filename);
    var moduleDir = getModuleDir(fullDir);
    if (moduleDir) {
        var partialDir = moduleDir.replace(MODULES_DIR + '/', '');
        var baseDir = MODULES_DIR;
        console.log('syncing ' + Path.basename(filename) + ' @ ' + DEFAULT_TAG);
        Sync.single(baseDir, partialDir, DEFAULT_TAG, function(err, result) {
            if (err) console.error(err);
            else console.log('synced ' + partialDir);
        });
    }
});
