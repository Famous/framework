'use strict';

var Args = require('./../../helpers/args');
var VirtualDOM = require('./../../virtual-dom');
var NodeStore = require('./../../node-store');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var INITIALIZATION_KEY = 'initialization';
var RUNTIME_KEY = 'runTime';

var CONTROLLER = {};
CONTROLLER[IF_KEY] = require('./if');
CONTROLLER[REPEAT_KEY] = require('./repeat');
CONTROLLER[YIELD_KEY] = require('./yield');

function processControlFlow(onInitialization, behavior, args, bestNode) {
    return function() {
        var processKey = onInitialization === true ? INITIALIZATION_KEY : RUNTIME_KEY;
        var result = CONTROLLER[behavior.name][processKey](args);

        if (result) {
            addNodes(result.add, bestNode);
            removeNodes(result.remove, bestNode);
        }
    };
}

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

            var fn = bestNode.eventsObject[behavior.name] ?
                bestNode.eventsObject[behavior.name].bind(null, bestNode.stateManager, {
                    // TODO: Update components to use domStore
                    payload: payload,
                    selector: behavior.selector,
                    childrenRoot: bestNode.domStore.childrenRoot,
                    surrogateRoot: bestNode.domStore.surrogateRoot,
                    treeSignature: bestNode.domStore.treeSignature
                }) :
                processControlFlow(onInitialization, behavior, controlFlowArgs, bestNode);

            fn();
        }
    };
}

module.exports = {
    create: create
};
