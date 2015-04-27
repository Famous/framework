var Utilities = require('./../utilities/utilities');
var DataStore = require('./../data-store/data-store');
var Events = require('./../events/events');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var FUNC = 'function';
var UID_KEY = 'uid';
var REPEAT_INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload'


function Behaviors(behaviorGroups) {
    this.behaviorList = Behaviors.processBehaviorGroups(behaviorGroups);
}

Behaviors.staticToDynamic = function staticToDynamic(value) {
    return function() {
        return value;
    }
}

Behaviors.prototype.getBehaviorList = function getBehaviorList() {
    return this.behaviorList;
}

Behaviors.prototype.eachListItem = function eachListItem(cb) {
    for (var i = 0; i < this.behaviorList.length; i++) {
        cb(this.behaviorList[i]);
    }
}

/**
 * Create flat list of behaviors & convert static behaviors to dynamic
 * in order to have a standardized list for easy processing.
 *
 * @param  {Object} behaviorGroups Behaviors grouped by CSS selector
 * @return {Array}                 Flat list of Behaviors
 */
Behaviors.processBehaviorGroups = function processBehaviorGroups(behaviorGroups) {
    var list = [];
    for (var behaviorSelector in behaviorGroups) {
        var behaviorImpls = behaviorGroups[behaviorSelector];
        for (var behaviorName in behaviorImpls) {
            var behaviorImpl = behaviorImpls[behaviorName];
            if (typeof behaviorImpl !== FUNC) {
                behaviorImpl = Behaviors.staticToDynamic(behaviorImpl);
            }
            var paramNames = Utilities.getParameterNames(behaviorImpl);
            list.push({
                name: behaviorName,
                selector: behaviorSelector,
                action: behaviorImpl,
                params: paramNames
            });
        }
    }
    return list;
}

Behaviors.getPayload = function getPayload(behavior, component) {
    var args = component.states.getValues(behavior.params);
    return behavior.action.apply(null, args);
}

/*
example:
famous:core:dom-element
    behaviors
        $self
            $self:assign-content
 */
Behaviors.selfMessagingBehavior = function selfMessagingBehavior(behavior, component) {
    var payload = Behaviors.getPayload(behavior, component);
    var event = component.events.getSelfEvent(behavior.name);
    component.events.triggerEvent(event, payload, component.uid);
}

/*
example:
famous:core:view
    behaviors
        $self
            famous:core:components:align
 */
Behaviors.selfDirectBehavior = function selfDirectBehavior(behavior, component) {
    var payload = Behaviors.getPayload(behavior, component);
    component.events.triggerDirectEventHandler(behavior.name, payload, component.uid);
}

/*
example:
famous:core:ui-element
    behaviors
        #view
            align
 */
Behaviors.targetMessagingBehavior = function targetMessagingBehavior(behavior, component, targets) {
    var payload = Behaviors.getPayload(behavior, component);
    var uid;
    var targetComponent;
    for (var i = 0; i < targets.length; i++) {
        uid = VirtualDOM.getUID(targets[i]);
        targetComponent = DataStore.getComponent(uid);
        targetComponent.events.triggerPublicEvent(behavior.name, payload, uid);
    }
}

Behaviors.invertedBehavior = function invertedBehavior(behavior, component, targets) {
    var args = component.states.getValues(behavior.params);
    var repeatIndexIndex = behavior.params.indexOf(REPEAT_INDEX_KEY);
    var repeatPayloadIndex = behavior.params.indexOf(REPEAT_PAYLOAD_KEY);

    var targetComponent;
    var payload;
    for (var i = 0; i < targets.length; i++) {
        targetComponent = DataStore.getComponent(VirtualDOM.getUID(targets[i]));
        if (repeatIndexIndex !== -1) {
            args[repeatIndexIndex] = targetComponent.states.get(REPEAT_INDEX_KEY);
        }
        if (repeatPayloadIndex !== -1) {
            args[repeatPayloadIndex] = targetComponent.states.get(REPEAT_PAYLOAD_KEY);
        }

        payload = behavior.action.apply(null, args);
        targetComponent.events.triggerPublicEvent(behavior.name, payload, targetComponent.uid);
    }
}


module.exports = Behaviors;
