'use strict';

var assets = require('./assets');
var async = require('async');
var dependencies = require('./dependencies');
var imports = require('./imports');
var jade = require('jade');
var lodash = require('lodash');
var parser = require('./parser');
var path = require('./support/path');
var preprocessor = require('./preprocessor');
var tokens = require('./tokens');

var CONCAT_SEPARATOR = '\n\n;\n\n';
var TREE_FACET_KEY = 'tree';
var NON_ENTRYPOINT_EXTNAMES = { '.jade': true, '.html': true, '.htm': true, '.xml': true, '.xhtml': true };

var COMPILERS = {
    '.jade': function(source) {
        return jade.compile(source)();
    },
    '.js': function(source) {
        return preprocessor.transform(source);
    },
    '.html': function(source) {
        return source;
    }
};

function compileFile(file) {
    var extname = path.extname(file.path);
    if (COMPILERS[extname]) {
        return COMPILERS[extname](file.content);
    }
    else {
        throw new Error('No compiler found');
    }
}

function buildFacetAST(source, facet) {
    if (facet === TREE_FACET_KEY) {
        return parser.buildLiteral(source);
    }
    else {
        return parser.returnBody(source);
    }
}

function assignFacets(definition, files) {
    parser.eachLiteral(definition, function(key, value, property) {
        var file = lodash.find(files, { path: value });
        if (file) {
            property.value = buildFacetAST(compileFile(file), key);
        }
    });
}

function expandProgram(definition, config) {
    assets.expand(definition, config);
    imports.expand(definition, config);
    tokens.expand(definition, config);
}

function loadDependencies(name, definition, config, tag, packages, finish) {
    dependencies.load(name, definition, config, tag, packages, { writeManifests: true }, function(err, deps) {
        var pairs = dependencies.pairs(deps);
        async.map(pairs, function(pair, cb) {
            (function(moduleName, moduleTag) {
                compile(moduleName, moduleTag, deps[moduleName][moduleTag], packages, function(err) {
                    cb(err);
                });
            }(pair[0], pair[1]));
        }, function(err) {
            finish(err);
        });
    });
}

function closureWrap(code) {
    return '(function(){\n' + code + '\n}());';
}

function commentHeading(name, version) {
    return '/** ' + name + ' (' + version + ') ' + Date.now() + ' **/\n';
}

function packageWrap(name, version, code) {
    return commentHeading(name, version) + closureWrap(code);
}

function build(name, tag, packages) {
    var snippets = [];
    for (var packageName in packages) {
        var packageManifest = packages[packageName];
        for (var packageVersion in packageManifest) {
            var packageObject = packageManifest[packageVersion];
            var ast = packageObject.ast;
            var code = parser.generate(ast);
            if (packageName === name && packageVersion == tag) {
                snippets.push(packageWrap(packageName, packageVersion, code));
            }
            else {
                snippets.unshift(packageWrap(packageName, packageVersion, code));
            }
        }
    }
    return snippets.join(CONCAT_SEPARATOR);
}

function entrypointName(name) {
    var parts = path.parts(name);
    return parts[parts.length - 1];
}

function findEntrypoint(name, files) {
    var epName = entrypointName(name);
    return lodash.find(files, function(file) {
        var extname = path.extname(file.path);
        if (extname in NON_ENTRYPOINT_EXTNAMES) {
            return false;
        }
        else {
            var basename = path.basename(file.path, extname);
            return basename === epName;
        }
    });
}

function failureEntrypoint(name, tag) {
    return {
        path: entrypointName(name) + '.js',
        content: 'console.error("Failed to load module `' + name + '`-`' + tag + '`");'
    };
}

function compile(name, tag, files, packages, after, finish) {
    var main = findEntrypoint(name, files);
    if (!main) {
        console.error('No entrypoint found for `' + name + '` version `' + tag + '`');
        main = failureEntrypoint(name, tag);
    }
    var code = compileFile(main);
    var ast = parser.parse(code);
    var config = parser.getConfig(ast);
    var definition = parser.getDefinition(ast);
    var versionMap = parser.getDependencies(config);

    async.waterfall([
        function(cb) {
            assignFacets(definition, files);
            expandProgram(definition, config);
            if (!packages[name]) {
                packages[name] = {};
            }
            packages[name][tag] = {
                ast: ast,
                definition: definition, 
                config: config,
                versions: versionMap
            };
            loadDependencies(name, definition, config, tag, packages, cb);
        },
        function(cb) {
            // Called when a single compile process ends
            if (after) {
                after(null);
            }
            // Called when the complete bundle is ready to be built
            if (finish) {
                finish(null, build(name, tag, packages));
            }
        }
    ]);
}

module.exports = {
    compile: compile
};
