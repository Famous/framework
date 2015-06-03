# esprima-helpers

Parsing and AST-exploration helpers for Esprima

## API Reference

    var es = require('es');
    // Do stuff

### Esprima tools wrappers

* `es.parse(code)` - Return the AST for the given source code string
* `es.traverse(ast, iterator)` - Iterate through the AST, passing each node to the iterator
* `es.generate(ast)` - Generate source code from the given AST
* `es.establishAncestry(ast)` - Attach a `parent` pointer to every node object

### Boolean checks

* `es.isArrayExpression(ast)`
* `es.isBinaryExpression(ast)`
* `es.isCallExpression(ast)`
* `es.isConditionalExpression(ast)`
* `es.isFunctionExpression(ast)`
* `es.isIdentifier(ast)`
* `es.isLiteral(ast)`
* `es.isMemberExpression(ast)`
* `es.isNewExpression(ast)`
* `es.isObjectExpression(ast)`

### Getters

* `es.getValueUnsafe(ast)` - Evaluate the given AST
* `es.getArrayValue(ast)` - Given an array AST, return a normal array
* `es.getFunctionValue(ast)` - Given a function AST, return a function object
* `es.getLiteralValue(ast)` - Given a literal AST, return the literal value
* `es.getObjectValue(ast)` - Given an object AST, return a normal object
* `es.getNativeValue(ast)` - Given an arbitrary AST, return the "native" object
* `es.getPropertyKeyName(propertyKeyObj)` - Return the name of the given property key
* `es.getAllNodesOfType(ast, type)` - Return an array of all nodes matching the given type

### Iterators

* `es.eachObjectProperty(objectExpressionAST, iterator)` - Iterate over the object properties
* `es.eachArrayElement(arrayExpressionAST, iterator)` - Iterate over the array elements
* `es.eachNodeOfType(ast, iterator)` - Iterate over all nodes of the given type
* `es.eachStringLiteral(ast, iterator)` - Iterate overall string literals
* `es.eachChainedMethodCall(ast, iterator)` - Iterate over all chained method calls

### Builders

* `es.buildStringLiteralAST(str)` - Build a string literal AST from the given string
