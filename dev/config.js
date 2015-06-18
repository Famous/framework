var Lodash = require('lodash');
var Path = require('path');

// Although this builder isn't completely isomorphic yet, at some point
// soon we are going to support running the build process in the browser
// too, which this checks for.
var IS_IN_BROWSER = (typeof window !== 'undefined');

var options = {
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

    // If true, we will write a .famous/framework.json file with locked
    // versions of the dependencies we have just resolved. This can be useful
    // if you want to guarantee that your component has the same dependencies
    // on every change. (As opposed to doing constant re-resolution.)
    doFreezeDependencies: false,

    // If no dependency for a given component can be found, fallback to
    // 'HEAD' which in code-manager world essentially means "the latest"
    // and which in local-raw-source world essentially means "whatever is"
    // found in the raw source folder for that component. Note that there is
    // some inherent danger in falling back to 'HEAD' since it is a pointer
    // to a potentially changing component
    defaultDependencyVersion: 'HEAD',

    // If true, skips the part where we build the 'executable' files, i.e.
    // the standalone builds that can be just loaded into the browser and
    // executed
    doSkipExecutableBuild: true,

    codeManagerApiVersion: 'v1',
    codeManagerAssetGetRoute: 'GET|default|' + '/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath'.replace('/', Path.sep),
    codeManagerBlockCreateRoute: 'POST|default|' + '/:apiVersion/blocks'.replace('/', Path.sep),
    codeManagerBlockGetRoute: 'GET|default|' + '/:apiVersion/blocks/:blockIdOrName'.replace('/', Path.sep),
    codeManagerVersionCreateRoute: 'POST|multipart/form-data|' + '/:apiVersion/blocks/:blockIdOrName/versions'.replace('/', Path.sep),
    codeManagerVersionUpdateRoute: 'PUT|multipart/form-data|' + '/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag'.replace('/', Path.sep),
    codeManagerVersionGetRoute: 'GET|default|' + '/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag'.replace('/', Path.sep),

    authApiVersion: 'v1',
    authConfigFilePath: Path.join('.famous', '.config'),
    authUserInfoRoute: 'GET|default|' + '/:apiVersion/users'.replace('/', Path.sep),
    authStatusRoute: 'GET|default|' + '/:apiVersion/status'.replace('/', Path.sep),

    bundleBasePath: '~bundles',
    bundleAssetPath: Path.join('~bundles', 'bundle.js'), // Complete file that the client knows how to process
    parcelAssetPath: Path.join('~bundles', 'parcel.json'), // Data and dependencies object used for dependency gathering
    bundleIndexPath: Path.join('~bundles', 'index.html'),
    bundleExecutablePath: Path.join('~bundles', 'build.js'),

    defaultDependencyData: undefined,
    doLoadDependenciesFromBrowser: IS_IN_BROWSER,
    doSkipAssetSaveStep: false,
    doSkipBundleSaveStep: false,
    fileOptions: { encoding: 'utf8' },

    // Content and assets
    assetTypes: { '.eot': true, '.gif': true, '.ico': true, '.jpeg': true, '.jpg': true, '.otf': true, '.png': true, '.svg': true, '.ttf': true, '.txt': true, '.woff': true, '.woff2': true },
    binaryTypes: { '.eot': true, '.gif': true, '.ico': true, '.jpeg': true, '.jpg': true, '.otf': true, '.png': true, '.ttf': true, '.woff': true, '.woff2': true },
    contentTypeFallback: 'application/octet-stream',
    contentTypeMap: { '.css': 'text/css', '.eot': 'application/vnd.ms-fontobject', '.gif': 'image/gif', '.html': 'text/html', '.htm': 'text/html', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg', '.jpg': 'image/jpeg', '.js': 'application/javascript', '.json': 'application/json', '.markdown': 'text/x-markdown', '.md': 'text/x-markdown', '.otf': 'font/opentype', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'application/octet-stream', '.txt': 'text/plain', '.woff': 'application/x-font-woff', '.woff2': 'application/font-woff2', '.xhtml': 'text/html', '.xml': 'application/xml' },

    // Parsing / processing
    assetRegexp: /\{\{@[a-zA-Z0-9\:\/\\\|\.-]+\}\}/ig,
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
        'famous:core': [ 'node' ],
        'famous:events': [ 'click', 'change', 'dblclick', 'drag', 'input', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseenter', 'mouseleave', 'mouseout', 'mouseover', 'mouseup', 'size-change', 'parent-size-change', 'touchstart', 'touchmove', 'touchend', 'wheel' ]
    },
    frameworkFilename: Path.join('.famous', 'framework.json'),
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

options.assetBlacklist = {};
options.assetBlacklist[Path.join('.famous', '.config')] = true;

module.exports = {
    get: function(key) {
        return options[key];
    },
    set: function(key, value) {
        options[key] = value;
    },
    assign: function(others) {
        options = Lodash.assign(Lodash.clone(options || {}), Lodash.clone(others || {}));
    }
};
