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

var TREE_FACET_KEY = 'tree';

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

function loadDependencies(definition, config, packages, finish) {
    dependencies.load(definition, config, packages, function(err) {
        finish(err);
    });
}

function build(definition, packages) {

}

function findEntrypoint(name, files) {
    var parts = path.parts(name);
    var last = parts[parts.length - 1];
    return lodash.find(files, function(file) {
        var extname = path.extname(file.path);
        var basename = path.basename(file.path, extname);
        return basename === last;
    });
}

function compile(name, files, packages, finish) {
    var main = findEntrypoint(name, files);
    var code = compileFile(main);
    var ast = parser.parse(code);
    var config = parser.getConfig(ast);
    var definition = parser.getDefinition(ast);

    async.waterfall([
        function(cb) {
            assignFacets(definition, files);
            expandProgram(definition, config);
            packages[name] = { definition: definition, config: config };
            loadDependencies(definition, config, packages, cb);
        },
        function(cb) {
            finish(null, build(definition, packages));
        }
    ]);
}

module.exports = {
    compile: compile
};
