'use strict';

var ObjUtils = require('framework-utilities/object');
var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;

var BEHAVIORS = {};
var BEHAVIOR_LISTS = {};
var DEFINITIONS = {};
var EVENTS = {};
var HANDLER_EVENTS = {};
var PUBLIC_EVENTS = {};
var STATES = {};

var FUNC_TYPE = 'function';
var COMPONENT_DELIM = ':';
var SELF_KEY = '$self';
var BEHAVIORS_KEY = 'behaviors';
var EVENTS_KEY = 'events';
var HANDLER_EVENTS_KEY = 'handlers';
var PUBLIC_EVENTS_KEY = 'public';
var STATES_KEY = 'states';

function addDefinition(name, definition) {
    DEFINITIONS[name] = definition || {};
    BEHAVIORS[name] = DEFINITIONS[name][BEHAVIORS_KEY] || {};
    EVENTS[name] = DEFINITIONS[name][EVENTS_KEY] || {};
    HANDLER_EVENTS[name] = EVENTS[name][HANDLER_EVENTS_KEY] || {};
    PUBLIC_EVENTS[name] = EVENTS[name][PUBLIC_EVENTS_KEY] || {};
    STATES[name] = DEFINITIONS[name][STATES_KEY] || {};
}

function getBehaviorHandler(name, clientNode) {
    var lastDelimIdx = name.lastIndexOf(COMPONENT_DELIM);
    var componentName = name.slice(0, lastDelimIdx);
    var handlerName = name.slice(lastDelimIdx + 1, name.length);
    var handler;
    if (componentName === SELF_KEY) {
        handler = clientNode.handlerEvents[handlerName];
    }
    else {
        handler = getHandlerEvents(componentName)[handlerName];
    }
    if (handler) {
        return {
            action: handler,
            params: getParameterNames(handler) || []
        };
    }
    else {
        throw new Error('Unknown behavior handler `' + behaviorName + '`');
    }
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

function getBehaviors(name) {
    return ObjUtils.clone(BEHAVIORS[name]);
}

function getDefinition(name) {
    return ObjUtils.clone(DEFINITIONS[name]);
}

function getStates(name) {
    return ObjUtils.clone(STATES[name]);
}

function getEvents(name) {
    return ObjUtils.clone(EVENTS[name]);
}

function getPublicEvents(name) {
    return ObjUtils.clone(PUBLIC_EVENTS[name]);
}

function getHandlerEvents(name) {
    return ObjUtils.clone(HANDLER_EVENTS[name]);
}

function hasDefinition(name) {
    return !!DEFINITIONS[name];
}

module.exports = {
    BEHAVIORS: BEHAVIORS,
    DEFINITIONS: DEFINITIONS,
    EVENTS: EVENTS,
    HANDLER_EVENTS: HANDLER_EVENTS,
    PUBLIC_EVENTS: PUBLIC_EVENTS,
    STATES: STATES,
    addDefinition: addDefinition,
    getBehaviors: getBehaviors,
    getBehaviorHandler: getBehaviorHandler,
    getBehaviorList: getBehaviorList,
    getDefinition: getDefinition,
    getMatchingBehaviors: getMatchingBehaviors,
    getStates: getStates,
    getEvents: getEvents,
    getPublicEvents: getPublicEvents,
    getHandlerEvents: getHandlerEvents,
    hasDefinition: hasDefinition
};
