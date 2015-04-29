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

function loadDependencies(definition, config, tag, packages, finish) {
    dependencies.load(definition, config, tag, packages, function(err, deps) {
        var keys = Object.keys(deps);
        async.map(keys, function(moduleName, cb) {
            compile(moduleName, tag, deps[moduleName], packages, function(err) {
                cb(err);
            });
        }, function(err) {
            finish(err);
        });
    });
}

function closureWrap(code) {
    return '(function(){\n' + code + '\n}());';
}

function build(name, packages) {
    var snippets = [];
    for (var packageName in packages) {
        var ast = packages[packageName].ast;
        var code = parser.generate(ast);
        if (packageName === name) {
            snippets.push(closureWrap(code));
        }
        else {
            snippets.unshift(closureWrap(code));
        }
    }
    return snippets.join(CONCAT_SEPARATOR);
}

function findEntrypoint(name, files) {
    var parts = path.parts(name);
    var last = parts[parts.length - 1];
    return lodash.find(files, function(file) {
        var extname = path.extname(file.path);
        if (extname in NON_ENTRYPOINT_EXTNAMES) {
            return false;
        }
        else {
            var basename = path.basename(file.path, extname);
            return basename === last;
        }
    });
}

function compile(name, tag, files, packages, after, finish) {
    var main = findEntrypoint(name, files);
    if (!main) {
        throw new Error('No entrypoint found for `' + name + '`');
    }
    var code = compileFile(main);
    var ast = parser.parse(code);
    var config = parser.getConfig(ast);
    var definition = parser.getDefinition(ast);

    async.waterfall([
        function(cb) {
            assignFacets(definition, files);
            expandProgram(definition, config);
            packages[name] = {
                ast: ast,
                definition: definition, 
                config: config
            };
            loadDependencies(definition, config, tag, packages, cb);
        },
        function(cb) {
            // Called when a single compile process ends
            if (after) {
                after(null);
            }
            // Called when the complete bundle is ready to be built
            if (finish) {
                finish(null, build(name, packages));
            }
        }
    ]);
}

module.exports = {
    compile: compile
};
