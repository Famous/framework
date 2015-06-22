'use strict';

var ControlFlowUtils = require('./control-flow-utils');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var ArrayUtils = require('./../utilities/array');

var IF_KEY = ControlFlowUtils.CONSTANTS.IF_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;

// This class is used to manage all the state that must be mantained in order
// to process the control flow behaviors.
function ControlFlowDataManager(behaviorList) {
    this._behaviors = ControlFlowDataManager.processBehaviorList(behaviorList || []);
    this.behaviors = this._behaviors; // deprecate

    this._repeatData = {};
    this._ifData = {};
}

ControlFlowDataManager.prototype.getIfBehaviors = function getIfBehaviors() {
    return this._behaviors[IF_KEY];
};

ControlFlowDataManager.prototype.getRepeatBehaviors = function getRepeatBehaviors() {
    return this._behaviors[REPEAT_KEY];
};

ControlFlowDataManager.prototype.getYieldBehaviors = function getYieldBehaviors() {
    return this._behaviors[YIELD_KEY];
};

ControlFlowDataManager.prototype.getYieldBehaviors = function getYieldBehaviors() {
    return this._behaviors[YIELD_KEY];
};

ControlFlowDataManager.prototype.getIfData = function getIfData() {
    return this._ifData;
};

ControlFlowDataManager.prototype.getRepeatData = function getRepeatData() {
    return this._repeatData;
};

ControlFlowDataManager.prototype.getIfPayload = function getIfPayload(selector) {
    return this._ifData[selector].payload;
};

ControlFlowDataManager.prototype.setIfPayload = function setIfPayload(selector, payload) {
    if (!(typeof payload === 'boolean')) {
        throw new Error('If payload must be set to a boolean. `' + payload + '` is not a valid payload.');
    }
    this._ifData[selector].payload = payload;
};

ControlFlowDataManager.prototype.setRepeatPayload = function setRepeatPayload(selector, payload) {
    var data = this._repeatData[selector];
    data.payloadEquality = ArrayUtils.checkElementEquality(data.payload || [], payload);
    data.payload = payload;
};

ControlFlowDataManager.prototype.resetRepeatData = function resetRepeatData(selectors) {
    for (var i = 0; i < selectors.length; i++) {
        this._repeatData[selectors[i]] = null;
    }
};

/**
 * Creates a stateful representation of the behavior by attaching the behavior payload
 * and hash map of parentUIDs to a data object stored using the behavior's selector.
 */

/*
Example data format:

'.selector' : {
    payload: true,
    parentUIDs: {
        uid1: [blueprint1],
        uid2: [blueprint2, blueprint3]
    }
}
 */
ControlFlowDataManager.prototype.initializeDataForIfBehavior = function initializeDataForIfBehavior(selector, payload, blueprint) {
    this._ifData[selector] = {};
    var data = this._ifData[selector]; // abbreviation
    data.payload = payload;

    // Attach parent UIDs associated w/ the selector
    var targets = VirtualDOM.query(blueprint, selector);
    var parentUID;
    var target;
    data.parentUIDs = {};
    for (var i = 0; i < targets.length; i++) {
        target = targets[i];
        parentUID = VirtualDOM.getParentUID(target);
        if (!data.parentUIDs[parentUID]) {
            data.parentUIDs[parentUID] = [];
        }
        data.parentUIDs[parentUID].push(VirtualDOM.clone(target));
    }
};

/*
Example data format:

'.selector' :
    initialized: false,
    parentUIDs: [{
        uid: uid1
        blueprint: node,
        repeatedNodes: [node1, node2, node3]
    }],
    payload: [{}, {}, {}],
    payloadEquality: [true, true, false]
 */
ControlFlowDataManager.prototype.initializeDataForRepeatBehavior = function initializeDataForRepeatBehavior(selector, payload, blueprint) {
    this._repeatData[selector] = {};
    var data = this._repeatData[selector]; // abbreviation

    // Find parent nodes & attach 'blueprint' (i.e., repeated node)
    data.parentUIDs = [];
    var parentUID;
    var processedParentUIDs = {};
    var blueprintNode;
    VirtualDOM.eachNode(blueprint, selector, function(repeatedNode) {
        parentUID = VirtualDOM.getParentUID(repeatedNode);

        // Only 1 data entry per parentUID
        if (!processedParentUIDs[parentUID]) {
            processedParentUIDs[parentUID] = [];
            blueprintNode = VirtualDOM.clone(repeatedNode);
            ControlFlowUtils.stripMessages(blueprintNode);
            data.parentUIDs.push({
                uid: parentUID,
                blueprint: blueprintNode,
                repeatedNodes: processedParentUIDs[parentUID]
            });
        }

        // Attach repeated node to repeatedNodes array in order to tag it for
        // removal to avoid the overhead of creating an unnecessary component
        processedParentUIDs[parentUID].push(repeatedNode);
    });

    data.initialzed = true;
};

// Flatten out behaviors so that they are ordered by behavior type instead of CSS selector.
ControlFlowDataManager.processBehaviorList = function processBehaviorList(behaviorList) {
    var controlFlowBehaviors = {};
    controlFlowBehaviors[IF_KEY] = [];
    controlFlowBehaviors[REPEAT_KEY] = [];
    controlFlowBehaviors[YIELD_KEY] = [];

    for (var i = 0; i < behaviorList.length; i++) {
        switch(behaviorList[i].name) {
            case IF_KEY: controlFlowBehaviors[IF_KEY].push(behaviorList[i]); break;
            case REPEAT_KEY: controlFlowBehaviors[REPEAT_KEY].push(behaviorList[i]); break;
            case YIELD_KEY: controlFlowBehaviors[YIELD_KEY].push(behaviorList[i]); break;
        }
    }

    return controlFlowBehaviors;
};

module.exports = ControlFlowDataManager;
