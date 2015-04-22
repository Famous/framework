var Behaviors = require('./behaviors');
var VirtualDOM = require('../virtual-dom/virtual-dom');

var SELF_KEY = '$self';
var PUBLIC_KEY = '$public';
var CONTROL_FLOW_KEYS = ['$if', '$repeat', '$yield'];
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
        console.error('Dynamic control flow behaviors [`'+name+'`] not yet implemented.');
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