'use strict';

var Behaviors = require('./../behaviors/behaviors');
var ControlFlowUtils = require('./control-flow-utils');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var BOOLEAN_KEY = 'boolean';
var SELF_KEY = '$self';
var STRING_KEY = 'string';
var UID_KEY = 'uid';

var REPEAT_INFO_KEY = ControlFlowUtils.CONSTANTS.REPEAT_INFO_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;

function initializeSelfContainedFlows(blueprint, uid, controlFlowDataMngr) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    initializeRepeatBehaviors(expandedBlueprint, uid, controlFlowDataMngr);
    return expandedBlueprint;
}

function initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr) {
    var ifBehaviors = controlFlowDataMngr.getIfBehaviors();
    var behavior;
    var payload;
    for (var i = 0; i < ifBehaviors.length; i++) {
        behavior = ifBehaviors[i];
        payload = Behaviors.getPayloadFromUID(behavior, uid);

        controlFlowDataMngr.initializeDataForIfBehavior(behavior.selector, payload, blueprint);
        if (!payload) {
            // Remove node from expanded blueprint to avoid overhead of processing components
            removeNodesFromExpandedBlueprint(expandedBlueprint, behavior.selector);
        }
    }
}

function removeNodesFromExpandedBlueprint(expandedBlueprint, selector) {
    VirtualDOM.eachNode(expandedBlueprint, selector, function(node) {
        node.parentNode.removeChild(node);
    });
}

function findChildRepeatSelectors(ifSelector, expandedBlueprint, controlFlowDataMngr) {
    var repeatSelectors = Object.keys(controlFlowDataMngr.getRepeatData());
    var repeatNodes = [];
    var childRepeatSelectors = [];
    var repeatNode;
    var i;
    for (i = 0; i < repeatSelectors.length; i++) {
        VirtualDOM.eachNode(expandedBlueprint, repeatSelectors[i], function(repeatNode) {
            if (repeatNodes.indexOf(repeatNode) === -1) {
                repeatNodes.push({
                    selector: repeatSelectors[i],
                    node: repeatNode
                });
            }
        });
    }
    VirtualDOM.eachNode(expandedBlueprint, ifSelector, function(ifNode) {
        for (i = 0; i < repeatNodes.length; i++) {
            repeatNode = repeatNodes[i];
            if (VirtualDOM.isDescendant(repeatNode.node, ifNode)) {
                if (childRepeatSelectors.indexOf(repeatNode.selector) === -1) {
                    childRepeatSelectors.push(repeatNode.selector);
                }
            }
        }
    });
    return childRepeatSelectors;
}

function processIfBehavior(behavior, expandedBlueprint, uid, controlFlowDataMngr) {
    var payload = Behaviors.getPayloadFromUID(behavior, uid);
    var selector = behavior.selector;
    var data = controlFlowDataMngr.getIfData()[selector];
    if (!data) {
        throw new Error('If behavior for selector: `' + selector + '` has not yet been initialized');
    }

    var oldPayload = controlFlowDataMngr.getIfPayload(selector);
    if (payload !== oldPayload) {
        applyIfBehaviorToVirtualDOM(payload, selector, expandedBlueprint, data);

        // If the payload has updated from `true` to `false`, all data associated with 'childRepeatSelectors'
        // (i.e., selectors that target nodes that are descendants of the nodes that are targeted
        // by the current '$if' behavior) needs to be reset because those behaviors will need to be re-run
        // and the parentUIDs associated with the behaviors will need to be recalculated.
        if (payload) {
            controlFlowDataMngr.resetRepeatData(
                findChildRepeatSelectors(selector, expandedBlueprint, controlFlowDataMngr)
            );
        }

        controlFlowDataMngr.setIfPayload(selector, payload);
    }
}

function verifyRepeatPayload(payload) {
    if (!(payload instanceof Array)) {
        throw new Error('Unsupported payload type for $repeat: `' + payload + '`');
    }
    return payload;
}

function initializeRepeatBehaviors(expandedBlueprint, uid, controlFlowDataMngr) {
    var repeatBehaviors = controlFlowDataMngr.behaviors[REPEAT_KEY];
    for (var i = 0; i < repeatBehaviors.length; i++) {
        processRepeatBehavior(repeatBehaviors[i], expandedBlueprint, uid, controlFlowDataMngr);
    }
}

function removeNodesStoredInRepeatData(data) {
    var repeatedNodes;
    for (var i = 0; i < data.parentUIDs.length; i++) {
        repeatedNodes = data.parentUIDs[i].repeatedNodes;
        for (var j = 0; j < repeatedNodes.length; j++) {
            VirtualDOM.deleteNode(repeatedNodes[j]);
        }
    }
}

