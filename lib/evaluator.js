'use strict';

var evalInScope = require('./eval-in-scope');
var Validator = require('./validator');

var ASSET_INTERP_RE = /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig;

function Evaluator(options, loader) {
    this.loader = loader;
    this.finder = this.loader.finder;
}

Evaluator.prototype.expandAssets = function(source) {
    var matches = source.match(ASSET_INTERP_RE);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var assetStr = match.replace(/^\@\{/, '')
                                .replace(/\}$/, '')
                                .replace(/:/g, '/')
                                .replace('|', '/');
            var fullPath = this.finder.componentsHost + '/' + assetStr;
            source = source.split(match).join(fullPath);
        }
    }
    return source;
}

/*eslint-disable*/

Evaluator.prototype.evalBEST = function(source, cb, skipValidation) {
    source = this.expandAssets(source);
    if (!skipValidation) {
        Validator.validateSource(source);
    }
    return evalInScope(source, function(name, definition) {
        return this.loader.loadComponent(name, definition, cb);
    }.bind(this));
}

Evaluator.prototype.evalSources = function(sources, cb) {
    var sourcesLength = sources.length;
    var sourcesLoaded = 0;
    if (sourcesLength === sourcesLoaded) {
        if (cb) {
            return cb();
        }
    }
    for (var i = 0; i < sourcesLength; i++) {
        this.evalDependency(sources[i], function() {
            if (++sourcesLoaded === sourcesLength) {
                if (cb) {
                    return cb();
                }
            }
        });
    }
}

Evaluator.prototype.evalDependency = function(source, cb) {
    return this.evalBEST(source, cb, false);
}

Evaluator.prototype.evalFragment = function(source) {
    return this.evalBEST(source, null, true);
}

/*eslint-enable*/

module.exports = Evaluator;
