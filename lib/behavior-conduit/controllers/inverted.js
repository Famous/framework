'use strict';

var Args = require('./../../helpers/args');
var VirtualDOM = require('./../../virtual-dom');
var NodeStore = require('./../../node-store');

var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';

function getRepeatPayload(node, selector, index) {
    return node.behaviorConduit.controlFlowData.repeat[selector].payload[index];
}

function create(behavior, node) {
    return function() {
        var targets = node.domStore.treeSignature.querySelectorAll(behavior.selector);
        var args = Args.fetch(behavior.params, node.stateManager);
        var repeatIndexIndex = behavior.params.indexOf(INDEX_KEY);
        var repeatPayloadIndex = behavior.params.indexOf(REPEAT_PAYLOAD_KEY);
        var payload;
        var targetNode;
        for (var i = 0; i < targets.length; i++) {
            args[repeatIndexIndex] = i;
            args[repeatPayloadIndex] = getRepeatPayload(node, behavior.selector, i);
            payload = behavior.action.apply(null, args);
            targetNode = NodeStore.findNode(VirtualDOM.getUID(targets[i]));
            targetNode.eventChannel.sendMessage(behavior.name, payload);
        }
    };
}

module.exports = {
    create: create
};
