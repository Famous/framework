'use strict';

var FunctionParser = require('framework-utilities/function-parser');
var DataStore = require('../data-store/data-store');
var VirtualDOM = require('../virtual-dom/virtual-dom');

var FUNC_TYPE = 'function';

function getParameterNames(obj) {
    if (typeof obj === FUNC_TYPE) {
        return FunctionParser.getParameterNames(obj);
    }
    else {
        return null;
    }
}

function getComponent(node) {
    return DataStore.getComponent(VirtualDOM.getUID(node));
}

function getParentComponent(node) {
    if (!node.parentNode) {
        throw new Error('Cannot get a parent component for a virtual dom node that does not have a parent');
    }

    return DataStore.getComponent(VirtualDOM.getParentUID(node));
}

module.exports = {
    getParameterNames: getParameterNames,
    getComponent: getComponent,
    getParentComponent: getParentComponent
};
