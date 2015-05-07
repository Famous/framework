'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Path = require('path');

var Builder = require('./../builder/builder');
var Compiler = require('./../compiler/compiler');
var Storage = require('./storage');

var SLASH = '/';

function Version(options) {
    this.options = Lodash.defaults(Lodash.clone(Version.DEFAULTS || {}), Lodash.clone(options || {}));
    this.storage = new Storage(this.options);
    this.compiler = new Compiler(this.options);
}

Version.DEFAULTS = {
    bundlesFolder: '~bundles',
    bundleFilename: 'bundle.js',
    componentDelimiter: ':',
    defaultConfiguration: {
        'public': true,
        'apiKeys': []
    },
    versionsFolder: '~versions',
};

Version.prototype.getModulePath = function(name) {
    return Path.join.apply(Path, name.split(this.options.componentDelimiter));
};

Version.prototype.getVersionsPath = function(name) {
    var modulePath = this.getModulePath(name);
    return Path.join(modulePath, this.options.versionsFolder);
};

Version.prototype.getBundlesPath = function(name) {
    var modulePath = this.getModulePath(name);
    return Path.join(modulePath, this.options.bundlesFolder);
};

Version.prototype.getVersionPath = function(name, tag) {
    var versionsPath = this.getVersionsPath(name);
    return Path.join(versionsPath, tag);
};

Version.prototype.getBundlePath = function(name, tag) {
    var bundlesPath = this.getBundlesPath(name);
    return Path.join(bundlesPath, tag);
};

Version.prototype.getBundleURL = function(name, tag) {
    var bundlePath = Path.join(this.getBundlePath(name, tag), this.options.bundleFilename);
    var storageBase = this.storage.getBaseURL();
    return storageBase + SLASH + bundlePath;
};

Version.prototype.buildBundle = function(compilation, options, finish) {
    Builder.buildBundle(compilation, options, function(err, bundle) {
        if (err) return finish(err);
        finish(null, bundle);
    });
};

Version.prototype.save = function(name, files, finish) {
    var storageService = this.storage;
    var compilerService = this.compiler;
    compilerService.compileModule(name, files, {}, function(err, compilation) {
        var moduleTag = compilation.moduleTag;
        var versionBasePath = this.getVersionPath(name, moduleTag);
        var bundleBasePath = this.getBundlePath(name, moduleTag);
        var bundleFilename = this.options.bundleFilename;
        var bundleBuilder = this.buildBundle.bind(this);
        var bundleURLGetter = this.getBundleURL.bind(this);
        Async.map(files, function(file, cb) {
            var fullFilePath = Path.join(versionBasePath, file.path);
            storageService.putFile(fullFilePath, file.content, function(err) {
                if (err) return cb(err);
                cb(cb);
            });
        }, function(err) {
            var fullBundlePath = Path.join(bundleBasePath, bundleFilename);
            bundleBuilder(compilation, {}, function(err, bundle) {
                if (err) return finish(err);
                storageService.putFile(fullBundlePath, bundle, function(err) {
                    if (err) return finish(err);
                    finish(null, {
                        name: name,
                        tag: moduleTag,
                        url: bundleURLGetter(name, moduleTag)
                    });
                });
            });
        });
    }.bind(this));
};

module.exports = Version;
