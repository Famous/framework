var ObjUtils = require('framework-utilities/object');

// A BEST Application with a Famo.us Context
var EXECUTED_COMPONENTS = {};

// A component is an instantiated BEST module.
var COMPONENTS = {};

// A module is a BEST definition.
var MODULES = {};

function registerModule(name, definition) {
    if (!hasModule(name)) {
        saveModule(name, definition);
    }
}

function saveModule(name, definition) {
    MODULES[name] = definition;
}

function hasModule(name) {
    return !!getModule(name);
}

function getModule(name) {
    return ObjUtils.clone(MODULES[name]);
}

function registerComponent(uid, component) {
    if (hasComponent(uid)) {
        throw new Error('Component with UID `' + uid + '` already exists!');
    }
    else {
        saveComponent(uid, component);
    }
}

function saveComponent(uid, component) {
    COMPONENTS[uid] = component;
}

function hasComponent(uid) {
    return !!getComponent(uid);
}

function getComponent(uid) {
    return COMPONENTS[uid];
}

function saveExecutedComponent(selector, component) {
    EXECUTED_COMPONENTS[selector] = component;
}

function getExecutedComponent(selector) {
    return EXECUTED_COMPONENTS[selector];
}

module.exports = {
    getModule: getModule,
    registerModule: registerModule,
    getComponent: getComponent,
    registerComponent: registerComponent,
    saveExecutedComponent: saveExecutedComponent,
    getExecutedComponent: getExecutedComponent
};
