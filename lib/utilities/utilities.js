'use strict';

var FunctionParser = require('best-function-parser');
var FUNC_TYPE = 'function';

function getParameterNames(obj) {
    if (typeof obj === FUNC_TYPE) {
        return FunctionParser.getParameterNames(obj);
    }
    else {
        return null;
    }
}

module.exports = {
    getParameterNames: getParameterNames
};
