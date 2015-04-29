'use strict';

var AWS = require('aws-sdk');
var path = require('path');
var secrets = require('./../../conf/secrets/secrets');

var REGION = 'us-west-2';
var HOST = 'https://s3-' + REGION + '.amazonaws.com';
var BUCKET = 'best-ecosystem';

var s3 = new AWS.S3({
    params: {
        Bucket: BUCKET,
        Region: REGION,
        ACL: 'public-read'
    },
    apiVersion: '2006-03-01',
    accessKeyId: secrets['aws_access_key_id'],
    secretAccessKey: secrets['aws_secret_access_key']
});

// Mapping of extname to content type
var typeMap = {
  '.css': 'text/css',
  '.eot': 'application/vnd.ms-fontobject',
  '.gif': 'image/gif',
  '.html': 'text/html',
  '.htm': 'text/html',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.markdown': 'text/x-markdown',
  '.md': 'text/x-markdown',
  '.otf': 'font/opentype',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttf': 'application/octet-stream',
  '.txt': 'text/plain',
  '.woff': 'application/x-font-woff',
  '.woff2': 'application/font-woff2',
  '.xhtml': 'text/html',
  '.xml': 'application/xml'
};
// Use this fallback if no content type found
var fallback = 'application/octet-stream';

function getContentType(filepath) {
    var extname = path.extname(filepath.toLowerCase());
    var found = typeMap[extname];
    if (found) {
        return found;
    }
    else {
        return fallback;
    }
};

function getFile(path, cb) {
    s3.getObject({
        Key: path
    }, cb);
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
    s3.listObjects({
        Prefix: path
    }, cb);
}

function putFile(path, data, cb) {
    s3.putObject({
        Key: path,
        Body: data,
        ContentType: getContentType(path)
    }, cb);
}

module.exports = {
    baseURL: path.join(HOST, BUCKET),
    getData: getData,
    getFile: getFile,
    hasFile: hasFile,
    listFiles: listFiles,
    putFile: putFile
};
