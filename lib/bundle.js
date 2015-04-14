'use strict';

var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;
var ObjUtils = require('framework-utilities/object');
var Shorthand = require('./shorthand');
var Validator = require('./validator');

var BEHAVIORS = {};
var DEFINITIONS = {};
var EVENTS = {};
var STATES = {};

var FUNC_TYPE = 'function';
var COMPONENT_DELIM = ':';
var PUBLIC_KEY = '$public';
var SELF_KEY = '$self';
var MISS_KEY = '$miss';
var ANY_KEY = '$any';
var BEHAVIORS_KEY = 'behaviors';
var EVENTS_KEY = 'events';
var STATES_KEY = 'states';

function addDefinition(name, definition) {
    DEFINITIONS[name] = definition || {};
    Validator.validateDefinition(DEFINITIONS[name]);
    BEHAVIORS[name] = DEFINITIONS[name][BEHAVIORS_KEY] || {};
    EVENTS[name] = DEFINITIONS[name][EVENTS_KEY] || {};
    STATES[name] = DEFINITIONS[name][STATES_KEY] || {};
}

function getBehaviors(name) {
    return ObjUtils.clone(BEHAVIORS[name]);
}

function getEvents(name) {
    return ObjUtils.clone(EVENTS[name]);
}

function getDefinition(name) {
    return ObjUtils.clone(DEFINITIONS[name]);
}

function getStates(name) {
    return ObjUtils.clone(STATES[name]);
}

function hasDefinition(name) {
    return !!DEFINITIONS[name];
}

function getEventsList(name) {
    var list = [];
    var eventGroups = getEvents(name);
    for (var selector in eventGroups) {
        var events = eventGroups[selector];
        for (var eventName in events) {
            var eventValue = events[eventName];
            var eventImpl = Shorthand.processEvent(eventName, eventValue);
            list.push({
                name: eventName,
                action: eventImpl,
                selector: selector,
                params: getParameterNames(eventImpl)
            });
        }
    }
    return list;
}

function getBehaviorHandler(name, clientNode) {
    var lastDelimIdx = name.lastIndexOf(COMPONENT_DELIM);
    var componentName = name.slice(0, lastDelimIdx);
    var handlerName = name.slice(lastDelimIdx + 1, name.length);
    var handler;
    if (componentName === SELF_KEY) {
        handler = clientNode.eventChannel.getSelfEvent(handlerName);
    }
    else {
        var foundEvent;
        var fallbackEvent;
        var eventsList = getEventsList(componentName);
        for (var i = 0; i < eventsList.length; i++) {
            var event = eventsList[i];
            if (event.selector === PUBLIC_KEY) {
                if (event.name === handlerName) {
                    foundEvent = event;
                }
                else if (event.name === MISS_KEY) {
                    fallbackEvent = event;
                }
                else if (event.name === ANY_KEY) {
                    fallbackEvent = event;
                }
            }
        }
        handler = foundEvent || fallbackEvent;
    }
    if (!handler) {
        throw new Error('Unknown behavior handler `' + name + '`');
    }
    return handler;
}

function getBehaviorList(name, exceptions) {
    var list = [];
    var behaviorGroups = getBehaviors(name);
    for (var behaviorSelector in behaviorGroups) {
        var behaviorImpls = behaviorGroups[behaviorSelector];
        for (var behaviorName in behaviorImpls) {
            var doInclude = true;
            if (exceptions && exceptions.length) {
                for (var i = 0; i < exceptions.length; i++) {
                    if (behaviorName === exceptions[i]) {
                        doInclude = false;
                        break;
                    }
                }
            }
            if (doInclude) {
                var behaviorImpl = behaviorImpls[behaviorName];
                var implType = typeof behaviorImpl;
                var isFunction = implType === FUNC_TYPE;
                var paramNames = (isFunction) ? getParameterNames(behaviorImpl) || [] : null;
                list.push({
                    name: behaviorName,
                    type: implType,
                    selector: behaviorSelector,
                    action: behaviorImpl,
                    params: paramNames
                });
            }
        }
    }
    return list;
}

function getMatchingBehaviors(name, matchers) {
    var list = [];
    var behaviors = getBehaviorList(name);
    for (var i = 0; i < matchers.length; i++) {
        var matcher = matchers[i];
        for (var j = 0; j < behaviors.length; j++) {
            var behavior = behaviors[j];
            if (behavior.name === matcher) {
                list.push(behavior);
            }
        }
    }
    return list;
}

module.exports = {
    addDefinition: addDefinition,
    getBehaviors: getBehaviors,
    getBehaviorHandler: getBehaviorHandler,
    getBehaviorList: getBehaviorList,
    getDefinition: getDefinition,
    getMatchingBehaviors: getMatchingBehaviors,
    getStates: getStates,
    getEvents: getEvents,
    getEventsList: getEventsList,
    hasDefinition: hasDefinition
};
