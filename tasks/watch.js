var path = require('path');
var sync = require('./sync');
var validate = require('./validate');
var watch = require('node-watch');

var ROOT_DIR = path.join(__dirname, '..');
var DATA_DIR = path.join(ROOT_DIR, 'data');
var MODULES_DIR = path.join(DATA_DIR, 'modules');

var SLASH = '/';
var BLANK = '';
var SUBDIR = '..';
var DEFAULT_TAG = 'HEAD';

// Given a directory, find the directory that is the
// parent BEST module directory of this one.
function getModuleDir(dir) {
    if (validate.isModule(dir)) {
        return dir;
    }
    else {
        // No need to drop any further down than the
        // base modules folder.
        if (dir === MODULES_DIR) {
            return false;
        }
        else {
            return getModuleDir(path.join(dir, SUBDIR));
        }
    }
}

watch(MODULES_DIR, function(filename) {
    var fullDir = path.dirname(filename);
    var moduleDir = getModuleDir(fullDir);
    if (moduleDir) {
        var partialDir = moduleDir.replace(MODULES_DIR + SLASH, BLANK);
        var baseDir = MODULES_DIR;
        sync.single(baseDir, partialDir, DEFAULT_TAG, function(err, result) {
            if (err) {
                console.error(err);
            }
            else {
                console.log('synced ' + partialDir, result);
            }
        });
    }
});
