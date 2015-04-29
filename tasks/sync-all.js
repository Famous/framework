'use strict';

/**
 * Sync all modules in the data/modules folder to
 * the remote datastore.
 */

var path = require('path');
var sync = require('./sync');

var ROOT_DIR = path.join(__dirname, '..');
var DATA_DIR = path.join(ROOT_DIR, 'data');
var MODULES_DIR = path.join(DATA_DIR, 'modules');

var DEFAULT_TAG = 'HEAD';
var SUBFOLDER = '';

sync.recursive(MODULES_DIR, SUBFOLDER, DEFAULT_TAG, function(err, result) {
    if (err) {
        console.error(err);
    }
});
