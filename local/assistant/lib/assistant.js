'use strict';

var Async = require('async');
var Chokidar = require('chokidar');
var Fs = require('fs');
var Lodash = require('lodash');
var Path = require('path');

var Builder = require('./../../../shared/builder/lib/builder');

var BLANK = '';
var DOUBLE_DOT = '..';
var SLASH = '/';

function Assistant(options) {
    this.setOptions(options);
    this.builder = new Builder(this.options.builderOptions);
}

Assistant.DEFAULTS = {
    builderOptions: {},
    chokidarIgnored: /[\/\\]\./,
    componentDelimiter: ':',
    entrypointExtnames: {
        '.js': true
    },
    fileOptions: {
        encoding: 'utf8'
    },
    folderBlacklist: {
        'node_modules': true,
        '.git': true
    },
    moduleNameRegexp: /FamousFramework.(scene|module|register|component)\(\'(\S+)\'/gi
};

Assistant.prototype.setOptions = function(options) {
    this.options = Lodash.assign(Lodash.clone(Assistant.DEFAULTS), Lodash.clone(options || {}));
};

Assistant.prototype.buildModule = function(moduleName, files, sourceDir, cb) {
    this.builder.buildModule({ name: moduleName, files: files, sourceDirectory: sourceDir }, cb);
};

Assistant.prototype.buildAll = function(baseDir, subDir, cb) {
    this.buildRecursive(baseDir, subDir, function(err, result) {
        if (err) cb(err);
        else cb(null, result);
    });
};

Assistant.prototype.buildSingle = function(baseDir, subDir, cb) {
    var moduleName;
    if (subDir.length > 0) {
         moduleName = subDir.split(SLASH).join(this.options.componentDelimiter);
    }
    else {
        // If the subdir string was empty, we should assume that the baseDir
        // is the home for the single component. This means we need to do some
        // additional work to find the module name. We'll look for an entry point
        // file, and then try to locate the module name. This is a bit brittle
        // and warrants some re-thinking. TODO
        var dirParts = baseDir.split(Path.sep);
        var lastPart = dirParts[dirParts.length - 1];
        var entrypointNameToLookFor = lastPart + '.js';
        var entrypointPath = Path.join(baseDir, entrypointNameToLookFor);
        var entrypointData = Fs.readFileSync(entrypointPath, this.options.fileOptions);
        var regexpMatches = this.options.moduleNameRegexp.exec(entrypointData);

        // We need to reset the lastindex so this regex will run properly
        // on subsequent runs.
        this.options.moduleNameRegexp.lastIndex = 0;

        var moduleNameMatch = regexpMatches[2];
        if (!moduleNameMatch || moduleNameMatch.indexOf(this.options.componentDelimiter) === -1) {
            return cb(new Error('Unable to find the name of the module in the given directory; is your syntax correct?'));
        }
        else {
            moduleName = moduleNameMatch;
        }
    }

    var files = [];
    this.pushFilesToArray(files, baseDir, subDir, BLANK);
    this.buildModule(moduleName, files, Path.join(baseDir, subDir), function(err, result) {
        if (err) {
            cb(err);
        }
        else {
            cb(null, result);
        }
    });
};

Assistant.prototype.tuplesRecursive = function(tuples, baseDir, subDir, cb) {
    var mainPath = Path.join(baseDir, subDir);
    var entries = Fs.readdirSync(mainPath);
    entries.forEach(function(entryPath) {
        var fullEntryPath = Path.join(mainPath, entryPath);
        var entryStat = Fs.lstatSync(fullEntryPath);
        if (entryStat.isDirectory()) {
            var partialPath = Path.join(subDir, entryPath);
            if (this.isModuleDir(fullEntryPath)) {
                tuples.push([baseDir, partialPath]);
            }
            this.tuplesRecursive(tuples, baseDir, partialPath);
        }
    }.bind(this));
    if (cb) {
        cb(null, tuples);
    }
};

Assistant.prototype.buildRecursive = function(baseDir, subDir, finish) {
    this.tuplesRecursive([], baseDir, subDir, function(err, tuples) {
        if (err) {
            console.error(err);
        }
        Async.mapSeries(tuples, function(tuple, cb) {
            this.buildSingle(tuple[0], tuple[1], cb);
        }.bind(this), finish);
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
                files.push({ path: finalPath, content: entryContent });
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
        this.buildSingle(baseDir, subDir, function(err, result) {
            if (err) {
                console.error('assistant:', err);
            }
        });
    }.bind(this), 500);
    watcher.on('all', handler);
};

Assistant.prototype.watchDirectoryRecursive = function(baseDir, subDir) {
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
            this.buildSingle(baseDir, moduleRelativeDir, function(err, result) {
                if (err) {
                    console.error('assistant:', err);
                }
            });
        }
    }.bind(this), 1000);
    watcher.on('all', handler);
};

module.exports = Assistant;
