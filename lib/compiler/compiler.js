'use strict';

var Async = require('async');
var Es = require('es');
var Jsdom = require('jsdom');
var Lodash = require('lodash');
var Path = require('path');

var Extensions = require('./extensions');

var BLANK = '';
var PIPE = '|';
var QUOTE = '\'';
var SLASH = '/';

/**
 * The Compiler's job is to produce a compilation object from a
 * an array of 'file' objects that represent a module version.
 * At a high level, the steps of this process are:
 * 
 * - Preprocess every 'file'. (E.g., compile from SASS to CSS)
 * - Find the module 'entrypoint' file. (For 'foo:bar' it would be 'bar.js')
 * - Create an AST from the entrypoint 'file'
 * - Locate all BEST invocations therein (E.g. BEST.scene(...))
 * - Link any associated files to the object (E.g. { tree: 'tree.html' })
 * - Expand the syntax. (E.g. convert 'setter' strings to functions)
 * - Build a list of all of the module's dependencies
 */

function Compiler(options) {
    this.options = Lodash.defaults(Lodash.clone(Compiler.DEFAULTS || {}), Lodash.clone(options || {}));
}

Compiler.DEFAULTS = {
    assetsHost: '',
    assetRegexp: /\@\{[a-zA-Z0-9\:\/\|\.-]+\}/ig,
    assetPrefixRegexp: /\}$/,
    assetSuffixRegexp: /^\@\{/,
    componentDelimiter: ':',
    componentDelimiterRegexp: /:/g,
    configMethodIdentifier: 'config',
    defaultDependencyVersion: 'HEAD',
    defaultImports: {
        'famous:core': ['components', 'dom-element', 'ui-element', 'view', 'wrapper'],
        'famous:events': ['click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup']
    },
    dependenciesKeyName: 'dependencies',
    dependencyBlacklist: { 'localhost': true },
    dependencyRegexp: /([\w-_.]+:)+(([\w-_.]+(?=[\s|>|\/]))|([\w-_.]+(?=:)))/ig,
    entrypointExtnames: { '.js': true },
    eventsFacetKeyName: 'events',
    importsKeyName: 'imports',
    libraryInvocationIdentifiers: {
        'module': true,
        'component': true,
        'scene': true
    },
    libraryMainNamespace: 'BEST',
    treeFacetKeyName: 'tree'
};

Compiler.ERRORS = {
    NO_COMPILER: function(extname) {
        console.warn('No compiler for type `' + extname + '`');
    },
    COMPILE_FAILURE: function(path) {
        console.error('Compilation failed for `' + path + '`');
    },
    NO_ENTRYPOINT: function(name) {
        console.error('No entrypoint file found for `' + name + '`');
    }
};

