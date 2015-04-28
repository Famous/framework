'use strict';

var async = require('async');
var path = require('./support/path');
var version = require('./version');

var DEFAULT_VERSION = 'HEAD';

function load(names, packages, finish) {
    async.map(names, function(name) {
        version.files(name, DEFAULT_VERSION, function(err, files) {
            console.log(files);
        });
    }, function(err, results) {

    });
}

module.exports = {
    load: load
};
