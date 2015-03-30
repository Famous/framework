'use strict';

var Loader = require('./loader');
var Messager = require('./messager');
var Graph = require('./graph');

var DEFAULT_SELECTOR = 'body';

function Application(name, selector, ready) {
    if (!selector) {
        console.warn('Defaulting to `' + DEFAULT_SELECTOR + '`');
    }
    Loader.loadEntrypoint(name, function() {
        this.initialize(name, selector || DEFAULT_SELECTOR, ready);
    }.bind(this));
}

Application.deploy = function(name, selector, ready) {
    return new Application(name, selector, ready);
};

Application.prototype.initialize = function(name, selector, ready) {
    this.graph = new Graph(name, selector);
    this.messager = new Messager(this.graph);
    if (ready) {
        ready(this);
    }
};

Application.prototype.send = function(selector, key, message) {
    this.messager.send(selector, key, message);
};

module.exports = Application;
