'use strict';

var Async = require('async');
var Es = require('./../es');
var Jsdom = require('jsdom');
var Lodash = require('lodash');
var Path = require('path');

var Errors = require('./../errors/errors');
var Extensions = require('./extensions');
var Helper = require('./../helper/helper');

var BLANK = '';
var PIPE = '|';
var QUOTE = '\'';
var BEHAVIORS_KEY = 'behaviors';
var EVENTS_KEY = 'events';
var PASS_THROUGH_KEY = '$pass-through';
var RESERVED_EVENT_VALUES = {};

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
    this.options = Lodash.assign(Lodash.clone(Compiler.DEFAULTS), Lodash.clone(options || {}));
    this.helper = new Helper(this.options);
}

Compiler.DEFAULTS = {
    behaviorsFacetKeyName: 'behaviors',
    behaviorSetterRegex: /^\[\[[\w|\|]+\]\]$/,
    configMethodIdentifier: 'config',
    defaultDependencyVersion: 'HEAD',
    defaultImports: {
        'famous:core': ['components', 'context', 'dom-element', 'ui-element', 'view', 'wrapper'],
        'famous:events': [
            'click', 'dblclick', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseenter',
            'mouseleave', 'mouseout', 'mouseover', 'mouseup', 'size-change', 'parent-size-change', 'touchstart',
            'touchmove', 'touchend'
        ]
    },
    dependenciesKeyName: 'dependencies',
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

// Name{String}, Files{Array}, Object -> Result
Compiler.prototype.compileModule = function(moduleName, originalFiles, options, finalCB) {
    // Saving bound versions of these functions for better readability below
    var buildDepTableFn = this.buildDependencyTable.bind(this);
    var compileFileFn = this.compileFile.bind(this);
    var expandASTFn = this.expandAST.bind(this);
    var findEntrypointFn = this.findEntrypointFile.bind(this);
    var findDefinitionASTsFn = this.findModuleDefinitionASTs.bind(this);
    var findConfigASTsFn = this.findModuleConfigASTs.bind(this);
    var findTagFn = this.findModuleTag.bind(this);
    var interpolateASTFn = this.interpolateAST.bind(this);
    var linkASTFn = this.linkAST.bind(this);

    // These are the parts of the compilation object we need to create
    var compiledFiles = Lodash.clone(originalFiles);
    var astTuples = [];
    var dependencyTable = {}; // Table of all modules required by this one
    var entrypointFile; // File object representing the main entrypoint of the module
    var entrypointAST; // AST of the entrypoint file
    var moduleDefinitionASTs; // All definition object ASTs discovered in the entrypoint
    var moduleConfigASTs; // All config object ASTs discovered in the entrypoint
    var moduleTag;

    Async.waterfall([
        // Pre-compile all of the individual files based on their type
        function(cb) {
            Async.map(compiledFiles, compileFileFn, function(err, sources) {
                Errors.handle(err, 'failed-precompilation', {}, cb, finalCB, function() {
                    for (var i = 0; i < compiledFiles.length; i++) {
                        var compiledFile = compiledFiles[i];
                        compiledFile.compiledContent = sources[i];
                        compiledFile.compiledPath = Extensions.compiledPath(compiledFile.path);
                    }
                    cb(null);
                });
            });
        },
        // Locate the entrypoint file within the files collection
        function(cb) {
            findEntrypointFn(moduleName, compiledFiles, function(err, entrypointFound) {
                Errors.handle(err, 'failed-finding-entrypoint', { moduleName: moduleName }, cb, finalCB, function() {
                    entrypointFile = entrypointFound;
                    cb(null);
                });
            });
        },
        // Find all module definitions within the entrypoint
        function(cb) {
            if (!entrypointFile) {
                Errors.handle('No entrypoint found', 'failed-finding-entrypoint', { moduleName: moduleName }, cb, finalCB, function(){});
            }
            else {
                entrypointAST = Es.parse(entrypointFile.compiledContent);
                findDefinitionASTsFn(entrypointAST, function(err, definitionASTsFound) {
                    Errors.handle(err, 'failed-finding-definition-asts', {}, cb, finalCB, function() {
                        moduleDefinitionASTs = definitionASTsFound;
                        cb(null);
                    });
                });
            }
        },
        // Find the module version tag
        function(cb) {
            findTagFn(moduleName, entrypointAST, function(err, tagFound) {
                Errors.handle(err, 'failed-finding-tag', { moduleName: moduleName }, cb, finalCB, function() {
                    moduleTag = tagFound;
                    cb(null);
                });
            });
        },
        // Get the configuration object (if any) for any found modules
        function(cb) {
            findConfigASTsFn(entrypointAST, function(err, configASTsFound) {
                Errors.handle(err, 'failed-finding-config', {}, cb, finalCB, function() {
                    moduleConfigASTs = configASTsFound;
                    cb(null);
                });
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
                linkASTFn(definitionAST, compiledFiles, cb);
            }, function(err) {
                Errors.handle(err, 'failed-linking-definitions', {}, finish, finalCB, function() {
                    finish(null);
                });
            });
        },
        // Expand the syntax into the full form
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                var configAST = astTuple[2];
                expandASTFn(definitionAST, configAST, cb);
            }, function(err) {
                Errors.handle(err, 'failed-expanding-syntax', {}, finish, finalCB, function() {
                    finish(null);
                });
            });
        },
        // Interpolate asset syntax found anywhere in the definition ASTs
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                interpolateASTFn(moduleName, moduleTag, definitionAST, function(err) {
                    Errors.handle(err, 'failed-interpolating-strings', {}, finish, finalCB, function() {
                        cb(null);
                    });
                });
            }, function(err) {
                Errors.handle(err, 'failed-interpolating-strings', {}, finish, finalCB, function() {
                    finish(null);
                });
            });
        },
        // Extract the dependency table for all of the found modules
        function(finish) {
            Async.map(astTuples, function(astTuple, cb) {
                var definitionAST = astTuple[1];
                var configAST = astTuple[2];
                buildDepTableFn(definitionAST, configAST, function(err, dependencyTableFound) {
                    Errors.handle(err, 'failed-building-dependency-table', {}, finish, finalCB, function() {
                        Lodash.defaults(dependencyTable, dependencyTableFound);
                        cb(err);
                    });
                });
            }, function(err) {
                Errors.handle(err, 'failed-building-dependency-table', {}, finish, finalCB, function() {
                    finish(err);
                });
            });
        },
        // Pass the accumulated results to the caller
        function(cb) {
            finalCB(null, {
                compiledFiles: compiledFiles,
                configs: Lodash.map(moduleConfigASTs, Es.getObjectValue),
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
    if (this.helper.looksLikeAsset(file)) {
        cb(null, file.content);
    }
    else {
        var extname = Path.extname(file.path);
        if (Extensions.hasCompilerFor(extname)) {
            try {
                Extensions.compileSource(file.content, extname, function(err, source) {
                    Errors.handle(err, 'failed-compiling-source', { filePath: file.path }, null, cb, function() {
                        cb(null, source);
                    });
                });
            }
            catch (err) {
                Errors.handle(err, 'failed-compiling-source', { filePath: file.path }, null, cb, function() {
                    cb(null, file.content);
                });
            }
        }
        else {
            Errors.handle('Warning: No compiler found!', 'no-compiler-found', { extname: extname }, null, cb, function() {
                cb(null, file.content);
            });
        }
    }
};

// ModuleName{String}, Files{Array} -> File{Object} / False
Compiler.prototype.findEntrypointFile = function(moduleName, files, cb) {
    var entrypointBasename = this.helper.getEntrypointBasename(moduleName);
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
        if (err) {
            throw (err);
        }
        var moduleDefinitions = {};
        for (var moduleName in libraryInvocations) {
            var libraryInvocation = libraryInvocations[moduleName];
            var moduleDefinition = Es.EMPTY_OBJECT_EXPRESSION;
            if (libraryInvocation.arguments) {
                moduleDefinition = libraryInvocation.arguments[2];
            }
            moduleDefinitions[moduleName] = moduleDefinition;
        }
        cb(null, moduleDefinitions);
    });
};