function processRepeatBehavior(behavior, expandedBlueprint, uid, controlFlowDataMngr) {
    var payload = verifyRepeatPayload(Behaviors.getPayloadFromUID(behavior, uid)).slice();
    var selector = behavior.selector;
    var repeatData = controlFlowDataMngr.getRepeatData();

    if (!repeatData[selector]) {
        controlFlowDataMngr.initializeDataForRepeatBehavior(selector, payload, expandedBlueprint);

        // Remove manually repeated (i.e., nodes that have been repeated in tree w/o applying behavior)
        // nodes from expandedBlueprint to avoid overhead of creating unnecessary component since
        // they will be overwritten by nodes that are created using behavior.
        removeNodesStoredInRepeatData(repeatData[selector]);
    }

    // Update repeat payload
    controlFlowDataMngr.setRepeatPayload(selector, payload);
    applyRepeatBehaviorToVirtualDOM(expandedBlueprint, repeatData[selector]);
}

function initializeParentDefinedFlows(expandedBlueprint, childrenRoot, injectablesRoot, controlFlowDataMngr) {
    processYield(childrenRoot, injectablesRoot, expandedBlueprint, controlFlowDataMngr);
    return childrenRoot;
}

function processYield(target, injectablesRoot, expandedBlueprint, controlFlowDataMngr) {
    var i;
    if (injectablesRoot) {
        var yieldBehaviors = controlFlowDataMngr.behaviors[YIELD_KEY];
        for (i = 0; i < yieldBehaviors.length; i++) {
            applyYieldBehaviorToVirtualDOM(yieldBehaviors[i], target, injectablesRoot, expandedBlueprint);
        }
    }
    else {
        for (i = 0; i < target.children.length; i++) {
            // $index should be attached to all nodes to allow components to create layouts.
            // The $index corresponds to the index in the `parent.children` array.
            attachIndexToNode(target.children[i], i);
        }
    }
}

// Checks to see if a given node matches the value returned from a $yield behavior.
// This method assumes that the only valid return values from a $yield behavior are
// a boolean, or a string that corresponds to an id (e.g. '#id') or class name (e.g., '.class').
// More complicated CSS selectors are not currently supported as value returned from a
// $yield behavior.
function doesInjectableMatchYieldValue(injectableNode, value) {
    if (typeof value === 'string') {
        if (value[0] === '.') {
            return injectableNode.classList.contains(value.slice(1));
        }
        else if (value[0] === '#') {
            return injectableNode.id === value.slice(1);
        }
        else {
            return injectableNode.tagName.toLowerCase() === value.toLowerCase();
        }
    }
    else {
        if (value === false) return false;
        else throw new Error('$yield behavior must return a Boolean or String value.');
    }
}

/*-----------------------------------------------------------------------------------------*/
// VirtualDOM manipulation
/*-----------------------------------------------------------------------------------------*/

// Add a control flow message on to the node signaling that the node
// and the component associated with it should be deleted. These messages
// are processed by the parent component.
function addDeleteMessages(expandedBlueprint, selector) {
    var targets = VirtualDOM.query(expandedBlueprint, selector);
    for (var i = 0; i < targets.length; i++) {
        ControlFlowUtils.addDeleteMessage(targets[i]);
    }
}

// Add $index to a node unless its already been added
function attachIndexToNode(node, index) {
    if (!VirtualDOM.getAttribute(node, REPEAT_INFO_KEY)) {
        ControlFlowUtils.addRepeatInfo(node, index, {});
    }
}

// Modify the component's expanded blueprint based on its $if behavior. Items
// can either by marked for creation or removal becased on the value passed back
// by the behavior.
function applyIfBehaviorToVirtualDOM(payload, selector, expandedBlueprint, data) {
    // Add elements to expandedBlueprint
    if (payload) {
        var parentUID;
        // Cycle through all parents whose children have $if behavior applied to them
        for (parentUID in data.parentUIDs) {
            // Cycle through all nodes that should be added to parent port
            for (var i = 0; i < data.parentUIDs[parentUID].length; i++) {
                ControlFlowUtils.attachNewNode(
                    data.parentUIDs[parentUID][i], expandedBlueprint, parentUID
                );
            }
        }
    }
    // Remove elements from expandedBlueprint
    else {
        addDeleteMessages(expandedBlueprint, selector);
    }
}

