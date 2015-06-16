'use strict';

var piecewise = require('./piecewise');
var clone = require('./../utilities/object').clone;

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
    formatStyle: formatStyle
};
