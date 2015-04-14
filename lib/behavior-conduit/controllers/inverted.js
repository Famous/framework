'use strict';

var Args = require('./../../helpers/args');
var VirtualDOM = require('./../../virtual-dom');
var NodeStore = require('./../../node-store');

var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';

function create(behavior, node) {
    return function() {
        var targets = node.domStore.treeSignature.querySelectorAll(behavior.selector);
        var args = Args.fetch(behavior.params, node.stateManager);
        var repeatIndexIndex = behavior.params.indexOf(INDEX_KEY);
        var repeatPayloadIndex = behavior.params.indexOf(REPEAT_PAYLOAD_KEY);
        var payload;
        var targetNode;
        for (var i = 0; i < targets.length; i++) {
            targetNode = NodeStore.findNode(VirtualDOM.getUID(targets[i]));

            // Insert $index & $repeatPayload
            if (repeatIndexIndex !== -1) {
                args[repeatIndexIndex] = targetNode.stateManager.get(INDEX_KEY);
            }
            if (repeatPayloadIndex) {
                args[repeatPayloadIndex] = targetNode.stateManager.get(REPEAT_PAYLOAD_KEY);
            }

            payload = behavior.action.apply(null, args);
            targetNode.eventChannel.sendMessage(behavior.name, payload);
        }
    };
}

module.exports = {
    create: create
};
