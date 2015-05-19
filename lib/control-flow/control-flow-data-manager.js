'use strict';

var ControlFlowUtils = require('./control-flow-utils');
var Behaviors = require('../behaviors/behaviors');
var VirtualDOM = require('../virtual-dom/virtual-dom');

var IF_KEY = ControlFlowUtils.CONSTANTS.IF_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;

function ControlFlowDataManager(behaviorList) {
    this._behaviors = ControlFlowDataManager.processBehaviorList(behaviorList || []);
    this.behaviors = this._behaviors; // deprecate

    this.repeat = {
        /*
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
    };
    this._repeatData = this.repeat;

    this._ifData = {
        /*
        '.selector' : {
            payload: true,
            parentUIDs: {
                uid1: blueprint1,
                uid2: blueprint2
            }
        }
         */
    };
}

ControlFlowDataManager.prototype.getIfBehaviors = function getIfBehaviors() {
    return this._behaviors[IF_KEY];
} 

ControlFlowDataManager.prototype.getRepeatBehaviors = function getRepeatBehaviors() {
    return this._behaviors[REPEAT_KEY];
} 

ControlFlowDataManager.prototype.getYieldBehaviors = function getYieldBehaviors() {
    return this._behaviors[YIELD_KEY];
}

ControlFlowDataManager.prototype.getIfData = function getIfData() {
    return this._ifData;
}

ControlFlowDataManager.prototype.getRepeatData = function getRepeatData() {
    return this._repeatData;
}

ControlFlowDataManager.prototype.getIfPayload = function getIfPayload(selector) {
    return this._ifData[selector].payload;
}

ControlFlowDataManager.prototype.setIfPayload = function setIfPayload(selector, payload) {
    if (!(typeof payload === 'boolean')) {
        throw new Error ('If payload must be set to a boolean. `' + payload + '` is not a valid payload.');
    }
    this._ifData[selector].payload = payload;
}

/**
 * Creates a stateful representation of the behavior by attaching the behavior payload
 * and hash map of parentUIDs to a data object stored using the behavior's selector.
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
        data.parentUIDs[parentUID] = VirtualDOM.clone(target);
    }
}

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
