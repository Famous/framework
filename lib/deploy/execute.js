'use strict';

var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

function execute(name, selector) {
    var component = Component.executeComponent(name, selector);
    window.c = component;
    DataStore.saveExecutedComponent(selector, component);
}

module.exports = execute;
