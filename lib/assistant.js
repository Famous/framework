var Chokidar = require('chokidar');
var Fs = require('fs');
var Lodash = require('lodash');
var Path = require('path');

var BLANK = '';
var DOUBLE_DOT = '..';
var SLASH = '/';

function Assistant(options) {
    this.setOptions(options);
}

Assistant.DEFAULTS = {
    chokidarIgnored: /[\/\\]\./,
    componentDelimiter: ':',
    entrypointExtnames: {
        '.js': true
    },
    fileOptions: {
        encoding: 'utf8'
    },
    folderBlacklist: {
        'node_modules': true
    }
};

Assistant.prototype.setOptions = function(options) {
    this.options = Lodash.defaults(Lodash.clone(Assistant.DEFAULTS), Lodash.clone(options || {}));
};

Assistant.prototype.syncAll = function(baseDir, subDir) {
    this.syncRecursive(baseDir, subDir, function(err, result) {
        if (err) console.error(err);
        else console.log('success!', result);
    });
};

Assistant.prototype.syncSingle = function(baseDir, subDir, cb) {
    var moduleName = location.split(SLASH).join(this.options.componentDelimiter);
    var files = [];
    this.pushFilesToArray(files, baseDir, subDir, BLANK);
    console.log(moduleName, files);
};

Assistant.prototype.syncRecursive = function(baseDir, subDir, cb) {
    var mainPath = Path.join(baseDir, subDir);
    var entries = Fs.readdirSync(mainPath);
    entries.forEach(function(entryPath) {
        if (!(entryPath in this.options.folderBlacklist)) {
            var fullEntryPath = Path.join(mainPath, entryPath);
            var entryStat = Fs.lstatSync(fullEntryPath);
            if (entryStat.isDirectory()) {
                var partialPath = Path.join(subDir, entryPath);
                if (this.isModuleDir(fullEntryPath)) {
                    this.syncCingle(baseDir, partialPath, cb);
                }
                this.syncRecursive(baseDir, partialPath, cb);
            }
        }
    }.bind(this));
};

Assistant.prototype.pushFilesToArray = function(files, baseDir, subDir, prefix) {
    var fullPath = Path.join(baseDir, subDir);
    var entries = Fs.readdirSync(fullPath);
    entries.forEach(function(entryPath) {
        if (!(entryPath in this.options.folderBlacklist)) {
            var entryPartialPath = Path.join(subDir, entryPath);
            var entryFullPath = Path.join(fullPath, entryPath);
            var entryStat = Fs.lstatSync(entryFullPath);
            var finalPath = Path.join(prefix, entryPath);
            if (!entryStat.isDirectory()) {
                var entryContent = Fs.readFileSync(entryFullPath, this.options.fileOptions);
                files.push({ path: finalPath, content: entryContent });
            }
            else {
                this.pushFilesToArray(files, baseDir, entryPartialPath, finalPath);
            }
        }
    }.bind(this));
};

Assistant.prototype.isModuleDir = function(dir) {
    var isMod = false;
    var folderBasename = Path.basename(dir);
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
    });
    return isMod;
};

Assistant.prototype.getModuleDir = function(bottomDir, dir) {
    if (this.isModuleDir(dir)) {
        return dir;
    }
    else {
        if (dir === bottomDir) {
            return false;
        }
        else {
            return this.getModuleDir(bottomDir, Path.join(dir, DOUBLE_DOT));
        }
    }
};

Assistant.prototype.watchDirectory = function(baseDir, subDir) {
    var dir = Path.join(baseDir, subDir);
    Chokidar.watch(baseDir, { ignored: this.options.chokidarIgnored }, function(event, filename) {
        var fullDir = Path.dirname(filename);
        var moduleDir = this.getModuleDir(baseDir, fullDir);
        if (moduleDir) {
            var partialDir = moduleDir.replace(subDir + SLASH, BLANK);
            this.syncSingle(subDir, partialDir, function(err, result) {
                if (err) {
                    console.error(err);
                }
                else {
                    console.log('synced ' + partialDir);
                }
            });
        }
    });
};

module.exports = Assistant;
