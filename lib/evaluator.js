'use strict';

var evalInScope = require('./helpers/eval-in-scope');
var HelperFunctions = require('./helper-functions');
var ObjUtils = require('framework-utilities/object');
var Validator = require('./validator');

/*eslint-disable*/

function evalBEST(source, builder) {
    var bestNamespace = ObjUtils.merge(HelperFunctions, { component: builder });
    Validator.validateSource(source);
    evalInScope(source, bestNamespace);
}

function evalSources(sources, proc, cb) {
    var sourcesLength = sources.length;
    var sourcesLoaded = 0;
    if (sourcesLength === sourcesLoaded) {
        if (cb) {
            return cb();
        }
    }
    for (var i = 0; i < sourcesLength; i++) {
        evalDependency(sources[i], proc, function() {
            if (++sourcesLoaded === sourcesLength) {
                if (cb) {
                    return cb();
                }
            }
        });
    }
}

function evalEntrypoint(source, proc, final) {
    evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    });
}

function evalDependency(source, proc, final) {
    evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    });
}

/*eslint-enable*/

module.exports = {
    evalDependency: evalDependency,
    evalEntrypoint: evalEntrypoint,
    evalSources: evalSources
};
