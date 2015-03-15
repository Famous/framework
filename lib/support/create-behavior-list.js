/**
 * Given an object of behaiors where the behaviors are grouped into
 * sub-objects, return a flat array of behavior objects, each of whose
 * `selector` is the group it was contained within.
 *
 * I.e. take this: `{'#foo':{bar:{},baz:{}}}`
 * and return this: `[{name:'bar',selector:'#foo'},{name:'bar',selector'#foo'}]`
 *
 * @function createBehaviorList
 * @param {Object} behaviorGroups
 * @return {Array}
*/
function createBehaviorList(behaviorGroups) {
    var list = [];
    for (var behaviorSelector in behaviorGroups) {
        var behaviorImpls = behaviorGroups[behaviorSelector];
        for (var behaviorName in behaviorImpls) {
            var behaviorImpl = behaviorImpls[behaviorName];
            list.push({
                name: behaviorName,
                selector: behaviorSelector,
                action: behaviorImpl
            });
        }
    }
    return list;
}

module.exports = createBehaviorList;
