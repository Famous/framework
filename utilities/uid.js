'use strict';

var BLANK_STR = '';
var GLOBAL_PREFIX = '*';
var DELIMITER = '-';
var COUNTS = {};

function counter(prefix) {
    if (COUNTS[prefix] === undefined) {
        COUNTS[prefix] = 0;
        return 0;
    }
    else {
        COUNTS[prefix] += 1;
        return COUNTS[prefix];
    }
}

function generate(group) {
    var prefix = (group || GLOBAL_PREFIX) + BLANK_STR;
    var count = counter(prefix) + BLANK_STR;
    var now = Date.now().toString();
    var rand = Math.random().toString(36).slice(2);
    return [prefix, count, now, rand].join(DELIMITER);
}

module.exports = {
    generate: generate
};
