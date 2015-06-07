'use strict';

var tape = require('tape');
var esprima = require('esprima');
var es = require('./../index');
var fs = require('fs');
var path = require('path');

var scriptPath = path.join(__dirname, 'fixtures', 'foo.js');
var scriptCode = fs.readFileSync(scriptPath, { encoding: 'utf8' });
var ast = esprima.parse(scriptCode);

tape('es', function(t) {
    t.plan(2);
    t.ok(es, 'exports');
    t.ok(es.wrap(ast), 'wraps');
    var objASTs = es.getAllNodesOfType(ast, es.TYPES.OBJECT_EXPRESSION);
    objASTs.forEach(function(objAST) {
        es.eachObjectProperty(objAST, function(kn, ko, vv, vo, po, props) {
            // console.log(vv);
        });
    });
    es.eachStringLiteral(ast, function(node) {
        // console.log(node);
    });
    es.eachChainedMethodCall(ast, function(node) {
        // console.log(node);
    });
});
