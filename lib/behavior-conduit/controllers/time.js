'use strict';

function create() {
    return function() {};
}

module.exports = {
    create: create
};

//BehaviorConduit.prototype.buildTimeController = function(behavior, behaviorDeps) {
//    var behaviorTargets = fetchBehaviorTargets(this.bestNode.DOMNode, behavior.selector);
//    return function(time) {
//        var behaviorArgs = [];
//        var i;
//        for (i = 0; i < behaviorDeps.length; i++) {
//            var behaviorDepName = behaviorDeps[i];
//            if (behaviorDepName === TIME_KEY) {
//                behaviorArgs.push(time);
//            }
//            else {
//                var statesObject = this.bestNode.stateManager._state;
//                var stateValue = statesObject[behaviorDepName];
//                behaviorArgs.push(stateValue);
//            }
//        }
//        var behaviorPayload = behavior.action.apply(null, behaviorArgs);
//        if (behaviorTargets.length < 1) {
//            var targetMatches = this.bestNode.DOMNode.querySelectorAll(behavior.selector);
//            for (i = 0; i < targetMatches.length; i++) {
//                var selectedElement = targetMatches[i];
//                behaviorTargets.push(selectedElement);
//            }
//        }
//        for (i = 0; i < behaviorTargets.length; i++) {
//            var behaviorTarget = behaviorTargets[i];
//            var behaviorTargetUID = behaviorTarget.bestUID;
//            var behaviorTargetNode = this.bestApplication.bestNodes[behaviorTargetUID];
//            var eventManager = behaviorTargetNode.eventManager;
//            eventManager.send(behavior.name, behaviorPayload);
//        }
//    }.bind(this);
//};
