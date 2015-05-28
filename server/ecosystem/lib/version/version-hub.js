'use strict';

var Lodash = require('lodash');

function VersionHub(options) {
    this.options = Lodash.assign(Lodash.clone(VersionHub.DEFAULTS || {}), Lodash.clone(options || {}));
}

VersionHub.DEFAULTS = {};

VersionHub.prototype.save = function(name, files, finish) {
    console.error('Hub integration not yet implemented!');
};

module.exports = VersionHub;
