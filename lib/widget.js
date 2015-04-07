var Application = require('./application');
var Loader = require('./loader');
var UID = require('./helpers/uid');

var WIDGET_PREFIX = 'best-local';
var COMPONENT_DELIM = ':';

function Widget(name, selector, definition, cb) {
    var name = WIDGET_PREFIX + COMPONENT_DELIM + name;
    Loader.loadComponent(name, definition, function() {
        Application.deploy(name, selector, cb);
    });
}

module.exports = Widget;
