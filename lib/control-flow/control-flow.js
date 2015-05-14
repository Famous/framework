'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Behaviors = require('./../behaviors/behaviors');
var DataStore = require('./../data-store/data-store');
var If = require('./if');
var Repeat = require('./repeat');
var Yield = require('./yield');
var ArrayUtils = require('framework-utilities/array');
var ControlFlowUtils = require('./control-flow-utils');

var IF_KEY = ControlFlowUtils.CONSTANTS.IF_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;


function processSelfContainedFlows(blueprint, uid, data) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    processIfBehaviors(blueprint, expandedBlueprint, uid, data);
    processRepeatBehaviors(blueprint, expandedBlueprint, uid, data);
    return expandedBlueprint;
};

function processIfBehaviors(blueprint, expandedBlueprint, uid, data) {
    var ifBehaviors = data.behaviors[IF_KEY];
    for (var i = 0; i < ifBehaviors.length; i++) {
        processIfBehavior(ifBehaviors[i], blueprint, expandedBlueprint, uid, data);
    }
};

function processIfBehavior(behavior, blueprint, expandedBlueprint, uid, cfData) {
    var component = DataStore.getComponent(uid);
    var payload = Behaviors.getPayload(behavior, component);
    var selector = behavior.selector;
    var data;

    // Initialization
    if (!cfData.if[selector]) {
        cfData.if[selector] = {};
        data = cfData.if[selector]; // Abbreviation
        data.payload = payload;
        If.findParentNodes(blueprint, selector, data);

        // $if doesn't need to be initially processed if payload
        // is `true` since there is no side effect
        if (!payload) {
            // TODO --> remove from expandedblueprint?
            If.process(payload, selector, expandedBlueprint, data);
        }
    }
    // Runtime
    else {
        data = cfData.if[selector]; // Abbreviation
        if (payload !== data.payload) {
            If.process(payload, selector, expandedBlueprint, data);
            data.payload = payload;
        }
    }
};

function verifyRepeatPayload(payload) {
    if (!(payload instanceof Array)) {
        throw new Error('Unsupported payload type for $repeat: `' + payload + '`');
    }
}

function processRepeatBehaviors(blueprint, expandedBlueprint, uid, data) {
    var repeatBehaviors = data.behaviors[REPEAT_KEY];
    for (var i = 0; i < repeatBehaviors.length; i++) {
        processRepeatBehavior(repeatBehaviors[i], expandedBlueprint, uid, blueprint, data);
    }
};

function processRepeatBehavior(behavior, expandedBlueprint, uid, blueprint, cfData) {
    var component = DataStore.getComponent(uid);
    var repeatPayload;
    var data;
    repeatPayload = Behaviors.getPayload(behavior, component);
    verifyRepeatPayload(repeatPayload);

    if (!cfData.repeat[behavior.selector]) {
        cfData.repeat[behavior.selector] = {};
    }
    data = cfData.repeat[behavior.selector];
    data.payloadEquality = ArrayUtils.checkElementEquality(data.payload || [], repeatPayload);
    data.payload = repeatPayload;

    if (!data.initialized) {
        Repeat.findParentNodes(blueprint, expandedBlueprint, behavior.selector, data);
        data.initialized = true;
    }

    Repeat.process(expandedBlueprint, data);
};

function processParentDefinedFlows(expandedBlueprint, injectablesRoot, data) {
    var childrenRoot = VirtualDOM.clone(expandedBlueprint);
    processYield(childrenRoot, injectablesRoot, data);
    return childrenRoot;
};

function processYield(target, injectablesRoot, data) {
    if (injectablesRoot) {
        var yieldBehaviors = data.behaviors[YIELD_KEY];
        for (var i = 0; i < yieldBehaviors.length; i++) {
            Yield.process(yieldBehaviors[i], target, injectablesRoot);
        }
    }
};

module.exports = {
    processSelfContainedFlows: processSelfContainedFlows,
    processIfBehavior: processIfBehavior,
    processRepeatBehavior: processRepeatBehavior,
    processParentDefinedFlows: processParentDefinedFlows
};
