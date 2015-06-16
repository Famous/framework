var state = {
    number: 1,
    string: 'two',
    array: [3, 3, 3],
    boolean: true,
    nestedState: {
        moreNesting: {
            nestingArray: [1, 2, 3]
        }
    }
};

var observerState = {
    args: [],
    hasFired: false,
    hasFiredMoreThanOnce: false
};

// Deep-clone the given object.
function clone(b) {
    var a;
    if (typeof b === 'object') {
        a = (b instanceof Array) ? [] : {};
        for (var key in b) {
            if (typeof b[key] === 'object' && b[key] !== null) {
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

module.exports = {
    state: state,
    clone: clone,
    observerState: observerState
};
