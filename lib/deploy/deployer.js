'use strict';

var ObjUtils = require('framework-utilities/object');
var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

var PROTOCOL_DELIMITER = '://';
var SLASH = '/';

function Deployer() {
    this.options = ObjUtils.clone(Deployer.DEFAULTS);
    this.inserted = {};
    this.loaded = {};
}

Deployer.DEFAULTS = {
    awaitInterval: 10,
    awaitMaxTime: 1000,
    componentDelimiter: ':',
    ecosystemScheme: 'http',
    ecosystemHost: 'localhost:3000',
    defaultModuleTag: 'HEAD',
    bucket: 'best-ecosystem',
    bundlesFolder: '~bundles',
    bundleFilename: 'bundle.js'
};

Deployer.prototype.getModulePath = function(name) {
    return name.split(this.options.componentDelimiter).join(SLASH);
};

Deployer.prototype.getBundleURL = function(name, tag) {
    return this.options.ecosystemScheme +
           PROTOCOL_DELIMITER +
             [this.options.ecosystemHost,
              this.options.bucket,
              this.getModulePath(name),
              this.options.bundlesFolder,
              tag || this.options.defaultModuleTag,
              this.options.bundleFilename
            ].join(SLASH);
};

Deployer.prototype.markLoaded = function(name, tag) {
    if (!this.loaded[name]) {
        this.loaded[name] = {};
    }
    this.loaded[name][tag] = true;
};

Deployer.prototype.markInserted = function(name, tag) {
    if (!this.inserted[name]) {
        this.inserted[name] = {};
    }
    this.inserted[name][tag] = true;
};

Deployer.prototype.isInserted = function(name, tag) {
    return !!(this.inserted[name] && this.inserted[name][tag]);
};

Deployer.prototype.insertScript = function(name, tag, cb) {
    var url = this.getBundleURL(name, tag);
    var script = document.createElement('script');
    script.onload = function() {
        this.markLoaded(name, tag);
        if (cb) {
            cb(null, name, tag, url);
        }
    }.bind(this);
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', url);
    document.head.appendChild(script);
    this.markInserted(name, tag);
};

Deployer.prototype.everythingLoaded = function() {
    var result = true;
    var inserted = this.inserted;
    var loaded = this.loaded;
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
    this.insertScript(name, tag, function(err, insertedName, insertedTag) {
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

Deployer.prototype.requires = function(name, tag, requires, finish) {
    DataStore.saveDependencies(name, tag, requires);
    var requiresLength = requires.length;
    if (requiresLength === 0) {
        return finish(); // Early finish if nothing to do
    }
    var requiresLoaded = 0;
    for (var i = 0; i < requiresLength; i++) {
        var requireName = requires[i][0];
        var requireTag = requires[i][1];
        if (!this.isInserted(requireName, requireTag)) {
            this.insertScript(requireName, requireTag, function() {
                if (++requiresLoaded === requiresLength) {
                    finish();
                }
            });
        }
        else {
            if (++requiresLoaded === requiresLength) {
                finish();
            }
        }
    }
};

Deployer.prototype.execute = function(name, tag, selector) {
    var component = Component.executeComponent(name, tag, selector);
    DataStore.saveExecutedComponent(selector, component);
};

module.exports = Deployer;
