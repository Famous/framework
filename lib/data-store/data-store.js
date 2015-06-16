'use strict';

var ObjUtils = require('./../utilities/object');

// A FamousFramework Application with a Famo.us Context
var EXECUTED_COMPONENTS = {};

// FamousEngine scenes
var ROOT_SCENES = {};

// A component is an instantiated FamousFramework module.
var COMPONENTS = {};

// List of the tagged dependencies of every tagged module.
var DEPENDENCIES = {};

// A module is a FamousFramework definition.
var MODULES = {};

// Config objects
var CONFIGS = {};

// Timelines objects
var TIMELINES = {};

// Attachment objects ('raw code' wrappers)
var ATTACHMENTS = {};

// Options passed in when registered a Framework Component
var MODULE_OPTIONS = {};

// Custom Famous Node constructors that can be passed to
// `addChild` when adding nodes to the scene graph
var FAMOUS_NODE_CONSTRUCTORS = {};

// Famous Node with DOMElement attached, used to render
// DOM content from the tree on to the page.
var DOM_WRAPPER = {};

var BEHAVIORS_KEY = 'behaviors';
var DEFAULT_TAG = 'HEAD';
var EVENTS_KEY = 'events';
var EXTENSION_KEYS = 'extensions';
var NODE_NAME = 'famous:core:node';
var NORMAL_FACET_NAMES = {
    'behaviors': true,
    'events': true,
    'states': true,
    'tree': true
};
var SELF_KEY = '$self';
var STATES_KEY = 'states';
var TREE_KEY = 'tree';
var YIELD_KEY = '$yield';

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

