'use strict';

var Loader = require('./loader');
var Messager = require('./messager');
var Graph = require('./graph');
var Bundle = require('./bundle');

var DEFAULT_SELECTOR = 'body';

function Application(name, selector, options, ready) {
    if (!options) {
        options = {};
    }
    if (!selector) {
        console.warn('Defaulting to `' + DEFAULT_SELECTOR + '`');
    }
    selector = selector || DEFAULT_SELECTOR;
    this.loader = new Loader(options);
    if (Bundle.hasDefinition(name)) {
        this.initialize(name, selector, ready);
    }
    else {
        this.loader.loadEntrypoint(name, function() {
            this.initialize(name, selector, ready);
        }.bind(this));
    }
}

Application.deploy = function(name, selector, options, ready) {
    return new Application(name, selector, options, ready);
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
