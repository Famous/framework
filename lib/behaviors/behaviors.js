var Utilities = require('./../utilities/utilities');

var FUNC = 'function';

function Behaviors(behaviorGroups) {
    this.behaviorList = Behaviors.groupToList(behaviorGroups);
}

Behaviors.staticToDynamic = function staticToDynamic(value) {
    return function() {
        return value;
    }
}

Behaviors.prototype.getBehaviorList = function getBehaviorList() {
    for (var i = 0; i < this.behaviorList.length; i++) {
        var behavior = this.behaviorList[i];

        if (behavior.type !== FUNC) {
            behavior.action = Behaviors.staticToDynamic(behavior.action);
        }
    }
    return this.behaviorList;
}

Behaviors.groupToList = function groupToList(behaviorGroups) {
    var list = [];

    for (var behaviorSelector in behaviorGroups) {
        var behaviorImpls = behaviorGroups[behaviorSelector];
        for (var behaviorName in behaviorImpls) {
            var behaviorImpl = behaviorImpls[behaviorName];
            var implType = typeof behaviorImpl;
            var paramNames = Utilities.getParameterNames(behaviorImpl);
            list.push({
                name: behaviorName,
                type: implType,
                selector: behaviorSelector,
                action: behaviorImpl,
                params: paramNames
            });
        }
    }
    return list;
}

module.exports = Behaviors;
