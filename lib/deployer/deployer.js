'use strict';

var ObjUtils = require('./../utilities/object');
var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

function Deployer() {
    this.options = ObjUtils.clone(Deployer.DEFAULTS);
    this.assetsLoaded = {};
    this.assetsInserted = {};
    this.awaitInterval = 16;
    this.awaitTimeout = 10000;
    this.includesReady = {};
    this.componentsReady = {};
}

Deployer.DEFAULTS = {
    componentDelimiter: ':'
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

// Attach an attachment to a the current module
Deployer.prototype.attach = function(name, tag, selector, executable) {
    DataStore.setAttachment(name, tag, {
       selector: selector,
       executable: executable
    });
};

// Mark a component as being ready for execution
Deployer.prototype.markComponentAsReady = function(name, tag) {
    this.componentsReady[name] = {};
    this.componentsReady[name][tag] = true;
};

// Execute a component to an element once it has been marked as ready
Deployer.prototype.deploy = function(name, tag, selector, configuration, cb) {
    var timeAwaited = 0;
    var readyInterval = setInterval(function() {
        timeAwaited += this.awaitInterval;

        if (this.componentsReady[name] && this.componentsReady[name][tag]) {
            clearInterval(readyInterval);
            this.execute(name, tag, selector, configuration, cb);
        }
        else {
            if (timeAwaited >= this.awaitTimeout) {
                clearInterval(readyInterval);
                console.error('Gave up waiting on `' + name + '` (' + tag + ')');
            }
        }
    }.bind(this), this.awaitInterval);
};

// Execute a component that has already been registered
Deployer.prototype.execute = function(name, tag, selector, configuration, cb) {
    var component = Component.executeComponent(name, tag, selector, configuration, cb);
    DataStore.saveExecutedComponent(selector, component);
    return component;
};

module.exports = Deployer;
