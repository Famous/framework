'use strict';

var ENVS = {};
ENVS.DEVELOPMENT = 'development';
ENVS.STAGING = 'staging';
ENVS.PRODUCTION = 'production';
var DEFAULT_ENV = ENVS.DEVELOPMENT;
var kind = ENVS[process.env.ECOSYSTEM_ENV] || DEFAULT_ENV;
var PORT = 3000;

module.exports = {
    kind: kind,
    DEVELOPMENT: ENVS.DEVELOPMENT,
    STAGING: ENVS.STAGING,
    PRODUCTION: ENVS.PRODUCTION,
    PORT: PORT
};
