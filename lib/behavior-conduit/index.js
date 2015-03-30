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
var FLOW_BEHAVIORS = {
    '$if': true,
    '$repeat': true,
    '$yield': true
};

function BehaviorConduit(node) {
    this.node = node;
    var flowBehaviorNames = Object.keys(FLOW_BEHAVIORS);
    this.behaviorList = Bundle.getBehaviorList(this.node.name, flowBehaviorNames);
    this.controlFlowList = Bundle.getMatchingBehaviors(this.node.name, flowBehaviorNames);
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
}

function timeBehavior(behavior, node) {
    Famous.everyFrame(TimeController.create(behavior, node));
}

function dynamicBehavior(behavior, node) {
    if (hasTimeParams(behavior.params)) {
        timeBehavior(behavior, node);
    }
    else {
        stateBehavior(behavior, node);
    }
}

function staticBehavior(behavior, node) {
    var value = behavior.action;
    behavior.action = function() {
        return value;
    };
    dynamicBehavior(behavior, node);
}

function setupBehavior(behavior, node) {
    if (behavior.type === FUNC) {
        dynamicBehavior(behavior, node);
    }
    else {
        staticBehavior(behavior, node);
    }
}

BehaviorConduit.prototype.prepareControlFlow = function() {
    for (var i = 0; i < this.controlFlowList.length; i++) {
        var controlFlowBehavior = this.controlFlowList[i];
        setupBehavior(controlFlowBehavior, this.node);
    }
};

BehaviorConduit.prototype.prepareNormalBehaviors = function() {
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];
        setupBehavior(behavior, this.node);
    }
};

module.exports = BehaviorConduit;
