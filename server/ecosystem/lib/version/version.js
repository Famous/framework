'use strict';

var Env = require('./../../config/environment');

module.exports = (Env.kind === Env.PRODUCTION)
    ? require('./version-hub')
    : require('./version-tmp');
