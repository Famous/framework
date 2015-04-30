'use strict';

var env = require('./../environment');
var PORT = env.PORT;
var HOST = 'http://localhost:' + PORT;
var BUCKET = 'best-ecosystem';

var lodash = require('lodash');
var fs = require('fs');
var walk = require('fs-walk');
var Path = require('path');
var mkdirp = require('mkdirp');
var ROOT_DIR = Path.join(__dirname, '..', '..');
var PUBLIC_DIR = Path.join(ROOT_DIR, 'public');
var ECO_DIR = Path.join(PUBLIC_DIR, BUCKET);
var FS_OPTS = { encoding: 'utf8' };

function localPath(path) {
    return Path.join(ECO_DIR, path);
}

function getFile(path, cb) {
    fs.readFile(localPath(path), FS_OPTS, function(err, result) {
        if (err) {
            console.error(err);
            cb(err);
        }
        else {
            cb(null, {
                Body: result
            });
        }
    });
}

function getData(path, cb) {
    getFile(path, function(err, result) {
        if (err || !result) {
            cb(err);
        }
        else if (result.Body) {
            cb(null, result.Body.toString());
        }
    });
}

function hasFile(path, cb) {
    getFile(path, function(err, result) {
        if (!err && result && result.Body) {
            cb(null, true);
        }
        else {
            cb(err, false);
        }
    });
}

function listFiles(path, cb) {
    var filesList = [];
    walk.files(localPath(path), function(basedir, filename, stat, next) {
        var subdir = basedir.replace(localPath(path), '').replace(/^\//, '');
        filesList.push(Path.join(subdir, filename));
        next();
    }, function() {
        cb(null, {
            Contents: filesList.map(function(entry) {
                return { Key: Path.join(path, entry) }
            })
        });
    });
}

function putFile(path, data, cb) {
    var fullPath = localPath(path);
    var baseDir = Path.dirname(fullPath);
    mkdirp(baseDir, function(err) {
        fs.writeFile(fullPath, data, FS_OPTS, function(err) {
           if (err) {
               cb(err);
           }
           else {
               cb(null, {});
           }
        });
    });
}

module.exports = {
    baseURL: HOST + '/' + BUCKET,
    getData: getData,
    getFile: getFile,
    hasFile: hasFile,
    listFiles: listFiles,
    putFile: putFile
};
