var Component = require('./component/component');
var DataStore = require('./data-store/data-store');
var Messenger = require('./messenger/messenger');
var Deploy = require('./deploy/deploy');
var execute = require('./deploy/execute');

function register(name, definition) {
    return DataStore.registerModule(name, definition);
}

module.exports = {
    register: register,
    scene: register, // alias
    module: register, // alias
    component: register, // alias
    execute: execute,
    message: Messenger.message,
    deploy: Deploy.deploy
};
