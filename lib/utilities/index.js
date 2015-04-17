var FunctionParser = require('best-function-parser');

var FUNC_TYPE = 'function';

function getParameterNames(obj) {
    FunctionParser.getParameterNames;

    var isFunction = obj === FUNC_TYPE;

    if (typeof(obj) === FUNC_TYPE) {
        return FunctionParser.getParameterNames(obj);
    }
    else {
        return null;
    }
}

module.exports = {
    getParameterNames: getParameterNames
};
