var Lodash = require('lodash');
var Request = require('request');

var SLASH = '/';

function APIClient(options) {
    this.setOptions(options);
}

APIClient.DEFAULTS = {
    saveMethod: 'POST',
    hostURI: 'http://localhost:3000'
};

APIClient.prototype.setOptions = function(options) {
    this.options = Lodash.defaults(Lodash.clone(APIClient.DEFAULTS), Lodash.clone(options || {}));
};

APIClient.prototype.saveModule = function(moduleName, files, cb) {
    Request({
        method: this.options.saveMethod,
        uri: this.options.hostURI + SLASH + 'versions.json',
        encoding: 'utf8',
        json: true,
        body: {
            name: moduleName,
            files: files
        }
    }, function(err, resp) {
        if (err) cb(err);
        else cb(null, resp);
    });
};

module.exports = APIClient;
