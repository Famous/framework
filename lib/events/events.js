var EventHandler = require('./../utilities/event-handler');
var Utilities = require('./../utilities/utilities');
var Injector = require('./injector');
var DataStore = require('./../data-store/data-store');

var COMPONENT_DELIM = ':';
var PUBLIC_KEY = '$public';
var PRIVATE_KEY = '$private';
var LIFECYCLE_KEY = '$lifecycle';
var DESCENDANT_KEY = 'descendant';
var SELF_KEY = '$self';

function Events(eventGroups, name) {
    EventHandler.apply(this);
    this.name = name;
    this.eventStore = Events.processEventGroups(eventGroups);
}

Events.prototype = Object.create(EventHandler.prototype);
Events.prototype.constructor = Events;

Events.prototype.getPublicEvent = function getPublicEvent(eventName) {
    return this.eventStore[PUBLIC_KEY][eventName];
}

Events.prototype.triggerDirectEventHandler = function triggerDirectEventHandler(name, payload, uid) {
    var lastDelimIdx = name.lastIndexOf(COMPONENT_DELIM);
    var moduleName = name.slice(0, lastDelimIdx);
    var handlerName = name.slice(lastDelimIdx + 1);
    var bestModule = DataStore.getModule(moduleName);
    var handler = bestModule.events[PUBLIC_KEY][handlerName];
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

module.exports = Events;
