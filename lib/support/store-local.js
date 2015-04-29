'use strict';

var env = require('./../environment');
var PORT = env.PORT;
var HOST = 'http://localhost:' + PORT;
var BUCKET = 'best-ecosystem';

var fs = require('fs');
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
    fs.readdir(localPath(path), function(err, entries) {
        if (err) {
            cb(err);
        }
        else {
            cb(null, {
                Contents: entries.map(function(entry) {
                    return {
                        Key: Path.join(path, entry)
                    };
                })
            });
        }
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
