'use strict';

/*eslint-disable*/

var Aws = require('aws-sdk');
var Lodash = require('lodash');
var Path = require('path');
var SECRETS = require('./../../config/secrets');

function StorageS3(options) {
    this.options = Lodash.defaults(Lodash.clone(StorageS3.DEFAULTS), Lodash.clone(options || {}));
    this.helper = new Helper(this.options);
    this.client = new Aws.S3({
        params: {
            Bucket: this.helper.getBucket(),
            Region: this.helper.getRegion(),
            ACL: this.options.acl
        },
        apiVersion: this.options.apiVersion,
        accessKeyId: this.options.accessKeyId,
        secretAccessKey: this.options.secretAccessKey
    });
}

StorageS3.DEFAULTS = {
    accessKeyId: SECRETS.aws_access_key_id,
    acl: 'public-read',
    apiVersion: '2006-03-01',
    secretAccessKey: SECRETS.aws_secret_access_key
};

// String -> String
StorageS3.prototype.getContentType = function(path) {
    var extname = Path.extname(path.toLowerCase());
    var found = this.helper.getContentTypeMap()[extname];
    if (found) {
        return found;
    }
    else {
        return this.helper.getContentTypeFallback();
    }
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

/*eslint-enable*/

module.exports = StorageS3;
