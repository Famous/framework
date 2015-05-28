'use strict';

var Lodash = require('lodash');
var Request = require('request');

function APIClient(options) {
    this.setOptions(options);
}

var ECOSYSTEM_BASE_URI = process.env.ECOSYSTEM_BASE_URI;
if (!ECOSYSTEM_BASE_URI) {
    throw new Error('best-assistant: `ECOSYSTEM_BASE_URI` must be specified!');
}

APIClient.DEFAULTS = {
    saveMethod: 'POST'
};

APIClient.prototype.setOptions = function(options) {
    this.options = Lodash.defaults(Lodash.clone(APIClient.DEFAULTS), Lodash.clone(options || {}));
};

APIClient.prototype.saveModule = function(moduleName, files, cb) {
    var saveMethod = this.options.saveMethod;
    Request({
        method: saveMethod,
        uri: ECOSYSTEM_BASE_URI + 'versions.json',
        encoding: 'utf8',
        json: true,
        timeout: 10000,
        body: {
            name: moduleName,
            files: files
        }
    }, function(err, resp) {
        if (err) {
            console.error(err);
            cb(err);
        }
        else cb(null, resp);
    });
};

module.exports = APIClient;
