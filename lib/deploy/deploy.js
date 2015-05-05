'use strict';

var xhr = require('xhr');
var execute = require('./execute');

var ECOSYSTEM_HOST = 'http://localhost:3000';
var DEFAULT_VERSION = 'HEAD';

function bundleURL(name) {
    return ECOSYSTEM_HOST + '/bundles/' + name + '/' + DEFAULT_VERSION + '.json';
}

function attachBundle(url, cb) {
    var script = document.createElement('script');
    script.onload = cb;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.head.appendChild(script);
}

function deploy(name, selector) {
    xhr({
        url: bundleURL(name)
    }, function(err, resp, body) {
        if (err) {
            throw new Error(err);
        }

        var info = JSON.parse(body);
        var url = info.url;
        attachBundle(url, function() {
            execute(name, selector);
        });
    });
}

module.exports = {
    deploy: deploy
};