// Name{String}, Files{Array} -> ?
Compiler.compileModule = function(moduleName, moduleTag, originalFiles, options, finalCB) {
    var compiler = new Compiler(options);

    // Saving bound versions of these functions for better readability below
    var buildDepTableFn = compiler.buildDependencyTable.bind(compiler);
    var compileFileFn = compiler.compileFile.bind(compiler);
    var expandASTFn = compiler.expandAST.bind(compiler);
    var findEntrypointFn = compiler.findEntrypointFile.bind(compiler);
    var findDefinitionASTsFn = compiler.findModuleDefinitionASTs.bind(compiler);
    var findConfigASTsFn = compiler.findModuleConfigASTs.bind(compiler);
    var interpolateASTFn = compiler.interpolateAST.bind(compiler);

    // These are the parts of the compilation object we need to create
    var compiledFiles = Lodash.clone(originalFiles);
    var astTuples = [];
    var dependencyTable = {}; // Table of all modules required by this one
    var entrypointFile; // File object representing the main entrypoint of the module
    var entrypointAST; // AST of the entrypoint file
    var moduleDefinitionASTs; // All definition object ASTs discovered in the entrypoint
    var moduleConfigASTs; // All config object ASTs discovered in the entrypoint

    Async.waterfall([
        // Pre-compile all of the individual files based on their type
        function(cb) {
            Async.map(compiledFiles, compileFileFn, function(err, sources) {
                for (var i = 0; i < compiledFiles.length; i++) {
                    var compiledFile = compiledFiles[i];
                    compiledFile.compiledContent = sources[i];
                    compiledFile.compiledPath = Extensions.compiledPath(compiledFile.path);
                }
                cb(err);
            });
        },
        // Locate the entrypoint file within the files collection
        function(cb) {
            findEntrypointFn(moduleName, compiledFiles, function(err, entrypointFound) {
                entrypointFile = entrypointFound;
                if (!entrypointFile) {
                    Compiler.ERRORS.NO_ENTRYPOINT(moduleName);
                    finalCB(err);
                }
                else {
                    cb(err);
                }
            });
        },
        // Find all module definitions within the entrypoint
        function(cb) {
            entrypointAST = Es.parse(entrypointFile.content);
            findDefinitionASTsFn(entrypointAST, function(err, definitionASTsFound) {
                moduleDefinitionASTs = definitionASTsFound;
                cb(err);
            });
        },
        // Get the configuration object (if any) for any found modules
        function(cb) {
            findConfigASTsFn(entrypointAST, function(err, configASTsFound) {
                moduleConfigASTs = configASTsFound;
                cb(err);
            });
        },
        // Build out tuples for easy processing
        function(cb) {
            for (var moduleName in moduleDefinitionASTs) {
                var newTuple = [];
                newTuple[0] = moduleName;
                newTuple[1] = moduleDefinitionASTs[moduleName] || Es.EMPTY_OBJECT_EXPRESSION;
                newTuple[2] = moduleConfigASTs[moduleName] || Es.EMPTY_OBJECT_EXPRESSION;
                astTuples.push(newTuple);
            }
            cb(null);
        },
        // Link all of the definitions to any requested files
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                compiler.linkAST(definitionAST, compiledFiles, cb);
            }, function(err) {
                finish(err);
            });
        },
        // Expand the syntax into the full form
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                var configAST = astTuple[2];
                expandASTFn(definitionAST, configAST, cb);
            }, function(err) {
                finish(err);
            });
        },
        // Interpolate asset syntax found anywhere in the definition ASTs
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                interpolateASTFn(definitionAST, function(err) {
                    cb(err);
                });
            }, function(err) {
                finish(err);
            });
        },
        // Extract the dependency table for all of the found modules
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                var configAST = astTuple[2];
                buildDepTableFn(definitionAST, configAST, function(err, dependencyTableFound) {
                    Lodash.defaults(dependencyTable, dependencyTableFound);
                    cb(err);
                });
            }, function(err) {
                finish(err);
            });
        },
        // Pass the accumulated results to the caller
        function(cb) {
            finalCB(null, {
                compiledFiles: compiledFiles,
                dependencyTable: dependencyTable,
                entrypointAST: entrypointAST,
                moduleName: moduleName,
                moduleTag: moduleTag,
                originalFiles: originalFiles
            });
        }
    ]);
};

// File{Object} -> File{Object}
Compiler.prototype.compileFile = function(file, cb) {
    var extname = Path.extname(file.path);
    if (Extensions.hasCompilerFor(extname)) {
        try {
            Extensions.compileSource(file.content, extname, function(err, source) {
                cb(err, source);
            });
        }
        catch(error) {
            console.error(error);
            Compiler.ERRORS.COMPILE_FAILURE(file.path);
        }
    }
    else {
        Compiler.ERRORS.NO_COMPILER(extname);
        cb(null, file.content);
    }
};

// String -> Array
Compiler.prototype.getModuleNameParts = function(moduleName) {
    return moduleName.split(this.options.componentDelimiter);
};

// String -> String
Compiler.prototype.getEntrypointBasename = function(moduleName) {
    var moduleNameParts = this.getModuleNameParts(moduleName);
    return moduleNameParts[moduleNameParts.length - 1];
};

// ModuleName{String}, Files{Array} -> File{Object} / False
Compiler.prototype.findEntrypointFile = function(moduleName, files, cb) {
    var entrypointBasename = this.getEntrypointBasename(moduleName);
    var entrypointExtnames = this.options.entrypointExtnames;
    var foundFile = Lodash.find(files, function(file) {
        var filePath = file.path;
        var extname = Path.extname(filePath);
        if (extname in entrypointExtnames) {
            var basename = Path.basename(filePath, extname);
            return basename === entrypointBasename;
        }
        else {
            return false;
        }
    });
    cb(null, foundFile);
};

