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
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var EVENT_KEY = '$event';

function Events(eventGroups, name, dependencies, rootNode) {
    EventHandler.apply(this);
    this.name = name;
    this.dependencies = dependencies;
    this.dispatcher = new Dispatcher(rootNode);
    this.eventStore = Events.processEventGroups(eventGroups);
}

Events.prototype = Object.create(EventHandler.prototype);
Events.prototype.constructor = Events;

// Set up event listeners for all events that are attached to children of the component.
Events.prototype.initializeDescendantEvents = function initializeDescendantEvents(expandedBlueprint, uid, uidWhiteList) {
    var events;
    var event;
    var selector;
    var eventName;
    var targets;
    for (selector in this.eventStore[DESCENDANT_KEY]) {
        events = this.eventStore[DESCENDANT_KEY][selector];
        targets = VirtualDOM.query(expandedBlueprint, selector);

        // If white list is included, only attach events to nodes corresponding to UIDs in
        // that white list (i.e., dynamically added nodes).
        if (uidWhiteList) {
            var whiteListTargets = [];
            for (var i = 0; i < targets.length; i++) {
                if (uidWhiteList.indexOf(VirtualDOM.getUID(targets[i])) !== -1) {
                    whiteListTargets.push(targets[i]);
                }
            }
            targets = whiteListTargets;
        }

        for (eventName in events) {
            event = events[eventName];
            if (eventName.indexOf(COMPONENT_DELIM) >= 0) {
                this.setupProxyEvent(event, targets, uid);
            }
            else {
                this.setupDispatchedEvent(event, targets, uid);
            }
        }
    }
};

function getIndexAndRepeatPayloadParamIndex(params) {
    var $indexIndex = params.indexOf(INDEX_KEY);
    var $repeatPayloadIndex = params.indexOf(REPEAT_PAYLOAD_KEY);
    if ($indexIndex !== -1 || $repeatPayloadIndex !== -1) {
        return {
            '$indexIndex' : $indexIndex,
            '$repeatPayloadIndex' : $repeatPayloadIndex
        };
    }
    else {
        return null;
    }
}

function triggerProxyEvent(frameworkEvent, nativeEvent, args) {
    var $eventIndex = frameworkEvent.params.indexOf(EVENT_KEY);
    args[$eventIndex] = nativeEvent;
    frameworkEvent.action.apply(null, args);
}

/*
example:
events:
    '#surface'
        'famous:events:click' ()=>
 */
Events.prototype.setupProxyEvent = function setupProxyEvent(frameworkEvent, targets, uid) {
    var trigger = Events.getDirectEventAction(frameworkEvent.name, this.dependencies);
    var triggerParams = Utilities.getParameterNames(trigger);
    var lastDelimIdx = frameworkEvent.name.lastIndexOf(COMPONENT_DELIM);
    var eventName = frameworkEvent.name.slice(lastDelimIdx + 1); // 'famous:events:click' -> 'click'
    var targetUID;
    var triggerArgs;
    var listenerArgs;
    var component;
    var payload;
    var target;

    for (var i = 0; i < targets.length; i++) {
        payload = { eventName: eventName };
        target = targets[i];

        while(VirtualDOM.isValidHTMLElement(target)) {
            target = target.parentNode;
        }

        targetUID = VirtualDOM.getUID(target);

        // If $index/$repeatPayload is injected into an event handler, the value of $index should
        // correspond to the $index associated with the item that is capturing the event.
        // For example, if items are repeated, the $index value on a click handler should be
        // the index of the repeated item, not the parent component.
        var specialIndicies = getIndexAndRepeatPayloadParamIndex(frameworkEvent.params);
        if (specialIndicies) {
            component = Utilities.getComponent(target);
            payload.listener = function(boundComponent, eventPayload) {
                listenerArgs = Injector.getArgs(frameworkEvent.params, null, uid);
                listenerArgs[specialIndicies.$indexIndex] = boundComponent.states.get(INDEX_KEY);
                listenerArgs[specialIndicies.$repeatPayloadIndex] = boundComponent.states.get(REPEAT_PAYLOAD_KEY);
                triggerProxyEvent(frameworkEvent, eventPayload, listenerArgs);
            }.bind(null, component);
        }
        else {
            payload.listener = function(eventPayload) {
                listenerArgs = Injector.getArgs(frameworkEvent.params, null, uid);
                triggerProxyEvent(frameworkEvent, eventPayload, listenerArgs);
            };
        }

        triggerArgs = Injector.getArgs(triggerParams, payload, targetUID);
        trigger.apply(null, triggerArgs);
    }
};

