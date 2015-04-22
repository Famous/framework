var Component = require('./component/component');
var DataStore = require('./data-store/data-store');
var Messager = require('./messager/messager');

function register(name, definition) {
    DataStore.registerModule(name, definition);
}

function execute(name, selector, definition) {
    var component = Component.executeComponent(name, selector, definition);
    DataStore.saveExecutedComponent(selector, component);
}

module.exports = {
    register: register,
    execute: execute,
    message: Messager.message
};
