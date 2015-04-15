'use strict';

var evalInScope = require('./helpers/eval-in-scope');
var HelperFunctions = require('./helper-functions');
var ObjUtils = require('framework-utilities/object');
var Validator = require('./validator');

var ASSET_INTERP_RE = /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig;

function Evaluator(options, finder) {
    this.finder = finder;
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

Evaluator.prototype.evalBEST = function(source, builder, skipValidation) {
    source = this.expandAssets(source);
    var bestNamespace = ObjUtils.merge(HelperFunctions, { component: builder });
    if (!skipValidation) {
        Validator.validateSource(source);
    }
    return evalInScope(source, bestNamespace);
}

Evaluator.prototype.evalSources = function(sources, proc, cb) {
    var sourcesLength = sources.length;
    var sourcesLoaded = 0;
    if (sourcesLength === sourcesLoaded) {
        if (cb) {
            return cb();
        }
    }
    for (var i = 0; i < sourcesLength; i++) {
        this.evalDependency(sources[i], proc, function() {
            if (++sourcesLoaded === sourcesLength) {
                if (cb) {
                    return cb();
                }
            }
        });
    }
}

Evaluator.prototype.evalEntrypoint = function(source, proc, final) {
    return this.evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    });
}

Evaluator.prototype.evalDependency = function(source, proc, final) {
    return this.evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    });
}

Evaluator.prototype.evalFragment = function(source, proc) {
    return this.evalBEST(source, proc, true);
}

/*eslint-enable*/

module.exports = Evaluator;
