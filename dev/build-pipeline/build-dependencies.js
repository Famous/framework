'use strict';

var Async = require('async');
var each = require('lodash.foreach');

function buildDependency(name, version, files, originalData, cb) {
    return Async.waterfall([
        function(cb) {
            // Since we need to build the component in order to fully understand
            // what its own dependencies are, we end up with a recursive build
            // process. Each build has a 'data' object, but we also don't want
            // to waste effort by loading dependencies that we've already gotten,
            // so we pass along the original dependencies loaded so this can be
            // checked against at each pass.
            cb(null, name, files, {
                dependenciesLoaded: originalData.dependenciesLoaded
            });
        },

        require('./preprocess-assets'),
        require('./extract-artifacts'),
        require('./link-facets'),
        require('./expand-imports'),
        require('./find-dependencies'),
        require('./load-dependencies'),
        require('./build-dependencies'),
        require('./expand-syntax')
    ], function(recursiveBuildErr, nameOut, filesOut, data) {
        if (recursiveBuildErr) {
            return cb(recursiveBuildErr);
        }

        return cb(null, [nameOut, version, filesOut, data]);
    });
}

function buildDependencyTuple(tuple, cb) {
    return buildDependency(tuple[0], tuple[1], tuple[2], tuple[3], cb);
}

function buildDependencies(name, files, data, finish) {
    each(data.dependencyTuples, function(tuple) {
        // Pass the original 'data' object through in case we
        // need to add anything to the recursive build process
        tuple.push(data);
    });

    Async.map(data.dependencyTuples, buildDependencyTuple, function(buildDepErr, builtDependencyTuples) {
        if (buildDepErr) {
            return finish(buildDepErr);
        }

        data.builtDependencyTuples = builtDependencyTuples;

        return finish(null, name, files, data);
    });
}

module.exports = buildDependencies;
