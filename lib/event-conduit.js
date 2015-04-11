'use strict';

var Bundle = require('./bundle');
var Injector = require('./injector');
var NodeStore = require('./node-store');
var VirtualDOM = require('./virtual-dom');

var OBJ_TYPE = 'object';
var COMPONENT_DELIM = ':';
var ALL_SELECTOR = '*';
var RESERVED_ATTRIBUTES = {
    'id': true,
    'class': true,
    'uid': true,
    'data-messages': true,
    'tree_sig': true
};

function EventConduit(node) {
    this.node = node;
}

function createNormalListener(bestNode, descNode, key, value) {
    descNode.arbiter.on(key, function(event) {
        bestNode.eventManager.sendMessage(value, event);
    });
}

function createHandlerListener(bestNode, descNode, key, value) {
    var behaviorHandler = Bundle.getBehaviorHandler(key, bestNode);
    var payload = { listenerName: value, listenerNode: bestNode, channelName: key };
    var args = Injector.getArgs(behaviorHandler.params, payload, descNode);
    behaviorHandler.action.apply(null, args);
}

function createListener(bestNode, descNode, attribute) {
    if (typeof attribute === OBJ_TYPE) {
        if (!(attribute.name in RESERVED_ATTRIBUTES)) {
            var eventName = attribute.name;
            var eventValue = attribute.value;
            if (eventName.indexOf(COMPONENT_DELIM) !== -1) {
                createHandlerListener(bestNode, descNode, eventName, eventValue);
            }
            else {
                createNormalListener(bestNode, descNode, eventName, eventValue);
            }
        }
    }
}

EventConduit.prototype.prepare = function() {
    var signatureRoot = this.node.domStore.treeSignature;
    var descendants = VirtualDOM.query(signatureRoot, ALL_SELECTOR);
    for (var i = 0; i < descendants.length; i++) {
        var descendant = descendants[i];
        var descendantNode = NodeStore.findNode(VirtualDOM.getUID(descendant));
        var attributes = descendant.attributes;
        for (var key in attributes) {
            createListener(this.node, descendantNode, attributes[key]);
        }
    }
};

module.exports = EventConduit;
