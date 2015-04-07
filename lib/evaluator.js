'use strict';

var evalInScope = require('./helpers/eval-in-scope');

/*eslint-disable*/

function evalBEST(source, builder, extras) {
    evalInScope(source, { component: builder }, extras);
}

function evalSources(sources, proc, extras, cb) {
    var sourcesLength = sources.length;
    var sourcesLoaded = 0;
    if (sourcesLength === sourcesLoaded) {
        if (cb) {
            return cb();
        }
    }
    for (var i = 0; i < sourcesLength; i++) {
        evalDependency(sources[i], proc, extras, function() {
            if (++sourcesLoaded === sourcesLength) {
                if (cb) {
                    return cb();
                }
            }
        });
    }
}

function evalEntrypoint(source, proc, extras, final) {
    evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    }, extras);
}

function evalDependency(source, proc, extras, final) {
    evalBEST(source, function(name, definition) {
        return proc(name, definition, final);
    }, extras);
}

/*eslint-enable*/

module.exports = {
    evalDependency: evalDependency,
    evalEntrypoint: evalEntrypoint,
    evalSources: evalSources
};
