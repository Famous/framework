'use strict';

var Args = require('./../../helpers/args');
var NodeStore = require('./../../node-store');
var Targets = require('./../../helpers/targets');
var VirtualDOM = require('./../../virtual-dom');

function create(behavior, node) {
    return function() {
        var args = Args.fetch(behavior.params, node.stateManager);
        var targets = Targets.fetch(node.domStore.treeSignature, behavior.selector);
        for (var i = 0; i < targets.length; i++) {
            var target = targets[i];
            var targetNode = NodeStore.findNode(VirtualDOM.getUID(target));
            var targetEventChannel = targetNode.eventChannel;
            var payload = behavior.action.apply(null, args);
            targetEventChannel.sendMessage(behavior.name, payload);
        }
    };
}

module.exports = {
    create: create
};
