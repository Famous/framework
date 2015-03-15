var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;

var COMPONENT_DELIM = ':';
var FN_TYPE = 'function';
var TIME_KEY = '$time';
var SELF_KEY = '$self';

function BehaviorConduit(bestApplication, bestNode) {
    this.bestNode = bestNode;
    this.bestApplication = bestApplication;
    this.behaviorList = bestNode.behaviorList || [];
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];
        this.setupBehavior(behavior);
    }
}

function fetchBehaviorArgs(behaviorDeps, stateManager) {
    var behaviorArgs = [];
    for (var i = 0; i < behaviorDeps.length; i++) {
        behaviorArgs.push(stateManager.getState(behaviorDeps[i]));
    }
    return behaviorArgs;
}

function fetchBehaviorTargets(bestDOMNode, behaviorSelector) {
    var behaviorTargets = [];
    var targetMatches = bestDOMNode.querySelectorAll(behaviorSelector);
    for (var i = 0; i < targetMatches.length; i++) {
        var selectedElement = targetMatches[i];
        behaviorTargets.push(selectedElement);
    }
    return behaviorTargets;
}

BehaviorConduit.prototype.setupBehavior = function(behavior) {
    if (typeof behavior.action !== FN_TYPE) {
        this.setupStaticBehavior(behavior);
    }
    else {
        this.setupDynamicBehavior(behavior);
    }
}

BehaviorConduit.prototype.setupStaticBehavior = function(behavior) {
    var behaviorValue = behavior.action;
    behavior.action = function() { return behaviorValue; };
    this.setupDynamicBehavior(behavior);
}

BehaviorConduit.prototype.setupDynamicBehavior = function(behavior) {
    var behaviorDeps = getParameterNames(behavior.action) || [];
    if (behaviorDeps.indexOf(TIME_KEY) !== -1) {
        this.setupTimeBehavior(behavior, behaviorDeps);
    }
    else {
        this.setupStateBehavior(behavior, behaviorDeps);
    }
}

BehaviorConduit.prototype.setupTimeBehavior = function(behavior, behaviorDeps) {
    this.bestApplication.famous.engine.update({
        update: this.buildTimeController(behavior, behaviorDeps)
    });
}

BehaviorConduit.prototype.setupStateBehavior = function(behavior, behaviorDeps) {
    var behaviorController = (behavior.selector === SELF_KEY)
            ? this.buildHandlerController(behavior, behaviorDeps)
            : this.buildProxyController(behavior, behaviorDeps);
    if (behaviorDeps.length < 1) {
        this.bestNode.stateManager.subscribe(behaviorController);
    }
    else {
        for (var i = 0; i < behaviorDeps.length; i++) {
            this.bestNode.stateManager.subscribeTo(behaviorDeps[i], behaviorController);
        }                
    }
};

BehaviorConduit.prototype.buildHandlerController = function(behavior, behaviorDeps) {
    var behaviorHandler = this.bestApplication.fetchBehaviorHandler(behavior.name, this.bestNode);
    var behaviorHandlerDeps = getParameterNames(behaviorHandler);
    return function() {
        var behaviorArgs = fetchBehaviorArgs(behaviorDeps, this.bestNode.stateManager);
        var behaviorPayload = behavior.action.apply(null, behaviorArgs);
        var behaviorHandlerArgs = this.bestApplication.fetchDependencies(behaviorHandlerDeps, behaviorPayload, this.bestNode);
        behaviorHandler.apply(null, behaviorHandlerArgs);
    }.bind(this);
};

BehaviorConduit.prototype.buildProxyController = function(behavior, behaviorDeps) {
    if (behavior.name.indexOf(COMPONENT_DELIM) !== -1) {
        return this.buildDirectProxyController(behavior, behaviorDeps);
    }
    else {
        return this.buildMessagingProxyController(behavior, behaviorDeps);
    }
};

BehaviorConduit.prototype.buildDirectProxyController = function(behavior, behaviorDeps) {
    return function() {
        var behaviorArgs = fetchBehaviorArgs(behaviorDeps, this.bestNode.stateManager);
        var behaviorPayload = behavior.action.apply(null, behaviorArgs);
        var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
        for (var i = 0; i < behaviorTargets.length; i++) {
            var targetDOMNode = behaviorTargets[i];
            var targetBestNodeUID = targetDOMNode.bestUID;
            var targetBestNode = this.bestApplication.bestNodes[targetBestNodeUID];
            var behaviorHandler = this.bestApplication.fetchBehaviorHandler(behavior.name, targetBestNode);
            var behaviorHandlerDeps = getParameterNames(behaviorHandler);
            var behaviorHandlerArgs = this.bestApplication.fetchDependencies(behaviorHandlerDeps, behaviorPayload, targetBestNode);
            behaviorHandler.apply(null, behaviorHandlerArgs);
        }
    }.bind(this);
};

BehaviorConduit.prototype.buildMessagingProxyController = function(behavior, behaviorDeps) {
    return function() {
        var behaviorArgs = fetchBehaviorArgs(behaviorDeps, this.bestNode.stateManager);
        var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
        for (var i = 0; i < behaviorTargets.length; i++) {
            var targetDOMNode = behaviorTargets[i];
            var targetBestNodeUID = targetDOMNode.bestUID;
            var targetBestNode = this.bestApplication.bestNodes[targetBestNodeUID];
            var targetEventManager = targetBestNode.eventManager;
            var behaviorPayload = behavior.action.apply(null, behaviorArgs);
            targetEventManager.send(behavior.name, behaviorPayload);
        }
    }.bind(this);
};

BehaviorConduit.prototype.buildTimeController = function(behavior, behaviorDeps) {
    var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
    return function(time) {
        var behaviorArgs = [];
        for (var i = 0; i < behaviorDeps.length; i++) {
            var behaviorDepName = behaviorDeps[i];
            if (behaviorDepName === TIME_KEY) {
                behaviorArgs.push(time);
            }
            else {
                var statesObject = this.bestNode.stateManager._state;
                var stateValue = statesObject[behaviorDepName];
                behaviorArgs.push(stateValue);
            }
        }
        var behaviorPayload = behavior.action.apply(null, behaviorArgs);
        if (behaviorTargets.length < 1) {
            var targetMatches = this.bestNode.DOMNode.querySelectorAll(behavior.selector);
            for (var i = 0; i < targetMatches.length; i++) {
                var selectedElement = targetMatches[i];
                behaviorTargets.push(selectedElement);
            }
        }
        for (var i = 0; i < behaviorTargets.length; i++) {
            var behaviorTarget = behaviorTargets[i];
            var behaviorTargetUID = behaviorTarget.bestUID;
            var behaviorTargetNode = this.bestApplication.bestNodes[behaviorTargetUID];
            var eventManager = behaviorTargetNode.eventManager;
            eventManager.send(behavior.name, behaviorPayload);
        }
    }.bind(this);
};

module.exports = BehaviorConduit;

