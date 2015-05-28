'use strict';

var Fs = require('fs');
var Lodash = require('lodash');
var Mkdirp = require('mkdirp');
var Path = require('path');
var Walk = require('fs-walk');

var Helper = require('./../helper/helper');

var BEGINNING_SLASH_REGEXP = /^\//;
var BLANK = '';

function StorageFS(options) {
    this.options = Lodash.defaults(Lodash.clone(StorageFS.DEFAULTS), Lodash.clone(options || {}));
    this.helper = new Helper(this.options);
}

StorageFS.DEFAULTS = {
    storageDir: Path.join(__dirname, '..', '..', 'public', 'best-ecosystem'),
    fileOptions: { encoding: 'utf8' }
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
    });
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
    });
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
    });
};

// String -> Array
StorageFS.prototype.fetchFilesList = function(path, cb) {
    var filesList = [];
    Walk.files(this.localPathFrom(path), function(basedir, filename, stat, next) {
        var subdir = basedir.replace(this.localPathFrom(path), BLANK).replace(BEGINNING_SLASH_REGEXP, BLANK);
        filesList.push(Path.join(subdir, filename));
        next();
    }.bind(this), function(walkErr) {
        if (walkErr) {
            console.error(walkErr);
            cb(walkErr);
        }
        cb(null, {
            Contents: filesList.map(function(entry) {
                return { Key: Path.join(path, entry) };
            })
        }.bind(this));
    }.bind(this));
};

// String, String
StorageFS.prototype.putFile = function(path, data, cb) {
    var fullPath = this.localPathFrom(path);
    var baseDir = Path.dirname(fullPath);
    Mkdirp(baseDir, function(err) {
        if (err) {
            throw (err);
        }
        if (this.helper.looksLikeBinary(path)) {
            data = new Buffer(data, 'binary');
        }
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
