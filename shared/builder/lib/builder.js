'use strict';

var Async = require('async');
var Chalk = require('chalk');
var Lodash = require('lodash');

function Builder(options) {
    this.options = Lodash.assign(Lodash.clone(Builder.DEFAULTS || {}), Lodash.clone(options || {}));
    this.buildBundle = require('./build-steps/build-bundle').bind(this);
    this.derefDependencies = require('./build-steps/deref-dependencies').bind(this);
    this.expandImportsShorthand = require('./build-steps/expand-imports-shorthand').bind(this);
    this.expandSyntax = require('./build-steps/expand-syntax').bind(this);
    this.extractCoreObjects = require('./build-steps/extract-core-objects').bind(this);
    this.freezeDependencies = require('./build-steps/freeze-dependencies').bind(this);
    this.findDependencies = require('./build-steps/find-dependencies').bind(this);
    this.linkFacets = require('./build-steps/link-facets').bind(this);
    this.loadDependencies = require('./build-steps/load-dependencies').bind(this);
    this.preprocessFiles = require('./build-steps/preprocess-files').bind(this);
    this.saveAssets = require('./build-steps/save-assets').bind(this);
    this.saveFrameworkInfo = require('./build-steps/save-framework-info').bind(this);
    this.saveBundle = require('./build-steps/save-bundle').bind(this);
}

// Although this builder isn't completely isomorphic yet, at some point
// soon we are going to support running the build process in the browser
// too, which this checks for.
var IS_IN_BROWSER = (typeof window !== 'undefined');

Builder.DEFAULTS = {
    // Persistence and stateful service references
    localRawSourceFolder: null, // The folder where local components are being actively developed
    localBlocksFolder: null, // The folder where block version (and bundles) are stored
    localBlocksCacheFolder: null, // A cache folder also for block version (and bundles) storage
    codeManagerAssetReadHost: null, // Webservice host from which *assets* can be READ
    codeManagerAssetWriteHost: null, // Webservice host to which *assets* can be WRITTEN
    codeManagerVersionInfoHost: null, // Webservice host that can return JSON data about versions
    authHost: null, // Webservice host for Hub authentication/authorization/user info

    // By default, don't try to persist to code manager, since
    // that's too heavyweight a step for many local changes that
    // might occur
    doWriteToCodeManager: false,

    // If you're doing a completely local build, you may want to
    // disable the dependency dereferencing which will make a roundtrip
    // to code manager. This essentially means that all the components
    // you depend on should exist locally and have a HEAD version
    // available
    doSkipDependencyDereferencing: true,

    // If true, this will enable a recursive search for dependencies
    // that may also be located in either the local blocks folder or
    // the local raw source folder. Each dependency found will be built as-is,
    // assigned whatever version was requested, and then added to the
    // bundle of the original component requesting it.
    doAttemptToBuildDependenciesLocally: true,

    // If no dependency for a given component can be found, fallback to
    // 'HEAD' which in code-manager world essentially means "the latest"
    // and which in local-raw-source world essentially means "whatever is"
    // found in the raw source folder for that component. Note that there is
    // some inherent danger in falling back to 'HEAD' since it is a pointer
    // to a potentially changing component
    defaultDependencyVersion: 'HEAD',

    codeManagerApiVersion: 'v1',
    codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath',
    codeManagerBlockCreateRoute: 'POST|default|/:apiVersion/blocks',
    codeManagerBlockGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName',
    codeManagerVersionCreateRoute: 'POST|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions',
    codeManagerVersionUpdateRoute: 'PUT|multipart/form-data|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',
    codeManagerVersionGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag',

    authApiVersion: 'v1',
    authConfigFilePath: '.famous/.config',
    authUserInfoRoute: 'GET|default|/:apiVersion/users',
    authStatusRoute: 'GET|default|/:apiVersion/status',

    // Other persistence miscellany
    assetBlacklist: {
        '.famous/.config': true // This file may contain user secrets
    },
    bundleAssetPath: '~bundles/bundle.js', // Complete file that the client knows how to process
    bundleExecutableAssetPath: '~bundles/bundle-executable.js', // File that includes an 'execute' block (will not work with `deploy`!)
    parcelAssetPath: '~bundles/parcel.json', // Data and dependencies object used for dependency gathering
    frameworkLibraryAssetPath: '~bundles/famous-framework.js',
    frameworkExecutablePageAssetPath: '~bundles/bundle-executable.html',
    defaultDependencyData: undefined,
    doLoadDependenciesFromBrowser: IS_IN_BROWSER,
    doSkipAssetSaveStep: false,
    doSkipBundleSaveStep: false,
    fileOptions: { encoding: 'utf8' },

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
    assetRegexp: /\{\{@[a-zA-Z0-9\:\/\|\.-]+\}\}/ig,
    assetPrefixRegexp: /\}\}$/,
    assetSuffixRegexp: /^\{\{@/,
    attachmentIdentifiers: { 'attach': true },
    behaviorsFacetKeyName: 'behaviors',
    behaviorSetterRegex: /^\[\[[\w|\|]+\]\]$/,
    componentDelimiter: ':', // e.g. my:great:module
    componentDelimiterRegexp: /:/g,
    configMethodIdentifier: 'config', // e.g. FamousFramework.scene(...).config({...})
    defaultExtends: ['famous:core:node'],
    defaultImports: {
        'famous:core': [
            'node'
        ],
        'famous:events': [
            'click',
            'change',
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
            'value',
            'wheel'
        ]
    },
    frameworkFilename: '.famous/framework.json',
    dependenciesKeyName: 'dependencies', // e.g. FamousFramework.scene(...).config({dependencies:{...}})
    dependencyBlacklist: { 'localhost': true },
    dependencyRegexp: /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig,
    entrypointExtnames: { '.js': true },
    eventsFacetKeyName: 'events',
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
    moduleCDNRegexp: /\{\{@CDN_PATH(\|)?(([a-zA-Z0-9\:\.-])?)+\}\}/ig,
    passThroughKey: '$pass-through',
    reservedEventValues: {},
    treeFacetKeyName: 'tree'
};

Builder.prototype.buildModule = function(info, finish) {
    // If we are building this module as part of the dependency resolution
    // process of another module, then this is considered a 'subDependencyCall'
    if (!info.subDependencyCall) {
        console.log('');
        console.log(Chalk.underline(Chalk.gray('famous')), Chalk.underline('Building module ' + info.name));
    }
    else {
        console.log(Chalk.gray('famous'), 'Building dependency ' + info.name + ' ~> ' + info.explicitVersion);
    }

    var subRoutines = [];
    subRoutines.push(this.preprocessFiles);
    subRoutines.push(this.extractCoreObjects);
    subRoutines.push(this.linkFacets);
    subRoutines.push(this.expandImportsShorthand);
    subRoutines.push(this.findDependencies);
    subRoutines.push(this.derefDependencies);
    subRoutines.push(this.freezeDependencies);
    subRoutines.push(this.loadDependencies);
    if (!this.options.doSkipAssetSaveStep) {
        // Note: Skipping this step may assume that already have
        // an 'explicitVersion' set, since only saving assets
        // can give us the version ref for the component.
        subRoutines.push(this.saveAssets.bind(this));
        subRoutines.push(this.saveFrameworkInfo.bind(this));
    }
    subRoutines.push(this.expandSyntax);
    subRoutines.push(this.buildBundle);
    if (!this.options.doSkipBundleSaveStep) {
        subRoutines.push(this.saveBundle.bind(this));
    }
    Async.seq.apply(Async, subRoutines)(info, function(err, result) {
        finish(err, result);
    });
};

module.exports = Builder;
