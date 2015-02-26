'use strict';

// Convenient state operators.
 module.exports = {
    '+': function(a, b) { return a + b},
    '-': function(a, b) { return a - b},
    '*': function(a, b) { return a * b},
    '/': function(a, b) { return a / b},
    'pi': function(a) { return a * Math.PI},
    'pow': function(a, b) { return Math.pow(a, b)},
    'sqrt': function(a) { return Math.sqrt(a)},
    'abs': function(a) { return Math.abs(a)},
    'sin': function(a) { return Math.sin(a)},
    'cos': function(a) { return Math.cos(a)},
    'tan': function(a) { return Math.tan(a)},
    'ceil': function(a) { return Math.floor(a)},
    'floor': function(a) { return Math.floor(a)},
  }
