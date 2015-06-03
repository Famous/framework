'use strict';

var ObjUtils = require('./../../../utilities/object');
var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

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
    bundleFilename: 'bundle.js'
};

Deployer.prototype.getModulePath = function(name) {
    return name.split(this.options.componentDelimiter).join(SLASH);
};

Deployer.prototype.getBundleURL = function(name, tag) {
    return ECOSYSTEM_BASE_URI +
             [this.options.bucket,
              this.getModulePath(name),
              this.options.bundlesFolder,
              tag || this.options.defaultModuleTag,
              this.options.bundleFilename
            ].join(SLASH);
};

Deployer.prototype.getVersionBaseURL = function(name, tag) {
    return ECOSYSTEM_BASE_URI +
             [this.options.bucket,
              this.getModulePath(name),
              this.options.versionsFolder,
              tag || this.options.defaultModuleTag
            ].join(SLASH);
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

Deployer.prototype.insertModule = function(name, tag, cb) {
    var url = this.getBundleURL(name, tag);
    this.insertJavaScript(url, function() {
        this.markModuleLoaded(name, tag);
        if (cb) {
            cb(null, name, tag, url);
        }
    }.bind(this));
    this.markModuleInserted(name, tag);
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
    this.insertModule(name, tag, function(err, insertedName, insertedTag) {
        if (err) {
            console.error(err);
        }
        var deployInterval = setInterval(function() {
            if (this.everythingLoaded()) {
                clearInterval(deployInterval);
                this.execute(insertedName, insertedTag, selector);
            }
        }.bind(this), awaitInterval);
    }.bind(this));
};

Deployer.prototype.postRequireHook = function(name, tag, finish) {
    finish();
};

Deployer.prototype.looksLikeModuleRequire = function(name, tag) {
    var parts = name.split('.');
    var lastPart = parts[parts.length - 1];
    return tag && tag.length && lastPart.indexOf(this.options.componentDelimiter) !== -1;
};

// Fire the 'finish' callback once all of the elements in 'requires' array
// have been loaded onto the page. 'Requires' is a list of either name-tag
// component desginators, or asset URLs (such as JavaScripts).
Deployer.prototype.requires = function(name, tag, requires, finish) {
    DataStore.saveDependencies(name, tag, requires);
    var versionBaseURL = this.getVersionBaseURL(name, tag);

    var requiresLength = requires.length;
    if (requiresLength === 0) {
        return this.postRequireHook(name, tag, finish); // Early return if nothing to do
    }
    var requiresLoaded = 0;
    for (var i = 0; i < requiresLength; i++) {
        var requireName = requires[i][0];
        var requireTag = requires[i][1];
        if (this.looksLikeModuleRequire(requireName, requireTag)) {
            if (!this.isModuleInserted(requireName, requireTag)) {
                this.insertModule(requireName, requireTag, function() {
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
        else {
            var requireURL = requireName;
            var fullURL = versionBaseURL + SLASH + requireURL;
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
