'use strict';

var HTTP = require('framework-utilities/HTTP');
var Bundle = require('./bundle');
var Evaluator = require('./evaluator');
var Finder = require('./finder');

var HTML_TYPE = 'html';

function loadSources(names, cb) {
    var urls = [];
    for (var i = 0; i < names.length; i++) {
        var name = names[i];
        if (!Bundle.hasDefinition(name)) {
            urls.push(Finder.componentURL(name));
        }
    }
    return HTTP.join(urls, function(results) {
        if (cb) {
            return cb(results);
        }
    });
}

function loadSubcomponents(name, partial, cb) {
    var loadables = Finder.subcomponentURLs(name, partial);
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
            var type = Finder.subcomponentType(url);
            if (type === HTML_TYPE) {
                partial[key] = result;
            }
            else {
                // TODO: Loading of external JavaScript fragments.
                console.error('Unsupported subcomponent `' + key + '`');
            }
        }
        return cb(partial);
    });
}

function loadSource(name, cb) {
    return loadSources([name], function(sources) {
        return cb(sources[0]);
    });
}

/* eslint-disable */

function loadComponent(name, partial, final) {
    return loadSubcomponents(name, partial, function(full) {
        Bundle.addDefinition(name, full);
        var dependencies = Finder.findDependencies(full);
        return loadDependencies(dependencies, final);
    });
}

function loadDependencies(names, final) {
    if (names.length < 1) {
        return final();
    }
    return loadSources(names, function(sources) {
        return Evaluator.evalSources(sources, loadComponent, final);
    });
}

/* eslint-enable */

function loadEntrypoint(name, final) {
    return loadSource(name, function(source) {
        return Evaluator.evalEntrypoint(source, loadComponent, final);
    });
}

module.exports = {
    loadEntrypoint: loadEntrypoint
};
