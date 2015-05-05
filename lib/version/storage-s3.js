'use strict';

var Aws = require('aws-sdk');
var Path = require('path');
var SECRETS = require('./../../config/secrets');

var SLASH = '/';
var PROTOCOL_DELIMITER = '://';

function StorageS3(options) {
    this.options = Lodash.defaults(Lodash.clone(StorageS3.DEFAULTS || {}), Lodash.clone(options || {}));
    this.client = new Aws.S3({
        params: {
            Bucket: this.options.bucket,
            Region: this.options.region,
            ACL: this.options.acl
        },
        apiVersion: this.options.apiVersion,
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey
    });
}

StorageS3.DEFAULTS = {
    accessKeyId: SECRETS['aws_access_key_id'],
    acl: 'public-read',
    apiVersion: '2006-03-01',
    bucket: 'best-ecosystem',
    contentTypeFallback: 'application/octet-stream',
    contentTypeMap: {
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
    },
    host: 's3-us-west-2.amazonaws.com',
    region: 'us-west-2',
    scheme: 'https',
    secretAccessKey: SECRETS['aws_secret_access_key']
};

// String -> String
StorageS3.prototype.getContentType = function(path) {
    var extname = Path.extname(path.toLowerCase());
    var found = this.options.contentTypeMap[extname];
    if (found) {
        return found;
    }
    else {
        return this.options.contentTypeFallback;
    }
};

// _ -> String
StorageS3.prototype.getBaseURL = function() {
    return this.options.scheme + PROTOCOL_DELIMITER + this.options.host + SLASH + this.options.bucket;
};

// String -> Object
StorageS3.prototype.fetchFile = function(path, cb) {
    this.client.getObject({ Key: path }, cb);
};

// String -> String
StorageS3.prototype.fetchData = function(path, cb) {
    getFile(path, function(err, result) {
        if (err || !result) {
            cb(err);
        }
        else if (result.Body) {
            cb(null, result.Body.toString());
        }
    });
};

// String -> Boolean
StorageS3.prototype.fetchFileExists = function(path, cb) {
    getFile(path, function(err, result) {
        if (!err && result && result.Body) {
            cb(null, true);
        }
        else {
            cb(err, false);
        }
    });
};

// String -> Array
StorageS3.prototype.fetchFilesList = function(path, cb) {
    this.client.listObjects({ Prefix: path }, cb);
};

// String, String
StorageS3.prototype.putFile = function(path, data, cb) {
    this.client.putObject({
        Key: path,
        Body: data,
        ContentType: this.getContentType(path)
    }, cb);
};

module.exports = StorageS3;
