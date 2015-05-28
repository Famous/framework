'use strict';

var Es = require('./../es');
var Lodash = require('lodash');

/**
 * The Builder's job is to take a compilation object (the object
 * created by the compiler) and to construct strings that can
 * later be written out to the bundle files for the module.
 * (This module doesn't do any IO; it's just a string builder).
 */

function Builder(options) {
    this.options = Lodash.defaults(Lodash.clone(Builder.DEFAULTS || {}), Lodash.clone(options || {}));
}

var OPEN_ARRAY = '[';
var CLOSE_ARRAY = ']';
var QUOTE = '\'';
var COMMA = ',';
var NEWLINE = '\n';
var NEWLINE_REGEXP = /\n/g;
var TAB = '  ';

Builder.DEFAULTS = {
    iifePrefix: '\n(function(){\n',
    iifeSuffix: '\n}());'
};

// Object, Object -> String
Builder.buildBundle = function(compilation, options, cb) {
    var builder = new Builder(options);
    try {
        var importTupleString = builder.buildImportTupleString(compilation.dependencyTable, compilation.configs);
        var mainCodeBlock = builder.buildMainCodeBlock(compilation.moduleName, compilation.moduleTag, compilation.entrypointAST);
        var bundleSource = builder.buildBundleSource(compilation.moduleName, compilation.moduleTag, importTupleString, mainCodeBlock);
        cb(null, bundleSource);
    }
    catch (e) {
        cb(e);
    }
};

// String -> String
function indent(str) {
    return (TAB + str).replace(NEWLINE_REGEXP, NEWLINE + TAB);
}

// String, String -> String
Builder.prototype.buildBundleSource = function(moduleName, moduleTag, importTupleString, mainCodeBlock) {
    return '\nBEST.requires(\'' + moduleName + '\',\'' + moduleTag + '\',[\n' +
           importTupleString +
           '\n],function(){\n' +
           mainCodeBlock +
           '\n\n});';
};

// String, String, AST{Object} -> String
Builder.prototype.buildMainCodeBlock = function(moduleName, moduleTag, ast) {
    var mainCode = indent(Es.generate(ast));
    var isolatedCode = indent(this.isolateWrap(moduleName, moduleTag, mainCode));
    return isolatedCode;
};

// Object -> Array
Builder.prototype.buildImportTupleString = function(dependencyTable, configs) {
    var importTupleStrings = [];
    for (var moduleName in dependencyTable) {
        var moduleTag = dependencyTable[moduleName];
        importTupleStrings.push(
            OPEN_ARRAY +
            QUOTE + moduleName + QUOTE + COMMA +
            QUOTE + moduleTag + QUOTE +
            CLOSE_ARRAY
        );
    }
    for (var i = 0; i < configs.length; i++) {
        var conf = configs[i];
        var includes = conf.includes;
        if (includes) {
            for (var j = 0; j < includes.length; j++) {
                var incl = includes[j];
                importTupleStrings.push(
                    OPEN_ARRAY +
                    QUOTE + incl + QUOTE +
                    CLOSE_ARRAY
                );
            }
        }
    }
    return importTupleStrings.join(COMMA + NEWLINE);
};

// String -> String
Builder.prototype.iifeWrap = function(code) {
    return this.options.iifePrefix + code + this.options.iifeSuffix;
};

// String, String -> String
Builder.prototype.commentHeading = function(moduleName, moduleTag) {
    return '\n/* ' + moduleName + ' (' + moduleTag + ') ' + Date.now() + ' */';
};

// String, String, String -> String
Builder.prototype.isolateWrap = function(moduleName, moduleTag, code) {
    return this.commentHeading(moduleName, moduleTag) + this.iifeWrap(code);
};

module.exports = Builder;
