'use strict';

var Bundle = require('./../bundle');
var Famous = require('./../famous');
var AppliedController = require('./controllers/applied');
var FlowController = require('./control-flow/flow');
var HandlingController = require('./controllers/handling');
var TimeController = require('./controllers/time');
var InvertedController = require('./controllers/inverted');

var FUNC = 'function';
var TIME_KEY = '$time';
var SELF_KEY = '$self';
var EVERY_KEY = '$every';
var STATE_KEY = '$state';
var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var REPEAT_BEHAVIOR_KEYS = {
    '$index': true,
    '$repeatPayload': true
}
var FLOW_BEHAVIORS = {};
FLOW_BEHAVIORS[IF_KEY] = true;
FLOW_BEHAVIORS[REPEAT_KEY] = true;
FLOW_BEHAVIORS[YIELD_KEY] = true;

function BehaviorConduit(node) {
    this.node = node;
    var flowBehaviorNames = Object.keys(FLOW_BEHAVIORS);
    this.behaviorList = Bundle.getBehaviorList(this.node.name, flowBehaviorNames);
    this.controlFlowList = Bundle.getMatchingBehaviors(this.node.name, flowBehaviorNames);
    this.controlFlowActionQueue = [[/*if*/], [/*repeat*/], [/*yield*/]];
    this.controlFlowData = {
        repeat: {}
    };
}

function hasTimeParams(params) {
    return params && params.indexOf(TIME_KEY) !== -1;
}

function hasRepeatParams(params) {
    var result = false;
    if (params) {
        for (var i = 0; i < params.length; i++) {
           if (params[i] in REPEAT_BEHAVIOR_KEYS) {
                result = true;
            }
        }
    }
    return result;
}

function isSelfSelector(selector) {
    return selector === SELF_KEY;
}

function isFlowBehavior(name) {
    return (name in FLOW_BEHAVIORS);
}

function wantsAllUpdates(params) {
    return params.indexOf(EVERY_KEY) > -1 ||
           params.indexOf(STATE_KEY) > -1;
}

BehaviorConduit.prototype.stateBehavior = function(behavior) {
    var controller;
    if (isFlowBehavior(behavior.name)) {
        controller = FlowController.create(behavior, this.node, this.controlFlowData);
    }
    else {
        if (isSelfSelector(behavior.selector)) {
            controller = HandlingController.create(behavior, this.node);
        }
        else {
            controller = AppliedController.create(behavior, this.node);
        }
    }

    if (!behavior.params || behavior.params.length < 1) {
        this.node.stateManager.subscribeOnce(controller);
    }
    else if (wantsAllUpdates(behavior.params)) {
        this.node.stateManager.subscribe(controller);
    }
    else {
        for (var i = 0; i < behavior.params.length; i++) {
            this.node.stateManager.subscribeTo(behavior.params[i], controller);
        }
    }

    return controller;
}

BehaviorConduit.prototype.timeBehavior = function(behavior) {
    var controller = TimeController.create(behavior, this.node);
    Famous.everyFrame(controller);
    return controller;
}

BehaviorConduit.prototype.invertedBehavior = function(behavior) {
    return InvertedController.create(behavior, this.node);
}

BehaviorConduit.prototype.dynamicBehavior = function(behavior) {
    if (hasTimeParams(behavior.params)) {
        return this.timeBehavior(behavior);
    }
    else if (hasRepeatParams(behavior.params)) {
        return this.invertedBehavior(behavior);
    }
    else {
        return this.stateBehavior(behavior);
    }
}

BehaviorConduit.prototype.staticBehavior = function(behavior) {
    var value = behavior.action;
    behavior.action = function() {
        return value;
    };
    return this.dynamicBehavior(behavior);
}

BehaviorConduit.prototype.setupBehavior = function(behavior) {
    if (behavior.type === FUNC) {
        return this.dynamicBehavior(behavior);
    }
    else {
        return this.staticBehavior(behavior);
    }
}

BehaviorConduit.prototype.prepareControlFlow = function() {
    for (var i = 0; i < this.controlFlowList.length; i++) {
        var controlFlowBehavior = this.controlFlowList[i];
        var controller = this.setupBehavior(controlFlowBehavior);
        this.addToControlFlowActionQueue(controlFlowBehavior, controller);
    }
    this.processControlFlow();
};

BehaviorConduit.prototype.prepareNormalBehaviors = function() {
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];
        this.setupBehavior(behavior, this.node);
    }
};

BehaviorConduit.prototype.addToControlFlowActionQueue = function(behavior, controller) {
    switch (behavior.name) {
        case IF_KEY: this.controlFlowActionQueue[0].push(controller); break;
        case REPEAT_KEY: this.controlFlowActionQueue[1].push(controller); break;
        case YIELD_KEY: this.controlFlowActionQueue[2].push(controller); break;
    }
};

BehaviorConduit.prototype.processControlFlow = function() {
    var controller;
    var onInitialization = true;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < this.controlFlowActionQueue[i].length; j++) {
            controller = this.controlFlowActionQueue[i][j];
            controller(onInitialization);
        }
    }
};

module.exports = BehaviorConduit;
