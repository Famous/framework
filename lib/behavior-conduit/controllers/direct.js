'use strict';

var Args = require('./../../helpers/args');
var Bundle = require('./../../bundle');
var Injector = require('./../../injector');
var NodeStore = require('./../../node-store');
var Targets = require('./../../helpers/targets');
var VirtualDOM = require('./../../virtual-dom');

function create(behavior, node) {
    return function() {
        var args = Args.fetch(behavior.params, node.stateManager);
        var targets = Targets.fetch(node.domNode, behavior.selector);
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var payload = behavior.action.apply(null, args);
            var targetNode = NodeStore.findNode(VirtualDOM.getUID(target));
            var handler = Bundle.getBehaviorHandler(behavior.name, targetNode);
            var handlerArgs = Injector.getArgs(handler.params, payload, targetNode);
            handler.action.apply(null, handlerArgs);
        }
    };
}

module.exports = {
    create: create
};
