'use strict';

var clone = require('clone');
var generate = require('escodegen').generate;
var parse = require('esprima').parse;
var traverse = require('estraverse').traverse;

var STRING_TYPE = 'string';
var QUOTE = '\'';

function es(ast) {
    var wrappedAST = clone(ast);
    es.establishAncestry(wrappedAST);
    return wrappedAST;
}

es.wrap = function(ast) {
    return es(ast);
};

es.TYPES = {
    ARRAY_EXPRESSION: 'ArrayExpression',
    BINARY_EXPRESSION: 'BinaryExpression',
    CALL_EXPRESSION: 'CallExpression',
    CONDITIONAL_EXPRESSION: 'ConditionalExpression',
    EXPRESSION_STATEMENT: 'ExpressionStatement',
    FUNCTION_EXPRESSION: 'FunctionExpression',
    IDENTIFIER: 'Identifier',
    LITERAL: 'Literal',
    MEMBER_EXPRESSION: 'MemberExpression',
    NEW_EXPRESSION: 'NewExpression',
    OBJECT_EXPRESSION: 'ObjectExpression',
    TEMPLATE_LITERAL: 'TemplateLiteral'
};

es.isArrayExpression = function(subTree) {
    return subTree.type === es.TYPES.ARRAY_EXPRESSION;
};
es.isBinaryExpression = function(subTree) {
    return subTree.type === es.TYPES.BINARY_EXPRESSION;
};
es.isCallExpression = function(subTree) {
    return subTree.type === es.TYPES.CALL_EXPRESSION;
};
es.isConditionalExpression = function(subTree) {
    return subTree.type === es.TYPES.CONDITIONAL_EXPRESSION;
};
es.isFunctionExpression = function(subTree) {
    return subTree.type === es.TYPES.FUNCTION_EXPRESSION;
};
es.isIdentifier = function(subTree) {
    return subTree.type === es.TYPES.IDENTIFIER;
};
es.isLiteral = function(subTree) {
    return subTree.type === es.TYPES.LITERAL;
};
es.isStringLiteral = function(subTree) {
    return es.isLiteral(subTree) && typeof subTree.value === 'string';
};
es.isMemberExpression = function(subTree) {
    return subTree.type === es.TYPES.MEMBER_EXPRESSION;
};
es.isNewExpression = function(subTree) {
    return subTree.type === es.TYPES.NEW_EXPRESSION;
};
es.isObjectExpression = function(subTree) {
    return subTree.type === es.TYPES.OBJECT_EXPRESSION;
};
es.isTemplateLiteral = function(subTree) {
    return subTree.type === es.TYPES.TEMPLATE_LITERAL;
};

es.EMPTY_OBJECT_EXPRESSION = {
    type: es.TYPES.OBJECT_EXPRESSION,
    properties: []
};

es.ESPRIMA_OPTIONS = {
    loc: false,
    range: false,
    raw: true,
    tokens: false,
    comment: false,
    tolerant: false
};

es.parse = function(code) {
    return parse(code, es.ESPRIMA_OPTIONS);
};

es.traverse = function(ast, iterator) {
    traverse(ast, {
        enter: iterator
    });
};

es.generate = function(ast, options) {
    return generate(ast, options);
};

es.establishAncestry = function(ast) {
    es.traverse(ast, function(node, parent) {
        node.parent = parent;
    });
};

es.wrapCodeAsExpression = function(code) {
    return '(' + code + ')';
};

es.wrapCodeAsIIFE = function(code) {
    return '(function(){return ' + code + '\n}())';
};

/*eslint-disable*/

es.getValueUnsafe = function(subTree) {
    return eval(es.wrapCodeAsExpression(es.generate(subTree)));
};

/*eslint-enable*/

// This class is used to wrap up subtrees that are dependant
// on scope in order to evaluate. Internal only.
function ScopeDependant(ast) {
    if (!this instanceof ScopeDependant) return new ScopeDependant(ast);
    this.ast = clone(ast);
    this.needsScope = true;
}

es.buildScopeDependant = function(subTree) {
    return new ScopeDependant(subTree);
};

// We can't return a value for any of these types without
// accessing their scope. So instead of returning an actual
// value, we return a wrapper object so they can be dealt
// with later.
es.getBinaryValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};
es.getCallValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};
es.getConditionalValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};
es.getExpressionStatementValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};
es.getMemberValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};
es.getNewExpressionValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};

es.getArrayValue = function(subTree) {
    var arrayToReturn = [];
    es.eachArrayElement(subTree, function(elementValue) {
        arrayToReturn.push(elementValue);
    });
    return arrayToReturn;
};

es.getIdentifierValue = function(subTree) {
    if (subTree.name === 'undefined') {
        return undefined;
    }
    else if (subTree.name === 'null') {
        return null;
    }
    else {
        return es.buildScopeDependant(subTree);
    }
};

