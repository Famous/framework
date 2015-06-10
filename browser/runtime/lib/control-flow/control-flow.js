'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Behaviors = require('./../behaviors/behaviors');
var ControlFlowUtils = require('./control-flow-utils');

var BOOLEAN_KEY = 'boolean';
var REPEAT_INFO_KEY = ControlFlowUtils.CONSTANTS.REPEAT_INFO_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var SELF_KEY = '$self';
var STRING_KEY = 'string';
var UID_KEY = 'uid';
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;

function initializeSelfContainedFlows(blueprint, uid, controlFlowDataMngr) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    initializeRepeatBehaviors(expandedBlueprint, uid, controlFlowDataMngr);
    return expandedBlueprint;
}

function removeNodesFromExpandedBlueprint(expandedBlueprint, selector) {
    VirtualDOM.eachNode(expandedBlueprint, selector, function(node) {
        node.parentNode.removeChild(node);
    });
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
    var payload = Behaviors.getPayloadFromUID(behavior, uid);
    verifyRepeatPayload(payload);
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
    if (injectablesRoot) {
        var yieldBehaviors = controlFlowDataMngr.behaviors[YIELD_KEY];
        for (var i = 0; i < yieldBehaviors.length; i++) {
            applyYieldBehaviorToVirtualDOM(yieldBehaviors[i], target, injectablesRoot, expandedBlueprint);
        }
    }
}

/*-----------------------------------------------------------------------------------------*/
// VirtualDOM manipulation
/*-----------------------------------------------------------------------------------------*/
function addDeleteMessages(expandedBlueprint, selector) {
    var targets = VirtualDOM.query(expandedBlueprint, selector);
    for (var i = 0; i < targets.length; i++) {
        ControlFlowUtils.addDeleteMessage(targets[i]);
    }
}

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
                ControlFlowUtils.addDeleteMessage(parentData.repeatedNodes[payloadIndex]);
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

function applyYieldBehaviorToVirtualDOM(yieldBehavior, target, injectablesRoot, expandedBlueprint) {
    // Process yield payload
    var yieldValue = yieldBehavior.action();
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
        yieldPorts = [target];
    }
    else {
        yieldPorts = VirtualDOM.query(target, selector);
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
    var parentNode;
    var parentUID;
    var parentNodeFromExpandedBlueprint;
    var yieldPort;
    var blueprintPort;
    var clonedPort;
    var clonedInjectable;

    var i;

    // When the $yield behavior is applied to the $self selector, yield ports should not be cloned.
    // Instead, all of the injectables should be added directly to component's children root.
    if (selector === SELF_KEY) {
        yieldPort = yieldPorts[0];
        ControlFlowUtils.addRepeatInfo(yieldPort, 0, {});
        for (i = 0; i < injectables.length; i++) {
            clonedInjectable = VirtualDOM.clone(injectables[i]);
            if (!VirtualDOM.getAttribute(clonedInjectable, REPEAT_INFO_KEY)) {
                // Add $index to element being repeated unless its already defined
                ControlFlowUtils.addRepeatInfo(clonedInjectable, j, {});
            }
            yieldPort.appendChild(clonedInjectable);
        }
    }
    else {
        for (i = 0; i < yieldPorts.length; i++) {
            yieldPort = yieldPorts[i];
            blueprintPort = VirtualDOM.removeAttribute(VirtualDOM.clone(yieldPort), UID_KEY); // clone port before children are added
            parentNode = yieldPort.parentNode || yieldPort;

            // Get parent node from expandedBlueprint in order to update expandedBlueprint with
            // dynamically created ports
            parentUID = VirtualDOM.getUID(parentNode);
            if (VirtualDOM.getUID(expandedBlueprint) === parentUID) {
                parentNodeFromExpandedBlueprint = expandedBlueprint;
            }
            else {
                parentNodeFromExpandedBlueprint = VirtualDOM.getNodeByUID(expandedBlueprint, parentUID);
            }

            VirtualDOM.removeChildNodes(yieldPorts);
            for (var j = 0; j < injectables.length; j++) {
                clonedInjectable = VirtualDOM.clone(injectables[j]);
                if (!VirtualDOM.getAttribute(clonedInjectable, REPEAT_INFO_KEY)) {
                    // Add $index to element being repeated unless its already defined
                    ControlFlowUtils.addRepeatInfo(clonedInjectable, j, {});
                }

                // yieldPort already attached to parent
                if (j === 0) {
                    ControlFlowUtils.addRepeatInfo(yieldPort, j, {});
                    yieldPort.appendChild(clonedInjectable);
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
                    clonedPort.appendChild(clonedInjectable);
                    parentNode.appendChild(clonedPort);
                }
            }
        }
    }
}


module.exports = {
    initializeSelfContainedFlows: initializeSelfContainedFlows,
    initializeParentDefinedFlows: initializeParentDefinedFlows,
    initializeIfBehaviors: initializeIfBehaviors,
    processIfBehavior: processIfBehavior,
    processRepeatBehavior: processRepeatBehavior,
    applyIfBehaviorToVirtualDOM: applyIfBehaviorToVirtualDOM,
    applyRepeatBehaviorToVirtualDOM: applyRepeatBehaviorToVirtualDOM,
    applyYieldBehaviorToVirtualDOM: applyYieldBehaviorToVirtualDOM
};