function getDescendantEvents(eventName, descendantEvents, selector) {
    var events = [];
    var event;
    for (var descendantEventName in descendantEvents) {
        event = descendantEvents[descendantEventName];
        if (descendantEventName === eventName) {
            events.push(event);
        }
    }

    if (events.length < 1) {
        throw new Error('Unknown event `' + eventName + '` for `' + this.name + '` (' + selector + ')');
    }

    return events;
}

/*
example:
events:
    '#surface'
        'custom-event' ()=>
 */
Events.prototype.setupDispatchedEvent = function setupDispatchedEvent(frameworkEvent, targets, uid) {
    var eventName = frameworkEvent.name;
    var component;
    var specialIndicies = getIndexAndRepeatPayloadParamIndex(frameworkEvent.params);
    for (var i = 0; i < targets.length; i++) {
        component = DataStore.getComponent(VirtualDOM.getUID(targets[i]));

        component.events.dispatcher.on(eventName, function(component, customEvent) {
            var eventsToFire = getDescendantEvents(eventName, this.eventStore[DESCENDANT_KEY][frameworkEvent.selector] || {}, frameworkEvent.selector);
            var args;
            var event;
            var $eventIndex;
            for (i = 0; i < eventsToFire.length; i++) {
                event = eventsToFire[i];
                args = Injector.getArgs(event.params, customEvent.detail, uid);
                if (specialIndicies) {
                    args[specialIndicies.$indexIndex] = component.states.get(INDEX_KEY);
                    args[specialIndicies.$repeatPayloadIndex] = component.states.get(REPEAT_PAYLOAD_KEY);
                }
                $eventIndex = event.params.indexOf(EVENT_KEY);
                args[$eventIndex] = customEvent;
                event.action.apply(null, args);
            }
        }.bind(this, component));
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
        content =>

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
Events.prototype._processPassThroughEvents = function _processPassThroughEvents(messageKey, messagePayload, uid) {
    var passThroughEvents = this.eventStore[PASS_THROUGH_KEY];
    var eventPassedThrough = false;
    var selector;
    var event;
    var value;
    for (selector in passThroughEvents) {
        event = passThroughEvents[selector];
        selector = event.name;
        value = event.action;
        if (value === '*') {
            Events.sendMessageBySelector(messageKey, messagePayload, uid, selector);
            eventPassedThrough = true;
        }
        else if (Array.isArray(value)) {
            if (value.indexOf(messageKey) > -1) {
                Events.sendMessageBySelector(messageKey, messagePayload, uid, selector);
                eventPassedThrough = true;
            }
        }
        else if (typeof value === 'object') {
            if (messageKey in value) {
                Events.sendMessageBySelector(value[messageKey], messagePayload, uid, selector);
                eventPassedThrough = true;
            }
        }
        else {
            throw new Error('`' + value + '` is not a valid value for a $pass-through event');
        }
    }

    return eventPassedThrough;
};

// Sends a message to a component. The component first checks if it has
// any $public events associated with the key of the message. If there are
// none and a `$miss` event is defined, the `$miss` event handler will be triggered.
// If there a `$any` event defined, its event handler will be
// triggered on any message the component receives. Additionally, the component
// will check if it has definted any $pass-through events that match the key. If so,
// the $pass-through event handler on the grandchild component will also get triggered.
Events.prototype.sendMessage = function sendMessage(key, payload, uid) {
    // Check public events
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

    // Check pass through events
    var messagePassedThrough = this._processPassThroughEvents(key, payload, uid);

    //  Trigger events
    if (eventsToFire.length < 1) {
        if (!messagePassedThrough) {
            Logger.log('Unknown public/passthrough event `' + key + '` for `' + this.name + '`', 1);
        }
    }
    else {
        var event;
        for (var i = 0; i < eventsToFire.length; i++) {
            event = eventsToFire[i];
            this._executeEvent(event, payload, uid);
        }
    }
};

Events.prototype.sendMessages = function sendMessages(messages, uid) {
    for (var key in messages) {
        this.sendMessage(key, messages[key], uid);
    }
};

// Send a message to all the children of a component that match a given CSS selector.
Events.sendMessageBySelector = function sendMessageBySelector(key, value, uid, selector) {
    var parentComponent = DataStore.getComponent(uid);
    var expandedBlueprint = parentComponent.tree.getExpandedBlueprint();
    if (expandedBlueprint) {
        var targets = VirtualDOM.query(expandedBlueprint, selector);
        var component;
        for (var i = 0; i < targets.length; i++) {
            component = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
            component.sendMessage(key, value);
        }
    }
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
    var frameworkModule = DataStore.getModuleDefinition(moduleName, moduleTag);

    var foundEvent;
    var fallbackEvent;
    var action;
    for (var eventName in frameworkModule.events[PUBLIC_KEY]) {
        action = frameworkModule.events[PUBLIC_KEY][eventName];
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
