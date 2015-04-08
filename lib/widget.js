'use strict';

var Application = require('./application');
var Loader = require('./loader');

var WIDGET_PREFIX = 'best-local';
var COMPONENT_DELIM = ':';

function Widget(name, selector, definition, cb) {
    name = WIDGET_PREFIX + COMPONENT_DELIM + name;
    Loader.loadComponent(name, definition, function() {
        Application.deploy(name, selector, cb);
    });
}

module.exports = Widget;
