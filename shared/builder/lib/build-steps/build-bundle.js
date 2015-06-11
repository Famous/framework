'use strict';

var Fs = require('fs');
var Lodash = require('lodash');
var Path = require('path');

var BuildHelpers = require('./../build-helpers');
var EsprimaHelpers = require('./../esprima-helpers');

var NEWLINE = '\n';
var NEWLINE_REGEXP = /\n/g;
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
    return 'FamousFramework.includes("' + info.name + '","' + (info.explicitVersion || info.versionRef) + '",' + JSON.stringify(flatIncludes) + ',function(){';
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

function buildRegistrationBlocks(info) {
    var parcelHash = info.parcelHash;
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
        if (regObj.name === info.name) {
            return regObj.entrypoint;
        }
        else {
            // This AWFUL HACK is to correct a sort of 'off-by-one' error wherein the BUNDLE
            // contents we want to load actually point to a previously established VERSION
            // that we previously saved in code manager
            var origEntrypoint = regObj.entrypoint;
            var versionRefTheyHave = regObj.version;
            var versionRefWeHave = info.dereffedDependencyTable[regObj.name];

            // HACK If for some reason we don't have a verion ref for this item, we pretty
            // much have no choice but to fall back to the original without the swap we
            // would normally do above
            if (versionRefWeHave) {
                var newEntrypoint = origEntrypoint.split(versionRefTheyHave).join(versionRefWeHave);
                return newEntrypoint;
            }
            else {
                return origEntrypoint;
            }
        }
    });
    return flatEntrypoints.join(NEWLINE);
}

function buildExecuteBlock(info) {
    return 'window.onload = function() { FamousFramework.execute("' + info.name + '", "' + info.versionRef + '", "body"); };';
}

function buildIncludesSuffix() {
    return '});';
}

function buildBundleString(info) {
    return [
        copyright(),
        '\'use strict\';',
        buildIncludesPrefix(info),
        indent(buildRegistrationBlocks(info)),
        buildIncludesSuffix(),
        copyright()
    ].join(NEWLINE);
}

function buildBundleExecutableString(info) {
     return [
        copyright(),
        '\'use strict\';',
        buildIncludesPrefix(info),
        indent(buildRegistrationBlocks(info)),
        indent(buildExecuteBlock(info)),
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
/*eslint-disable */
var PROJECT_DIR = Path.join(__dirname, '..', '..', '..', '..');
/*eslint-enable */

// TODO we need to make sure we lock this content to whatever version of
// the framework was used at the given time. Even more ideal, rather than
// writing this to every bundle folder, we could just template out the
// 'executable-bundle.html' to point to a version of the library that had
// been previously CDN'd
// var FRAMEWORK_LIB_STRING = Fs.readFileSync(Path.join(PROJECT_DIR, 'local', 'workspace', 'build', 'famous-framework.bundle.js'));
var FRAMEWORK_EXECUTABLE_PAGE_STRING = Fs.readFileSync(Path.join(__dirname, 'templates', 'executable-bundle.html'));

// function getFrameworkLibraryString() {
//     return FRAMEWORK_LIB_STRING;
// }

function getFrameworkExecutablePageString() {
    return FRAMEWORK_EXECUTABLE_PAGE_STRING;
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
    info.bundleExecutableString = buildBundleExecutableString.call(this, info);
    info.frameworkLibraryString = '';//getFrameworkLibraryString.call(this, info);
    info.frameworkExecutablePageString = getFrameworkExecutablePageString.call(this, info);
    cb(null, info);
}

module.exports = buildBundle;