// ASTNode{Object}, String, Object -> Boolean
function isLibraryInvocation(node, libNamespace, libWhitelist) {
    if (Es.isCallExpression(node)) {
        if (Es.isMemberExpression(node.callee)) {
            var calleeObject = node.callee.object;
            var calleeProperty = node.callee.property;
            if (Es.isIdentifier(calleeObject)) {
                if (Es.isIdentifier(calleeProperty)) {
                    return (calleeObject.name === libNamespace) &&
                           (calleeProperty.name in libWhitelist);
                }
            }
        }
    }
    return false;
}

// AST{Object} -> Object
Compiler.prototype.findLibraryInvocations = function(fullAST, cb) {
    var libraryInvocations = {};
    var libNamespace = this.options.libraryMainNamespace;
    var libWhitelist = this.options.libraryInvocationIdentifiers;
    Es.traverse(fullAST, function(node, parent) {
        if (isLibraryInvocation(node, libNamespace, libWhitelist)) {
            if (node.arguments) {
                var moduleName = node.arguments[0].value;
                libraryInvocations[moduleName] = node;
            }
        }
    });
    cb(null, libraryInvocations);
};

// AST{Object} -> Object
Compiler.prototype.findModuleDefinitionASTs = function(fullAST, cb) {
    this.findLibraryInvocations(fullAST, function(err, libraryInvocations) {
        var moduleDefinitions = {};
        for (var moduleName in libraryInvocations) {
            var libraryInvocation = libraryInvocations[moduleName];
            var moduleDefinition = Es.EMPTY_OBJECT_EXPRESSION;
            if (libraryInvocation.arguments) {
                moduleDefinition = libraryInvocation.arguments[1];
            }
            moduleDefinitions[moduleName] = moduleDefinition;
        }
        cb(null, moduleDefinitions);
    });
};

// AST{Object}, Files{Array} -> *AST{Object}
Compiler.prototype.linkAST = function(definitionAST, files, cb) {
    var treeFacetKeyName = this.options.treeFacetKeyName;
    Es.eachStringProperty(definitionAST, function(facetName, _1, facetValue, _2, facetProp) {
        var facetFile = Lodash.find(files, { path: facetValue });
        if (facetFile) {
            var content = facetFile.compiledContent || facetFile.content;
            facetProp.value = (facetName === treeFacetKeyName)
                ? Es.buildStringLiteralAST(content)
                : Es.parse(content).body[0];
        }
    });
    cb(null, definitionAST);
};

// AST{Object} -> Object
Compiler.prototype.findModuleConfigASTs = function(fullAST, cb) {
    var moduleConfigASTs = {};
    var configMethodIdentifier = this.options.configMethodIdentifier;
    var libraryMainNamespace = this.options.libraryMainNamespace;
    Es.eachChainedMethodCall(fullAST, function(methodName, methodArgs, node, parent) {
        if (methodName === configMethodIdentifier) {
            if (parent && parent.expression && parent.expression.callee && parent.expression.callee.object) {
                var parentCallee = parent.expression.callee.object.callee;
                if (parentCallee.object.name === libraryMainNamespace) {
                    var parentArguments = parent.expression.callee.object.arguments;
                    var moduleName = parentArguments[0].value;
                    var configObjectExpression = node.arguments[0];
                    moduleConfigASTs[moduleName] = configObjectExpression;
                }
            }
        }
    });
    cb(null, moduleConfigASTs);
};

// AST{Object}, Array
Compiler.prototype.findDependencyKeys = function(objectAST, dependenciesList) {
    var dependencyRegexp = this.options.dependencyRegexp;
    var componentDelimiter = this.options.componentDelimiter;
    Es.eachObjectProperty(objectAST, function(keyName, _1, _2, valueObject, propObj) {
        if (dependencyRegexp.test(keyName)) {
            var parts = keyName.split(componentDelimiter);
            var head = parts.splice(0, parts.length - 1);
            dependenciesList.push(head.join(componentDelimiter));
        }
        if (Es.isObjectExpression(valueObject)) {
            this.findDependencyKeys(valueObject, dependenciesList);
        }
    }.bind(this));
}

