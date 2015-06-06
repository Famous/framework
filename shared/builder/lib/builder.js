'use strict';

var Async = require('async');
var Lodash = require('lodash');

function Builder(options) {
    this.options = Lodash.assign(Lodash.clone(Builder.DEFAULTS || {}), Lodash.clone(options || {}));
    this.buildBundle = require('./build-steps/build-bundle').bind(this);
    this.derefDependencies = require('./build-steps/deref-dependencies').bind(this);
    this.expandImportsShorthand = require('./build-steps/expand-imports-shorthand').bind(this);
    this.expandSyntax = require('./build-steps/expand-syntax').bind(this);
    this.extractCoreObjects = require('./build-steps/extract-core-objects').bind(this);
    this.findDependencies = require('./build-steps/find-dependencies').bind(this);
    this.linkFacets = require('./build-steps/link-facets').bind(this);
    this.loadDependencies = require('./build-steps/load-dependencies').bind(this);
    this.preprocessFiles = require('./build-steps/preprocess-files').bind(this);
    this.saveAssets = require('./build-steps/save-assets').bind(this);
    this.saveBundle = require('./build-steps/save-bundle').bind(this);
}

var IS_IN_BROWSER = (typeof window !== 'undefined');

Builder.DEFAULTS = {
    // Persistence related
    bundleAssetPath: '~bundles/bundle.js', // Complete file that the client knows how to process
    parcelAssetPath: '~bundles/parcel.json', // Data and dependencies object used for dependency gathering
    codeManagerHost: process.env.CODE_MANAGER_HOST, // If not Famous CodeManager itself, a simple local server
    codeManagerApiVersion: 'v1',
    codeManagerBlockCreateRoute: 'POST|default|/:apiVersion/blocks',
    codeManagerBlockGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName',
    codeManagerVersionCreateRoute: 'POST|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions',
    codeManagerVersionUpdateRoute: 'PUT|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',
    codeManagerVersionGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',
    codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath',
    defaultDependencyVersion: 'HEAD',
    defaultDependencyData: undefined,
    doAttemptToBuildDependenciesLocally: true,
    doLoadDependenciesFromBrowser: IS_IN_BROWSER,
    doSkipAssetSaveStep: false,
    doSkipBundleSaveStep: false,
    fileOptions: { encoding: 'utf8' },
    localComponentsSourceFolder: process.env.FRAMEWORK_LOCAL_COMPONENTS_SOURCE_FOLDER,
    localDependenciesSourceFolder: process.env.FRAMEWORK_LOCAL_DEPENDENCIES_SOURCE_FOLDER,
    localDependenciesCacheFolder: process.env.FRAMEWORK_LOCAL_DEPENDENCIES_CACHE_FOLDER,
    whereToPersistBuildFiles: 'local',

    // Content and assets
    assetTypes: {
      '.eot': true,
      '.gif': true,
      '.ico': true,
      '.jpeg': true,
      '.jpg': true,
      '.otf': true,
      '.png': true,
      '.svg': true,
      '.ttf': true,
      '.txt': true,
      '.woff': true,
      '.woff2': true
    },
    binaryTypes: {
      '.eot': true,
      '.gif': true,
      '.ico': true,
      '.jpeg': true,
      '.jpg': true,
      '.otf': true,
      '.png': true,
      '.ttf': true,
      '.woff': true,
      '.woff2': true
    },
    contentTypeFallback: 'application/octet-stream',
    contentTypeMap: {
      '.css': 'text/css',
      '.eot': 'application/vnd.ms-fontobject',
      '.gif': 'image/gif',
      '.html': 'text/html',
      '.htm': 'text/html',
      '.ico': 'image/x-icon',
      '.jpeg': 'image/jpeg',
      '.jpg': 'image/jpeg',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.markdown': 'text/x-markdown',
      '.md': 'text/x-markdown',
      '.otf': 'font/opentype',
      '.png': 'image/png',
      '.svg': 'image/svg+xml',
      '.ttf': 'application/octet-stream',
      '.txt': 'text/plain',
      '.woff': 'application/x-font-woff',
      '.woff2': 'application/font-woff2',
      '.xhtml': 'text/html',
      '.xml': 'application/xml'
    },

    // Parsing / processing
    assetRegexp: /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig,
    assetPrefixRegexp: /\}$/,
    assetSuffixRegexp: /^\@\{/,
    attachmentIdentifiers: { 'attach': true },
    behaviorsFacetKeyName: 'behaviors',
    behaviorSetterRegex: /^\[\[[\w|\|]+\]\]$/,
    componentDelimiter: ':', // e.g. my:great:module
    componentDelimiterRegexp: /:/g,
    configMethodIdentifier: 'config', // e.g. BEST.scene(...).config({...})
    defaultExtends: ['famous:core:node'],
    defaultImports: {
        'famous:core': [
            'components',
            'context',
            'dom-element',
            'node',
            'ui-element',
            'view',
            'wrapper'
        ],
        'famous:events': [
            'click',
            'dblclick',
            'keydown',
            'keypress',
            'keyup',
            'mousedown',
            'mousemove',
            'mouseenter',
            'mouseleave',
            'mouseout',
            'mouseover',
            'mouseup',
            'size-change',
            'parent-size-change',
            'touchstart',
            'touchmove',
            'touchend',
            'wheel'
        ]
    },
    dependenciesKeyName: 'dependencies', // e.g. BEST.scene(...).config({dependencies:{...}})
    dependencyBlacklist: { 'localhost': true },
    dependencyRegexp: /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig,
    entrypointExtnames: { '.js': true },
    eventsFacetKeyName: 'events',
    importsKeyName: 'imports', // e.g. BEST.scene(...).config({imports:{...}})
    indexOfModuleNameArgument: 0, // e.g. BEST.scene('THIS STRING', {...})
    indexOfModuleDefinitionArgument: 1, // e.g. BEST.scene('foo'. {THIS OBJECT})
    indexOfModuleConfigArgument: 0, // e.g. BEST.scene(...).config({THIS OBJECT})
    libraryInvocationIdentifiers: {
        'module': true, // BEST.module(...) // All these are equivalent on the client
        'component': true, // BEST.component(...)
        'scene': true // BEST.scene(...)
    },
    libraryMainNamespace: 'BEST',
    moduleCDNRegexp: /\@\{CDN_PATH(\|)?(([a-zA-Z0-9\:\.-])?)+\}/ig,
    passThroughKey: '$pass-through',
    reservedEventValues: {},
    treeFacetKeyName: 'tree'
};

Builder.prototype.buildModule = function(info, finish) {
    var subRoutines = [];
    subRoutines.push(this.preprocessFiles);
    subRoutines.push(this.extractCoreObjects);
    subRoutines.push(this.linkFacets);
    subRoutines.push(this.expandImportsShorthand);
    subRoutines.push(this.findDependencies);
    subRoutines.push(this.derefDependencies);
    subRoutines.push(this.loadDependencies);
    if (!this.options.doSkipAssetSaveStep) {
        // Note: Skipping this step may assume that already have
        // an 'explicitVersion' set, since only saving assets
        // can give us the version ref for the component.
        subRoutines.push(this.saveAssets.bind(this, this.options.whereToPersistBuildFiles));
    }
    subRoutines.push(this.expandSyntax);
    subRoutines.push(this.buildBundle);
    if (!this.options.doSkipBundleSaveStep) {
        subRoutines.push(this.saveBundle.bind(this, this.options.whereToPersistBuildFiles));
    }
    Async.seq.apply(Async, subRoutines)(info, function(err, result) {
        finish(err, result);
    });
};

module.exports = Builder;
