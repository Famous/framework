'use strict';

var escodegen = require('escodegen');
var esprima = require('esprima');
var estraverse = require('estraverse');
var traverse = require('traverse');

var CALL = 'CallExpression';
var CONFIG_NAME = 'config';
var IDENTIFIER = 'Identifier';
var INVOKE_WHITELIST = ['module', 'component', 'scene'];
var LIB_NAME = 'BEST';
var LITERAL = 'Literal';
var MEMBER = 'MemberExpression';
var QUOTE = '\'';
var OBJECT_EXPRESSION = 'ObjectExpression';
var RETURN_PREFIX = '(function(){return ';
var RETURN_SUFFIX = '\n}());';
var STRING_TYPE = 'string';
var TREE_FACET_KEY = 'tree';

var EMPTY_CONFIG = { type: OBJECT_EXPRESSION, properties: [] };

function getKeyName(key) {
    switch (key.type) {
        case LITERAL: return key.value;
        case IDENTIFIER: return key.name;
        default:
            throw new Error('Unknown key type');
    }
}

function eachLiteral(objExpr, iterator) {
    eachProperty(objExpr, function(key, value, property) {
        if (value.type === LITERAL) {
            iterator(key, value.value, property, objExpr);
        }
    });
}

function everyStringValue(ast, iterator) {
    traverse(ast).forEach(function(value) {
        if (typeof value === STRING_TYPE) {
            iterator(value, this);
        }
    });
}

function eachProperty(objExpr, iterator) {
    var properties = objExpr.properties;
    for (var i = 0; i < properties.length; i++) {
        var property = properties[i];
        var key = getKeyName(property.key);
        var value = property.value;
        iterator(key, value, property, objExpr);
    }
}

function eachElement(arr, iterator) {
    for (var i = 0; i < arr.elements.length; i++) {
        var element = arr.elements[i];
        iterator(element.value, element, i);
    }
}

function buildLiteral(str) {
    return {
        type: LITERAL,
        value: str,
        raw: QUOTE + str + QUOTE
    };
}

function returnBody(str) {
    var parsed = esprima.parse(str);
    var body = getASTBody(parsed);
    return body;
}

function getASTBody(ast) {
    return ast.body[0].expression;
}

function isModuleInvocation(node) {
    // We're looking for `BEST.module(...)` or `BEST.scene(...)`...
    if (node.type === CALL && node.callee.type === MEMBER) {
        var callee = node.callee;
        var obj = callee.object;
        var prop = callee.property;
        if (obj.type === IDENTIFIER &&
            obj.name === LIB_NAME &&
            prop.type === IDENTIFIER) {

            if (INVOKE_WHITELIST.indexOf(prop.name) !== -1) {
                return true;
            }
        }
    }
    return false;
}

function getModuleInvocation(ast) {
    var invocations = [];
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (isModuleInvocation(node)) {
                invocations.push(node);
            }
        }
    });
    return invocations[0];
}

function isConfigCall(node, parent) {
    if (node.type === CALL && node.callee.type === MEMBER) {
        var pexpression = parent.expression;
        if (pexpression && pexpression.type === CALL && pexpression.callee.object) {
            if (isModuleInvocation(pexpression.callee.object)) {
                if (node.callee.property && node.callee.property.name === CONFIG_NAME) {
                    return true;
                }
            }
        }
    }
    return false;
}

function getConfig(ast) {
    var configs = [];
    estraverse.traverse(ast, {
        enter: function(node, parent) {
            if (isConfigCall(node, parent)) {
                configs.push(node.arguments[0]);
            }
        }
    });
    return configs[0] || EMPTY_CONFIG;
}

function getName(ast) {
    var modInvoke = getModuleInvocation(ast);
    return modInvoke.arguments[0];
}

function getDefinition(ast) {
    var modInvoke = getModuleInvocation(ast);
    return modInvoke.arguments[1];
}

function getTreeNode(definition) {
    var treeNode;
    eachProperty(definition, function(defKey, defValue) {
        if (defKey === TREE_FACET_KEY) {
            treeNode = defValue;
        }
    });
    return treeNode;
}

function isObjectExpression(ast) {
    return ast.type === OBJECT_EXPRESSION;
}

function parse(code) {
    return esprima.parse(code);
}

function generate(ast) {
    return escodegen.generate(ast);
}

module.exports = {
    buildLiteral: buildLiteral,
    everyStringValue: everyStringValue,
    getConfig: getConfig,
    generate: generate,
    getDefinition: getDefinition,
    eachElement: eachElement,
    eachLiteral: eachLiteral,
    eachProperty: eachProperty,
    getKeyName: getKeyName,
    getName: getName,
    getASTBody: getASTBody,
    getTreeNode: getTreeNode,
    isObjectExpression: isObjectExpression,
    parse: parse,
    returnBody: returnBody
};
