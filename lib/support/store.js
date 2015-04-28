var AWS = require('aws-sdk');
var secrets = require('./../../conf/secrets/secrets');

var s3 = new AWS.S3({
    params: {
        Bucket: 'best-ecosystem',
        Region: 'us-west-2',
        ACL: 'public-read'
    },
    apiVersion: '2006-03-01',
    accessKeyId: secrets['aws_access_key_id'],
    secretAccessKey: secrets['aws_secret_access_key']
});

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
        Body: data
    }, cb);
}

module.exports = {
    getData: getData,
    getFile: getFile,
    hasFile: hasFile,
    listFiles: listFiles,
    putFile: putFile
};
