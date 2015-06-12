'use strict';

var Babel = require('babel');
var Less = require('less');
var Path = require('path');
var Stylus = require('stylus');

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

COMPILERS['.less'] = function(source, cb) {
    Less.render(source, function(err, output) {
        if (!err) {
            cb(null, output.css);
        }
        else {
            cb(err);
        }
    });
};

COMPILERS['.stylus'] = function(source, cb) {
    Stylus.render(source, {}, function(err, css) {
        if (!err) {
            cb(null, css);
        }
        else {
            cb(err);
        }
    });
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
    '.es7': '.js',
    '.styl': '.stylus'
};

// The extname each type would normally get after compilation
var COMPILATION_EXTNAME_MAPPING = {
    '.coffee': '.js',
    '.es': '.js',
    '.es6': '.js',
    '.es7': '.js',
    '.less': '.css',
    '.styl': '.css',
    '.stylus': '.css'
};

for (var aliasExtname in ALIASES) {
    var compilerExtname = ALIASES[aliasExtname];
    COMPILERS[aliasExtname] = COMPILERS[compilerExtname];
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
                console.log(err.codeframe);
                result = 'console.log("error in file: ' + path + '");';
                result += 'console.log("' + err.name + ':' + err.message + '")';
                console.log(result);
            }

            return cb(null, {
                path: compiledPath(path),
                content: result
            });
        });
    }
    else {
        cb(null, {
            path: compiledPath(path),
            content: source
        });
    }
}

module.exports = {
    compiledPath: compiledPath,
    compileSource: compileSource
};
