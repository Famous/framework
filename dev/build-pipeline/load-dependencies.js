'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Path = require('path');

var Helpers = require('./helpers/helpers');
var Config = require('./config/config');

function loadDependencyFromLocalFileSystem(name, version, cb) {
    var dependencyRelativePath = name.split(Config.get('componentDelimiter')).join(Path.sep);
    var dependencyAbsolutePath = Path.join(Config.get('localSourceFolder'), dependencyRelativePath);

    Helpers.readFilesRecursive(dependencyAbsolutePath, function(readFilesErr, files) {
        if (readFilesErr) {
            return cb(readFilesErr);
        }

        return cb(null, {
            name: name,
            version: version,
            files: files
        });
    });
}

function loadDependency(dependencyPair, cb) {
    var dependencyName = dependencyPair[0];
    var dependencyVersion = dependencyPair[1];

    // If we wanted to try to load a dependency from a different source,
    // this would be the place to add that condition. On success, the
    // callback expects an object in the following format:
    // { name: 'foo:bar:baz', 
    //   version: '0f3xd...',
    //   files: [{path: 'baz.js', content:'...'}]
    // }
    // The 'version' property is only required in cases where we are
    // trying to load a specific version of a dependency. In most cases
    // we can load whichever one is already available in our store.
    loadDependencyFromLocalFileSystem(dependencyName, dependencyVersion, cb);
}

function loadDependencies(name, files, data, finish) {
    var dependencyPairsAll = Lodash.pairs(data.dependencyTable);

    // Don't load any dependencies that have already been loaded
    var dependencyPairs = Lodash.select(dependencyPairsAll, function(pair) {
        if (data.dependenciesLoaded && data.dependenciesLoaded[pair[0]] && data.dependenciesLoaded[pair[0]][pair[1]]) {
            return false;
        }
        return true;
    });

    Async.map(dependencyPairs, loadDependency, function(depLoadErr, dependencies) {
        if (depLoadErr) {
            return finish(depLoadErr);
        }

        if (!data.dependencyTuples) {
            data.dependencyTuples = [];
        }

        if (!data.dependenciesLoaded) {
            data.dependenciesLoaded = {};
        }

        for (var i = 0; i < dependencies.length; i++) {
            var dependency = dependencies[i];

            if (!data.dependenciesLoaded[dependency.name]) {
                data.dependenciesLoaded[dependency.name] = {};
            }

            if (!data.dependenciesLoaded[dependency.name][dependency.version]) {
                data.dependenciesLoaded[dependency.name][dependency.version] = dependency.files;
                data.dependencyTuples.push([dependency.name, dependency.version, dependency.files]);
            }
        }

        return finish(null, name, files, data);
    });
}

module.exports = loadDependencies;
