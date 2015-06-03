'use strict';

var getComponent = require('../utilities/utilities').getComponent;

function Dispatcher(domNode) {
    this.domNode = domNode;
}

Dispatcher.willEventsBubble = (function() {
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
    if (Dispatcher.willEventsBubble) {
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
}

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
