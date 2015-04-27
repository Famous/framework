var Behaviors = require('./behaviors');
var VirtualDOM = require('../virtual-dom/virtual-dom');

var SELF_KEY = '$self';
var PUBLIC_KEY = '$public';
var IF_KEY = '$if';
var REPEAT_KEY = '$repeat';
var YIELD_KEY = '$yield';
var CONTROL_FLOW_KEYS = [IF_KEY, REPEAT_KEY, YIELD_KEY];
var COMPONENT_DELIM = ':';


function isSelfSelector(selector) {
    return selector === SELF_KEY;
}

function isControlFlowBehavior(name) {
    return CONTROL_FLOW_KEYS.indexOf(name) >= 0;
}

function route(behavior, component) {
    var name = behavior.name;

    if (isControlFlowBehavior(name)) {
        if (!component.blockControlFlow) {
            if (behavior.name === REPEAT_KEY) {
                component.processDynamicRepeat(behavior);
            }
            else {
                console.error('Dynamic $if/$yield behaviors [`'+name+'`]  are not yet implemented.');
            }
        }
    }
    else {
        if (isSelfSelector(behavior.selector)) {
            if (name.indexOf(SELF_KEY) >= 0) {
                Behaviors.selfMessagingBehavior(behavior, component);
            }
            else {
                Behaviors.selfDirectBehavior(behavior, component);
            }

        }
        else {
            var expandedBlueprint = component.tree.getExpandedBlueprint();
            var targets = VirtualDOM.query(expandedBlueprint, behavior.selector);
            if (name.indexOf(COMPONENT_DELIM) === -1) {
                Behaviors.targetMessagingBehavior(behavior, component, targets);
            }
            else {
                throw new Error ('Direct targeted behavior is not supported (' + behavior.selector + '|' + name + '.)');
            }
        }
    }
}

module.exports = {
    route: route
};