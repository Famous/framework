'use strict';

var Env = require('./../../config/environment');
var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');
var Walk = require('fs-walk');

var BEGINNING_SLASH_REGEXP = /^\//;
var BLANK = '';
var PROTOCOL_DELIMITER = '://';
var SLASH = '/';

function StorageFS(options) {
    this.options = Lodash.defaults(Lodash.clone(StorageFS.DEFAULTS || {}), Lodash.clone(options || {}));
}

StorageFS.DEFAULTS = {
    storageDir: Path.join(__dirname, '..', '..', 'public', 'best-ecosystem'),
    fileOptions: { encoding: 'utf8' },
    bucket: 'best-ecosystem',
    scheme: 'http',
    host: 'localhost:' + Env.PORT
};

// _ -> String
StorageFS.prototype.getBaseURL = function() {
    return this.options.scheme + PROTOCOL_DELIMITER + this.options.host + SLASH + this.options.bucket;
};

// String -> String
StorageFS.prototype.localPathFrom = function(path) {
    return Path.join(this.options.storageDir, path);
};

// String -> Object
StorageFS.prototype.fetchFile = function(path, cb) {
    Fs.readFile(this.localPathFrom(path), this.options.fileOptions, function(err, result) {
        if (err) {
            console.error(err);
            cb(err);
        }
        else {
            cb(null, { Body: result });
        }
    }.bind(this));
};

// String -> String
StorageFS.prototype.fetchData = function(path, cb) {
    this.fetchFile(path, function(err, result) {
        if (err || !result) {
            cb(err);
        }
        else if (result.Body) {
            cb(null, result.Body.toString());
        }
    }.bind(this));
};

// String -> Boolean
StorageFS.prototype.fetchFileExists = function(path, cb) {
    this.fetchFile(path, function(err, result) {
        if (!err && result && result.Body) {
            cb(null, true);
        }
        else {
            cb(err, false);
        }
    }.bind(this));
};

// String -> Array
StorageFS.prototype.fetchFilesList = function(path, cb) {
    var filesList = [];
    Walk.files(this.localPathFrom(path), function(basedir, filename, stat, next) {
        var subdir = basedir.replace(this.localPathFrom(path), BLANK).replace(BEGINNING_SLASH_REGEXP, BLANK);
        filesList.push(Path.join(subdir, filename));
        next();
    }.bind(this), function() {
        cb(null, {
            Contents: filesList.map(function(entry) {
                return { Key: Path.join(path, entry) }
            })
        }.bind(this));
    }.bind(this));
};

// String, String
StorageFS.prototype.putFile = function(path, data, cb) {
    var fullPath = this.localPathFrom(path);
    var baseDir = Path.dirname(fullPath);
    Mkdirp(baseDir, function(err) {
        Fs.writeFile(fullPath, data, this.options.fileOptions, function(err) {
           if (err) {
               cb(err);
           }
           else {
               cb(null, {});
           }
        });
    }.bind(this));
};

module.exports = StorageFS;
