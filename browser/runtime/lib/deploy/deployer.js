'use strict';

var ObjUtils = require('./../../../utilities/object');
var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

var PathingHelpers = require('./../../../../shared/builder/lib/storage-helpers/pathing');

var SLASH = '/';

function Deployer() {
    this.options = ObjUtils.clone(Deployer.DEFAULTS);
    this.assetsLoaded = {};
    this.assetsInserted = {};
    this.awaitInterval = 16;
    this.includesReady = {};
}

Deployer.DEFAULTS = {
    componentDelimiter: ':',
    bundleAssetPath: '~bundles/bundle.js',
    codeManagerAssetReadHost: process.env.FF_ASSET_READ_HOST,
    codeManagerApiVersion: 'v1',
    codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath'
};

if (!Deployer.DEFAULTS.codeManagerAssetReadHost || Deployer.DEFAULTS.codeManagerAssetReadHost === 'undefined') {
    throw new Error('To build the runtime, you must specify a `FF_ASSET_READ_HOST`/`options.codeManagerAssetReadHost`');
}

Deployer.prototype.getModulePath = function(name) {
    return name.split(this.options.componentDelimiter).join(SLASH);
};

Deployer.prototype.getBundleURL = function(name, tag) {
    return PathingHelpers.buildAssetURL.call(this, name, tag, this.options.bundleAssetPath);
};

Deployer.prototype.getAssetURL = function(name, tag, assetPath) {
    return PathingHelpers.buildAssetURL.call(this, name, tag, assetPath);
};

Deployer.prototype.insertAsset = function(url, cb) {
    var parts = url.split('.');
    var format = parts[parts.length - 1];
    switch (format) {
        case 'js':
            this.insertJavaScript(url, function() {
                this.assetsLoaded[url] = true;
                cb();
            }.bind(this));
            break;
        case 'css':
            this.insertStylesheet(url, function() {
                this.assetsLoaded[url] = true;
                cb();
            }.bind(this));
            break;
        case 'html':
            this.insertHTML(url, function() {
                this.assetsLoaded[url] = true;
                cb();
            }.bind(this));
            break;
        default:
            console.warn('Unexpected include type `' + format + '` @ ' + url);
            this.assetsLoaded[url] = true;
            cb();
            break;
    }
    this.assetsInserted[url] = true;
};

Deployer.prototype.insertStylesheet = function(url, cb) {
    var link = document.createElement('link');
    link.onload = cb;
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url);
    document.head.appendChild(link);
};

Deployer.prototype.insertJavaScript = function(url, cb) {
    var script = document.createElement('script');
    script.onload = cb;
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.head.appendChild(script);
};

Deployer.prototype.insertHTML = function(url, cb) {
    var link = document.createElement('link');
    link.onload = cb;
    link.setAttribute('rel', 'import');
    link.setAttribute('type', 'text/html');
    link.setAttribute('href', url);
    document.body.appendChild(link);
};

// Process any includes (remote URLs) and fire the callback
Deployer.prototype.includes = function(moduleName, moduleTag, includeURLs, cb) {
    var includesLength = includeURLs.length;
    var includesLoaded = 0;
    if (includesLength < 1) {
        cb();
        this.includesReady[moduleName] = {};
        this.includesReady[moduleName][moduleTag] = [];
    }
    for (var i = 0; i < includeURLs.length; i++) {
        var includeURL = includeURLs[i];
        this.insertAsset(includeURL, function() {
            if (++includesLoaded === includesLength) {
                cb();
                this.includesReady[moduleName] = {};
                this.includesReady[moduleName][moduleTag] = includeURLs;
            }
        }.bind(this));
    }
};

// Return T/F if the given includes are ready
Deployer.prototype.areIncludesReady = function(moduleName, moduleTag) {
    return !!this.includesFor(moduleName, moduleTag);
};

// Return the includes for a given module/tag pair
Deployer.prototype.includesFor = function(moduleName, moduleTag) {
    return this.includesReady[moduleName] && this.includesReady[moduleName][moduleTag];
};

// Run the given callback when all includes for the given module are done.
Deployer.prototype.whenIncludesAreReady = function(moduleName, moduleTag, cb) {
    if (this.areIncludesReady(moduleName, moduleTag)) {
        cb(null, this.includesFor(moduleName, moduleTag));
    }
    else {
        var calledBackAlready = false;
        var includesWatcher = setInterval(function() {
            if (this.areIncludesReady(moduleName, moduleTag)) {
                clearInterval(includesWatcher);
                if (!calledBackAlready) {
                    calledBackAlready = true;
                    cb(null, this.includesFor(moduleName, moduleTag));
                }
            }
        }.bind(this), this.awaitInterval);
    }
};

// Load the given module and kick off the rendering process
Deployer.prototype.deploy = function(moduleName, moduleTag, selector) {
    var bundleURL = this.getBundleURL(moduleName, moduleTag);
    console.info('Deploying', bundleURL);
    this.insertJavaScript(bundleURL, function() {
        // This can be called before the includes have finished loading
        this.whenIncludesAreReady(moduleName, moduleTag, function() {
            this.execute(moduleName, moduleTag, selector);
        }.bind(this));
    }.bind(this));
};

// Attach an attachment to a the current module
Deployer.prototype.attach = function(name, tag, selector, executable) {
    DataStore.setAttachment(name, tag, {
       selector: selector,
       executable: executable
    });
};

// Execute a component that has already been registered
Deployer.prototype.execute = function(name, tag, selector) {
    var component = Component.executeComponent(name, tag, selector);
    DataStore.saveExecutedComponent(selector, component);
};

module.exports = Deployer;
