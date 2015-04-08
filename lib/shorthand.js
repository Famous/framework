var SETTER_KEY = 'setter';
var PARTS_DELIM = '|';
var FILTERS = {
    'camel': function(str) {
        return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
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
    return function(state, message) {
        state.set(stateName, message);
    };
}

function buildFunction(name, key, filters) {
    switch (key) {
        case SETTER_KEY: return buildSetterFunction(name, filters);
    }
}

function processPublicEvents(events) {
    for (var name in events) {
        var value = events[name];
        if (typeof value === 'string') {
            var parts = value.split(PARTS_DELIM);
            var key = parts[0];
            var filters = parts.slice(1, parts.length);
            events[name] = buildFunction(name, key, filters);
        }
    }
}

function processEvents(events) {
    if (events.public) {
        processPublicEvents(events.public);
    }
}

function process(definition) {
    if (!definition) return;
    if (definition.events) {
        processEvents(definition.events);
    }
    return definition;
}

module.exports = {
    process: process
};
