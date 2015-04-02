'use strict';

var NodeStore = require('./../../node-store');
var Targets = require('./../../helpers/targets');
var VirtualDOM = require('./../../virtual-dom');

var TIME_KEY = '$time';
var NOW_KEY = '$now';
var FRAME_KEY = '$frame';

var FRAMES = {};

function create(behavior, node) {
    var states = node.statesObject;
    FRAMES[node.uid] = 0;
    return function(time) {
        var now = Date.now();
        var frame = FRAMES[node.uid]++;

        var i;
        var args = [];
        var params = behavior.params || [];
        for (i = 0; i < params.length; i++) {
            var name = params[i];
            if (name === TIME_KEY) {
                args[i] = time;
            }
            else if (name === FRAME_KEY) {
                args[i] = frame;
            }
            else if (name === NOW_KEY) {
                args[i] = now;
            }
            else {
                args[i] = states[name];
            }
        }
        var payload = behavior.action.apply(null, args);
        var targets = Targets.fetch(node.domNode, behavior.selector);
        for (i = 0; i < targets.length; i++) {
            var target = targets[i];
            var targetNode = NodeStore.findNode(VirtualDOM.getUID(target));
            targetNode.eventManager.sendMessage(behavior.name, payload);
        }
    };
}

module.exports = {
    create: create
};