Wrapper.prototype.timelines = function timelines(timelinesObject) {
    if (!TIMELINES[this.name]) {
        TIMELINES[this.name] = {};
    }
    TIMELINES[this.name][this.tag] = timelinesObject;
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

function getModuleDefinition(name, tag, useClone) {
    useClone = useClone === undefined ? true : useClone;
    tag = tag ? tag : DEFAULT_TAG;
    if (MODULES[name] && MODULES[name][tag]) {
        return useClone ? ObjUtils.clone(MODULES[name][tag].definition) : MODULES[name][tag].definition;
    }
    else {
        return null;
    }
}

function saveModule(name, tag, options, definition) {
    if (!MODULES[name]) {
        MODULES[name] = {};
    }
    MODULES[name][tag] = {
        definition: definition,
        options: options
    };
    saveDependencies(name, tag, options.dependencies || {});
    return getModuleDefinition(name, tag);
}

function hasModule(name, tag) {
    return !!getModuleDefinition(name, tag);
}

function extendDefinition(definition, extensions) {
    var extensionDefinition;
    var definesSelfYield;
    for (var i = 0; i < extensions.length; i++) {
        extensionDefinition = getModuleDefinition(extensions[i].name, extensions[i].version, false);
        if (extensionDefinition) {
            definition[BEHAVIORS_KEY] = definition[BEHAVIORS_KEY] ? definition[BEHAVIORS_KEY] : {};
            definition[EVENTS_KEY] = definition[EVENTS_KEY] ? definition[EVENTS_KEY] : {};
            definition[STATES_KEY] = definition[STATES_KEY] ? definition[STATES_KEY] : {};

            definesSelfYield = definition[BEHAVIORS_KEY][SELF_KEY] ? definition[BEHAVIORS_KEY][SELF_KEY][YIELD_KEY] : false;
            ObjUtils.naiveExtends(definition[BEHAVIORS_KEY], extensionDefinition[BEHAVIORS_KEY]);
            // By default, components behaviors.$self.$yield should be set to `false`, which requires
            // an overwrite of the mixin created from merging with famous:core:node.
            if (!definesSelfYield && extensions[i].name === NODE_NAME) {
                definition[BEHAVIORS_KEY][SELF_KEY][YIELD_KEY] = false;
            }
            ObjUtils.naiveExtends(definition[EVENTS_KEY], extensionDefinition[EVENTS_KEY]);
            ObjUtils.naiveExtends(definition[STATES_KEY], extensionDefinition[STATES_KEY]);

            if (!definition[TREE_KEY]) {
                definition[TREE_KEY] = extensionDefinition[TREE_KEY] || '';
            }
        }
    }
}

function validateModule(name, tag, options, definition) {
    if (/[A-Z]/.test(name)) {
        console.warn('`' + name + ' (' + tag + ')` ' + 'has an uppercase letter in its name; use lowercase only');
    }
    for (var facetName in definition) {
        if (!(facetName in NORMAL_FACET_NAMES)) {
            console.warn('`' + name + ' (' + tag + ')` ' + 'has an unrecognized property `' + facetName + '` in its definition');
        }
    }
}

function enhanceModule(name, tag, options, definition) {
    extendDefinition(definition, options[EXTENSION_KEYS]);
}

function saveModuleOptions(name, tag, options) {
    if (!MODULE_OPTIONS[name]) {
        MODULE_OPTIONS[name] = [];
    }
    MODULE_OPTIONS[name][tag] = options;
}

function getModuleOptions(name, tag) {
    var options = MODULE_OPTIONS[name][tag];
    if (!options) {
        console.warn('`' + name + ' (' + tag + ')` ' + 'has not been registered.');
        return {};
    }
    else {
        return options;
    }
}

function registerModule(name, tag, options, definition) {
    if (!hasModule(name, tag)) {
        validateModule(name, tag, options, definition);
        enhanceModule(name, tag, options, definition);
        saveModuleOptions(name, tag, options);
        return wrapModule(name, tag, saveModule(name, tag, options, definition));
    }
    else {
        return wrapModule(name, tag, getModuleDefinition(name, tag));
    }
}

function getComponent(uid) {
    return COMPONENTS[uid];
}

function hasFamousFrameworkComponent(uid) {
    return !!getComponent(uid);
}

function saveFamousFrameworkComponent(uid, component) {
    COMPONENTS[uid] = component;
}

function registerFamousFrameworkComponent(uid, component) {
    if (hasFamousFrameworkComponent(uid)) {
        throw new Error('Component with UID `' + uid + '` already exists!');
    }
    else {
        saveFamousFrameworkComponent(uid, component);
    }
}

function registerDOMWrapper(uid, wrapper) {
    if (DOM_WRAPPER[uid]) {
        throw new Error('DOM Wrapper with UID `' + uid + '` already exists!');
    }
    else {
        DOM_WRAPPER[uid] = wrapper;
    }
}

function getDOMWrapper(uid) {
    return DOM_WRAPPER[uid];
}

function saveExecutedComponent(selector, component) {
    EXECUTED_COMPONENTS[selector] = component;
}

function getExecutedComponent(selector) {
    return EXECUTED_COMPONENTS[selector];
}

// We need to store the dependencies that a given module depends on
// because we need to assign the version tags to all of the components
// in the tree for use when selecting elements correctly
function saveDependencies(name, tag, dependencies) {
    if (!DEPENDENCIES[name]) {
        DEPENDENCIES[name] = {};
    }
    DEPENDENCIES[name][tag] = {};
    for (var depName in dependencies) {
        var depVersion = dependencies[depName];
        DEPENDENCIES[name][tag][depName] = depVersion;
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

function registerCustomFamousNodeConstructors(constructors) {
    for (var name in constructors) {
        FAMOUS_NODE_CONSTRUCTORS[name] = constructors[name];
    }
}

function getCustomFamousNodeConstructor(constuctorName) {
    var Constructor = FAMOUS_NODE_CONSTRUCTORS[constuctorName];
    if (Constructor) {
        return Constructor;
    }
    else {
        throw new Error('Famous Node Constructor named `' + name + '` has not been registered');
    }
}

function getRootScene(selector) {
    return ROOT_SCENES[selector].scene;
}

function registerRootScene(selector, scene) {
    ROOT_SCENES[selector] = {};
    ROOT_SCENES[selector].scene = scene;
    ROOT_SCENES[selector].camera = null;
}

function getCamera(selector) {
    return ROOT_SCENES[selector].camera;
}

function registerCamera(selector, camera) {
    if (!ROOT_SCENES[selector]) {
        throw new Error('A Famous Scene with selector `' + selector + '` has not been created.');
    }
    ROOT_SCENES[selector].camera = camera;
}

module.exports = {
    getAttachments: getAttachments,
    getCamera: getCamera,
    getComponent: getComponent,
    getConfig: getConfig,
    getCustomFamousNodeConstructor: getCustomFamousNodeConstructor,
    getDependencies: getDependencies,
    getDOMWrapper: getDOMWrapper,
    getExecutedComponent: getExecutedComponent,
    getModuleDefinition: getModuleDefinition,
    getModuleOptions: getModuleOptions,
    getRootScene: getRootScene,
    getTimelines: getTimelines,
    hasFamousFrameworkComponent: hasFamousFrameworkComponent,
    registerCamera: registerCamera,
    registerCustomFamousNodeConstructors: registerCustomFamousNodeConstructors,
    registerDOMWrapper: registerDOMWrapper,
    registerFamousFrameworkComponent: registerFamousFrameworkComponent,
    registerModule: registerModule,
    registerRootScene: registerRootScene,
    saveDependencies: saveDependencies,
    saveExecutedComponent: saveExecutedComponent,
    setAttachment: setAttachment
};
