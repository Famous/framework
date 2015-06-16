'use strict';

var DataStore = require('./../data-store/data-store');
var FunctionParser = require('./function-parser');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

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

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

module.exports = {
    camelCase: camelCase,
    getComponent: getComponent,
    getParameterNames: getParameterNames,
    getParentComponent: getParentComponent
};
