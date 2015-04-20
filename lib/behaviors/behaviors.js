var Utilities = require('./../utilities/utilities');

var FUNC = 'function';

function Behaviors(behaviorGroups) {
    this.behaviorList = Behaviors.processBehaviorGroups(behaviorGroups);
}

Behaviors.staticToDynamic = function staticToDynamic(value) {
    return function() {
        return value;
    }
}

Behaviors.prototype.getBehaviorList = function getBehaviorList() {
    return this.behaviorList;
}

Behaviors.prototype.eachListItem = function eachListItem(cb) {
    for (var i = 0; i < this.behaviorList.length; i++) {
        cb(this.behaviorList[i]);
    }
}

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
}

module.exports = Behaviors;
