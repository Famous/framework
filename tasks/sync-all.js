'use strict';

/**
 * Sync all modules in the data/modules folder to
 * the remote datastore.
 */

var Path = require('path');

var Sync = require('./sync');

var ROOT_DIR = Path.join(__dirname, '..');
var DATA_DIR = Path.join(ROOT_DIR, 'data');
var MODULES_DIR = Path.join(DATA_DIR, 'modules');

var DEFAULT_TAG = 'HEAD';
var SUBFOLDER = '';

Sync.recursive(MODULES_DIR, SUBFOLDER, DEFAULT_TAG, function(err, result) {
    if (err) console.error(err);
    else console.log('Success!', result);
});
