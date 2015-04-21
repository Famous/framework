var EventHandler = require('./../utilities/event-handler');
var Utilities = require('./../utilities/utilities');
var Injector = require('./injector');

var PUBLIC_KEY = '$public';
var PRIVATE_KEY = '$private';
var LIFECYCLE_KEY = '$lifecycle';
var DESCENDANT_EVENTS_KEY = 'descendant';

function Events(eventGroups, name) {
    EventHandler.apply(this);
    this.name = name;
    this.eventStore = Events.processEventGroups(eventGroups);
}

Events.prototype = Object.create(EventHandler.prototype);
Events.prototype.constructor = Events;

Events.prototype.getPublicEvents = function getPublicEvents() {
    return this.eventStore[PUBLIC_KEY];
}

Events.prototype.triggerPublicEvent = function triggerPublicEvent(eventName, payload, uid) {
    var event = this.eventStore[PUBLIC_KEY][eventName];
    if (!event) {
        throw new Error('Unknown public event `' + eventName + '` for `' + this.name + '`');
    }

    var args = Injector.getArgs(event.params, payload, uid);
    event.action.apply(null, args);
}

Events.processEventGroups = function processEventGroups(groups) {
    var list = {};
    list[PUBLIC_KEY] = {};
    list[PRIVATE_KEY] = {};
    list[LIFECYCLE_KEY] = {};
    list[DESCENDANT_EVENTS_KEY] = {};

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
            }
        }

        switch (selector) {
            case PUBLIC_KEY: list[PUBLIC_KEY] = store; break;
            case PRIVATE_KEY: list[PRIVATE_KEY] = store; break;
            case LIFECYCLE_KEY: list[LIFECYCLE_KEY] = store; break;
            default: list[DESCENDANT_EVENTS_KEY][selector] = store; break;
        }
    }

    return list;
}

module.exports = Events;
