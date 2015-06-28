'use strict';

require('./polyfills/custom-event');

var DataStore = require('./data-store/data-store');
var Deployer = require('./deployer/deployer');
var helpers = require('./helpers/helpers');
var Messenger = require('./messenger/messenger');

var deployer = new Deployer();

function register(name, tag, options, definition) {
    return DataStore.registerModule(name, tag, options, definition);
}

module.exports = {
    attach: deployer.attach.bind(deployer),
    component: register, // alias for 'register'
    deploy: deployer.deploy.bind(deployer),
    execute: deployer.execute.bind(deployer),
    FamousEngine: require('./famous-connector/famous-connector').FamousEngine,
    getComponentByUID: DataStore.getComponent,
    helpers: helpers,
    includes: deployer.includes.bind(deployer),
    markComponentAsReady: deployer.markComponentAsReady.bind(deployer),
    message: Messenger.message,
    module: register, // alias for 'register'
    register: register,
    registerCustomFamousNodeConstructors: DataStore.registerCustomFamousNodeConstructors,
    scene: register // alias for 'register'
};
