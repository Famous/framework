'use strict';

var ObjUtils = require('framework-utilities/object');

// A BEST Application with a Famo.us Context
var EXECUTED_COMPONENTS = {};

// A component is an instantiated BEST module.
var COMPONENTS = {};

// List of the tagged dependencies of every tagged module.
var DEPENDENCIES = {};

// A module is a BEST definition.
var MODULES = {};

function Wrapper(mod) {
    this.mod = mod;
}

Wrapper.prototype.config = function(obj) {
    this.config = obj;
};

function wrapModule(mod) {
    return new Wrapper(mod);
}

function registerModule(name, tag, definition) {
    if (!hasModule(name, tag)) {
        return wrapModule(saveModule(name, tag, definition));
    }
    else {
        return wrapModule(getModule(name, tag));
    }
}

function hasModule(name, tag) {
    return !!getModule(name, tag);
}

function getModule(name, tag) {
    if (MODULES[name] && MODULES[name][tag]) {
        return ObjUtils.clone(MODULES[name][tag]);
    }
}

function saveModule(name, tag, definition) {
    if (!MODULES[name]) {
        MODULES[name] = {};
    }
    MODULES[name][tag] = definition;
    return getModule(name, tag);
}

function getComponent(uid) {
    return COMPONENTS[uid];
}

function hasComponent(uid) {
    return !!getComponent(uid);
}

function saveComponent(uid, component) {
    COMPONENTS[uid] = component;
}

function registerComponent(uid, component) {
    if (hasComponent(uid)) {
        throw new Error('Component with UID `' + uid + '` already exists!');
    }
    else {
        saveComponent(uid, component);
    }
}

function saveExecutedComponent(selector, component) {
    EXECUTED_COMPONENTS[selector] = component;
}

function getExecutedComponent(selector) {
    return EXECUTED_COMPONENTS[selector];
}

function saveDependencies(name, tag, requires) {
    if (!DEPENDENCIES[name]) DEPENDENCIES[name] = {};
    DEPENDENCIES[name][tag] = {};
    for (var i = 0; i < requires.length; i++) {
        var moduleName = requires[i][0];
        var moduleTag = requires[i][1];
        DEPENDENCIES[name][tag][moduleName] = moduleTag;
    }
}

function getDependencies(name, tag) {
    if (DEPENDENCIES[name] && DEPENDENCIES[name][tag]) {
        return DEPENDENCIES[name][tag];
    }
    else {
        throw new Error('No dependencies found for `' + name + ' (' + tag + ')`');
    }
}

module.exports = {
    getModule: getModule,
    registerModule: registerModule,
    getComponent: getComponent,
    registerComponent: registerComponent,
    saveExecutedComponent: saveExecutedComponent,
    getExecutedComponent: getExecutedComponent,
    saveDependencies: saveDependencies,
    getDependencies: getDependencies
};
