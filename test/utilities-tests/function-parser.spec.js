'use strict';

var test = require('tape');
var functionParser = require('./../../lib/utilities/function-parser');
var getParameterNames = functionParser.getParameterNames;

var fn = function(one, two, three, four) {};
function func(one, two, three, four) {}
var fnArgs = ['one', 'two', 'three', 'four'];

test('getParameterNames', function(t) {
  t.plan(3);
  t.ok(getParameterNames, 'exports');
  t.same(getParameterNames(fn), fnArgs, 'should return function arguments for function expressions');
  t.same(getParameterNames(func), fnArgs, 'should return function arguments for function declarations');
  t.end();
});
