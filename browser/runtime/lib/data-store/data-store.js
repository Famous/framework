'use strict';

var ObjUtils = require('./../../../utilities/object');

// A BEST Application with a Famo.us Context
var EXECUTED_COMPONENTS = {};

// A component is an instantiated BEST module.
var COMPONENTS = {};

// List of the tagged dependencies of every tagged module.
var DEPENDENCIES = {};

// A module is a BEST definition.
var MODULES = {};

// Config objects
var CONFIGS = {};

// Timelines objects
var TIMELINES = {};

// Attachment objects ('raw code' wrappers)
var ATTACHMENTS = {};

function getAttachments(name, tag) {
    if (ATTACHMENTS[name] && ATTACHMENTS[name][tag]) {
        return ObjUtils.clone(ATTACHMENTS[name][tag]);
    }
    else {
        return [];
    }
}

function setAttachment(name, tag, info) {
    if (!ATTACHMENTS[name]) ATTACHMENTS[name] = {};
    if (!ATTACHMENTS[name][tag]) ATTACHMENTS[name][tag] = [];
    ATTACHMENTS[name][tag].push(info);
}

function Wrapper(name, tag, mod) {
    this.name = name;
    this.tag = tag;
    this.mod = mod;
}

Wrapper.prototype.config = function(conf) {
    if (!CONFIGS[this.name]) {
        CONFIGS[this.name] = {};
    }
    CONFIGS[this.name][this.tag] = conf;
    return this;
};

function getConfig(name, tag) {
    if (CONFIGS[name] && CONFIGS[name][tag]) {
        return ObjUtils.clone(CONFIGS[name][tag]);
    }
    else {
        return {};
    }
}

Wrapper.prototype.timelines = function timelines(timelines) {
    if (!TIMELINES[this.name]) {
        TIMELINES[this.name] = {};
    }
    TIMELINES[this.name][this.tag] = timelines;
    return this;
};

function getTimelines(name, tag) {
    if (TIMELINES[name] && TIMELINES[name][tag]) {
        return ObjUtils.clone(TIMELINES[name][tag]);
    }
    else {
        return {};
    }
}

function wrapModule(name, tag, mod) {
    return new Wrapper(name, tag, mod);
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

function hasModule(name, tag) {
    return !!getModule(name, tag);
}

var NORMAL_FACET_NAMES = {
    'behaviors': true,
    'events': true,
    'states': true,
    'tree': true
};

function validateModule(name, tag, definition) {
    for (var facetName in definition) {
        if (!(facetName in NORMAL_FACET_NAMES)) {
            console.warn('`' + name + ' (' + tag + ')` ' + 'has an unrecognized property `' + facetName + '` in its definition');
        }
    }
}

function registerModule(name, tag, definition) {
    if (!hasModule(name, tag)) {
        validateModule(name, tag, definition);
        return wrapModule(name, tag, saveModule(name, tag, definition));
    }
    else {
        return wrapModule(name, tag, getModule(name, tag));
    }
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
    if (!DEPENDENCIES[name]) {
        DEPENDENCIES[name] = {};
    }
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
    getConfig: getConfig,
    getTimelines: getTimelines,
    registerComponent: registerComponent,
    saveExecutedComponent: saveExecutedComponent,
    getExecutedComponent: getExecutedComponent,
    saveDependencies: saveDependencies,
    getDependencies: getDependencies,
    getAttachments: getAttachments,
    setAttachment: setAttachment
};
