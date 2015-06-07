'use strict';

var Lodash = require('lodash');
var Path = require('path');

var BuildHelpers = require('./../build-helpers');
var EsprimaHelpers = require('./../esprima-helpers');
var PathingHelpers = require('./../storage-helpers/pathing');

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

function copyright() {
    var startYear = '2015';
    var currYear = new Date().getFullYear().toString();
    var yearStr = startYear;
    if (currYear !== startYear) {
        yearStr += ('-' + currYear);
    }
    return '// Copyright ' + yearStr + ' (c) Famous Industries, Inc.';
}

function getFlatIncludes(flatIncludes, parcelHash) {
    if (parcelHash.includes) {
        flatIncludes = flatIncludes.concat(parcelHash.includes);
    }
    if (parcelHash.dependencies) {
        for (var dependencyName in parcelHash.dependencies) {
            flatIncludes = getFlatIncludes(flatIncludes, parcelHash.dependencies[dependencyName]);
        }
    }
    return Lodash.uniq(flatIncludes);
}

function buildIncludesPrefix(info) {
    var parcelHash = info.parcelHash;
    var flatIncludes = getFlatIncludes([], parcelHash);
    return 'BEST.includes("' + info.name + '","' + (info.explicitVersion || info.versionRef) + '",' + JSON.stringify(flatIncludes) + ',function(){';
}

function getFlatRegistrations(flatRegistrations, alreadyRegistered, parcelHash) {
    if (parcelHash.entrypoint) {
        flatRegistrations.unshift({
            name: parcelHash.name,
            version: parcelHash.version,
            entrypoint: parcelHash.entrypoint
        });
    }
    if (parcelHash.dependencies) {
        for (var dependencyName in parcelHash.dependencies) {
            getFlatRegistrations(flatRegistrations, alreadyRegistered, parcelHash.dependencies[dependencyName]);
        }
    }
    return flatRegistrations;
}

function buildRegistrationBlocks(parcelHash) {
    var flatRegistrations = getFlatRegistrations([], {}, parcelHash);
    // Remove duplicates from the registration blocks we got.
    // No point in registering them multiple times!
    var uniqRegistrations = [];
    var regTuples = {};
    for (var i = 0; i < flatRegistrations.length; i++) {
        var flatReg = flatRegistrations[i];
        var regKey = flatReg.name + '-' + flatReg.version;
        if (!regTuples[regKey]) {
            regTuples[regKey] = true;
            uniqRegistrations.push(flatReg);
        }
    }
    var flatEntrypoints = Lodash.map(uniqRegistrations, function(regObj) {
        return regObj.entrypoint;
    });
    return flatEntrypoints.join(NEWLINE);
}

function buildIncludesSuffix() {
    return '});';
}

function buildBundleString(info) {
    return [
        copyright(),
        '\'use strict\';',
        buildIncludesPrefix(info),
        indent(buildRegistrationBlocks(info.parcelHash)),
        buildIncludesSuffix(),
        copyright()
    ].join(NEWLINE);
}

function normalizeDependenciesFound(dependenciesFound) {
    var normalized = {};
    for (var depName in dependenciesFound) {
        var depJSON = dependenciesFound[depName];
        if (typeof depJSON === 'string') {
            normalized[depName] = JSON.parse(depJSON);
        }
        else {
            normalized[depName] = depJSON;
        }
    }
    return normalized;
}

function buildEntrypointString(info) {
    try {
        var generated = EsprimaHelpers.generate(info.entrypointAST);
        return generated;
    }
    catch (entrypointBuildErr) {
        // Dear developer:
        // To get insight into what may have failed, try uncommenting this
        // block and inspecting what all of the nodes in the AST are.
        // EsprimaHelpers.traverse(info.entrypointAST, function(node) {
        //     console.log(node);
        // });
        console.error('Esprima says:', entrypointBuildErr);
        console.error('Failed to build `' + info.name + '` (' + info.versionRef + ') entrypoint; this is most likely a problem with the framework build tool');
        return 'console.error("The build of `' + info.name + '` (' + info.versionRef + ') failed; this is most likely a problem with the framework build tool");';
    }
}

function buildParcelHash(info) {
    var includes = BuildHelpers.buildIncludesArray(info);
    var dependencies = normalizeDependenciesFound(info.dependenciesFound);
    return {
        name: info.name,
        version: info.explicitVersion || info.versionRef,
        timestamp: Date.now(),
        includes: includes,
        dependencies: dependencies,
        entrypoint: buildEntrypointString(info)
    };
}

function buildBundle(info, cb) {
    // When building bundles in memory only (no persistence, say, when testing),
    // we might not have either a version ref or an explicit version set; in that
    // case, fall back to the dependency version so that the bundles don't have
    // a bunch of "undefined" versions listed
    if (!info.versionRef && !info.explicitVersion) {
        info.versionRef = this.options.defaultDependencyVersion;
    }

    info.parcelHash = buildParcelHash.call(this, info);
    info.bundleString = buildBundleString.call(this, info);
    cb(null, info);
}

module.exports = buildBundle;
