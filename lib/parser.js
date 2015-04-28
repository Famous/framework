'use strict';

var esprima = require('esprima');
var traverse = require('traverse');

var IDENTIFIER = 'Identifier';
var LITERAL = 'Literal';
var QUOTE = '\'';
var OBJECT_EXPRESSION = 'ObjectExpression';
var RETURN_PREFIX = '(function(){return ';
var RETURN_SUFFIX = '\n}());';
var STRING_TYPE = 'string';
var TREE_FACET_KEY = 'tree';

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
    var body = getBody(parsed);
    return body;
}

function getBody(ast) {
    return ast.body[0].expression;
}

function getName(ast) {
    var body = getBody(ast);
    return body.callee.object.arguments[0];
}

function getConfig(ast) {
    var body = getBody(ast);
    return body.arguments[0];
}

function getDefinition(ast) {
    var body = getBody(ast);
    return body.callee.object.arguments[1];
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

module.exports = {
    buildLiteral: buildLiteral,
    everyStringValue: everyStringValue,
    getConfig: getConfig,
    getDefinition: getDefinition,
    eachElement: eachElement,
    eachLiteral: eachLiteral,
    eachProperty: eachProperty,
    getKeyName: getKeyName,
    getName: getName,
    getBody: getBody,
    getTreeNode: getTreeNode,
    isObjectExpression: isObjectExpression,
    parse: parse,
    returnBody: returnBody
};
