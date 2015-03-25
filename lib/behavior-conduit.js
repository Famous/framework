'use strict';

var ObjUtils = require('framework-utilities/object');
var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;

var COMPONENT_DELIM = ':';
var FN_TYPE = 'function';
var TIME_KEY = '$time';
var SELF_KEY = '$self';
var EVERY_KEY = '$every';
var STATE_KEY = '$state';
var CONTROL_FLOW_BEHAVIORS = {'$yield': true};

/**
 * Allow state changes to trigger the behaviors of a BEST node, and
 * the output of those behaviors to be routed to behavior handlers.
 *
 * E.g., take this behaviors object:
 *    {'#foo':{size:function(level){return 1;}}}
 *
 * And make it such that when the state `level` changes in the component,
 * the function `size` is triggered, and its return value routed to a
 * behavior handler called `size` in all elements matching the selector
 * `'#foo'`.
 */
function BehaviorConduit(bestApplication, bestNode) {
    this.bestNode = bestNode;
    this.bestApplication = bestApplication;
    this.behaviorList = bestNode.behaviorList || [];
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];
        if (behavior.name in CONTROL_FLOW_BEHAVIORS) {
            continue; // Handled in separate conduit
        }
        this.setupBehavior(behavior);
    }
}

/**
 * Given a list of dependency strings and a state manager, return an
 * array with the actual values for those dependencies, pulled out of
 * the state manager.
 */
function fetchBehaviorArgs(behaviorDeps, stateManager) {
    if (behaviorDeps.indexOf(EVERY_KEY) > -1) {
        var latestStateChange = stateManager.getLatestStateChange();
        var key = Object.keys(latestStateChange)[0];
        return [null, key, latestStateChange[key]];
    }
    else if (behaviorDeps.indexOf(STATE_KEY) > -1) {
        return [ObjUtils.clone(stateManager._state)];
    }
    else {
        var behaviorArgs = [];
        for (var i = 0; i < behaviorDeps.length; i++) {
            behaviorArgs.push(stateManager.getState(behaviorDeps[i]));
        }
        return behaviorArgs;
    }
}

/**
 * Given the virtual DOM node for a BEST node and a selector, return all
 * of the descendents (DOM nodes) that match that selector.
 */
function fetchBehaviorTargets(bestDOMNode, behaviorSelector) {
    var behaviorTargets = [];
    var targetMatches = bestDOMNode.querySelectorAll(behaviorSelector);
    for (var i = 0; i < targetMatches.length; i++) {
        var selectedElement = targetMatches[i];
        behaviorTargets.push(selectedElement);
    }
    return behaviorTargets;
}

/**
 * Given a behavior object, set up its behavior conduit. If the behavior
 * is a value rather than a function, set up a 'static' behavior.
 */
BehaviorConduit.prototype.setupBehavior = function(behavior) {
    if (typeof behavior.action !== FN_TYPE) {
        this.setupStaticBehavior(behavior);
    }
    else {
        this.setupDynamicBehavior(behavior);
    }
};

/**
 * Static behaviors are behaviors defined as values instead of functions.
 * TODO|HACK: This works by simply wrapping the value in a function and
 * then setting it up as a dynamic behavior. It'd be better to simply assign
 * the static value and be done with it, but there's a potential race
 * condition in cases when the node has no children set up, i.e., before the
 * initial `yield` is called.
 */
BehaviorConduit.prototype.setupStaticBehavior = function(behavior) {
    var behaviorValue = behavior.action;
    behavior.action = function() {
        return behaviorValue;
    };
    this.setupDynamicBehavior(behavior);
};

/**
 * Set up a dynamic behavior (one that first when states change). If one of
 * the behavior's dependencies is `$time`, set up a time-based behavior.
 */
BehaviorConduit.prototype.setupDynamicBehavior = function(behavior) {
    var behaviorDeps = getParameterNames(behavior.action) || [];
    if (behaviorDeps.indexOf(TIME_KEY) !== -1) {
        this.setupTimeBehavior(behavior, behaviorDeps);
    }
    else {
        this.setupStateBehavior(behavior, behaviorDeps);
    }
};

