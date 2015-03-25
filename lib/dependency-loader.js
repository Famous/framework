'use strict';

var array = require('framework-utilities/array');
var Deps = require('./support/deps');
var evalInScope = require('./support/eval-in-scope');

var EMPTY_TREE = '';

/**
 * Wrapper for various functions that handle loading BEST application
 * dependencies from a remote data source.
 */
function DependencyLoader(){}

/**
 * Load the source content for the given BEST component name, passing
 * that source code to the callback.
 */
function loadSource(name, cb) {
    Deps.load([name], {}, function(sources) {
        cb(sources[0]);
    });
}

/**
 * Evaluate BEST component source code using the given `builder` function
 * as the process for the function `BEST.component`
 */
function evalBEST(source, builder) {
    evalInScope(source, { component: builder });
}

/* eslint-disable */

/**
 * Evaluates the top-level BEST component. (I.e., the component whose name)
 * was given via `BEST.deploy('this:thingy')`
 */
function evalEntrypoint(source, cb) {
    evalBEST(source, function(name, definition) {
        return loadComponent(name, definition, {}, cb);
    });
}

/**
 * Evaluates a dependency of the top-level BEST component.
 */
function evalDependency(source, bundle, cb) {
    evalBEST(source, function(name, definition) {
        return loadComponent(name, definition, bundle, cb);
    });
}

/* eslint-enable */

/**
 * Load the BEST component of the given name, passing a bundle of all
 * its dependencies to the given callback.
 */
DependencyLoader.prototype.load = function(name, cb) {
    loadSource(name, function(source) {
        evalEntrypoint(source, cb);
    });
};

/**
 * Given a collection of strings which are source code snippets from
 * BEST components, evaluate those components, firing the callback
 * function when all have finished setup.
 */
function evalSources(sources, bundle, cb) {
    var sourcesLength = sources.length;
    var sourcesLoaded = 0;
    if (sourcesLength === sourcesLoaded) {
        return cb();
    }
    for (var i = 0; i < sourcesLength; i++) {
        evalDependency(sources[i], bundle, function() {
            if (++sourcesLoaded === sourcesLength) {
                cb();
            }
        });
    }
}

/**
 * Given a collection of BEST component name strings, load all of the
 * actual source files, passing along the component bundle in which we
 * are accumulating all of the results. Components already in the bundle
 * will be skipped (i.e. will not be reloaded).
 */
function loadDependencies(deps, bundle, cb) {
    if (deps.length < 1) {
        return cb();
    }
    Deps.load(deps, bundle, function(sources) {
        evalSources(sources, bundle, cb);
    });
}

/**
 * Given a name, a BEST component definition object, a bundle of
 * dependencies and a callback, recursively load all of its
 * dependency components, firing the passed callback only when all
 * of the children have finished.
 */
function loadComponent(name, definition, bundle, cb) {
    var givenTree = definition.tree || EMPTY_TREE;
    Deps.loadTree(name, givenTree, function(treeString) {
        var tree = definition.tree = treeString;
        var behaviors = definition.behaviors || {};
        var deps = array.union(
            Deps.findTreeDeps(tree, name),
            Deps.findBehaviorDeps(behaviors)
        );
        bundle[name] = definition;
        loadDependencies(deps, bundle, function() {
            cb(bundle);
        });
    });
}

module.exports = DependencyLoader;
