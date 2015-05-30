'use strict';

function handleArrayInput (operator, a, b) {
    if (Array.isArray(b)) {
        for (var i = 0; i < b.length; i++) {
            if (b === a.length) return undefined;
            a[i] = operations[operator](a[i], b[i]);
        }
    }
    else {
        for (var j = 0; j < a.length; j++) {
            a[j] = operations[operator](a[j], b);
        }
    }

    return a;
}

// Check for number/string/array
function isTypeValid(input) {
    return !isNaN(input) || typeof(input) === 'string' || Array.isArray(input);
}

// Convenient state operators.
var operations = {
    '+': function(a, b) {
        return a + b;
    },
    '-': function(a, b) {
        return a - b;
    },
    '*': function(a, b) {
        return a * b;
    },
    '/': function(a, b) {
        return a / b;
    },
    'pow': function(a, b) {
        return Math.pow(a, b);
    },
    'sqrt': function(a) {
        return Math.sqrt(a);
    },
    'abs': function(a) {
        return Math.abs(a);
    },
    'sin': function(a) {
        return Math.sin(a);
    },
    'cos': function(a) {
        return Math.cos(a);
    },
    'tan': function(a) {
        return Math.tan(a);
    },
    'ceil': function(a) {
        return Math.ceil(a);
    },
    'floor': function(a) {
        return Math.floor(a);
    },
    'concat': function(a, b) {
        return a.concat(b);
    },
    'substring': function(a, b) {
        return a.substring(b[0], b[1]);
    },
    'toLower': function(a) {
        return a.toLowerCase();
    },
    'toUpper': function(a) {
        return a.toUpperCase();
    },
    'flip': function(a) {
        return !a;
    },
    'toInt': function(a) {
        return a ? 1 : 0;
    }
};

 module.exports = {
    operate: function(operator, currentValue, newValue) {
        if (newValue) {
            if (!(isTypeValid(currentValue) && isTypeValid(newValue))) {
                console.warn('<currentValue :', currentValue, '> or <newValue: ', newValue, '> is not a valid input type');
                throw new Error('Invalid input');
            }
            else if (!Array.isArray(currentValue) && Array.isArray(newValue)) {
                if (typeof(currentValue) !== 'string') { // special case for 'substring' operation
                    console.warn('An array can not be used as input to operate on a non-array');
                    throw new Error('Invalid input');
                }
            }
        }

        if (Array.isArray(currentValue)) {
            return handleArrayInput(operator, currentValue, newValue);
        }
        else {
            return operations[operator](currentValue, newValue);
        }
     },
     addOperation: function(name, func) {
        operations[name] = func;
     }
 };