// AST{Object}, AST{Config} -> Object
Compiler.prototype.buildDependencyTable = function(definitionAST, configAST, cb) {
    // Step 1: Collect dependencies from the definition objects.
    var dependenciesList = [];
    var treeFacetKeyName = this.options.treeFacetKeyName;
    var dependen
    var treeValue;
    Es.eachObjectProperty(definitionAST, function(keyName, _1, actualValue, valueObject) {
        if (keyName === treeFacetKeyName) {
            treeValue = actualValue;
        }
        else {
            if (Es.isObjectExpression(valueObject)) {
                this.findDependencyKeys(valueObject, dependenciesList);
            }            
        }
    }.bind(this));

    // Step 2: Get dependencies from the tree (if a node is present)
    var dependencyRegexp = this.options.dependencyRegexp;
    var dependencyBlacklist = this.options.dependencyBlacklist;
    if (treeValue) {
        var treeMatches = (treeValue || BLANK).match(dependencyRegexp) || [];
        var fixedMatches = [];
        for (var i = 0; i < treeMatches.length; i++) {
           if (!(treeMatches[i] in dependencyBlacklist)) {
               dependenciesList.push(treeMatches[i]);
           }
        }
    }

    // Step 3: Remove any repeats from the list.
    var uniqDependencies = Lodash.uniq(dependenciesList);

    // Step 4: Create a hash map from deps to versions, if any were supplied.
    var defaultDependencyVersion = this.options.defaultDependencyVersion;
    var dependenciesKeyName = this.options.dependenciesKeyName;
    var configObject = Es.getObjectValue(configAST);
    var dependencyTable = configObject[dependenciesKeyName] || {};
    for (var i = 0; i < uniqDependencies.length; i++) {
        var dependencyName = uniqDependencies[i];
        if (!dependencyTable[dependencyName]) {
            dependencyTable[dependencyName] = defaultDependencyVersion;
        }
    }

    // Step 5: Return the accumulated result
    cb(null, dependencyTable);
}

// String, Iterator
function eachAssetMatch(string, options, iterator) {
    var matches = string.match(options.assetRegexp) || [];
    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];
        var str = match + BLANK;
        str = str.replace(options.assetPrefixRegexp, BLANK)
                 .replace(options.assetSuffixRegexp, BLANK)
                 .replace(options.componentDelimiterRegexp, SLASH)
                 .replace(PIPE, SLASH);
        iterator(match, str);
    }
}

// AST{Object} -> *AST{Object}
Compiler.prototype.interpolateAST = function(definitionAST, cb) {
    var thisOptions = this.options;
    var assetsHost = thisOptions.assetsHost;
    Es.eachStringLiteral(definitionAST, function(stringValue, node, parent) {
        var matches = 0;
        eachAssetMatch(stringValue, thisOptions, function(match, replaced) {
            var fullPath = Path.join(assetsHost, replaced);
            stringValue = stringValue.split(match).join(fullPath);
            matches++;
        });
        if (matches > 0) {
            node.value = Es.buildStringLiteralAST(stringValue);
        }
    });
    cb(null);
};

// AST{Object}
Compiler.prototype.expandAST = function(definitionAST, configAST, cb) {
    var eventsFacetKeyName = this.options.eventsFacetKeyName;
    Es.eachObjectProperty(definitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === eventsFacetKeyName) {
            this.expandEventObject(valueObj);
        }
    }.bind(this));
    this.expandShorthandReferences(definitionAST, configAST);
    cb(null);
};

var EVENT_FUNCTION_FILTERS = {
    // Camel-case the given hyphen-separated string
    'camel': function(str) {
        return str.replace(/-([a-z])/g, function(g) {
            return g[1].toUpperCase();
        });
    }
};

