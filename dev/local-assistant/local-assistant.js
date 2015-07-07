'use strict';

var Async = require('async');
var Browserify = require('browserify');
var Chokidar = require('chokidar');
var Express = require('express');
var Fs = require('fs');
var Livereload = require('livereload');
var assign = require('lodash.assign');
var clone = require('lodash.clone');
var debounce = require('lodash.debounce');
var last = require('lodash.last');
var Mkdirp = require('mkdirp');
var Ncp = require('ncp').ncp;
var Path = require('path');
var Rimraf = require('rimraf');
var Watchify = require('watchify');

var buildModule = require('./../build-pipeline/build-module');
var Helpers = require('./../build-pipeline/helpers/helpers');

var BLANK = '';
var DOUBLE_DOT = '..';
// Avoid these for cross-OS compatibility: . , [ ] { } ( ) ! : ; " ' * ? < > | ¢ ™ $ ® \ /
var SAFE_NAMESPACE_DELIMITER = '~';
var PROJECT_DIR = Path.join(__dirname, '..', '..');
var CORE_COMPONENTS_FOLDER = Path.join(__dirname, '..', '..', 'lib', 'core-components', 'famous');

function LocalAssistant(options) {
    this.setOptions(options);
    this.cachedFrameworkBundle = null;
    this.cachedFrameworkBundleTimeStamp = Date.now();
    this.cacheTTL = 1000; // milliseconds
}

