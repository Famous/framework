'use strict';

var Bundle = require('./bundle');
var Injector = require('./injector');
var NodeStore = require('./node-store');
var VirtualDOM = require('./virtual-dom');

var PUBLIC_KEY = '$public';
var PRIVATE_KEY = '$private';
var LIFECYCLE_KEY = '$lifecycle';
var MISS_KEY = '$miss';
var ANY_KEY = '$any';
var COMPONENT_DELIM = ':';

function EventChannel(node) {
    this.node = node;
    this.stateManager = node.stateManager;
    this.eventsList = Bundle.getEventsList(node.name);
    this.selfEvents = {};
    this.publicEvents = {};
    this.privateEvents = {};
    this.lifecycleEvents = {};
    this.descendantEvents = [];
    var eventsList = this.eventsList;
    for (var i = 0; i < eventsList.length; i++) {
        var event = eventsList[i];
        var selector = event.selector;
        if (selector === PUBLIC_KEY) {
            this.selfEvents[event.name] = event;
            this.publicEvents[event.name] = event;
        }
        else if (selector === PRIVATE_KEY) {
            this.selfEvents[event.name] = event;
            this.publicEvents[event.name] = event;
        }
        else if (selector === LIFECYCLE_KEY) {
            this.lifecycleEvents[event.name] = event;
        }
        else {
            this.descendantEvents.push(event);
        }
    }
}

EventChannel.prototype.getPublicEvent = function(name) {
    return this.publicEvents[name];
};

EventChannel.prototype.getPrivateEvent = function(name) {
    return this.privateEvents[name];
};

EventChannel.prototype.getSelfEvent = function(name) {
    return this.selfEvents[name];
};

EventChannel.prototype.getLifecycleEvent = function(name) {
    return this.lifecycleEvents[name];
};

function setupProxyEvent(event, node, proxy) {
    var trigger = Bundle.getBehaviorHandler(event.name, node);
    var dom = node.domStore.treeSignature;
    var descNodes = VirtualDOM.query(dom, event.selector);
    for (var i = 0; i < descNodes.length; i++) {
        var descNode = descNodes[i];
        var descBestNode = NodeStore.findNode(VirtualDOM.getUID(descNode));
        var payload = {
            proxy: proxy,
            selector: event.selector,
            listener: node.eventChannel.descendantMessage.bind(node.eventChannel)
        };
        var args = Injector.getArgs(trigger.params, payload, descBestNode);
        trigger.action.apply(null, args);
    }
}

function setupDispatchedEvent(event, node, key) {
    var dom = node.domStore.treeSignature;
    var descNodes = VirtualDOM.query(dom, event.selector);
    for (var i = 0; i < descNodes.length; i++) {
        var descNode = descNodes[i];
        var descBestNode = NodeStore.findNode(VirtualDOM.getUID(descNode));
        descBestNode.dispatcher.on(event.name, function(message) {
            node.eventChannel.descendantMessage(key, message, event.selector);
        });
    }
}

EventChannel.prototype.prepare = function() {
    var descendantEvents = this.descendantEvents;
    for (var i = 0; i < descendantEvents.length; i++) {
        var event = descendantEvents[i];
        var parts = event.name.split(COMPONENT_DELIM);
        var key = parts[parts.length - 1];
        if (parts.length > 1) {
            setupProxyEvent(event, this.node, key);
        }
        else {
            setupDispatchedEvent(event, this.node, key);
        }
    }
};

EventChannel.prototype.sendMessage = function(key, message) {
    var eventsToFire = [];
    if (this.publicEvents[ANY_KEY]) {
        eventsToFire.push(this.publicEvents[key]);
    }
    if (this.publicEvents[key]) {
        eventsToFire.push(this.publicEvents[key]);
    }
    else {
        if (this.publicEvents[MISS_KEY]) {
            eventsToFire.push(this.publicEvents[MISS_KEY]);
        }
    }
    if (eventsToFire.length < 1) {
        throw new Error('Unknown public event `' + key + '` for `' + this.node.name + '`');
    }
    for (var i = 0; i < eventsToFire.length; i++) {
        var event = eventsToFire[i];
        var args = Injector.getArgs(event.params, message, this.node);
        event.action.apply(null, args);
    }
};

EventChannel.prototype.descendantMessage = function(key, message, selector) {
    var eventsToFire = [];
    var descendantEvents = this.descendantEvents;
    var i;
    var event;
    for (i = 0; i < descendantEvents.length; i++) {
        event = descendantEvents[i];
        if (event.selector === selector) {
            if (event.name === key) {
                eventsToFire.push(event);
            }
        }
    }
    if (eventsToFire.length < 1) {
        throw new Error('Unknown event `' + key + '` for `' + this.node.name + '` (' + selector + ')');
    }
    for (i = 0; i < eventsToFire.length; i++) {
        event = eventsToFire[i];
        var args = Injector.getArgs(event.params, message, this.node);
        event.action.apply(null, args);
    }
};

EventChannel.prototype.lifecycleMessage = function(key, message) {
    var lifecycleEvents = this.lifecycleEvents;
    if (lifecycleEvents[key]) {
        var event = lifecycleEvents[key];
        var args = Injector.getArgs(event.params, message, this.node);
        event.action.apply(null, args);
    }
};

EventChannel.prototype.sendMessages = function(messages) {
    for (var key in messages) {
        this.sendMessage(key, messages[key]);
    }
};

module.exports = EventChannel;
