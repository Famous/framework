'use strict';

var piecewise = require('./piecewise');
var clone = require('./../utilities/object').clone;

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            func.apply(context, args);
        }
    };
}

function formatStyle(styleObj) {
    var styleStr = '';
    for (var name in styleObj) {
        styleStr += name + ':' + styleObj[name] + '; ';
    }
    return styleStr;
}

module.exports = {
    piecewise: piecewise,
    clone: clone,
    formatStyle: formatStyle,
    debounce: debounce
};
