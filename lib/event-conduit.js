'use strict';

var Bundle = require('./bundle');
var Injector = require('./injector');
var NodeStore = require('./node-store');
var VirtualDOM = require('./virtual-dom');

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

EventConduit.prototype.prepare = function() {
    var signatureRoot = this.node.treeSignature;
    var descendants = VirtualDOM.query(signatureRoot, ALL_SELECTOR);
    for (var i = 0; i < descendants.length; i++) {
        var descendant = descendants[i];
        var descendantNode = NodeStore.findNode(VirtualDOM.getUID(descendant));
        var attributes = descendant.attributes;
        for (var key in attributes) {
            if ((isNaN(key))) {
                continue; // Numeric keys are user-defined
            }
            if ((attributes[key].name in RESERVED_ATTRIBUTES)) {
                continue;
            }
            var attribute = attributes[key];
            var channelName = attribute.name; // Name of the event trigger to setup in the substrate
            var registrantName = attribute.value; // Name of the event handler in the BEST node
            var eventTrigger = Bundle.getBehaviorHandler(channelName, this.node);
            var eventHandler = this.node.publicEvents[registrantName];
            if (!eventHandler) {
                continue;
            }
            var triggerPayload = { registrant: eventHandler, stateManager: this.node.stateManager };
            var eventTriggerArgs = Injector.getArgs(eventTrigger.params, triggerPayload, descendantNode);
            eventTrigger.action.apply(null, eventTriggerArgs);
        }
    }

    var stateManager = this.node.stateManager;
    var mainRoot = this.node.domNode;
    var descendantEventGroups = this.node.descendantEvents;
    for (var selector in descendantEventGroups) {
        var descendantEventsObject = descendantEventGroups[selector];
        var descendantNodes = VirtualDOM.query(mainRoot, selector);
        for (var i = 0; i < descendantNodes.length; i++) {
            var bestNode = NodeStore.findNode(VirtualDOM.getUID(descendantNodes[i]));
            for (var stateName in descendantEventsObject) {
                var descendantEventListener = descendantEventsObject[stateName];
                (function(descendantEventListener) {
                    bestNode.stateManager.subscribeTo(stateName, function(changedStateName, changedStateValue) {
                        descendantEventListener(stateManager, changedStateValue);
                    });
                })(descendantEventListener);

            }
        }
    }
};

module.exports = EventConduit;
