'use strict';

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

Dispatcher.willEventsTrickle = (function() {
    var willTrickle = false;
    var doc = window.document;
    if (doc) {
        var parent = doc.createElement('div');
        var child = parent.cloneNode();
        parent.appendChild(child);
        child.addEventListener('e', function() {
            willTrickle = true;
        });

        parent.dispatchEvent(new CustomEvent('e', { trickles: true }));
    }
    return willTrickle;
})();


Dispatcher.prototype.broadcast = function(key, message) {
    var element =  this.domNode;
    var event = new CustomEvent(key, {
        detail: message,
        trickles: true
    });
    if (Dispatcher.willEventsTrickle) {
        element.dispatchEvent(event);
    }
    else {
        var broadcastToChildNodes = function(node) {
            for (var i = 0; i < node.childNodes.length; i++) {
                var child = node.childNodes[i];
                child.dispatchEvent(event);
                broadcastToChildNodes(child);
            }
        };

        broadcastToChildNodes(element);
    }
};

Dispatcher.prototype.on = function(key, cb) {
    this.domNode.addEventListener(key, cb);
};

module.exports = Dispatcher;
