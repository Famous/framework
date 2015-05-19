'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');
var Behaviors = require('./../behaviors/behaviors');
var If = require('./if');
var Repeat = require('./repeat');
var Yield = require('./yield');
var ControlFlowUtils = require('./control-flow-utils');

var IF_KEY = ControlFlowUtils.CONSTANTS.IF_KEY;
var REPEAT_KEY = ControlFlowUtils.CONSTANTS.REPEAT_KEY;
var YIELD_KEY = ControlFlowUtils.CONSTANTS.YIELD_KEY;

function initializeSelfContainedFlows(blueprint, uid, controlFlowDataMngr) {
    var expandedBlueprint = VirtualDOM.clone(blueprint);
    initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr);
    initializeRepeatBehaviors(expandedBlueprint, uid, controlFlowDataMngr);
    return expandedBlueprint;
};

function removeNodesFromExpandedBlueprint(expandedBlueprint, selector) {
    VirtualDOM.eachNode(expandedBlueprint, selector, function(node) {
        node.parentNode.removeChild(node);
    });
}

function initializeIfBehaviors(blueprint, expandedBlueprint, uid, controlFlowDataMngr) {
    var ifBehaviors = controlFlowDataMngr.getIfBehaviors();
    var behavior;
    var payload;
    var selector;
    for (var i = 0; i < ifBehaviors.length; i++) {
        behavior = ifBehaviors[i];
        payload = Behaviors.getPayloadFromUID(behavior, uid);

        controlFlowDataMngr.initializeDataForIfBehavior(behavior.selector, payload, blueprint);
        if (!payload) {
            // Remove node from expanded blueprint to avoid overhead of processing components
            removeNodesFromExpandedBlueprint(expandedBlueprint, behavior.selector);
        }
    }
};

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
        If.process(payload, selector, expandedBlueprint, data);

        // 'child' repeat behaviors need to be reprocessed
        if (payload) {
            var childRepeatSelectors = findChildRepeatSelectors(selector, expandedBlueprint, controlFlowDataMngr);
            for (var i = 0; i < childRepeatSelectors.length; i++) {
                // clear repeat data
                controlFlowDataMngr._repeatData[childRepeatSelectors[i]] = null;
            }
        }

        controlFlowDataMngr.setIfPayload(selector, payload);
    }
};

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
};

function removeNodesStoredInRepeatData(data) {
    var repeatedNodes;
    for (var i = 0; i < data.parentUIDs.length; i++) {
        repeatedNodes = data.parentUIDs[i].repeatedNodes;
        for (var j = 0; j < repeatedNodes.length; j++) {
            VirtualDOM.deleteNode(repeatedNodes[i]);
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
    Repeat.process(expandedBlueprint, repeatData[selector]);
};

function initializeParentDefinedFlows(expandedBlueprint, injectablesRoot, controlFlowDataMngr) {
    var childrenRoot = VirtualDOM.clone(expandedBlueprint);
    processYield(childrenRoot, injectablesRoot, controlFlowDataMngr);
    return childrenRoot;
};

function processYield(target, injectablesRoot, controlFlowDataMngr) {
    if (injectablesRoot) {
        var yieldBehaviors = controlFlowDataMngr.behaviors[YIELD_KEY];
        for (var i = 0; i < yieldBehaviors.length; i++) {
            Yield.process(yieldBehaviors[i], target, injectablesRoot);
        }
    }
};

module.exports = {
    initializeSelfContainedFlows: initializeSelfContainedFlows,
    initializeParentDefinedFlows: initializeParentDefinedFlows,
    initializeIfBehaviors: initializeIfBehaviors,
    processIfBehavior: processIfBehavior,
    processRepeatBehavior: processRepeatBehavior
};