// Modify the component's expanded blueprint based on its $repeat behavior. Items
// can either by marked for creation or removal becased on the value passed back
// by the behavior. Items are removed when the $repeatPayload has changed
// from the last result of the $repeat behavior.
function applyRepeatBehaviorToVirtualDOM(expandedBlueprint, data) {
    for (var payloadIndex = 0; payloadIndex < data.payloadEquality.length; payloadIndex++) {
        if (data.payloadEquality[payloadIndex]) {
            continue;
        }

        var payload = data.payload[payloadIndex];
        var parentData;
        var newNode;
        for (var parentIndex = 0; parentIndex < data.parentUIDs.length; parentIndex++) {
            parentData = data.parentUIDs[parentIndex];

            // Delete existing node since payload is different
            if (parentData.repeatedNodes[payloadIndex]) {
                ControlFlowUtils.addDeleteMessage(parentData.repeatedNodes[payloadIndex], parentData.uid);
                parentData.repeatedNodes[payloadIndex] = null;
            }

            // Create new node if payload exists
            // (payload equality can be false if payload is missing)
            if (payload) {
                newNode = ControlFlowUtils.attachNewNode(
                    parentData.blueprint, expandedBlueprint, parentData.uid
                );
                ControlFlowUtils.addRepeatInfo(newNode, payloadIndex, payload);
                parentData.repeatedNodes[payloadIndex] = newNode;
            }
        }
    }
    return expandedBlueprint;
}

// Modify the virtual DOM that represents the children that should be added to a component.
// The children root is a combination of children that a component defines for items (targetRoot)
// and the children that the component's parent tries to insert into the component (injectablesRoot).
// This function runs once on instantiation. Subsequent node additions are handled by `processDynamicYield`.
// When the yield behavior targets a child element instead of itself (e.g., '$self'), 'wrapper' nodes
// are created and the expanded blueprint is updated. These 'wrapper' nodes are created so that a
// component has a way to modify the transform of its injected children without needing direct access.
function applyYieldBehaviorToVirtualDOM(yieldBehavior, targetRoot, injectablesRoot, expandedBlueprint) {
    // Process yield payload
    var yieldValue = yieldBehavior.action(); // TODO: parse params
    var injectables;
    switch (typeof yieldValue) {
        case BOOLEAN_KEY:
            injectables = yieldValue ? injectablesRoot.children : [];
            break;
        case STRING_KEY:
            injectables = VirtualDOM.query(injectablesRoot, yieldValue);
            break;
        default:
            throw new Error('Unsupported payload type for $yield');
    }

    // Only continue processing $yield if injectables have been passed
    // in from parent.
    if (injectables.length === 0) {
        return;
    }

    // Locate 'ports' that accept injected nodes from parent
    var selector = yieldBehavior.selector;
    var yieldPorts;
    if (selector === SELF_KEY) {
        yieldPorts = [targetRoot];
    }
    else {
        yieldPorts = VirtualDOM.query(targetRoot, selector);
    }

    // When the $yield behavior is applied to the $self selector, yield ports should not be cloned.
    // Instead, all of the injectables should be added directly to component's children root.
    if (selector === SELF_KEY) {
        processSelfYield(yieldPorts[0], injectables);
    }
    else {
        processChildrenYield(yieldPorts, injectables, expandedBlueprint);
    }
}

function processSelfYield(yieldPort, injectables) {
    ControlFlowUtils.addRepeatInfo(yieldPort, 0, {});
    var clonedInjectable;
    for (var i = 0; i < injectables.length; i++) {
        clonedInjectable = VirtualDOM.clone(injectables[i]);
        attachIndexToNode(clonedInjectable, i);
        VirtualDOM.addNode(clonedInjectable, yieldPort);
    }
}

// Attach cloned injectables into the ports. A new port should be created for
// each injectable and the ports should be indexed based on the index of the
// injectable. For example:
/*
    alpha
        behavior
            .item-view
                yield: true
        tree
            node.item-view

    beta
        tree
            alpha
                node item 1
                node item 2
                node item 3

    After processing, <node.item-view> will be created for each passed in <node>
    i.e.:
        tree:
            node.item-view // index 0
                node item 1
            node.item-view // index 1
                node item 2
            node.item-view // index 2
                node item3
 */
