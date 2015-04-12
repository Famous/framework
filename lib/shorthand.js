'use strict';

var SETTER_KEY = 'setter';
var PARTS_DELIM = '|';
var CAMEL_RE = /-([a-z])/g;

var FILTERS = {
    'camel': function(str) {
        return str.replace(CAMEL_RE, function(g) { return g[1].toUpperCase(); });
    }
};

function allFilters(name, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (FILTERS[filter]) {
            name = FILTERS[filter](name);
        }
    }
    return name;
}

function buildSetterFunction(name, filters) {
    var stateName = allFilters(name, filters);
    return function($state, $payload) {
        $state.set(stateName, $payload);
    };
}

function buildFunction(name, key, filters) {
    switch (key) {
        case SETTER_KEY: return buildSetterFunction(name, filters);
    }
}

function processEvent(eventName, eventValue) {
    if (typeof eventValue === 'string') {
        var parts = eventValue.split(PARTS_DELIM);
        var key = parts[0];
        var filters = parts.slice(1, parts.length);
        return buildFunction(eventName, key, filters);
    }
    else {
        return eventValue;
    }
}

module.exports = {
    processEvent: processEvent
};
