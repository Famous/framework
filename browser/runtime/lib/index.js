'use strict';

var DataStore = require('./data-store/data-store');
var Messenger = require('./messenger/messenger');
var Deployer = require('./deploy/deployer');
var helpers = require('./helpers/helpers');

var deployer = new Deployer();

// We use the module's tag for reference, so we need to give
// any modules that happen to not have a tag a default one.
var UNSPECIFIED_TAG = '!unspecified!';
var OBJECT_TYPE = 'object';

function returnUnspecifiedTag(name, tag) {
    console.warn('Tag given for `' + name + '` was `' + tag + '`; defaulting to `unspecified` instead');
    return UNSPECIFIED_TAG;
}

function register(name, tag, definition) {
    // Allow the arguments to `register` to be flexible, i.e. allow:
    // BEST.scene('foo:bar') (e.g. for a timeline-only API)
    // BEST.scene('foo:bar', {...}),
    // BEST.scene('foo:bar', '0.1', {...})
    if (!definition) {
        if (!tag) {
            definition = {};
            tag = returnUnspecifiedTag(name tag);
        }
        else {
            if (typeof tag === OBJECT_TYPE) {
                definition = tag;
                tag = returnUnspecifiedTag(name, tag);
            }
            else {
                definition = {};
                if (typeof tag !== 'string') {
                    tag = returnUnspecifiedTag(name, tag);
                }
            }
        }

    }
    return DataStore.registerModule(name, tag, definition);
}

module.exports = {
    attach: deployer.attach.bind(deployer),
    deploy: deployer.deploy.bind(deployer),
    execute: deployer.execute.bind(deployer),
    requires: deployer.requires.bind(deployer),
    register: register,
    component: register, // alias for 'register'
    module: register, // alias for 'register'
    scene: register, // alias for 'register'
    message: Messenger.message,
    helpers: helpers
};
