'use strict';

var ObjUtils = require('framework-utilities/object');
var Timeline = require('./timeline');

var EVERY_KEY = '$every';
var STATE_KEY = '$state';
var TIMELINE_KEY = '_timeline';

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
            if (paramNames[i] === TIMELINE_KEY) {
                args.push(Timeline);
            }
            else {
                args.push(stateManager.getState(paramNames[i]));
            }
        }
        return args;
    }
}

module.exports = {
    fetch: fetch
};
