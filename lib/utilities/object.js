'use strict';

var OBJ_TYPE = 'object';

// Deep-clone the given object.
function clone(b) {
    var a;
    if (typeof b === OBJ_TYPE) {
        a = (b instanceof Array) ? [] : {};
        for (var key in b) {
            if (typeof b[key] === OBJ_TYPE && b[key] !== null) {
                if (b[key] instanceof Array) {
                    a[key] = new Array(b[key].length);
                    for (var i = 0; i < b[key].length; i++) {
                        a[key][i] = clone(b[key][i]);
                    }
                }
                else {
                    a[key] = clone(b[key]);
                }
            }
            else {
                a[key] = b[key];
            }
        }
    }
    else {
        a = b;
    }
    return a;
}

// Return a new object merged from the given objects.
function merge(a, b) {
    var c = clone(a);

    for (var key in b) {
        var prop = b[key];
        if (typeof prop === OBJ_TYPE) {
            prop = clone(prop);
        }
        if (prop !== undefined) {
            c[key] = prop;
        }
    }

    return c;
};

module.exports = {
    clone: clone,
    merge: merge
};
