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
var DESCENDANT_KEY = 'descendant';
var SELF_KEY = '$self';
var MISS_KEY = '$miss';
var ANY_KEY = '$any';

function Events(eventGroups, name, rootNode) {
    EventHandler.apply(this);
    this.name = name;
    this.dispatcher = new Dispatcher(rootNode);
    this.eventStore = Events.processEventGroups(eventGroups);
}

Events.prototype = Object.create(EventHandler.prototype);
Events.prototype.constructor = Events;

Events.prototype.initializeDescendantEvents = function initializeDescendantEvents(targetRoot, uid) {
    var events;
    var events;
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
}

/*
example:
events:
    '#surface'
        'famous:events:click' ()=>
 */
Events.prototype.setupProxyEvent = function setupProxyEvent(event, targetRoot, uid) {
    var trigger = Events.getDirectEventAction(event.name);
    var triggerParams = Utilities.getParameterNames(trigger);
    var lastDelimIdx = event.name.lastIndexOf(COMPONENT_DELIM);
    var eventName = event.name.slice(lastDelimIdx + 1); // 'famous:events:click' -> 'click'

    var payload = {
        eventName: eventName
    };

    var targets = VirtualDOM.query(targetRoot, event.selector);
    var targetUID;
    var bestComponent;
    var triggerArgs;
    for (var i = targets.length - 1; i >= 0; i--) {
        targetUID = VirtualDOM.getUID(targets[i]);
        bestComponent = DataStore.getComponent(targetUID);

        payload.listener = function(eventPayload) {
            var listenerArgs = Injector.getArgs(event.params, eventPayload, uid);
            event.action.apply(null, listenerArgs);
        }

        triggerArgs = Injector.getArgs(triggerParams, payload, targetUID);
        trigger.apply(null, triggerArgs);
    };
}

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
    var eventChannel;
    for (var i = 0; i < targets.length; i++) {
        component = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
        component.events.dispatcher.on(event.name, function(message) {
            self.sendDescendantMessage(event.name, message, event.selector, uid)
        });
    }
}

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
            eventsToFire.push(publicEvents[MISS_KEY])
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
}

Events.prototype.sendMessages = function sendMessages(messages, uid) {
    for (var key in messages) {
        this.sendMessage(key, messages[key], uid);
    }
}

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
}

Events.prototype.getPublicEvent = function getPublicEvent(eventName) {
    return this.eventStore[PUBLIC_KEY][eventName];
}

Events.prototype.triggerDirectEventHandler = function triggerDirectEventHandler(name, payload, uid) {
    var handler = Events.getDirectEventAction(name);
    var handlerParams = Utilities.getParameterNames(handler);
    var handlerArgs = Injector.getArgs(handlerParams, payload, uid);
    handler.apply(null, handlerArgs);
}

Events.prototype.getSelfEvent = function getSelfEvent(eventName) {
    var lastDelimIdx = eventName.indexOf(COMPONENT_DELIM);
    eventName = eventName.slice(lastDelimIdx + 1);
    var event  = this.eventStore[PRIVATE_KEY][eventName];

    if (event) {
        return event;
    }
    else {
        return this.getPublicEvent(eventName);
    }
}

Events.prototype.triggerEvent = function(event, payload, uid) {
    var selector = event.selector;
    switch (selector) {
        case PUBLIC_KEY:
        case PRIVATE_KEY:
            this._executeEvent(event, payload, uid);
            break;
        case LIFECYCLE_KEY: this._triggerLifecycleEvent(event.name, payload, uid); break;
        case DESCENDANT_KEY: this._triggerDescendantEvent(event.name, payload, uid); break;
        default: throw new Error('`' + selector + '` is not a valid event selector');
    }
}

Events.prototype._executeEvent = function _executeEvent(event, payload, uid) {
    var args = Injector.getArgs(event.params, payload, uid);
    event.action.apply(null, args);
}

Events.prototype.triggerPublicEvent = function triggerPublicEvent(eventName, payload, uid) {
    var event = this.eventStore[PUBLIC_KEY][eventName];
    if (!event) {
        throw new Error('Unknown public event `' + eventName + '` for `' + this.name + '`');
    }

    this._executeEvent(event, payload, uid);
}

Events.prototype._triggerLifecycleEvent = function _triggerLifecycleEvent(eventName, payload, uid) {
    // TODO
}

Events.prototype._triggerDescendantEvent = function triggerDescendantEvent(eventName, payload, uid) {
    // TODO
}

Events.processEventGroups = function processEventGroups(groups) {
    var list = {};
    list[PUBLIC_KEY] = {};
    list[PRIVATE_KEY] = {};
    list[LIFECYCLE_KEY] = {};
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
            default: list[DESCENDANT_KEY][selector] = store; break;
        }
    }

    return list;
}

Events.getDirectEventAction = function getDirectEventAction(name) {
    var lastDelimIdx = name.lastIndexOf(COMPONENT_DELIM);
    var moduleName = name.slice(0, lastDelimIdx);
    var handlerName = name.slice(lastDelimIdx + 1);
    var bestModule = DataStore.getModule(moduleName);

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
}

module.exports = Events;
