'use strict';

var EventHandler = require('./../utilities/event-handler');
var Utilities = require('./../utilities/utilities');
var Injector = require('./injector');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var DataStore = require('./../data-store/data-store');
var Logger = require('./../logger/logger');
var Dispatcher = require('./dispatcher');

var COMPONENT_DELIM = ':';
var PUBLIC_KEY = '$public';
var PRIVATE_KEY = '$private';
var LIFECYCLE_KEY = '$lifecycle';
var PASS_THROUGH_KEY = '$pass-through';
var DESCENDANT_KEY = 'descendant';
var MISS_KEY = '$miss';
var ANY_KEY = '$any';

function Events(eventGroups, name, dependencies, rootNode) {
    EventHandler.apply(this);
    this.name = name;
    this.dependencies = dependencies;
    this.dispatcher = new Dispatcher(rootNode);
    this.eventStore = Events.processEventGroups(eventGroups);
}

Events.prototype = Object.create(EventHandler.prototype);
Events.prototype.constructor = Events;

Events.prototype.initializeDescendantEvents = function initializeDescendantEvents(targetRoot, uid) {
    var events;
    var event;
    var selector;
    var eventName;
    for (selector in this.eventStore[DESCENDANT_KEY]) {
        events = this.eventStore[DESCENDANT_KEY][selector];
        for (eventName in events) {
            event = events[eventName];
            if (eventName.indexOf(COMPONENT_DELIM) >= 0) {
                this.setupProxyEvent(event, targetRoot, uid);
            }
            else {
                this.setupDispatchedEvent(event, targetRoot, uid);
            }
        }
    }
};

/*
example:
events:
    '#surface'
        'famous:events:click' ()=>
 */
Events.prototype.setupProxyEvent = function setupProxyEvent(event, targetRoot, uid) {
    var trigger = Events.getDirectEventAction(event.name, this.dependencies);
    var triggerParams = Utilities.getParameterNames(trigger);
    var lastDelimIdx = event.name.lastIndexOf(COMPONENT_DELIM);
    var eventName = event.name.slice(lastDelimIdx + 1); // 'famous:events:click' -> 'click'

    var payload = {
        eventName: eventName
    };

    var targets = VirtualDOM.query(targetRoot, event.selector);
    var targetUID;
    var triggerArgs;
    for (var i = targets.length - 1; i >= 0; i--) {
        targetUID = VirtualDOM.getUID(targets[i]);

        payload.listener = function(eventPayload) {
            var listenerArgs = Injector.getArgs(event.params, eventPayload, uid);
            event.action.apply(null, listenerArgs);
        };

        triggerArgs = Injector.getArgs(triggerParams, payload, targetUID);
        trigger.apply(null, triggerArgs);
    }
};

/*
example:
events:
    '#surface'
        'custom-event' ()=>
 */
Events.prototype.setupDispatchedEvent = function setupDispatchedEvent(event, targetRoot, uid) {
    var self = this;
    var targets = VirtualDOM.query(targetRoot, event.selector);
    var component;
    for (var i = 0; i < targets.length; i++) {
        component = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
        component.events.dispatcher.on(event.name, function(message) {
            self.sendDescendantMessage(event.name, message, event.selector, uid);
        });
    }
};

Events.prototype.sendMessage = function sendMessage(key, value, uid) {
    var publicEvents = this.eventStore[PUBLIC_KEY];
    var eventsToFire = [];
    if (publicEvents[ANY_KEY]) {
        eventsToFire.push(publicEvents[key]);
    }
    if (publicEvents[key]) {
        eventsToFire.push(publicEvents[key]);
    }
    else {
        if (publicEvents[MISS_KEY]) {
            eventsToFire.push(publicEvents[MISS_KEY]);
        }
    }

    if (eventsToFire.length < 1) {
        Logger.log('Unknown public event `' + key + '` for `' + this.name + '`', 1);
    }

    var event;
    var args;
    for (var i = 0; i < eventsToFire.length; i++) {
        event = eventsToFire[i];
        args = Injector.getArgs(event.params, value, uid);
        event.action.apply(null, args);
    }
};

Events.prototype.sendMessages = function sendMessages(messages, uid) {
    for (var key in messages) {
        this.sendMessage(key, messages[key], uid);
    }
};

Events.sendMessageBySelector = function sendMessageBySelector(key, value, targetDOM, selector) {
    var targets = VirtualDOM.query(targetDOM, selector);
    var component;
    for (var i = 0; i < targets.length; i++) {
        component = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
        component.sendMessage(key, value);
    }
};

/*
events
    $pass-through
        selector: *
        (Every public message gets passed along to selected elements)

        selector: ['position', 'opacity']
        (Whitelist of public messages get passed along to selected elements)

        selector: {
            child-position: position,
            child-opacity: opacity
        }
        (Whitelist of public messages get passed along where key is public event &
        value is the public message that gets sent to )
 */
Events.prototype.processPassThroughEvents = function processPassThroughEvents(messageKey, messagePayload, targetDOM) {
    var passThroughEvents = this.eventStore[PASS_THROUGH_KEY];
    var selector;
    var event;
    var value;
    for (selector in passThroughEvents) {
        event = passThroughEvents[selector];
        selector = event.name;
        value = event.action;
        if (typeof value === 'string') {
            Events.sendMessageBySelector(messageKey, messagePayload, targetDOM, selector);
        }
        else if (Array.isArray(value)) {
            if (value.indexOf(messageKey) > -1) {
                Events.sendMessageBySelector(messageKey, messagePayload, targetDOM, selector);
            }
        }
        else if (typeof value === 'object') {
            if (messageKey in value) {
                Events.sendMessageBySelector(value[messageKey], messagePayload, targetDOM, selector);
            }
        }
        else {
            throw new Error('`' + value + '` is not a valid value for a $pass-through event');
        }
    }
};

