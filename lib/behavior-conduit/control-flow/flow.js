'use strict';

var Args = require('./../args');
var Injector = require('./../../injector');
var NodeStore = require('./../../node-store');
var VirtualDOM = require('./../../virtual-dom');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var INITIALIZATION_KEY = 'initialization';
var RUNTIME_KEY = 'runTime';

var CONTROLLER = {};
CONTROLLER[IF_KEY] = require('./if');
CONTROLLER[REPEAT_KEY] = require('./repeat');
CONTROLLER[YIELD_KEY] = require('./yield');

function addNodes(data, bestNode) {
    var BestNodeConstuctor = bestNode.constructor;
    var parentNode;
    var newNode;
    for (var i = 0; i < data.length; i++) {
        newNode = new BestNodeConstuctor(data[i].blueprintDOMNode);
        parentNode = NodeStore.findNode(data[i].parentUID);
        newNode.prepare(parentNode.famousNode);
        parentNode.domStore.domNode.appendChild(newNode.domStore.domNode);
    }

    bestNode.domStore.buildTreeSignature();
    bestNode.triggerGlobalChange(true);
}

function removeNodes(domNodes, bestNode) {
    var nodeToRemove;
    for (var i = 0; i < domNodes.length; i++) {
        nodeToRemove = NodeStore.findNode(VirtualDOM.getUID(domNodes[i]));
        nodeToRemove.teardown();
    }
    bestNode.domStore.buildTreeSignature();
}

function processControlFlow(onInitialization, behavior, args, bestNode) {
    return function() {
        var processKey = onInitialization === true ? INITIALIZATION_KEY : RUNTIME_KEY;
        var result = CONTROLLER[behavior.name][processKey](args);

        if (result) {
            addNodes(result.add, bestNode);
            removeNodes(result.remove, bestNode);

            // Force process of behaviors with '$index' of '$repeatPayload' since they may
            // not be listening to state that gets triggered with bestNode.triggerGlobalChange
            bestNode.behaviorConduit.triggerInvertedBehaviors();
        }
    };
}

function create(behavior, bestNode, controlFlowData) {
    return function(onInitialization) {
        if (!bestNode.lockControlFlow) {
            var behaviorActionArgs = Args.fetch(behavior.params, bestNode.stateManager);
            var payload = behavior.action.apply(null, behaviorActionArgs);

            var controlFlowArgs = {
                payload: payload,
                selector: behavior.selector,
                domStore: bestNode.domStore,
                controlFlowData: controlFlowData
            };

            var fn;
            var publicEvent = bestNode.eventChannel.getPublicEvent(behavior.name);
            if (publicEvent) {
                var payload = {
                    payload: payload,
                    selector: behavior.selector,
                    childrenRoot: bestNode.domStore.childrenRoot,
                    surrogateRoot: bestNode.domStore.surrogateRoot,
                    treeSignature: bestNode.domStore.treeSignature
                };
                var args = Injector.getArgs(publicEvent.params, payload, bestNode);
                fn = function() {
                    return publicEvent.action.apply(null, args);
                };
            }
            else {
                fn = processControlFlow(onInitialization, behavior, controlFlowArgs, bestNode);
            }
            fn();
        }
    };
}

module.exports = {
    create: create
};
