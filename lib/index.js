'use strict';

var DataStore = require('./data-store/data-store');
var Messenger = require('./messenger/messenger');
var Deployer = require('./deploy/deployer');
var helpers = require('./helpers/helpers');

var deployer = new Deployer();

function register(name, tag, definition) {
    return DataStore.registerModule(name, tag, definition);
}

module.exports = {
    component: register, // alias for 'register'
    deploy: deployer.deploy.bind(deployer),
    execute: deployer.execute.bind(deployer),
    helpers: helpers,
    message: Messenger.message,
    module: register, // alias for 'register'
    register: register,
    requires: deployer.requires.bind(deployer),
    scene: register // alias for 'register'
};
