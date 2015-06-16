'use strict';

var MAP = {
    2: 'INFO',
    1: 'WARN',
    0: 'FAIL'
};

var LOG_LEVEL = 0;

var LOG = {};
LOG[MAP[0]] = [];
LOG[MAP[1]] = [];
LOG[MAP[2]] = [];
LOG.ALL = [];

function log(msg, level) {
    if (level <= LOG_LEVEL) {
        if (level === 0) {
            console.error(msg);
        }
        else if (level === 1) {
            console.warn(msg);
        }
        else {
            console.log(msg);
        }
    }

    var info = {
        message: msg,
        timestamp: Date.now()
    };

    LOG.ALL.push(info);
    LOG[MAP[level]].push(info);
}

function setLevel(level) {
    if (level < 0 || level > 2) {
        throw new Error('Log level must be set to an integer between 0 and 2');
    }
    LOG_LEVEL = level;
}

function getLevel() {
    return LOG_LEVEL;
}

function getLog() {
    return LOG;
}


module.exports = {
    log: log,
    getLog: getLog,
    setLevel: setLevel,
    getLevel: getLevel
};
