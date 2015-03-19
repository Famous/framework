'use strict';

var ARRAY_TYPE = 'array';

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
    };

    for (key in set) {
        result.push(key);
    }
    return result;
}

module.exports = {
    each: each,
    union: union
}
