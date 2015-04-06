'use strict';

var Bundle = require('./../bundle');
var Famous = require('./../famous');
var AppliedController = require('./controllers/applied');
var FlowController = require('./controllers/flow');
var HandlingController = require('./controllers/handling');
var TimeController = require('./controllers/time');

var FUNC = 'function';
var TIME_KEY = '$time';
var SELF_KEY = '$self';
var EVERY_KEY = '$every';
var STATE_KEY = '$state';
var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
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
}

function hasTimeParams(params) {
    return params && params.indexOf(TIME_KEY) !== -1;
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

function stateBehavior(behavior, node) {
    var controller;
    if (isFlowBehavior(behavior.name)) {
        controller = FlowController.create(behavior, node);
    }
    else {
        if (isSelfSelector(behavior.selector)) {
            controller = HandlingController.create(behavior, node);
        }
        else {
            controller = AppliedController.create(behavior, node);
        }
    }

    if (!behavior.params || behavior.params.length < 1) {
        node.stateManager.subscribeOnce(controller);
    }
    else if (wantsAllUpdates(behavior.params)) {
        node.stateManager.subscribe(controller);
    }
    else {
        for (var i = 0; i < behavior.params.length; i++) {
            node.stateManager.subscribeTo(behavior.params[i], controller);
        }
    }

    return controller;
}

function timeBehavior(behavior, node) {
    var controller = TimeController.create(behavior, node);
    Famous.everyFrame(controller);
    return controller;
}

function dynamicBehavior(behavior, node) {
    if (hasTimeParams(behavior.params)) {
        return timeBehavior(behavior, node);
    }
    else {
        return stateBehavior(behavior, node);
    }
}

function staticBehavior(behavior, node) {
    var value = behavior.action;
    behavior.action = function() {
        return value;
    };
    return dynamicBehavior(behavior, node);
}

function setupBehavior(behavior, node) {
    if (behavior.type === FUNC) {
        return dynamicBehavior(behavior, node);
    }
    else {
        return staticBehavior(behavior, node);
    }
}

BehaviorConduit.prototype.prepareControlFlow = function() {
    for (var i = 0; i < this.controlFlowList.length; i++) {
        var controlFlowBehavior = this.controlFlowList[i];
        var controller = setupBehavior(controlFlowBehavior, this.node);
        this.addToControlFlowActionQueue(controlFlowBehavior, controller);
    }
    this.processControlFlow();
};

BehaviorConduit.prototype.prepareNormalBehaviors = function() {
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];
        setupBehavior(behavior, this.node);
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
    for (var i = 0; i < 3; i++) {
        while (this.controlFlowActionQueue[i].length > 0) {
            controller = this.controlFlowActionQueue[i].pop();
            controller();
        }
    }
};

module.exports = BehaviorConduit;
