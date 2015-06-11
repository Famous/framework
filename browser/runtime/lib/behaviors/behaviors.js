'use strict';

var DataStore = require('./../data-store/data-store');
var Logger = require('./../logger/logger');
var Utilities = require('./../utilities/utilities');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var FUNC = 'function';
var REPEAT_INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';


function Behaviors(behaviorGroups) {
    this.behaviorList = Behaviors.processBehaviorGroups(behaviorGroups);
}

Behaviors.staticToDynamic = function staticToDynamic(value) {
    return function() {
        return value;
    };
};

Behaviors.prototype.getBehaviorList = function getBehaviorList() {
    return this.behaviorList;
};

Behaviors.prototype.eachListItem = function eachListItem(cb) {
    for (var i = 0; i < this.behaviorList.length; i++) {
        cb(this.behaviorList[i]);
    }
};

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
};

Behaviors.getPayload = function getPayload(behavior, component) {
    if (typeof behavior.action === 'function') {
        var args = component.states.getValues(behavior.params);
        return behavior.action.apply(null, args);
    }
    else {
        return behavior.action;
    }
};

Behaviors.getPayloadFromUID = function getPayloadFromUID(behavior, uid) {
    return Behaviors.getPayload(behavior, DataStore.getComponent(uid));
};

/*
example:
famous:core:dom-element
    behaviors
        $self
            assign-content [searches own `$private` events, then `$public` events]
 */
Behaviors.selfMessagingBehavior = function selfMessagingBehavior(behavior, component) {
    var payload = Behaviors.getPayload(behavior, component);
    var event = component.events.getSelfEvent(behavior.name);
    component.events.triggerEvent(event, payload, component.uid);
};

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
};

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
        if (VirtualDOM.isValidHTMLElement(targets[i])) {
            Behaviors.processDOMBehavior(behavior, targets[i], payload);
        }
        else {
            uid = VirtualDOM.getUID(targets[i]);
            targetComponent = DataStore.getComponent(uid);
            if (!targetComponent) {
                var errorMsg = '' +
                    'Target messaging behavior `' + behavior.name + '` on `' + component.name + '` did not execute because ' +
                    'Component with UID ' + uid + ' does not exist. That component may have not ' +
                    'been created due to it being replaced via a `$yield` behavior applied on its parent.';
                Logger.log(errorMsg, 1);
            }
            else {
                targetComponent.events.sendMessage(behavior.name, payload, uid);
            }
        }
    }
};

Behaviors.processDOMBehavior = function(behavior, domEl, payload) {
    if (behavior.name === 'inner-html') {
        domEl.innerHTML = payload;
    }
    else if (behavior.name === 'text-content') {
        domEl[Utilities.camelCase(behavior.name)] = payload;
    }
    else {
        domEl.setAttribute(behavior.name, payload);
    }

    // find parent component node
    var parentNode = domEl.parentNode;
    while (VirtualDOM.isValidHTMLElement(parentNode)) {
        parentNode = parentNode.parentNode;
    }

    // update content by traversing children
    var updatedContent = '';
    var child;
    for (var i = 0; i < parentNode.children.length; i++) {
        child = parentNode.children[i];
        if (VirtualDOM.isValidHTMLElement(child)) {
            updatedContent += child.outerHTML;
        }
    }

    // assign updated content to associated Famous DOM Element that
    // handles all rendering
    var domWrapper = DataStore.getDOMWrapper(VirtualDOM.getUID(parentNode));
    domWrapper.setContent(updatedContent);
};

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
        targetComponent.events.sendMessage(behavior.name, payload, targetComponent.uid);
    }
};

module.exports = Behaviors;