/**
 * For behaviors that need to react to time, i.e. behaviors with `$time` as an
 * argument in their function signature, we listen to the Famous engine for time
 * updates and send that time value into the behavior.
 */
BehaviorConduit.prototype.setupTimeBehavior = function(behavior, behaviorDeps) {
    this.bestApplication.famous.engine.update({
        update: this.buildTimeController(behavior, behaviorDeps)
    });
};

/**
 * Most behaviors are 'state behaviors', i.e., behaviors that simply react to
 * changes in the state of the module they were declared in. If the behavior was
 * intended to be applied to another module, e.g.:
 *   '#foo': { bar: function(){...} }
 * then we set up a 'proxy' controller, one that routes the output of the behavior
 * to matching modules' public events. But if the behavior were applied to itself:
 *   '$self': { bar: function(){...} }
 * Then we route the behavior output to a handler on the selfsame module.
 */
BehaviorConduit.prototype.setupStateBehavior = function(behavior, behaviorDeps) {
    var behaviorController = (behavior.selector === SELF_KEY)
            ? this.buildHandlerController(behavior, behaviorDeps)
            : this.buildProxyController(behavior, behaviorDeps);
    if (behaviorDeps.length < 1) {
        this.bestNode.stateManager.subscribeOnce(behaviorController);
    }
    else if (behaviorDeps.indexOf(EVERY_KEY) > -1 || behaviorDeps.indexOf(STATE_KEY) > -1) {
        this.bestNode.stateManager.subscribe(behaviorController);
    }
    else {
        for (var i = 0; i < behaviorDeps.length; i++) {
            this.bestNode.stateManager.subscribeTo(behaviorDeps[i], behaviorController);
        }
    }
};

/**
 * Return a function that reacts to state changes and routes the behavior
 * payload to a handler of the given name.
 */
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

/**
 * Build a controller function that allows a module to apply behavior output
 * to another module. But check to see which of these is its naming format:
 *    size    vs.    famous:components:size
 * If the former, we route the behavior output to a public event (behavior
 * handler) on the target module. If the latter, we need to locate the
 * module that implements the behavior, and then apply it directly to the
 * target module.
 */
BehaviorConduit.prototype.buildProxyController = function(behavior, behaviorDeps) {
    if (behavior.name.indexOf(COMPONENT_DELIM) !== -1) {
        return this.buildDirectProxyController(behavior, behaviorDeps);
    }
    else {
        return this.buildMessagingProxyController(behavior, behaviorDeps);
    }
};

/**
 * Return a function that allows a parent to have a direct affect on any
 * of its descendent modules via behavior. (I.e. one that doesn't have to
 * go through the target's public events.)
*/
BehaviorConduit.prototype.buildDirectProxyController = function(behavior, behaviorDeps) {
    return function() {
        var behaviorArgs = fetchBehaviorArgs(behaviorDeps, this.bestNode.stateManager);
        var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
        for (var i = 0; i < behaviorTargets.length; i++) {
            var behaviorPayload = behavior.action.apply(null, behaviorArgs);
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

/**
 * Return a function that sends behavior output to the public events of
 * the module it targets. Think of this as the "polite" application of a
 * behavior, since it only affects child modules that explicitly allow it.
 */
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

/**
 * Return a function that can be fed continuous time values from the Famous
 * engine and return a value each time.
 */
BehaviorConduit.prototype.buildTimeController = function(behavior, behaviorDeps) {
    var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
    return function(time) {
        var behaviorArgs = [];
        var i;
        for (i = 0; i < behaviorDeps.length; i++) {
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
            for (i = 0; i < targetMatches.length; i++) {
                var selectedElement = targetMatches[i];
                behaviorTargets.push(selectedElement);
            }
        }
        for (i = 0; i < behaviorTargets.length; i++) {
            var behaviorTarget = behaviorTargets[i];
            var behaviorTargetUID = behaviorTarget.bestUID;
            var behaviorTargetNode = this.bestApplication.bestNodes[behaviorTargetUID];
            var eventManager = behaviorTargetNode.eventManager;
            eventManager.send(behavior.name, behaviorPayload);
        }
    }.bind(this);
};

module.exports = BehaviorConduit;
