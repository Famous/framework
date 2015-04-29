'use strict';

var PORT = 3000;

var ENVS = {
    DEVELOPMENT: 'development',
    STAGING: 'staging',
    PRODUCTION: 'production'
};

var DEFAULT_ENV = ENVS.DEVELOPMENT;
var env = process.env.ECOSYSTEM_ENV || DEFAULT_ENV;

module.exports = {
    env: env,
    DEVELOPMENT: ENVS.DEVELOPMENT,
    STAGING: ENVS.STAGING,
    PRODUCTION: ENVS.PRODUCTION,
    PORT: PORT
};
