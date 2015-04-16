'use strict';

if (!window.Famous) {
    throw new Error('`Famous` library must be included before `BEST`');
}

module.exports = {
    deploy: require('./application').deploy,
    helpers: require('./helper-functions')
};
