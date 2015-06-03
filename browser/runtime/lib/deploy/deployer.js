'use strict';

var ObjUtils = require('./../../../utilities/object');
var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

var PathingHelpers = require('./../../../../shared/builder/lib/build-steps/storage-helpers/pathing');

var SLASH = '/';

function Deployer() {
    this.options = ObjUtils.clone(Deployer.DEFAULTS);
    this.modulesInserted = {};
    this.modulesLoaded = {};
    this.assetsInserted = {};
    this.assetsLoaded = {};
}

Deployer.DEFAULTS = {
    awaitInterval: 10,
    awaitMaxTime: 1000,
    componentDelimiter: ':',
    bundleAssetPath: '~bundles/bundle.js',
    codeManagerHost: process.env.CODE_MANAGER_HOST || 'http://localhost:3000',
    codeManagerApiVersion: 'v1',
    codeManagerAssetGetRoute: 'GET|default|/:apiVersion/blocks/:blockIdOrName/versions/:versionRefOrTag/assets/:assetPath'
};

Deployer.prototype.getModulePath = function(name) {
    return name.split(this.options.componentDelimiter).join(SLASH);
};

Deployer.prototype.getBundleURL = function(name, tag) {
    return PathingHelpers.buildAssetURL.call(this, name, tag, this.options.bundleAssetPath);
};

Deployer.prototype.getAssetURL = function(name, tag, assetPath) {
    return PathingHelpers.buildAssetURL.call(this, name, tag, assetPath);
};

Deployer.prototype.markModuleLoaded = function(name, tag) {
    if (!this.modulesLoaded[name]) {
        this.modulesLoaded[name] = {};
    }
    this.modulesLoaded[name][tag] = true;
};

Deployer.prototype.markModuleInserted = function(name, tag) {
    if (!this.modulesInserted[name]) {
        this.modulesInserted[name] = {};
    }
    this.modulesInserted[name][tag] = true;
};

Deployer.prototype.isAssetInserted = function(url) {
    return !!this.assetsInserted[url];
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
            console.warn('Unexpected asset type `' + format + '`');
            console.warn(url);
            this.assetsLoaded[url] = true;
            cb();
            break;
    }
    this.assetsInserted[url] = true;
};

Deployer.prototype.isModuleInserted = function(name, tag) {
    return !!(this.modulesInserted[name] && this.modulesInserted[name][tag]);
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

Deployer.prototype.insertModule = function(requirement, cb) {
    var name = requirement.name;
    var tag = requirement.version;
    if (requirement.inline) {
        requirement.inline();
        this.markModuleInserted(name, tag);
        this.markModuleLoaded(name, tag);
    }
    else if (requirement.missing || requirement.remote) {
        var url = this.getBundleURL(name, tag);
        console.info('Loading `' + name + '` (' + tag + ') from ' + url);
        this.insertJavaScript(url, function() {
            this.markModuleLoaded(name, tag);
            if (cb) {
                cb(null, name, tag, url);
            }
        }.bind(this));
        this.markModuleInserted(name, tag);
    }
};

Deployer.prototype.everythingLoaded = function() {
    var result = true;
    var inserted = this.modulesInserted;
    var loaded = this.modulesLoaded;
    for (var name in inserted) {
        var versions = inserted[name];
        for (var tag in versions) {
            if (!loaded[name] || !loaded[name][tag]) {
                result = false;
            }
        }
    }
    return result;
};

Deployer.prototype.deploy = function(name, tag, selector) {
    var awaitInterval = this.options.awaitInterval;
    var awaitMaxTime = this.options.awaitMaxTime;
    // Quick shim to be compatible with the `insertModule` API
    var requirementObj = {
        name: name,
        version: tag,
        remote: true
    };
    this.insertModule(requirementObj, function(err, insertedName, insertedTag) {
        if (err) {
            console.error(err);
        }
        var timeSoFar = 0;
        var deployInterval = setInterval(function() {
            timeSoFar += awaitInterval;
            if (this.everythingLoaded()) {
                clearInterval(deployInterval);
                this.execute(insertedName, insertedTag, selector);
            }
            else {
                if (timeSoFar >= awaitMaxTime) {
                    console.error('Gave up waiting on `' + name + '` (' + tag + ')')
                    clearInterval(deployInterval);
                }
            }
            }.bind(this), awaitInterval);
    }.bind(this));
};

Deployer.prototype.postRequireHook = function(name, tag, finish) {
    finish();
};

// Fire the 'finish' callback once all of the elements in 'requires' array
// have been loaded onto the page. 'Requires' is a list of either name-tag
// component desginators, or asset URLs (such as JavaScripts).
Deployer.prototype.requires = function(name, tag, requires, finish) {
    DataStore.saveDependencies(name, tag, requires);
    var requiresLength = requires.length;
    if (requiresLength === 0) {
        return this.postRequireHook(name, tag, finish); // Early return if nothing to do
    }
    var requiresLoaded = 0;
    for (var i = 0; i < requiresLength; i++) {
        var requirement = requires[i];
        if (requirement.type === 'module') {
            if (!this.isModuleInserted(requirement.name, requirement.version)) {
                this.insertModule(requirement, function() {
                    if (++requiresLoaded === requiresLength) {
                        this.postRequireHook(name, tag, finish);
                    }
                }.bind(this));
            }
            else {
                if (++requiresLoaded === requiresLength) {
                    this.postRequireHook(name, tag, finish);
                }
            }
        }
        else if (requirement.type === 'include') {
            var fullURL = this.getAssetURL(name, tag, requirement.path);
            if (!this.isAssetInserted(fullURL)) {
                this.insertAsset(fullURL, function() {
                    if (++requiresLoaded === requiresLength) {
                        this.postRequireHook(name, tag, finish);
                    }
                }.bind(this));
            }
            else {
                if (++requiresLoaded === requiresLength) {
                    this.postRequireHook(name, tag, finish);
                }
            }
        }
    }
};

Deployer.prototype.attach = function(name, tag, selector, executable) {
    DataStore.setAttachment(name, tag, {
        selector: selector,
        executable: executable
    });
};

Deployer.prototype.execute = function(name, tag, selector) {
    var component = Component.executeComponent(name, tag, selector);
    DataStore.saveExecutedComponent(selector, component);
};

module.exports = Deployer;
