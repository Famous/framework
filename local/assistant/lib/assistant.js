'use strict';

var APIClient = require('./api-client');
var Chokidar = require('chokidar');
var Fs = require('fs');
var Lodash = require('lodash');
var Path = require('path');

var BLANK = '';
var DOUBLE_DOT = '..';
var SLASH = '/';

function Assistant(options) {
    this.setOptions(options);
    this.apiClient = new APIClient();
}

Assistant.DEFAULTS = {
    chokidarIgnored: /[\/\\]\./,
    componentDelimiter: ':',
    entrypointExtnames: { '.js': true },
    fileOptions: { encoding: 'utf8' },
    folderBlacklist: {
        'node_modules': true,
        '.git': true
    }
};

Assistant.prototype.setOptions = function(options) {
    this.options = Lodash.defaults(Lodash.clone(Assistant.DEFAULTS), Lodash.clone(options || {}));
};

Assistant.prototype.persistModule = function(moduleName, files, cb) {
    this.apiClient.saveModule(moduleName, files, cb);
};

Assistant.prototype.syncAll = function(baseDir, subDir, cb) {
    this.syncRecursive(baseDir, subDir, function(err, result) {
        if (err) cb(err);
        else cb(null, result);
    });
};

Assistant.prototype.syncSingle = function(baseDir, subDir, cb) {
    var moduleName = subDir.split(SLASH).join(this.options.componentDelimiter);
    var files = [];
    this.pushFilesToArray(files, baseDir, subDir, BLANK);
    this.persistModule(moduleName, files, function(err, result) {
        if (err) cb(err);
        else cb(null, result);
    });
};

Assistant.prototype.syncRecursive = function(baseDir, subDir, cb) {
    var mainPath = Path.join(baseDir, subDir);
    var entries = Fs.readdirSync(mainPath);
    entries.forEach(function(entryPath) {
        var fullEntryPath = Path.join(mainPath, entryPath);
        var entryStat = Fs.lstatSync(fullEntryPath);
        if (entryStat.isDirectory()) {
            var partialPath = Path.join(subDir, entryPath);
            if (this.isModuleDir(fullEntryPath)) {
                this.syncSingle(baseDir, partialPath, cb);
            }
            this.syncRecursive(baseDir, partialPath, cb);
        }
    }.bind(this));
};

Assistant.prototype.isPushableDir = function(dir) {
    var isPushable = true;
    var dirParts = dir.split(SLASH);
    for (var i = 0; i < dirParts.length; i++) {
        var dirPart = dirParts[i];
        if (dirPart in this.options.folderBlacklist) {
            isPushable = false;
        }
    }
    return isPushable;
};

Assistant.prototype.pushFilesToArray = function(files, baseDir, subDir, prefix) {
    if (this.isPushableDir(subDir)) {
        var fullPath = Path.join(baseDir, subDir);
        var entries = Fs.readdirSync(fullPath);
        entries.forEach(function(entryPath) {
            var entryPartialPath = Path.join(subDir, entryPath);
            var entryFullPath = Path.join(fullPath, entryPath);
            var entryStat = Fs.lstatSync(entryFullPath);
            var finalPath = Path.join(prefix, entryPath);
            if (!entryStat.isDirectory()) {
                var entryContent = Fs.readFileSync(entryFullPath);
                var encodedContent = new Buffer(entryContent).toString('base64');
                files.push({ path: finalPath, content: encodedContent });
            }
            else {
                this.pushFilesToArray(files, baseDir, entryPartialPath, finalPath);
            }
        }.bind(this));
    }
};

Assistant.prototype.isModuleDir = function(dir) {
    var isMod = false;
    var folderBasename = Path.basename(dir);
    try {
        var entries = Fs.readdirSync(dir);
        entries.forEach(function(entryPath) {
            var entryFullPath = Path.join(dir, entryPath);
            var entryStat = Fs.lstatSync(entryFullPath);
            if (!entryStat.isDirectory()) {
                var entryExtname = Path.extname(entryFullPath);
                var entryBasename = Path.basename(entryFullPath, entryExtname);
                if (entryBasename === folderBasename) {
                   if (entryExtname in this.options.entrypointExtnames) {
                       isMod = true;
                   }
                }
            }
        }.bind(this));
    }
    catch (err) {
        console.error(err);
        return false;
    }
    return isMod;
};

Assistant.prototype.getModuleDir = function(bottomDir, dir) {
    if (this.isModuleDir(dir)) {
        return dir;
    }
    else {
        if (dir === bottomDir || (dir + SLASH) === bottomDir) {
            return false;
        }
        else {
            return this.getModuleDir(bottomDir, Path.join(dir, DOUBLE_DOT));
        }
    }
};

Assistant.prototype.watchDirectory = function(baseDir, subDir) {
    var watchDir = Path.join(baseDir, subDir);
    var watcher = Chokidar.watch(watchDir, {
        ignored: this.options.chokidarIgnored,
        ignoreInitial: true
    });
    var handler = Lodash.debounce(function(event, filename) {
        var fileChangedDir = Path.dirname(filename);
        var moduleFullDir = this.getModuleDir(baseDir, fileChangedDir);
        if (moduleFullDir) {
            var moduleRelativeDir = moduleFullDir.replace(baseDir, BLANK).replace(/^\//, '');
            this.syncSingle(baseDir, moduleRelativeDir, function(err, result) {
                if (err) console.error('best-assistant:', err);
                console.log('best-assistant:', result.body);
            });
        }
    }.bind(this), 1000);
    watcher.on('all', handler);
};

module.exports = Assistant;
