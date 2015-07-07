'use strict';

var assign = require('lodash.assign');
var clone = require('lodash.clone');

var options = {
    localSourceFolder: null,
    defaultDependencyVersion: 'HEAD',
    frameworkBundleURL: 'famous-framework.bundle.js',
    fileOptions: { encoding: 'utf8' },
    // Content and assets
    assetTypes: { '.eot': true, '.gif': true, '.ico': true, '.jpeg': true, '.jpg': true, '.otf': true, '.png': true, '.svg': true, '.ttf': true, '.txt': true, '.woff': true, '.woff2': true },
    binaryTypes: { '.eot': true, '.gif': true, '.ico': true, '.jpeg': true, '.jpg': true, '.otf': true, '.png': true, '.ttf': true, '.woff': true, '.woff2': true },
    contentTypeFallback: 'application/octet-stream',
    contentTypeMap: { '.css': 'text/css', '.eot': 'application/vnd.ms-fontobject', '.gif': 'image/gif', '.html': 'text/html', '.htm': 'text/html', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'application/javascript', '.json': 'application/json', '.markdown': 'text/x-markdown', '.md': 'text/x-markdown', '.otf': 'font/opentype', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'application/octet-stream', '.txt': 'text/plain', '.woff': 'application/x-font-woff', '.woff2': 'application/font-woff2', '.xhtml': 'text/html', '.xml': 'application/xml' },
    // Parsing / processing
    attachmentIdentifiers: { 'attach': true },
    baseURLToken: '{{BASE_URL}}',
    behaviorsFacetKeyName: 'behaviors',
    behaviorSetterRegex: /^\[\[[\w|\|]+\]\]$/,
    componentDelimiter: ':', // e.g. my:great:module
    componentDelimiterRegexp: /:/g,
    configMethodIdentifier: 'config', // e.g. FamousFramework.scene(...).config({...})
    defaultExtends: ['famous:core:node'],
    defaultImports: {
        'famous:core': [ 'node' ],
        'famous:events': [
            // FamousEngine supported events
            'abort', 'beforeinput', 'blur', 'click', 'compositionend', 'compositionstart',
            'compositionupdate', 'dblclick', 'focus', 'focusin', 'focusout', 'input',
            'keydown', 'keyup', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout',
            'mouseover', 'mouseup', 'scroll', 'select', 'wheel', 'touchcancel',
            'touchend', 'touchmove ', 'touchstart',
            // Gestures
            'drag', 'tap', 'pinch', 'rotate',
            // Size Events
            'size-change', 'parent-size-change'
        ]
    },
    dependencyBlacklist: { 'localhost': true },
    dependencyRegexp: /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig,
    entrypointExtnames: { '.js': true },
    eventsFacetKeyName: 'events',
    includesKeyName: 'includes',
    importsKeyName: 'imports', // e.g. FamousFramework.scene(...).config({imports:{...}})
    indexOfModuleNameArgument: 0, // e.g. FamousFramework.scene('THIS STRING', {...})
    indexOfModuleDefinitionArgument: 1, // e.g. FamousFramework.scene('foo'. {THIS OBJECT})
    indexOfModuleConfigArgument: 0, // e.g. FamousFramework.scene(...).config({THIS OBJECT})
    libraryInvocationIdentifiers: {
        'module': true, // FamousFramework.module(...) // All these are equivalent on the client
        'component': true, // FamousFramework.component(...)
        'scene': true // FamousFramework.scene(...)
    },
    libraryMainNamespace: 'FamousFramework',
    passThroughKey: '$pass-through',
    reservedEventValues: {},
    treeFacetKeyName: 'tree'
};

module.exports = {
    get: function(key) {
        return options[key];
    },
    set: function(key, value) {
        options[key] = value;
    },
    assign: function(others) {
        options = assign(clone(options || {}), clone(others || {}));
    }
};
