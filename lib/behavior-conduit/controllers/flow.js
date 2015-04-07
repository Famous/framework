'use strict';

var Args = require('./../../helpers/args');
var VirtualDOM = require('../../virtual-dom');

var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var INITIALIZATION_KEY = 'initialization';
var RUNTIME_KEY = 'runTime';

var CONTROLLER = {};
CONTROLLER[IF_KEY] = require('./if');
CONTROLLER[REPEAT_KEY] = require('./repeat');
CONTROLLER[YIELD_KEY] = require('./yield');

function processControlFlow(onInitialization, behavior, node, args) {
    return function() {
        var processKey = onInitialization ? INITIALIZATION_KEY : RUNTIME_KEY;
        CONTROLLER[behavior.name][processKey](args);
    }
}

function create(behavior, node) {
    return function(onInitialization) {
        if (!node.lockControlFlow) {
            var behaviorActionArgs = Args.fetch(behavior.params, node.stateManager);
            var payload = behavior.action.apply(null, behaviorActionArgs);

            var controlFlowArgs = {
                payload: payload,
                selector: behavior.selector,
                childrenRoot: node.childrenRoot,
                surrogateRoot: node.surrogateRoot,
                scopedRoot: node.scopedRoot,
                treeSignature: node.treeSignature,
                node: node
            };

            var fn = node.publicEvents[behavior.name] ?
                node.publicEvents[behavior.name].bind(null, node.stateManager, controlFlowArgs) :
                processControlFlow(onInitialization, behavior, node, controlFlowArgs)

            fn();
        }
    }
}

module.exports = {
    create: create
};