LocalAssistant.DEFAULTS = {
    // These get passed into the build pipeline
    sourceFolder: null,
    destinationFolder: null,
    componentDelimiter: ':',
    entrypointExtnames: { '.js': true },

    // These are only used by the project assistant itself
    chokidarIgnored: /[\/\\]\./,    
    fileOptions: { encoding: 'utf8' },
    folderBlacklist: { 'node_modules': true, '.git': true },
    livereloadOptions: {
        port: 35729,
        exts: ['html','css','js','png','gif','jpg','coffee','less','json'],
        applyJSLive: false,
        applyCSSLive: false,
        exclusions: [/\\node_modules\//,/\\.git\//,/\\.svn\//,/\\.hg\//],
        interval: 5000
    },
    moduleNameRegexp: /FamousFramework.(scene|module|register|component)\(\'(\S+)\'/gi
};

LocalAssistant.prototype.setOptions = function(options) {
    this.options = assign(clone(LocalAssistant.DEFAULTS), clone(options || {}));
};

LocalAssistant.prototype.buildFramework = function(cb) {
    var inputFile = Path.join(PROJECT_DIR, 'lib', 'index.js');

    var browserify = Browserify(inputFile, {
        standalone: 'FamousFramework'
    });

    if (this.cachedFrameworkBundle && (this.cachedFrameworkBundleTimeStamp + this.cacheTTL > Date.now())) {
        return cb(null, this.cachedFrameworkBundle);
    }
    else {
        browserify.bundle(function(browserifyErr, buf) {
            if (browserifyErr) {
                return cb(browserifyErr);
            }

            this.cachedFrameworkBundle = buf.toString();
            this.cachedFrameworkBundleTimeStamp = Date.now();

            return cb(null, this.cachedFrameworkBundle);
        }.bind(this));
    }
};

LocalAssistant.prototype.buildModule = function(moduleName, files, finish) {
    var destinationFolder = Path.join(this.options.destinationFolder, moduleName.split(this.options.componentDelimiter).join(SAFE_NAMESPACE_DELIMITER));

    return buildModule(moduleName, files, {
        localSourceFolder: this.options.sourceFolder,
        componentDelimiter: this.options.componentDelimiter,
        entrypointExtnames: this.options.entrypointExtnames
    }, function(buildModuleErr, nameOut, filesOut, dataOut) {
        if (buildModuleErr) {
            return finish(buildModuleErr);
        }

        this.buildFramework(function(buildFrameworkErr, frameworkString) {
            if (buildFrameworkErr) {
                return finish(buildFrameworkErr);
            }

            dataOut.flatProjectFiles.push({
                path: 'famous-framework.bundle.js',
                content: frameworkString
            });

            Async.map(dataOut.flatProjectFiles, function(file, cb) {
                var filePathFull = Path.join(destinationFolder, file.path);
                var filePathBase = Path.dirname(filePathFull);

                Mkdirp(filePathBase, function(mkdirErr) {
                    if (mkdirErr) {
                        return cb(mkdirErr);
                    }

                    var fileData;
                    if (Helpers.doesFileLookLikeBinary(file) && typeof file.content === 'string') {
                        // Ensure that we convert assets like images to binary
                        // buffers instead of mangling them by writing the plain strings
                        fileData = new Buffer(file.content, 'binary');
                    }
                    else {
                        fileData = file.content;
                    }

                    Fs.writeFile(filePathFull, fileData, { flags: 'w' }, function(writeFileErr) {
                        if (writeFileErr) {
                            return cb(writeFileErr);
                        }

                        return cb(null);
                    });
                });
            }, function(writeAllErr) {
                if (writeAllErr) {
                    return finish(writeAllErr);
                }

                return finish(null, nameOut, filesOut, dataOut);
            });
        });
    }.bind(this));
};

LocalAssistant.prototype.buildAll = function(baseDir, subDir, cb) {
    this.cachedFrameworkBundle = null;

    this.buildRecursive(baseDir, subDir, function(err, result) {
        this.cachedFrameworkBundle = null;

        if (err) {
            return cb(err);
        }

        return cb(null, result);
    });
};

LocalAssistant.prototype.buildSingle = function(baseDir, subDir, cb) {
    var moduleName;
    if (subDir.length > 0) {
         moduleName = subDir.split(Path.sep).join(this.options.componentDelimiter);
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
    this.buildModule(moduleName, files, cb);
};

LocalAssistant.prototype.tuplesRecursive = function(tuples, baseDir, subDir, cb) {
    var mainPath = Path.join(baseDir, subDir);
    var entries = Fs.readdirSync(mainPath);

    entries.forEach(function(entryPath) {
        var fullEntryPath = Path.join(mainPath, entryPath);
        var entryStat = Fs.lstatSync(fullEntryPath);
        var entryExtname = Path.extname(fullEntryPath);
        var entryBasename = Path.basename(fullEntryPath, entryExtname);

        if (entryStat.isDirectory()) {
            var partialPath = Path.join(subDir, entryPath);

            if (this.isModuleDir(fullEntryPath)) {
                tuples.push([baseDir, partialPath]);
            }

            this.tuplesRecursive(tuples, baseDir, partialPath);
        }
        else {
            var subDirSegment = last(subDir.split(Path.sep));
            if (subDirSegment === entryBasename && (entryExtname in this.options.entrypointExtnames)) {
                tuples.push([baseDir, subDir]);
            }
        }
    }.bind(this));

    if (cb) {
        cb(null, tuples);
    }
};

LocalAssistant.prototype.buildRecursive = function(baseDir, subDir, finish) {
    var alreadyBuilt = [];
    this.tuplesRecursive([], baseDir, subDir, function(err, tuples) {
        if (err) {
            console.error(err);
        }
        Async.mapSeries(tuples, function(tuple, cb) {
            // Don't rebuild one that we just built during this run
            var stringified = JSON.stringify([tuple[0], tuple[1]]);
            if (alreadyBuilt.indexOf(stringified) === -1) {
                this.buildSingle(tuple[0], tuple[1], cb);
                alreadyBuilt.push(stringified);
            }
            else {
                cb();
            }
        }.bind(this), finish);
    }.bind(this));
};

LocalAssistant.prototype.isPushableDir = function(dir) {
    var isPushable = true;
    var dirParts = dir.split(Path.sep);

    for (var i = 0; i < dirParts.length; i++) {
        var dirPart = dirParts[i];

        if (dirPart in this.options.folderBlacklist) {
            isPushable = false;
        }
    }
    return isPushable;
};

LocalAssistant.prototype.pushFilesToArray = function(files, baseDir, subDir, prefix) {
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

LocalAssistant.prototype.isModuleDir = function(dir) {
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

LocalAssistant.prototype.getModuleDir = function(bottomDir, dir) {
    if (this.isModuleDir(dir)) {
        return dir;
    }
    else {
        if (dir === bottomDir || (dir + Path.sep) === bottomDir) {
            return false;
        }
        else {
            return this.getModuleDir(bottomDir, Path.join(dir, DOUBLE_DOT));
        }
    }
};

LocalAssistant.prototype.watchDirectory = function(baseDir, subDir, doRebuildEverythingOnChange, cb) {
    var watcher = Chokidar.watch(Path.join(baseDir, subDir), {
        ignored: this.options.chokidarIgnored,
        ignoreInitial: true
    });

    var handler = debounce(function(event, filename) {
        if (doRebuildEverythingOnChange) {
            this.buildAll(baseDir, '', cb);
        }
        else {
            this.buildSingle(baseDir, subDir, cb);
        }
    }.bind(this), 1000);

    watcher.on('all', handler);
};

LocalAssistant.prototype.watchDirectoryRecursive = function(baseDir, subDir, options, cb) {
    var pathToWatch;
    if (options.triggerEntrypointBuildOnAnyChange) {
        pathToWatch = baseDir;
    }
    else {
        pathToWatch = Path.join(baseDir, subDir);
    }

    var watcher = Chokidar.watch(pathToWatch, {
        ignored: this.options.chokidarIgnored,
        ignoreInitial: true
    });

    var handler = debounce(function(event, filename) {

        if (options.triggerEntrypointBuildOnAnyChange) {
            this.buildSingle(baseDir, subDir, cb);
        }
        else {
            var fileChangedDir = Path.dirname(filename);
            var moduleFullDir = this.getModuleDir(baseDir, fileChangedDir);
            if (moduleFullDir) {
                if (options.doRebuildEverythingOnChange) {
                    this.buildAll(baseDir, '', cb);
                }
                else {
                    var moduleRelativeDir = moduleFullDir.replace(baseDir, BLANK).replace(/^\//, '').replace(/^\\/, '');
                    this.buildSingle(baseDir, moduleRelativeDir, cb);
                }
            }
        }
    }.bind(this), 1000);

    watcher.on('all', handler);
};

LocalAssistant.prototype.localOnlyBootstrap = function(info) {
    console.log('famous framework: Bootstrapping local components...');

    this.setOptions({
        sourceFolder: info.sourceFolder,
        destinationFolder: info.destinationFolder
    });

    Rimraf(info.destinationFolder, function(rmErr) {
        var subDir = '';

        if (info.entrypointModuleName) {
            subDir = info.entrypointModuleName.split(this.options.componentDelimiter).join(Path.sep);
        }

        this.buildAll(info.sourceFolder, subDir, function(buildAllErr) {
            if (buildAllErr) {
                return console.log(buildAllErr);
            }

            if (info.watchAfterBuild !== 'no') {
                var livereloadServer = Livereload.createServer(this.options.livereloadOptions);
                var server = Express();

                var doRebuildEverythingOnChange = false;
                if (info.entrypointModuleName) {
                    doRebuildEverythingOnChange = true;
                }
                if (info.rebuildEverythingOnChange === 'yes') {
                    doRebuildEverythingOnChange = true;
                }
                else if (info.rebuildEverythingOnChange === 'no') {
                    doRebuildEverythingOnChange = false;
                }

                var options = {
                    doRebuildEverythingOnChange: doRebuildEverythingOnChange,
                    entrypointModuleName: info.entrypointModuleName,
                    triggerEntrypointBuildOnAnyChange: !!info.entrypointModuleName
                };

                this.watchDirectoryRecursive(info.sourceFolder, subDir, options, function(err, result) {
                    if (err) {
                        return console.log(err);
                    }

                    livereloadServer.refresh(Path.join(info.servedFolder, 'index.html'));
                    return console.log('famous framework: Finished!');
                });

                server.use(Express.static(info.servedFolder));
                server.listen(info.port);

                return console.log('famous framework: Finished! Serving at http://localhost:' + info.port);
            }
            else {
                return console.log('famous framework: Finished!');
            }
        }.bind(this));
    }.bind(this));
};

LocalAssistant.prototype.watchRuntime = function(info) {
    console.log('famous framework: Building the browser runtime...');

    var b = Browserify(info.inputFile, { cache: {}, packageCache: {} });
    var w = Watchify(b);

    function bundle() {
        w.bundle().pipe(Fs.createWriteStream(info.outputFile));
    }

    w.on('update', function() {
        bundle();
    });

    w.on('bytes', function(bytes) {
        console.log('famous framework: Wrote ' + bytes + ' bytes to ' + info.outputFile);
    });

    bundle();
};

LocalAssistant.prototype.copyCoreComponents = function(info) {
    Rimraf(info.destinationFolder, function(rmErr) {
        Ncp(CORE_COMPONENTS_FOLDER, info.destinationFolder, function(copyErr) {
            if (copyErr) {
                return console.error('famous framework: Couldn\'t copy core components!');
            }
        });
    });
};

module.exports = LocalAssistant;
