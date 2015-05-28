'use strict';

var ENVS = {
    'development': 1,
    'production': 2
};

var DEFAULT_ENV = ENVS.development;
var userSpecifiedEnv = process.env.ECOSYSTEM_ENV;
var kind = ENVS[userSpecifiedEnv] || DEFAULT_ENV;
var PORT = 8357;

module.exports = {
    kind: kind,
    DEVELOPMENT: ENVS.development,
    PRODUCTION: ENVS.production,
    PORT: PORT
};
