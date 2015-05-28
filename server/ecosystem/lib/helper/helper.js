'use strict';

var Env = require('./../../config/environment');
var Lodash = require('lodash');
var Path = require('path');

var BLANK = '';
var SLASH = '/';
var PIPE = '|';
var STRING = 'string';

function Helper(options) {
    this.options = Lodash.assign(Lodash.clone(Helper.DEFAULTS), Lodash.clone(options || {}));
}

Helper.DEFAULTS = {
    assetRegexp: /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig,
    assetPrefixRegexp: /\}$/,
    assetSuffixRegexp: /^\@\{/,
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
    bucket: 'best-ecosystem',
    bundlesFolder: '~bundles',
    bundleFilename: 'bundle.js',
    componentDelimiter: ':',
    componentDelimiterRegexp: /:/g,
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
    dependencyBlacklist: { 'localhost': true },
    dependencyRegexp: /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig,
    moduleCDNRegexp: /\@\{CDN_PATH(\|)?(([a-zA-Z0-9\:\.-])?)+\}/ig,
    region: 'us-west-2',
    storageHost: (Env.kind === Env.PRODUCTION)
        ? 'https://s3-us-west-2.amazonaws.com'
        : 'http://localhost:' + Env.PORT,
    versionsFolder: '~versions'
};

Helper.prototype.getDependencyModuleName = function(str) {
    var parts = this.getModuleNameParts(str);
    var head = parts.slice(0, parts.length - 1);
    var moduleName = head.join(this.options.componentDelimiter);
    return moduleName;
};

Helper.prototype.eachDependencyIn = function(str, iterator) {
    var matches = str.match(this.options.dependencyRegexp);
    for (var i = 0; i < matches.length; i++) {
        if (!(matches[i] in this.options.dependencyBlacklist)) {
            iterator(matches[i]);
        }
    }
};

Helper.prototype.looksLikeAsset = function(file) {
    var extname = Path.extname(file.path);
    return !!this.options.assetTypes[extname];
};

Helper.prototype.looksLikeBinary = function(path) {
    var extname = Path.extname(path);
    return !!this.options.binaryTypes[extname];
};

Helper.prototype.looksLikeDependency = function(str) {
    // Object keys might be numbers, so we have to check here.
    if (typeof str === STRING) {
        return str.indexOf(this.options.componentDelimiter) !== -1;  
    }
    else {
        return false;
    }
};

Helper.prototype.getContentTypeFallback = function() {
    return this.options.contentTypeFallback;
};

Helper.prototype.getContentTypeMap = function() {
    return this.options.contentTypeMap;
};

// String
Helper.prototype.eachAssetMatch = function(string, iterator) {
    var matches = string.match(this.options.assetRegexp) || [];
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var str = match + BLANK;
        str = str.replace(this.options.assetPrefixRegexp, BLANK)
                 .replace(this.options.assetSuffixRegexp, BLANK)
                 .replace(this.options.componentDelimiterRegexp, SLASH)
                 .replace(PIPE, SLASH);
        iterator(match, str);
    }
};

// String -> String
Helper.prototype.getEntrypointBasename = function(moduleName) {
    var moduleNameParts = this.getModuleNameParts(moduleName);
    return moduleNameParts[moduleNameParts.length - 1];
};

Helper.prototype.getModuleCDNMatch = function(string) {
    var matches = string.match(this.options.moduleCDNRegexp);
    if (matches) {
        return {
            match: matches,
            value: matches[0].replace(this.options.assetPrefixRegexp, BLANK)
                             .replace(this.options.assetSuffixRegexp, BLANK)
        };
    }
    else {
        return null;
    }
};

Helper.prototype.getModuleNameParts = function(moduleName) {
  return moduleName.split(this.options.componentDelimiter);
};

Helper.prototype.getFullAssetPath = function(moduleName, moduleTag, assetPartialPath) {
    var versionBase = this.getVersionPath(moduleName, moduleTag);
    var baseURL = this.getBaseURL();
    return baseURL + SLASH + versionBase + SLASH + assetPartialPath;
};

Helper.prototype.getModulePath = function(name) {
    return Path.join.apply(Path, name.split(this.options.componentDelimiter));
};

Helper.prototype.getVersionsPath = function(name) {
    var modulePath = this.getModulePath(name);
    return Path.join(modulePath, this.options.versionsFolder);
};

Helper.prototype.getBundlesPath = function(name) {
    var modulePath = this.getModulePath(name);
    return Path.join(modulePath, this.options.bundlesFolder);
};

Helper.prototype.buildModuleName = function(namespace, entrypointBasename) {
    return namespace + this.options.componentDelimiter + entrypointBasename;
};

Helper.prototype.getBucket = function() {
    return this.options.bucket;
};

Helper.prototype.getRegion = function() {
    return this.options.region;
};

Helper.prototype.getVersionPath = function(name, tag) {
    var versionsPath = this.getVersionsPath(name);
    return Path.join(versionsPath, tag);
};

Helper.prototype.getBundlePath = function(name, tag) {
    var bundlesPath = this.getBundlesPath(name);
    return Path.join(bundlesPath, tag);
};

Helper.prototype.getBaseURL = function() {
    return this.options.storageHost + SLASH + this.options.bucket;
};

Helper.prototype.getBundleURL = function(name, tag) {
    var bundlePath = Path.join(this.getBundlePath(name, tag), this.options.bundleFilename);
    var storageBase = this.getBaseURL();
    return storageBase + SLASH + bundlePath;
};

Helper.prototype.getBundleFilename = function() {
    return this.options.bundleFilename;
};

Helper.prototype.getFlatImports = function(importsObj) {
    var flatImports = {};
    for (var selector in importsObj) {
        var array = importsObj[selector];
        for (var i = 0; i < array.length; i++) {
            flatImports[array[i]] = selector + this.options.componentDelimiter + array[i];
        }
    }
    return flatImports;
};

module.exports = Helper;
