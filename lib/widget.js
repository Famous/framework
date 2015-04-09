'use strict';

var Application = require('./application');
var Loader = require('./loader');

var WIDGET_PREFIX = 'best-local';
var COMPONENT_DELIM = ':';

function Widget(name, selector, options, definition, cb) {
    name = WIDGET_PREFIX + COMPONENT_DELIM + name;
    var loader = new Loader(options);
    loader.loadComponent(name, definition, function() {
        Application.deploy(name, selector, options, cb);
    });
}

module.exports = Widget;
