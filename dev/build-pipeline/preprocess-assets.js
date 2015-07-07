'use strict';

var Async = require('async');
var Babel = require('babel');
var find = require('lodash.find');
var Path = require('path');

var Helpers = require('./helpers/helpers');

var COMPILERS = {};

COMPILERS['.js'] = function(source, cb) {
    var result;

    try {
        result = Babel.transform(source, {
            // Don't give a name to anonymous functions because then naming collisions
            // may occur which will trigger Babel to modify the function parameter names
            // which then breaks dependency injection
            blacklist: ['spec.functionName'],
            nonStandard: false
        });
    }
    catch (err) {
        return cb(err);
    }

    cb(null, result.code);
};

COMPILERS['.html'] = function(source, cb) {
    cb(null, source);
};

COMPILERS['.json'] = function(source, cb) {
    cb(null, source);
};

COMPILERS['.css'] = function(source, cb) {
    cb(null, source);
};

// Process source for extname in `keys` with compiler for `value`
var ALIASES = {
    '.es': '.js',
    '.es6': '.js',
    '.es7': '.js'
};

// The extname each type would normally get after compilation
var COMPILATION_EXTNAME_MAPPING = {
    '.es': '.js',
    '.es6': '.js',
    '.es7': '.js'
};

for (var aliasExtname in ALIASES) {
    COMPILERS[aliasExtname] = COMPILERS[ALIASES[aliasExtname]];
}

function hasCompilerFor(extname) {
    return !!COMPILERS[extname];
}

function compiledPath(path) {
    var extname = Path.extname(path);
    var basename = Path.basename(path, extname);

    var remappedExtname = COMPILATION_EXTNAME_MAPPING[extname];

    if (remappedExtname) {
        if (remappedExtname !== extname) {
            // e.g. foo.less -> foo.less.css
            return basename + extname + remappedExtname;
        }
        else {
            return basename + remappedExtname;
        }
    }
    else {
        return path;
    }
}

function compileSource(source, path, cb) {
    var extname = Path.extname(path);

    if (hasCompilerFor(extname)) {
        COMPILERS[extname](source, function(err, result) {
            if (err) {
                console.error('\n' + err.name + ':', err.message);
                result = 'console.error("Build process found a syntax error in file: ' + path + '");\n';
                result += 'console.error("' + err.name + ':' + err.message + '")';
            }

            return cb(null, {
                path: compiledPath(path),
                content: result
            });
        });
    }
    else {
        return cb(null, {
            path: compiledPath(path),
            content: source
        });
    }
}

function compileFile(file, cb) {
    if (Helpers.doesFileLookLikeStaticAsset(file)) {
        return cb(null, file);
    }

    return compileSource(file.content.toString(), file.path, cb);
}

function mergeCompiledFiles(rawFiles, compiledFiles) {
    for (var i = 0; i < compiledFiles.length; i++) {
        var compiledFile = compiledFiles[i];

        var existingFile = find(rawFiles, { path: compiledFile.path });

        if (existingFile) {
            // Overwrite the existing file with compiled content
            // in the case that the compiled file path is the same,
            // e.g. foo.js -> foo.js
            existingFile.content = compiledFile.content;
        }
        else {
            rawFiles.push(compiledFile);
        }
    }
}

function preprocessAssets(name, files, data, finish) {
    Async.map(files, compileFile, function(compileErr, compiledFiles) {
        mergeCompiledFiles(files, compiledFiles);

        return finish(null, name, files, data);
    });
}

module.exports = preprocessAssets;
