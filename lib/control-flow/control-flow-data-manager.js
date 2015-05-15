'use strict';

var ControlFlowUtils = require('./control-flow-utils');

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

    this.if = {
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

ControlFlowDataManager.processBehaviorList = function processBehaviorList(behaviorList) {
    var controlFlow = {};
    controlFlow[IF_KEY] = [];
    controlFlow[REPEAT_KEY] = [];
    controlFlow[YIELD_KEY] = [];

    for (var i = 0; i < behaviorList.length; i++) {
        switch(behaviorList[i].name) {
            case IF_KEY: controlFlow[IF_KEY].push(behaviorList[i]); break;
            case REPEAT_KEY: controlFlow[REPEAT_KEY].push(behaviorList[i]); break;
            case YIELD_KEY: controlFlow[YIELD_KEY].push(behaviorList[i]); break;
        }
    }

    return controlFlow;
};

module.exports = ControlFlowDataManager;