// String, AST{Object} -> String
Compiler.prototype.findModuleTag = function(name, fullAST, cb) {
    this.findLibraryInvocations(fullAST, function(err, libraryInvocations) {
        if (err) {
            throw (err);
        }
        var moduleTag;
        for (var moduleName in libraryInvocations) {
            // Only assume the main module has the correct tag.
            if (moduleName === name) {
                var libraryInvocation = libraryInvocations[moduleName];
                if (libraryInvocation.arguments) {
                    moduleTag = libraryInvocation.arguments[1];
                }
            }
        }
        if (moduleTag) {
            if (Es.isLiteral(moduleTag) && moduleTag.value) {
                cb(null, moduleTag.value);    
            }
            else {
                Errors.handle(new Error('Missing or malformed module tag!'), 'bad-module-tag-found', { moduleName: name }, null, cb, function(fixed) {
                    cb(null, fixed);
                });
            }
        }
        else {
            Errors.handle(new Error('No module tag found!'), 'no-module-tag-found', { moduleName: name }, null, cb, function(fixed) {
                cb(null, fixed);
            });
        }
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
/*
behaviors
    selector
        behavior-name --> Level 2 depth is only location that may contain dependencies
            values
 */
Compiler.prototype.findDependencyKeys = function(objectAST, dependenciesList) {
    var self = this;
    Es.eachObjectProperty(objectAST, function(_0, _1, _2, selectorObject, propObj) {
        if (selectorObject) {
            Es.eachObjectProperty(selectorObject, function(keyName){
                if (self.helper.looksLikeDependency(keyName)) {
                    dependenciesList.push(self.helper.getDependencyModuleName(keyName));
                }
            });
        }
    });
};

// AST{Object}, AST{Config} -> Object
Compiler.prototype.buildDependencyTable = function(definitionAST, configAST, cb) {
    // Step 1: Collect dependencies from the definition objects.
    var dependenciesList = [];
    var treeFacetKeyName = this.options.treeFacetKeyName;
    var treeValue;
    Es.eachObjectProperty(definitionAST, function(keyName, _1, actualValue, valueObject) {
        if (keyName === treeFacetKeyName) {
            treeValue = actualValue;
        }
        else {
            if (Es.isObjectExpression(valueObject)) {
                // `states` object cannot have any dependencies
                if (keyName === BEHAVIORS_KEY || keyName === EVENTS_KEY) {
                    this.findDependencyKeys(valueObject, dependenciesList);
                }
            }
        }
    }.bind(this));


    if (treeValue) {
        this.helper.eachDependencyIn(treeValue || BLANK, function(match) {
            dependenciesList.push(match);
        });
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
};

// AST{Object} -> *AST{Object}
Compiler.prototype.interpolateAST = function(name, tag, definitionAST, cb) {
    var fullPath;
    Es.eachStringLiteral(definitionAST, function(stringValue, node, parent) {
        var moduleCDNMatch = this.helper.getModuleCDNMatch(stringValue);
        if (moduleCDNMatch) {
            var moduleName = moduleCDNMatch.value.split(PIPE)[1] || name;
            fullPath = this.helper.getFullAssetPath(moduleName, tag, '');
            node.value = stringValue.split(moduleCDNMatch.match).join(fullPath);
        }
        else {
            var matches = 0;
            this.helper.eachAssetMatch(stringValue, function(match, replaced) {
                fullPath = this.helper.getFullAssetPath(name, tag, replaced);
                stringValue = stringValue.split(match).join(fullPath);
                matches++;
            }.bind(this));

            if (matches > 0) {
                node.value = stringValue;
            }
        }
    }.bind(this));
    cb(null);
};

// AST{Object}
Compiler.prototype.expandAST = function(definitionAST, configAST, cb) {
    var behaviorsFacetKeyName = this.options.behaviorsFacetKeyName;
    var eventsFacetKeyName = this.options.eventsFacetKeyName;
    Es.eachObjectProperty(definitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === behaviorsFacetKeyName) {
            this.expandBehaviorsObject(valueObj);
        }
        else if (facetName === eventsFacetKeyName) {
            this.expandEventObject(valueObj);
        }
    }.bind(this));
    this.expandShorthandReferences(definitionAST, configAST);
    cb(null);
};

var FUNCTION_FILTERS = {
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
        if (FUNCTION_FILTERS[filter]) {
            key = FUNCTION_FILTERS[filter](key);
        }
    }
    return key;
}

function buildFunctionAST(key, value, fnStringTemplate) {
    var functionParts = value.split(PIPE);
    var functionKey = functionParts[0];
    var filters = functionParts.slice(1, functionParts.length);
    var stateName;
    var fnString;
    var body;
    switch (functionKey) {
        case 'setter':
            stateName = allEventFunctionFilters(key, filters);
            fnString = fnStringTemplate(stateName);
            body = Es.parse(fnString).body[0];
            return body.expression;
        case 'identity':
            stateName = filters.splice(-1); // 'identity|myContent'
            stateName = allEventFunctionFilters(stateName, filters);
            fnString = behaviorFnStringTemplate(stateName);
            body = Es.parse(fnString).body[0];
            return body.expression;
        default:
            throw new Error('`' + functionKey + '` is not a valid value for an event.');
    }
}

function behaviorFnStringTemplate(stateName) {
    return '(function(' + stateName + '){ return ' + stateName + '; })';
}

Compiler.prototype.expandBehaviorsObject = function(behaviorsAST) {
    // Loop through behavior selectors
    Es.eachObjectProperty(behaviorsAST, function(_0, _1, _2, valueObj) {
        // Loop through behaviors
        Es.eachObjectProperty(valueObj, function(keyName, _1, subValueVal, subValueObj, eventProp) {
            if (Es.isStringLiteral(subValueObj) && subValueVal.match(Compiler.DEFAULTS.behaviorSetterRegex)) {
                subValueVal = subValueVal.substr(2, subValueVal.length - 4); // Remove brackets
                eventProp.value = buildFunctionAST(keyName, subValueVal, behaviorFnStringTemplate);
            }
        });
    });
};

function eventFnStringTemplate(stateName) {
    return '(function($state,$payload){$state.set(\'' + stateName + '\',$payload);})';
}

// AST{Object}
Compiler.prototype.expandEventObject = function(eventsAST) {
    Es.eachObjectProperty(eventsAST, function(keyName, _1, valueVal, valueObj, eventProp) {
        if (Es.isLiteral(valueObj)) {
            // Whitelist of event string values are processed on client
            if (!(valueVal in RESERVED_EVENT_VALUES)) {
                eventProp.value = buildFunctionAST(keyName, valueVal, eventFnStringTemplate);
            }
        }
        else if (Es.isObjectExpression(valueObj)) {
            if (keyName !== PASS_THROUGH_KEY) {
                this.expandEventObject(valueObj);
            }
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
Compiler.prototype.expandObjectKeyShorthands = function(facetObj, imports) {
    Es.eachObjectProperty(facetObj, function(keyName, _2, _3, valueObj, property) {
        if (Es.isObjectExpression(valueObj)) {
            this.expandObjectKeyShorthands(valueObj, imports);
        }
        for (var importNamespace in imports) {
            var importItems = imports[importNamespace];
            for (var i = 0; i < importItems.length; i++) {
                var importItem = importItems[i];
                if (keyName === importItem) {
                    var newKey = this.helper.buildModuleName(importNamespace, importItem);
                    property.key.value = newKey;
                    property.key.raw = QUOTE + newKey + QUOTE;
                }
            }
        }
    }.bind(this));
};

// AST{Object}, AST{Object}
Compiler.prototype.expandShorthandReferences = function(definitionAST, configAST) {
    // Step 1: Get a simplified (complete) imports object.
    var thisOptions = this.options;
    var treeFacetKeyName = thisOptions.treeFacetKeyName;
    var importsKeyName = thisOptions.importsKeyName;
    var defaultImports = thisOptions.defaultImports;
    var configObject = Es.getObjectValue(configAST);
    var imports = Lodash.defaults(configObject[importsKeyName] || {}, defaultImports);
    var treeNode;

    // Step 2: Replace shorthand references in the object keys
    Es.eachObjectProperty(definitionAST, function(facetName, _1, _2, valueObj) {
        if (facetName === treeFacetKeyName) {
            treeNode = valueObj;
        }
        else if (Es.isObjectExpression(valueObj)) {
            this.expandObjectKeyShorthands(valueObj, imports);
        }
    }.bind(this));

    // Step 3: Expand the tree from shorthand to long-form.
    if (treeNode) {
        var virtualDOM = Jsdom.jsdom(treeNode.value);
        var doc = virtualDOM.defaultView.document;
        var flatImports = this.helper.getFlatImports(imports);
        var newTree = fixTree(doc.body, flatImports, doc);
        treeNode.value = newTree;
    }
};

module.exports = Compiler;
