'use strict';

var env = require('./../environment');

if (env.env === env.PRODUCTION) {
    module.exports = require('./store-s3');
}
else {
    module.exports = require('./store-local');
}
