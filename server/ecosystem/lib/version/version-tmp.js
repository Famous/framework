'use strict';

var Async = require('async');
var Lodash = require('lodash');
var Path = require('path');

var Builder = require('./../builder/builder');
var Compiler = require('./../compiler/compiler');
var Errors = require('./../errors/errors');
var Helper = require('./../helper/helper');
var Storage = require('./storage');

function VersionTmp(options) {
    this.options = Lodash.assign(Lodash.clone(VersionTmp.DEFAULTS || {}), Lodash.clone(options || {}));
    this.storage = new Storage(this.options);
    this.compiler = new Compiler(this.options);
    this.helper = new Helper(this.options);
}

VersionTmp.DEFAULTS = {
    defaultConfiguration: {
        'public': true,
        'apiKeys': []
    }
};

VersionTmp.prototype.buildBundle = function(compilation, options, finish) {
    Builder.buildBundle(compilation, options, function(err, bundle) {
        if (err) return finish(err);
        finish(null, bundle);
    });
};

VersionTmp.prototype.save = function(name, files, finish) {
    var storageService = this.storage;
    var compilerService = this.compiler;
    var helper = this.helper;
    var bundleFilename = helper.getBundleFilename();
    var bundleBuilder = this.buildBundle.bind(this);
    files.forEach(function(file) {
        var buffer = new Buffer(file.content, 'base64');
        file.content = (helper.looksLikeBinary(file.path))
            ? buffer.toString('binary')
            : buffer.toString('utf8');
    });
    compilerService.compileModule(name, files, {}, function(compileErr, compilation) {
        Errors.handle(compileErr, 'failed-version-compilation', { moduleName: name }, null, finish, function() {
            var moduleTag = compilation.moduleTag;
            var versionBasePath = helper.getVersionPath(name, moduleTag);
            var bundleBasePath = helper.getBundlePath(name, moduleTag);
            Async.map(files, function(file, cb) {
                var fullFilePath = Path.join(versionBasePath, file.path);
                storageService.putFile(fullFilePath, file.content, function(putFileErr) {
                    Errors.handle(putFileErr, 'failed-version-file-storage', { filePath: file.path }, cb, finish, function() {
                        cb(null);
                    });
                });
            }, function(putAllFilesErr) {
                Errors.handle(putAllFilesErr, 'failed-version-storage', { moduleName: name }, null, finish);
                var fullBundlePath = Path.join(bundleBasePath, bundleFilename);
                bundleBuilder(compilation, {}, function(bundleBuildErr, bundle) {
                    Errors.handle(putAllFilesErr, 'failed-version-bundling', { moduleName: name }, null, finish);
                    storageService.putFile(fullBundlePath, bundle, function(putBundleFileErr) {
                        Errors.handle(putBundleFileErr, 'failed-bundle-storage', { moduleName: name }, null, finish, function() {
                            finish(null, {
                                name: name,
                                tag: moduleTag,
                                url: helper.getBundleURL(name, moduleTag)
                            });
                        });
                    });
                });
            });
        });
    });
};

module.exports = VersionTmp;
