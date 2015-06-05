'use strict';

var getComponent = require('../utilities/utilities').getComponent;

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
        while (element.parentNode) {
            element.dispatchEvent(event);
            element = element.parentNode;
        }
    }
};

Dispatcher.prototype.trigger = function(key, message) {
    var component = getComponent(this.domNode);
    component.sendMessage(key, message);
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

module.exports = Dispatcher;