function processChildrenYield(yieldPorts, injectables, expandedBlueprint) {
    for (var i = 0; i < yieldPorts.length; i++) {
        var yieldPort = yieldPorts[i];
        var blueprintPort = VirtualDOM.removeAttribute(VirtualDOM.clone(yieldPort), UID_KEY); // clone port before children are added
        // Get parent node from expandedBlueprint in order to update expandedBlueprint with
        // dynamically created ports
        var parentNode = yieldPort.parentNode || yieldPort;
        var parentUID = VirtualDOM.getUID(parentNode);
        var parentNodeFromExpandedBlueprint;
        var clonedInjectable;
        var clonedPort;

        if (VirtualDOM.getUID(expandedBlueprint) === parentUID) {
            parentNodeFromExpandedBlueprint = expandedBlueprint;
        }
        else {
            parentNodeFromExpandedBlueprint = VirtualDOM.getNodeByUID(expandedBlueprint, parentUID);
        }

        VirtualDOM.removeChildNodes(yieldPorts);
        for (var j = 0; j < injectables.length; j++) {
            clonedInjectable = VirtualDOM.clone(injectables[j]);
            attachIndexToNode(clonedInjectable, j);

            // yieldPort already attached to parent
            if (j === 0) {
                ControlFlowUtils.addRepeatInfo(yieldPort, j, {});
                ControlFlowUtils.setWrapperNodeAttribute(yieldPort);
                VirtualDOM.addNode(clonedInjectable, yieldPort);
            }
            // clone yieldPort & attach to parent
            else {
                clonedPort = VirtualDOM.clone(blueprintPort);
                VirtualDOM.setUID(clonedPort);
                // Add dynamically create port to expandedBlueprint in order
                // to properly apply behaviors
                VirtualDOM.addNode(
                    VirtualDOM.clone(clonedPort),
                    parentNodeFromExpandedBlueprint
                );

                ControlFlowUtils.addRepeatInfo(clonedPort, j, {});
                ControlFlowUtils.setWrapperNodeAttribute(clonedPort);
                VirtualDOM.addNode(clonedInjectable, clonedPort);
                VirtualDOM.addNode(clonedPort, parentNode);
            }
        }
    }
}

// This function runs when a component is about to be dynamically inserted into
// the tree and scene graph. Specifically, the function gets trigged when a component
// is processing its children's control flow messages and one of the values is CREATE.
// This function checks the component's definted $yield behaviors and will create a
// 'wrapper' component if the injectable node is slotted into a child component.
// For example, if a component that consumes a scroll view inserts new items into that
// scroll view, this method will package each newly inserted item into a newly created
// node that the scroll view component has access to. This allows the scroll view
// to position the items without having direct access to them.
function processDynamicYield(injectableNode, expandedBlueprint, controlFlowDataMngr) {
    var yieldBehaviors = controlFlowDataMngr.behaviors[YIELD_KEY];
    var behavior;
    var value;
    var parentNode;
    var childCount;
    var clonedPort;
    for (var i = 0; i < yieldBehaviors.length; i++) {
        behavior = yieldBehaviors[i];
        value = behavior.action(); // TODO: parse params
        if (behavior.selector === SELF_KEY && value !== false) {
            return injectableNode;
        }
        else {
            if (value || doesInjectableMatchYieldValue(injectableNode, value)) {
                // Create a "wrapper" node that is inserted into the parent's expanded
                // blueprint to enable layouts (i.e., a way for a parent to control the
                // position of an injected child). The wrapper node needs to have the
                // same $index as its child node.
                parentNode = expandedBlueprint.querySelector(behavior.selector).parentNode;
                childCount = parentNode.children.length;
                clonedPort = VirtualDOM.clone(parentNode.children[childCount - 1]);

                // Attach data to newly created wrapper node
                VirtualDOM.setUID(clonedPort);
                VirtualDOM.addNode(clonedPort, parentNode);
                ControlFlowUtils.addRepeatInfo(clonedPort, childCount, {});
                ControlFlowUtils.addCreateMessage(clonedPort, VirtualDOM.getUID(parentNode));
                ControlFlowUtils.setWrapperNodeAttribute(clonedPort);

                // Create another clone of the newly created port in order to add the injectable
                // without the injectable being added to the parent's expanded blueprint
                clonedPort = VirtualDOM.clone(clonedPort);
                VirtualDOM.addNode(VirtualDOM.clone(injectableNode), clonedPort);
                return clonedPort;
            }
        }
    }
    return injectableNode;
}

module.exports = {
    initializeSelfContainedFlows: initializeSelfContainedFlows,
    initializeParentDefinedFlows: initializeParentDefinedFlows,
    initializeIfBehaviors: initializeIfBehaviors,
    processDynamicYield: processDynamicYield,
    processIfBehavior: processIfBehavior,
    processRepeatBehavior: processRepeatBehavior,
    applyIfBehaviorToVirtualDOM: applyIfBehaviorToVirtualDOM,
    applyRepeatBehaviorToVirtualDOM: applyRepeatBehaviorToVirtualDOM,
    applyYieldBehaviorToVirtualDOM: applyYieldBehaviorToVirtualDOM
};
