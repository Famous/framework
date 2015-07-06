'use strict';

var PubSub = require('pubsub-js');

var getComponent = require('./../utilities/utilities').getComponent;

function Dispatcher(domNode) {
    this.domNode = domNode;
}

// Some browsers will not bubble events in a DOM tree that is
// detached from the document; this block simply checks whether
// detached DOM bubbling is supported or not, so we can know
// whether we need to manually bubble events below.
Dispatcher.willEventsBubbleInDetachedDOM = (function() {
    var willBubble = false;
    var doc = window.document;
    if (doc) {
        var parent = doc.createElement('div');
        var child = parent.cloneNode();
        parent.appendChild(child);
        parent.addEventListener('e', function() {
            willBubble = true;
        });

        child.dispatchEvent(new CustomEvent('e', { bubbles: true }));
    }
    return willBubble;
})();

Dispatcher.prototype.emit = function(key, message) {
    var element = this.domNode;

    var event = new CustomEvent(key, {
        detail: message,
        bubbles: true
    });

    if (Dispatcher.willEventsBubbleInDetachedDOM) {
        element.dispatchEvent(event);
    }
    else {
        // Grab all the nodes up the parent chain and dispatch
        // events to them. Select the parents first incase
        // one of the dispatched events leads the the removal
        // of a DOM element via the control flow conduit.
        var ancestors = [];
        var parent = element.parentNode;
        while (parent) {
            ancestors.push(parent);
            parent = parent.parentNode;
        }

        element.dispatchEvent(event);
        ancestors.forEach(function(ancestor) {
            ancestor.dispatchEvent(event);
        });
    }
};

Dispatcher.prototype.trigger = function(key, message) {
    var component = getComponent(this.domNode);

    // Trigger $public event
    component.sendMessage(key, message);

    // Trigger $private event
    var eventConduit = component.events;
    var privateEvent = eventConduit.getPrivateEvent(key);
    if (privateEvent) {
        eventConduit.triggerEvent(privateEvent, message, component.uid);
    }
};

Dispatcher.prototype.broadcast = function(key, message) {
    var element =  this.domNode;
    var event = new CustomEvent(key, {
        detail: message,
        trickles: true
    });
    var broadcastToChildNodes = function(node) {
        for (var i = 0; i < node.childNodes.length; i++) {
            var child = node.childNodes[i];
            child.dispatchEvent(event);
            broadcastToChildNodes(child);
        }
    };

    broadcastToChildNodes(element);
};

Dispatcher.prototype.on = function(key, cb) {
    this.domNode.addEventListener(key, cb);
};

Dispatcher.prototype.publish = function(key, message) {
    PubSub.publish(key, message);
};

Dispatcher.prototype.subscribe = function(key, cb) {
    PubSub.subscribe(key, cb);
};

module.exports = Dispatcher;
