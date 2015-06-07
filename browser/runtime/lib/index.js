'use strict';

var DataStore = require('./data-store/data-store');
var Messenger = require('./messenger/messenger');
var Deployer = require('./deploy/deployer');
var helpers = require('./helpers/helpers');

var deployer = new Deployer();

function register(name, tag, options, definition) {
    return DataStore.registerModule(name, tag, options, definition);
}

module.exports = {
    attach: deployer.attach.bind(deployer),
    deploy: deployer.deploy.bind(deployer),
    execute: deployer.execute.bind(deployer),
    includes: deployer.includes.bind(deployer),
    register: register,
    component: register, // alias for 'register'
    module: register, // alias for 'register'
    scene: register, // alias for 'register'
    message: Messenger.message,
    helpers: helpers
};
