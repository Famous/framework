'use strict';

/**
 * Returns an array of the passed-in function's arguments.
 */

var LPAREN = '(';
var RPAREN = ')';
var REGEXP = /([^\s,]+)/g;

function getParameterNames(fn) {
    var fnString = fn.toString();
    var matches = fnString.slice(fnString.indexOf(LPAREN) + 1, fnString.indexOf(RPAREN)).match(REGEXP);
    return matches || [];
}

module.exports = {
    getParameterNames: getParameterNames
};
