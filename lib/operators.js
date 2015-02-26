'use strict';

// Convenient state operators.
 module.exports = {
    '+': function(a, b) { return a + b},
    '-': function(a, b) { return a - b},
    '*': function(a, b) { return a * b},
    '/': function(a, b) { return a / b},
    'pow': function(a, b) { return Math.pow(a, b)},
    'sqrt': function(a) { return Math.sqrt(a)},
    'abs': function(a) { return Math.abs(a)},
    'sin': function(a) { return Math.sin(a)},
    'cos': function(a) { return Math.cos(a)},
    'tan': function(a) { return Math.tan(a)},
    'ceil': function(a) { return Math.floor(a)},
    'floor': function(a) { return Math.floor(a)},

    'concat': function(a, b) { return a.concat(b)},
    'splice': function(a, b) { return a.splice(b[0], b[1])},
    'toLower': function(a) { return a.toLower()},
    'toUpper': function(a) { return a.toUpper()},
  }
