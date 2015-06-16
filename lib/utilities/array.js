'use strict';

var ObjectUtils = require('./object');

// Iterate over the array, passing each element to the given function.
function each(a, cb) {
    for (var i = 0; i < a.length; i++) {
        cb(a[i]);
    }
}

// Return the set of elements that appear in both arrays `a` and `b`.
function union(a, b) {
    var set = {};
    var maxLength = Math.max(a.length, b.length);
    var result = [];
    var i, key;

    for (i = 0; i < maxLength; i++) {
        if (i < a.length) set[a[i]] = true;
        if (i < b.length) set[b[i]] = true;
    }

    for (key in set) {
        result.push(key);
    }
    return result;
}

/**
 * Iterates over each element in a pair of arrays and returns a result array
 * signifying whether elements at a shared index are equal.
 * @param  {Array} a
 * @param  {Array} b
 * @return {Array} Array of booleans; 'true' signifies that the elements that share
 *                 that index are equal, 'false' signifies that the elements at that
 *                 index are not equal.
 */
function checkElementEquality(a, b) {
    var maxLength = Math.max(a.length, b.length);
    var result = [];
    var isEqual;

    for (var i = 0; i < maxLength; i++) {
        isEqual = (a.length > i && b.length > i) ? ObjectUtils.isEqual(a[i], b[i]) : false;
        result.push(isEqual);
    }
    return result;
}

/**
 * Checks to see if two arrays share a given value.
 * @param  {Array} a
 * @param  {Array} b
 * @return {Boolean}
 */
function shareValue(a, b) {
    for (var i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) !== -1) {
            return true;
        }
    }
    return false;
}

module.exports = {
    each: each,
    union: union,
    checkElementEquality: checkElementEquality,
    shareValue: shareValue
};
