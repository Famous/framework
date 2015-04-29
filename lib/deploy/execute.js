var Component = require('./../component/component');
var DataStore = require('./../data-store/data-store');

function execute(name, selector) {
    var component = Component.executeComponent(name, selector);
    DataStore.saveExecutedComponent(selector, component);
}

module.exports = execute;
