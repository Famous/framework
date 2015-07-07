'use strict';

var DataStore = require('./../data-store/data-store');
var FamousConnector = require('./../famous-connector/famous-connector');
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
    var behaviorSelector;
    var behaviorName;
    var behaviorImpls;
    var behaviorImpl;
    var paramNames;
    for (behaviorSelector in behaviorGroups) {
        behaviorImpls = behaviorGroups[behaviorSelector];
        for (behaviorName in behaviorImpls) {
            behaviorImpl = behaviorImpls[behaviorName];
            if (typeof behaviorImpl !== FUNC) {
                behaviorImpl = Behaviors.staticToDynamic(behaviorImpl);
            }
            paramNames = Utilities.getParameterNames(behaviorImpl);
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
    var args;
    if (typeof behavior.action === 'function') {
        args = component.states.getValues(behavior.params);
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
        $camera
            depth: 2000
 */
Behaviors.cameraBehavior = function cameraBehavior(behavior, component) {
    var camera = FamousConnector.getCamera(component);
    var payload = Behaviors.getPayload(behavior, component);
    if (!Array.isArray(payload)) {
        payload = [payload];
    }
    switch(behavior.name) {
        // TODO: need to figure out how to pass getters along to a component
        // case 'getValue':
        // case 'get-value':
        //     camera.getValue();
        //     break;
        case 'set':
            camera.set(payload[0], payload[1], payload[2], payload[3]);
            break;
        case 'depth':
            camera.setDepth(payload[0]);
            break;
        case 'flat':
            camera.setFlat();
            break;
        case 'frustum':
            camera.setFrustum(payload[0], payload[1]);
            break;
        case 'value':
            camera.setValue(payload[0]);
            break;
    }
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

// The current FamousEngine implementation does not allow for an
// easy mapping between a rendered <div> on the page and its
// corresponding DOMElement. Because of this, we are not able to
// apply behaviors directly on the DOM elements on the page, but instead
// need to apply the behaviors to the in-memory detached DOM data
// representatino, then stringify the updated content, then finally
// set that content to the cotent of the associated DOMElement.
Behaviors.processDOMBehavior = function(behavior, domEl, payload) {
    switch (behavior.name) {
        case 'inner-html':
            domEl.innerHTML = payload;
            break;
        case 'content':
            domEl.textContent = payload;
            break;
        case 'text-content':
            console.warn('text-content is deprecated, use content instead.');
            domEl.textContent = payload;
            break;
        case 'inner-text':
            domEl.innerText = payload;
            break;
        case 'value':
            domEl.value = payload;
            domEl.setAttribute('value', payload);
            // This is a terrible HACK, but because the Famous Engine diffs
            // content before requesting an update, we don't necessarily get
            // the desired update rendered if the HTML we are sending in now
            // is exactly the same before. That doesn't seem like a big deal...
            // but consider the case where some text has been entered into an
            // input, which we want to make empty again after 'change'. If we set
            // the 'value' to empty string after the change, there is no
            // difference from the engine's POV, so the render update never
            // occurs. This just creates that difference to force the update.
            domEl.setAttribute('data-value-changed-at', Date.now());
            break;
        default:
            if (behavior.name === 'style' && typeof payload === 'object') {
                payload = FamousFramework.helpers.formatStyle(payload);
            }
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


/*
example:
username:foo
    behaviors
        #item
            position ($index) => {}
 */
// An 'inverted' behavior is one that contains `$index` or `$repeatPayload` as a parameter.
// Normally, a behavior runs once on a given state change and returns a single value to a collection
// of children nodes. An inverted behavior will once for each child, and the value of $index will
// correspond to that child's index in its parentNode.children array. Inverted behaviors allow the
// developer to return different values to each child based on logic surronding the different values
// of $index and $repeatPaylaod that the children have.
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