// String, Array -> String
function allEventFunctionFilters(key, filters) {
    for (var i = 0; i < filters.length; i++) {
        var filter = filters[i];
        if (EVENT_FUNCTION_FILTERS[filter]) {
            key = EVENT_FUNCTION_FILTERS[filter](key);
        }
    }
    return key;
}

// String, Function -> AST{Object}
function buildEventFunctionAST(key, value) {
    var functionParts = value.split(PIPE);
    var functionKey = functionParts[0];
    var filters = functionParts.slice(1, functionParts.length);
    switch (functionKey) {
        case 'setter':
            var stateName = allEventFunctionFilters(functionKey, filters);
            var fnString = '(function($state,$payload){$state.set(\'' + stateName + '\',$payload);})';
            return Es.parse(fnString).body[0];
    }
}

// AST{Object}
Compiler.prototype.expandEventObject = function(eventsAST) {
    Es.eachObjectProperty(eventsAST, function(keyName, _1, valueVal, valueObj, eventProp) {
        if (Es.isLiteral(valueObj)) {
            eventProp.value = buildEventFunctionAST(keyName, valueVal);
        }
        else if (Es.isObjectExpression(valueObj)) {
            this.expandEventObject(valueObj);
        }
    }.bind(this));
};

// DOMNode, DOMNode, Object, Document
function fixChildNode(node, tree, imports, doc) {
    fixTree(node, imports, doc);
    var newTagName = imports[node.tagName.toLowerCase()] || node.tagName;
    var newNode = doc.createElement(newTagName);
    newNode.innerHTML = node.innerHTML;
    for (var i = 0; i < node.attributes.length; i++) {
        var attr = node.attributes[i];
        newNode.setAttribute(attr.nodeName, attr.nodeValue);
    }
    tree.replaceChild(newNode, node);
}

// DOMNode, Object, Document
function fixTree(tree, imports, doc) {
    for (var i = 0; i < tree.children.length; i++) {
        fixChildNode(tree.children[i], tree, imports, doc);
    }
    return tree.innerHTML;
}

// AST{Object}, Object
function expandObjectKeyShorthands(facetObj, imports, options) {
    Es.eachObjectProperty(facetObj, function(keyName, _2, _3, valueObj, property) {
        if (Es.isObjectExpression(valueObj)) {
            expandObjectKeyShorthands(valueObj, imports, options);
        }
        for (var importNamespace in imports) {
            var importItems = imports[importNamespace];
            for (var i = 0; i < importItems.length; i++) {
                var importItem = importItems[i];
                if (keyName === importItem) {
                    var newKey = importNamespace + options.componentDelimiter + importItem;
                    property.key.value = newKey;
                    property.key.raw = QUOTE + newKey + QUOTE;
                }
            }
        }
    });
};

// AST{Object}, AST{Object}
Compiler.prototype.expandShorthandReferences = function(definitionAST, configAST) {
    // Step 1: Get a simplified (complete) imports object.
    var thisOptions = this.options;
    var treeFacetKeyName = thisOptions.treeFacetKeyName;
    var importsKeyName = thisOptions.importsKeyName;
    var defaultImports = thisOptions.defaultImports;
    var componentDelimiter = thisOptions.componentDelimiter;
    var configObject = Es.getObjectValue(configAST);
    var imports = Lodash.defaults(configObject[importsKeyName] || {}, defaultImports);
    var treeNode;

    // Step 2: Replace shorthand references in the object keys
    Es.eachObjectProperty(definitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === treeFacetKeyName) {
            treeNode = valueObj;
        }
        else if (Es.isObjectExpression(valueObj)) {
            expandObjectKeyShorthands(valueObj, imports, thisOptions);
        }
    });

    // Step 3: Expand the tree from shorthand to long-form.
    if (treeNode) {
        var virtualDOM = Jsdom.jsdom(treeNode.value);
        var doc = virtualDOM.defaultView.document;
        var flatImports = {};
        for (var selector in imports) {
            var array = imports[selector];
            for (var i = 0; i < array.length; i++) {
                flatImports[array[i]] = selector + componentDelimiter + array[i];
            }
        }
        var newTree = fixTree(doc.body, flatImports, doc);
        treeNode.value = newTree;
    }
};

module.exports = Compiler;
