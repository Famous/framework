'use strict';

var Lodash = require('lodash');

var EsprimaHelpers = require('./esprima-helpers');
var PathingHelpers = require('./storage-helpers/pathing');

var CLOSE_ARRAY = ']';
var COMMA = ',';
var NEWLINE = '\n';
var NEWLINE_REGEXP = /\n/g;
var OPEN_ARRAY = '[';
var QUOTE = '\'';
var TAB = '    '; // 4 spaces!

function indent(str) {
    return (TAB + str).replace(NEWLINE_REGEXP, NEWLINE + TAB);
}

function iifeWrap(code) {
    return '(function(){\n' + code + '\n}());';
}

function commentHeading(moduleName, moduleTag) {
    return '/* ' + moduleName + ' (' + moduleTag + ') built at ' + Date.now() + ' */';
}

function copyright() {
    return '// Copyright 2015 (c) Famous Industries, Inc.';
}

function isolateWrap(moduleName, moduleTag, code) {
    return [
        commentHeading(moduleName, moduleTag),
        iifeWrap(code)
    ].join(NEWLINE);
}

function buildRequiresStatement(moduleName, versionRef) {
    return 'BEST.requires(\'' + moduleName + '\',\'' + versionRef + '\', [';
}

function localValue(val) {
    if (Lodash.isString(val)) {
        return '"' + val + '"';
    }
    else if (Lodash.isFunction(val)) {
        var fnStr = val();
        return '(function(){\n' + indent(fnStr) + '\n}())';
    }
    else if (val === true) {
        return 'true';
    }
    else if (val === false) {
        return 'false';
    }
    else if (val === null) {
        return 'null';
    }
    else {
        return 'undefined';
    }
}

function objectTemplate(locals) {
    var open = '{';
    var close = '}';
    var props = [];
    for (var localName in locals) {
        var localVal = locals[localName];
        props.push('"' + localName + '": ' + localValue(localVal));
    }
    return [
        open,
        props.join(',' + NEWLINE),
        close
    ].join(NEWLINE);
}

function buildInlineModuleTupleString(name, version, data) {
    return objectTemplate({
        type: 'module',
        name: name,
        version: version,
        inline: function(){ return data; } // A function here signifies a function to run on the client-side
    });
}

function buildMissingModuleTupleString(name, version) {
    return objectTemplate({
        type: 'module',
        name: name,
        version: version,
        missing: true
    });
}

function buildImportTuplesStatement(dependencyTable, dependencies, moduleConfigs) {
    var importTupleStrings = [];
    for (var depName in dependencyTable) {
        var depVersion = dependencyTable[depName];
        var depObject = dependencies[depName];
        if (depObject.version === depVersion) {
            // Data we get might be a buffer object, so we have to stringify
            if (depData) {
                var depData = depObject.data.toString();
                importTupleStrings.push(buildInlineModuleTupleString(depName, depVersion, depData));
            }
            else {
                importTupleStrings.push(buildMissingModuleTupleString(depName, depVersion));
            }
        }
    }
    return importTupleStrings.join(COMMA + NEWLINE);
}

function buildMainCodeBlock(moduleName, versionRef, entrypointAST) {
    return isolateWrap(moduleName, versionRef, indent(EsprimaHelpers.generate(entrypointAST)));
}

function buildBundle(info, cb) {
    var bundleString = [
        copyright(),
        '\'use strict\';',
        buildRequiresStatement(info.name, info.versionRef),
        buildImportTuplesStatement(info.dereffedDependencyTable, info.dependencies, info.moduleConfigs),
        '],function(){',
        buildMainCodeBlock(info.name, info.versionRef, info.entrypointAST),
        '});',
        copyright()
    ].join(NEWLINE);
    info.bundleString = bundleString;
    cb(null, info);
}

module.exports = buildBundle;