es.getFunctionValue = function(subTree) {
    return es.getValueUnsafe(subTree);
};

es.getLiteralValue = function(subTree) {
    return subTree.value;
};

es.getObjectValue = function(subTree) {
    var objectToReturn = {};
    es.eachObjectProperty(subTree, function(keyName, keyObj, valueValue) {
        objectToReturn[keyName] = valueValue;
    });
    return objectToReturn;
};

es.getTemplateLiteralValue = function(subTree) {
    return es.buildScopeDependant(subTree);
};

es.getNativeValue = function(subTree) {
    switch (subTree.type) {
        case es.TYPES.ARRAY_EXPRESSION: return es.getArrayValue(subTree);
        case es.TYPES.BINARY_EXPRESSION: return es.getBinaryValue(subTree);
        case es.TYPES.CALL_EXPRESSION: return es.getCallValue(subTree);
        case es.TYPES.CONDITIONAL_EXPRESSION: return es.getConditionalValue(subTree);
        case es.TYPES.EXPRESSION_STATEMENT: return es.getExpressionStatementValue(subTree);
        case es.TYPES.FUNCTION_EXPRESSION: return es.getFunctionValue(subTree);
        case es.TYPES.IDENTIFIER: return es.getIdentifierValue(subTree);
        case es.TYPES.LITERAL: return es.getLiteralValue(subTree);
        case es.TYPES.MEMBER_EXPRESSION: return es.getMemberValue(subTree);
        case es.TYPES.NEW_EXPRESSION: return es.getNewExpressionValue(subTree);
        case es.TYPES.OBJECT_EXPRESSION: return es.getObjectValue(subTree);
        case es.TYPES.TEMPLATE_LITERAL: return es.getTemplateLiteralValue(subTree);
        default:
            return es.buildScopeDependant(subTree);
    }
};

es.getPropertyKeyName = function(propertyKey) {
    switch (propertyKey.type) {
        case es.TYPES.LITERAL: return propertyKey.value;
        case es.TYPES.IDENTIFIER: return propertyKey.name;
        default:
            throw new Error('Unknown property key type `' + propertyKey.type + '`');
    }
};

es.eachObjectProperty = function(objectExpression, iterator) {
    var properties = objectExpression.properties;
    for (var i = 0; i < properties.length; i++) {
        var propertyObject = properties[i];
        var keyObject = propertyObject.key;
        var keyName = es.getPropertyKeyName(keyObject);
        var valueObject = propertyObject.value;
        var valueValue = es.getNativeValue(valueObject);
        iterator(
            keyName,
            keyObject,
            valueValue,
            valueObject,
            propertyObject,
            properties
        );
    }
};

es.eachStringProperty = function(objectExpression, iterator) {
    es.eachObjectPropertyOfType(objectExpression, es.TYPES.LITERAL, iterator);
};

es.eachObjectPropertyOfType = function(objectExpression, type, iterator) {
    es.eachObjectProperty(objectExpression, function(kn, ko, vv, vo, po, props) {
        if (vo.type === type) {
            iterator(kn, ko, vv, vo, po, props);
        }
    });
};

es.eachArrayElement = function(arrayExpression, iterator) {
    var elements = arrayExpression.elements;
    for (var i = 0; i < elements.length; i++) {
        var elementObject = elements[i];
        var elementValue = es.getNativeValue(elementObject);
        iterator(elementValue, elementObject, elements);
    }
};

es.eachNodeOfType = function(ast, type, iterator) {
    es.traverse(ast, function(node, parent) {
        if (node.type === type) {
            iterator(node, parent);
        }
    });
};

es.getAllNodesOfType = function(ast, type) {
    var nodesOfType = [];
    es.eachNodeOfType(ast, type, function(node) {
        nodesOfType.push(node);
    });
    return nodesOfType;
};

es.eachStringLiteral = function(ast, iterator) {
    es.eachNodeOfType(ast, es.TYPES.LITERAL, function(node, parent) {
        if (typeof node.value === STRING_TYPE) {
            var stringValue = node.value;
            iterator(stringValue, node, parent);
        }
    });
};

es.eachChainedMethodCall = function(ast, iterator) {
    es.eachNodeOfType(ast, es.TYPES.CALL_EXPRESSION, function(node, parent) {
        if (node.callee && node.callee.type === es.TYPES.MEMBER_EXPRESSION) {
            if (node.callee.object.type === es.TYPES.CALL_EXPRESSION) {
                var methodName = node.callee.property.name;
                var methodArgs = node.arguments;
                iterator(methodName, methodArgs, node, parent);
            }
        }
    });
};

es.buildStringLiteralAST = function(str) {
    return {
        value: str,
        type: es.TYPES.LITERAL,
        raw: QUOTE + str + QUOTE
    };
};

module.exports = es;
