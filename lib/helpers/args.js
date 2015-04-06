'use strict';

var ObjUtils = require('framework-utilities/object');
var Random = require('./random');

var EVERY_KEY = '$every';
var STATE_KEY = '$state';
var RAND_RE = /^\$random/;

function getState(name, statesObject) {
    switch (true) {
        case RAND_RE.test(name): return Random.rand();
        default:
            return statesObject[name];
    }
}

function fetch(paramNames, stateManager) {
    if (!paramNames) {
        return [];
    }
    else if (paramNames.indexOf(EVERY_KEY) > -1) {
        var latestStateChange = stateManager.getLatestStateChange();
        var key = Object.keys(latestStateChange)[0];
        return [null, key, latestStateChange[key]];
    }
    else if (paramNames.indexOf(STATE_KEY) > -1) {
        return [ObjUtils.clone(stateManager._state)];
    }
    else {
        var states = stateManager._state;
        var args = [];
        for (var i = 0; i < paramNames.length; i++) {
            args.push(getState(paramNames[i], states));
        }
        return args;
    }
}

function fetchOne(name, statesObject) {
    return getState(name, statesObject);
}

module.exports = {
    fetch: fetch,
    fetchOne: fetchOne
};
