'use strict';

/**
 * Tokens are syntactical sugar within component code
 * and this module's job is to handle processing them.
 * For example, we might have a string used as shorthand
 * to declare a special, commonly used type of function.
 * This file's job would be to replace that string in
 * the AST with the desired function.
 */

var parser = require('./parser');

var CAMEL_RE = /-([a-z])/g;
var EVENTS_KEY = 'events';
var PIPE = '|';
var SETTER_KEY = 'setter';

var FILTERS = {
    'camel': function(str) {
        return str.replace(CAMEL_RE, function(g) {
            return g[1].toUpperCase();
        });
    }
};

function allFilters(key, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (FILTERS[filter]) {
            key = FILTERS[filter](key);
        }
        else {
            throw new Error('No such filter');
        }
    }
    return key;
}

function buildSetter(key, filters) {
    var stateName = allFilters(key, filters);
    var fnString = '(function($state,$payload){$state.set(\'' + stateName + '\',$payload);})';
    var parsed = parser.parse(fnString);
    return parser.getASTBody(parsed);
}

function buildEventFunctionAST(key, value) {
    var functionParts = value.split(PIPE);
    var functionKey = functionParts[0];
    var filters = functionParts.slice(1, functionParts.length);
    switch (functionKey) {
        case SETTER_KEY: return buildSetter(key, filters);
    }
}

function expandEvents(obj) {
    parser.eachProperty(obj, function(evtKey, evtValue, evtProp) {
        if (evtValue.type === 'Literal') {
            var fnAST = buildEventFunctionAST(evtKey, evtValue.value);
            evtProp.value = fnAST;
        }
        else if (evtValue.type === 'ObjectExpression') {
            expandEvents(evtValue);
        }
    });
}

function expand(definition) {
    parser.eachProperty(definition, function(key, value, property) {
        if (key === EVENTS_KEY) {
            expandEvents(value);
        }
    });
}

module.exports = {
    expand: expand
};
