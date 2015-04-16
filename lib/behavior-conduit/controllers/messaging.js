'use strict';

var Args = require('./../args');
var NodeStore = require('./../../node-store');
var VirtualDOM = require('./../../virtual-dom');

function create(behavior, node) {
    return function() {
        var args = Args.fetch(behavior.params, node.stateManager);
        var targets = VirtualDOM.fetchTargets(node.domStore.treeSignature, behavior.selector);
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