Events.prototype.sendDescendantMessage = function sendDescendantMessage(eventName, message, selector, uid) {
    var eventsToFire = [];
    var descendantEvents = this.eventStore[DESCENDANT_KEY][selector] || {};
    var i;
    var event;
    for (var descendantEventName in descendantEvents) {
        event = descendantEvents[descendantEventName];
        if (descendantEventName === eventName) {
            eventsToFire.push(event);
        }
    }

    if (eventsToFire.length < 1) {
        throw new Error('Unknown event `' + eventName + '` for `' + this.name + '` (' + selector + ')');
    }

    for (i = 0; i < eventsToFire.length; i++) {
        event = eventsToFire[i];
        event.action.apply(null, Injector.getArgs(event.params, message, uid));
    }
};

Events.prototype.getPublicEvent = function getPublicEvent(eventName) {
    return this.eventStore[PUBLIC_KEY][eventName];
};

Events.prototype.getPrivateEvent = function getPrivateEvent(eventName) {
    return this.eventStore[PRIVATE_KEY][eventName];
};

Events.prototype.triggerDirectEventHandler = function triggerDirectEventHandler(name, payload, uid) {
    var handler = Events.getDirectEventAction(name, this.dependencies);
    var handlerParams = Utilities.getParameterNames(handler);
    var handlerArgs = Injector.getArgs(handlerParams, payload, uid);
    handler.apply(null, handlerArgs);
};

/*
Used to find behavior handlers for behavior's with '$self' selector:
i.e.:
behaviors
    $self
        set-content =>

$private takes precendence of $public
 */
Events.prototype.getSelfEvent = function getSelfEvent(eventName) {
    var event = this.getPrivateEvent(eventName) ||
                this.getPublicEvent(eventName);

    if (!event) {
        throw new Error('`' + this.name + '` does not have a `$private` or `$public` event named `' + eventName + '`.');
    }

    return event;
};

Events.prototype.triggerEvent = function(event, payload, uid) {
    var selector = event.selector;
    switch (selector) {
        case PUBLIC_KEY:
        case PRIVATE_KEY:
            this._executeEvent(event, payload, uid);
            break;
        case LIFECYCLE_KEY: this.triggerLifecycleEvent(event.name, payload, uid); break;
        default: throw new Error('`' + selector + '` is not a valid event selector');
    }
};

Events.prototype.triggerLifecycleEvent = function(name, uid) {
    var event = this.eventStore[LIFECYCLE_KEY][name];
    if (event) {
        this._executeEvent(event, null, uid);
    }
};

Events.prototype._executeEvent = function _executeEvent(event, payload, uid) {
    var args = Injector.getArgs(event.params, payload, uid);
    event.action.apply(null, args);
};

Events.prototype.triggerPublicEvent = function triggerPublicEvent(eventName, payload, uid) {
    var event = this.eventStore[PUBLIC_KEY][eventName];
    if (!event) {
        throw new Error('Unknown public event `' + eventName + '` for `' + this.name + '`');
    }

    this._executeEvent(event, payload, uid);
};

Events.processEventGroups = function processEventGroups(groups) {
    var list = {};
    list[PUBLIC_KEY] = {};
    list[PRIVATE_KEY] = {};
    list[LIFECYCLE_KEY] = {};
    list[PASS_THROUGH_KEY] = {};
    list[DESCENDANT_KEY] = {};

    var selector;
    var events;
    var eventName;
    var store;
    for (selector in groups) {
        events = groups[selector];
        store = {};
        for (eventName in events) {
            store[eventName] = {
                name: eventName,
                action: events[eventName],
                selector: selector,
                params: Utilities.getParameterNames(events[eventName])
            };
        }

        switch (selector) {
            case PUBLIC_KEY: list[PUBLIC_KEY] = store; break;
            case PRIVATE_KEY: list[PRIVATE_KEY] = store; break;
            case LIFECYCLE_KEY: list[LIFECYCLE_KEY] = store; break;
            case PASS_THROUGH_KEY: list[PASS_THROUGH_KEY] = store; break;
            default: list[DESCENDANT_KEY][selector] = store; break;
        }
    }

    return list;
};

Events.getDirectEventAction = function getDirectEventAction(name, dependencies) {
    var lastDelimIdx = name.lastIndexOf(COMPONENT_DELIM);
    var moduleName = name.slice(0, lastDelimIdx);
    var handlerName = name.slice(lastDelimIdx + 1);
    var moduleTag = dependencies[moduleName];
    var bestModule = DataStore.getModule(moduleName, moduleTag);

    var foundEvent;
    var fallbackEvent;
    var action;
    for (var eventName in bestModule.events[PUBLIC_KEY]) {
        action = bestModule.events[PUBLIC_KEY][eventName];
        if (eventName === handlerName) {
            foundEvent = action;
            break;
        }
        else if (eventName === MISS_KEY || eventName === ANY_KEY) {
            fallbackEvent = action;
        }
    }

    var handler = foundEvent || fallbackEvent;
    if (!handler) {
        throw new Error('Unknown behavior handler `' + name + '`');
    }
    return handler;
};

module.exports = Events;
