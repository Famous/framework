'use strict';

var Fs = require('fs');
var Path = require('path');

var EsprimaHelpers = require('./helpers/esprima');
var Config = require('./config/config');

var FSLASH = '/';
var NEWLINE = '\n';
var NEWLINE_REGEXP = /\n/g;
var TAB = '    '; // 4 spaces!
var SAFE_NAMESPACE_DELIMITER = '~';

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

function iterateDependenciesIn(data, iterator) {
    for (var i = 0; i < data.builtDependencyTuples.length; i++) {
        var tuple = data.builtDependencyTuples[i];

        iterator(tuple[0], tuple[1], tuple[2], tuple[3]);
    }
}

function componentRelativeURL(name, version) {
    return name.split(Config.get('componentDelimiter')).join(FSLASH);
}

function componentNameSafeDelimited(name, version) {
    return name.split(Config.get('componentDelimiter')).join(SAFE_NAMESPACE_DELIMITER);
}

function expandBaseURLTokens(name, version, string) {
    var baseURLToken = Config.get('baseURLToken');
    var fixedString = string.split(baseURLToken).join(componentRelativeURL(name, version) + FSLASH);
    return fixedString;
}

function expandBaseURLSyntax(name, version, entrypointAST) {
    EsprimaHelpers.eachStringLiteral(entrypointAST, function(value, node, parent) {
        node.value = expandBaseURLTokens(name, version, value);
    });
}

function buildEntrypointString(name, version, data) {
    try {
        expandBaseURLSyntax(name, version, data.entrypointAST);
        return EsprimaHelpers.generate(data.entrypointAST);
    }
    catch (entrypointBuildErr) {
        console.error('Esprima says:', entrypointBuildErr);
        console.error('Failed to build `' + name + '` (' + version + ') entrypoint; this is most likely a problem with the framework build tool');
        // Inline an error message so that the developer sees this in the browser too
        return 'console.error("The build of `' + name + '` (' + version + ') failed; this is most likely a problem with the framework build tool");';
    }
}

function buildCodeBlock(name, version, data) {
    var codeBlock = [];
    codeBlock.push('(function(){');
    codeBlock.push(indent(buildEntrypointString(name, version, data)));
    codeBlock.push('}());');
    return codeBlock.join(NEWLINE);
}

function buildCodeBlocks(outArray, depsAdded, name, version, data) {
    var depKeys = Object.keys(data.dependencyTable);
    if (depKeys.length > 0) {
        iterateDependenciesIn(data, function(depName, depVersion, depFiles, depData) {
            buildCodeBlocks(outArray, depsAdded, depName, depVersion, depData);
        });
        outArray.push(buildCodeBlock(name, version, data));
        depsAdded.push([name, version]);
    }
    else {
        outArray.unshift(buildCodeBlock(name, version, data));
        depsAdded.unshift([name, version]);
    }
    return outArray.join(NEWLINE);
}

function getIncludeURLs(outArray, name, version, data) {
    for (var i = 0; i < data.moduleConfigObjects.length; i++) {
        var configObject = data.moduleConfigObjects[i];
        var includesArray = configObject[Config.get('includesKeyName')];

        if (includesArray) {
            for (var j = 0; j < includesArray.length; j++) {
                outArray.push(componentRelativeURL(name, version) + FSLASH + includesArray[j]);
            }
        }
    }

    iterateDependenciesIn(data, function(depName, depVersion, depFiles, depData) {
        getIncludeURLs(outArray, depName, depVersion, depData);
    });
}

function buildIncludesPrefix(name, version, data) {
    var includeURLs = [];
    getIncludeURLs(includeURLs, name, version, data);
    return 'FamousFramework.includes("' + name + '", "' + version + '", ' + JSON.stringify(includeURLs) + ', function() {';
}

function buildBundleString(name, files, data) {
    var version = Config.get('defaultDependencyVersion');
    var depsAdded = [];
    var output = [
        copyright(),
        '"use strict";',
        buildIncludesPrefix(name, version, data),
        indent(buildCodeBlocks([], depsAdded, name, version, data)),
        indent('FamousFramework.markComponentAsReady("' + name + '", "' + version + '");'),
        '});'
    ].join(NEWLINE);
    return output;
}

function buildIndexString(name, file, data) {
    // Important: This line needs to remain statically analyzable so it can be
    // substituted by brfs
    var rawString = Fs.readFileSync(Path.join(__dirname, 'templates', 'index.html'), 'utf8');

    var outString = rawString.split('{{componentNameSafeDelimited}}').join(componentNameSafeDelimited(name));
    outString = outString.split('{{componentName}}').join(name);
    outString = outString.split('{{componentVersion}}').join(Config.get('defaultDependencyVersion'));
    outString = outString.split('{{frameworkBundleURL}}').join(Config.get('frameworkBundleURL'));
    return outString;
}

function buildFlatProjectFiles(outArray, name, version, files, data) {
    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        outArray.push({
            path: componentRelativeURL(name, version) + Path.sep + file.path,
            content: file.content
        });
    }

    iterateDependenciesIn(data, function(depName, depVersion, depFiles, depData) {
        buildFlatProjectFiles(outArray, depName, depVersion, depFiles, depData);
    });

    return outArray;
}

function buildBundle(name, files, data, finish) {
    var flatProjectFiles = buildFlatProjectFiles([], name, Config.get('defaultDependencyVersion'), files, data);

    flatProjectFiles.push({
        path: componentNameSafeDelimited(name) + '.bundle.js',
        content: buildBundleString(name, files, data)
    });

    flatProjectFiles.push({
        path: 'index.html',
        content: buildIndexString(name, files, data)
    });

    data.flatProjectFiles = flatProjectFiles;

    return finish(null, name, files, data);
}

module.exports = buildBundle;
