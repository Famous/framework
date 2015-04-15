'use strict';

var HTTP = require('framework-utilities/HTTP');
var ObjUtils = require('framework-utilities/object');
var Bundle = require('./bundle');
var Evaluator = require('./evaluator');
var Finder = require('./finder');
var HelperFunctions = require('./helper-functions');
var Importer = require('./importer');
var Jade = require('jade');

var HTML_TYPE = 'html';
var JS_TYPE = 'js';
var JADE_TYPE = 'jade';

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

var STYLESHEETS_LIST_KEY = '@stylesheets';

function loadStylesheets(definition) {
    if (!definition.states) {
        return;
    }
    var stylesheets = definition.states[STYLESHEETS_LIST_KEY];
    if (stylesheets) {
        for (var i = 0; i < stylesheets.length; i++) {
            var stylesheet = stylesheets[i];
            var path = stylesheet.replace(/:/g, '/').replace('|', '/');
            var fullPath = this.finder.componentsHost + '/' + path;
            var link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', fullPath);
            document.head.appendChild(link);
        }
    }
}

var FN_PREFIX = '(function(){\nreturn ';
var FN_SUFFIX = '\n}());';
var BLANK_STR = '';
var NEWLINE_PREAMBLE_RE = /^\n+/i;

function loadSubcomponents(name, partial, cb) {
    var loadables = this.finder.subcomponentURLs(name, partial);
    var urls = [];
    var keys = [];
    for (var loadableKey in loadables) {
        var loadableURL = loadables[loadableKey];
        urls.push(loadableURL);
        keys.push(loadableKey);
    }
    HTTP.join(urls, function(results) {
        for (var i = 0; i < results.length; i++) {
            var result = results[i];
            var url = urls[i];
            var key = keys[i];
            var type = this.finder.subcomponentType(url);
            if (type === HTML_TYPE) {
                partial[key] = this.evaluator.expandAssets(result);
            }
            else if (type === JADE_TYPE) {
                var frag = this.evaluator.expandAssets(result || BLANK_STR);
                partial[key] = Jade.compile(frag)();
            }
            else if (type === JS_TYPE) {
                var wrapped = BLANK_STR;
                // To allow users to define plain objects in their
                // fragment files, we automatically wrap the output
                // string in a function so that we can `eval` it and
                // get that object's result
                wrapped = result.replace(NEWLINE_PREAMBLE_RE, BLANK_STR);
                wrapped = FN_PREFIX + wrapped + FN_SUFFIX;

                var evaled = this.evaluator.evalFragment(wrapped);
                partial[key] = evaled.fragment;
            }
            else {
                // TODO: Loading of other fragments types.
                console.error('Unsupported subcomponent `' + key + '`');
            }
        }
        this.loadStylesheets(partial);
        return cb(partial);
    }.bind(this));
    return this; // allows for chaining of BEST components
}

function loadSource(name, cb) {
    return this.loadSources([name], function(sources) {
        return cb(sources[0]);
    });
}

/* eslint-disable */

// BEST = { component: loadComponent }
function loadComponent(name, partial, final) {
    return this.loadSubcomponents(name, partial, function(full) {
        Importer.importDependencies(full, this.options);
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
        return this.evaluator.evalSources(sources, this.loadComponent.bind(this), final);
    }.bind(this));
}

/* eslint-enable */

function loadEntrypoint(name, final) {
    return this.loadSource(name, function(source) {
        return this.evaluator.evalEntrypoint(source, this.loadComponent.bind(this), final);
    }.bind(this));
}

function config(options) {
    this.options = ObjUtils.merge(this.options, options || {});
    return this;
}

function Loader(options) {
    this.options = options || {};
    this.finder = new Finder(options);
    this.evaluator = new Evaluator(options, this.finder);
    this.loadComponent = loadComponent.bind(this);
    this.loadDependencies = loadDependencies.bind(this);
    this.loadEntrypoint = loadEntrypoint.bind(this);
    this.loadSource = loadSource.bind(this);
    this.loadSources = loadSources.bind(this);
    this.loadStylesheets = loadStylesheets.bind(this);
    this.loadSubcomponents = loadSubcomponents.bind(this);
    this.config = config.bind(this);
}

module.exports = Loader;
