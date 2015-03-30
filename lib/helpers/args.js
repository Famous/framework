'use strict';

var ObjUtils = require('framework-utilities/object');

var EVERY_KEY = '$every';
var STATE_KEY = '$state';

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
        var args = [];
        for (var i = 0; i < paramNames.length; i++) {
            args.push(stateManager.getState(paramNames[i]));
        }
        return args;
    }
}

module.exports = {
    fetch: fetch
};
