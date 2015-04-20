var Component = require('./component/component');
var DataStore = require('./data-store/data-store');

function register(name, definition) {
    DataStore.registerModule(name, definition);
}

function execute(name, selector, definition) {
    Component.executeComponent(name, selector, definition);
}

module.exports = {
    register: register,
    execute: execute
};
