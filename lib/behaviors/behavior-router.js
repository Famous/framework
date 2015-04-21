var Behaviors = require('./Behaviors');

var SELF_KEY = '$self';
var CONTROL_FLOW_KEYS = ['$if', '$repeat', '$yield'];

var BehaviorRouter = {};

function isSelfSelector(selector) {
    return selector === SELF_KEY;
}

function isControlFlowBehavior(name) {
    return CONTROL_FLOW_KEYS.indexOf(name) >= 0;
}

BehaviorRouter.route = function(behavior, component) {
    if (isControlFlowBehavior(behavior.name)) {
        console.log('control flow behavior: ', behavior);
    }
    else {
        if (isSelfSelector(behavior.selector)) {
            Behaviors.processSelfBehavior(behavior, component);
        }
        else {
            Behaviors.processTargetedBehavior(
                behavior, component, component.tree.getExpandedBlueprint()
            );
        }
    }
}

module.exports = BehaviorRouter;