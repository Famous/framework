'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Behaviors = require('./../behaviors/behaviors');
var If = require('./if');
var Repeat = require('./repeat');
var Yield = require('./yield');
var ArrayUtils = require('framework-utilities/array');
var ControlFlowUtils = require('./control-flow-utils');

var IF_KEY = ControlFlowUtils.CONSTANTS.IF_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;


function initializeSelfContainedFlows(blueprint, uid, controlFlowDataMngr) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    initializeRepeatBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    return expandedBlueprint;
};

function initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr) {
    var ifBehaviors = controlFlowDataMngr.behaviors[IF_KEY];
    var payload;
    var selector;
    for (var i = 0; i < ifBehaviors.length; i++) {
        // payload = Behaviors.getPayloadFromUID()
        // selector = ifBehaviors[i].selector;

        // controlFlowDataMngr.initializeIfData()
        processIfBehavior(ifBehaviors[i], blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    }
};

function processIfBehavior(behavior, blueprint, expandedBlueprint, uid, controlFlowDataMngr) {
    var payload = Behaviors.getPayloadFromUID(behavior, uid);
    var selector = behavior.selector;
    var data;

    // Initialization
    if (!controlFlowDataMngr.if[selector]) {
        controlFlowDataMngr.if[selector] = {};
        data = controlFlowDataMngr.if[selector]; // Abbreviation
        data.payload = payload;
        If.findParentNodes(blueprint, selector, data);

        // $if doesn't need to be initially processed if payload
        // is `true` since there is no side effect
        if (!payload) {
            // TODO --> remove from expandedblueprint?
                // Currently, subcomponents are getting instantiated & then removed due
                // to the attaches CONTROL_FLOW_MESSAGE which is causing unnecceasy overhead
            If.process(payload, selector, expandedBlueprint, data);
        }
    }
    // Runtime
    else {
        data = controlFlowDataMngr.if[selector]; // Abbreviation
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

function initializeRepeatBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr) {
    var repeatBehaviors = controlFlowDataMngr.behaviors[REPEAT_KEY];
    for (var i = 0; i < repeatBehaviors.length; i++) {
        processRepeatBehavior(repeatBehaviors[i], expandedBlueprint, uid, blueprint, controlFlowDataMngr);
    }
};

function processRepeatBehavior(behavior, expandedBlueprint, uid, blueprint, controlFlowDataMngr) {
    var payload = Behaviors.getPayloadFromUID(behavior, uid);
    verifyRepeatPayload(payload);

    var data;
    if (!controlFlowDataMngr.repeat[behavior.selector]) {
        controlFlowDataMngr.repeat[behavior.selector] = {};
    }
    data = controlFlowDataMngr.repeat[behavior.selector];
    data.payloadEquality = ArrayUtils.checkElementEquality(data.payload || [], payload);
    data.payload = payload;

    if (!data.initialized) {
        Repeat.findParentNodes(blueprint, expandedBlueprint, behavior.selector, data);
        data.initialized = true;
    }

    Repeat.process(expandedBlueprint, data);
};

function initializeParentDefinedFlows(expandedBlueprint, injectablesRoot, controlFlowDataMngr) {
    var childrenRoot = VirtualDOM.clone(expandedBlueprint);
    processYield(childrenRoot, injectablesRoot, controlFlowDataMngr);
    return childrenRoot;
};

function processYield(target, injectablesRoot, controlFlowDataMngr) {
    if (injectablesRoot) {
        var yieldBehaviors = controlFlowDataMngr.behaviors[YIELD_KEY];
        for (var i = 0; i < yieldBehaviors.length; i++) {
            Yield.process(yieldBehaviors[i], target, injectablesRoot);
        }
    }
};

module.exports = {
    initializeSelfContainedFlows: initializeSelfContainedFlows,
    initializeParentDefinedFlows: initializeParentDefinedFlows,
    processIfBehavior: processIfBehavior,
    processRepeatBehavior: processRepeatBehavior
};
