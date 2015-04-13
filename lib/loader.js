'use strict';

var HTTP = require('framework-utilities/HTTP');
var Bundle = require('./bundle');
var Evaluator = require('./evaluator');
var Finder = require('./finder');
var HelperFunctions = require('./helper-functions');

var HTML_TYPE = 'html';

function loadSources(names, cb) {
    var urls = [];
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (!Bundle.hasDefinition(name)) {
            urls.push(this.finder.componentURL(name));
        }
    }
    return HTTP.join(urls, function(results) {
        if (cb) {
            return cb(results);
        }
    });
}

function loadSubcomponents(name, partial, cb) {
    var loadables = this.finder.subcomponentURLs(name, partial);
    var urls = [];
    var keys = [];
    for (var loadableKey in loadables) {
        var loadableURL = loadables[loadableKey];
        urls.push(loadableURL);
        keys.push(loadableKey);
    }
    return HTTP.join(urls, function(results) {
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var url = urls[i];
            var key = keys[i];
            var type = this.finder.subcomponentType(url);
            if (type === HTML_TYPE) {
                partial[key] = result;
            }
            else {
                // TODO: Loading of external JavaScript fragments.
                console.error('Unsupported subcomponent `' + key + '`');
            }
        }
        return cb(partial);
    }.bind(this));
}

function loadSource(name, cb) {
    return this.loadSources([name], function(sources) {
        return cb(sources[0]);
    });
}

/* eslint-disable */

function loadComponent(name, partial, final) {
    return this.loadSubcomponents(name, partial, function(full) {
        Bundle.addDefinition(name, full);
        var dependencies = this.finder.findDependencies(full);
        return this.loadDependencies(dependencies, final);
    }.bind(this));
}

function loadDependencies(names, final) {
    if (names.length < 1) {
        if (final) {
            return final();
        }
    }
    return this.loadSources(names, function(sources) {
        return Evaluator.evalSources(sources, this.loadComponent.bind(this), HelperFunctions, final);
    }.bind(this));
}

/* eslint-enable */

function loadEntrypoint(name, final) {
    return this.loadSource(name, function(source) {
        return Evaluator.evalEntrypoint(source, this.loadComponent.bind(this), HelperFunctions, final);
    }.bind(this));
}

function Loader(options) {
    if (!options) {
        options = {};
    }
    this.finder = new Finder(options);
    this.loadComponent = loadComponent.bind(this);
    this.loadDependencies = loadDependencies.bind(this);
    this.loadEntrypoint = loadEntrypoint.bind(this);
    this.loadSource = loadSource.bind(this);
    this.loadSources = loadSources.bind(this);
    this.loadSubcomponents = loadSubcomponents.bind(this);
}

module.exports = Loader;
