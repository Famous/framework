var SELF_KEY = '$self';
var YIELD_KEY = '$yield';
var STRING = 'string';
var BOOLEAN = 'boolean';
var FUNC = 'function';
var ELEMENT_NODE_TYPE = 1;

var YieldConduit = {};

YieldConduit.handleYield = function(bestNode, surrogateRoot) {
    var behavior,
        surrogates,
        target;

    for (var i = 0; i < bestNode.behaviorList.length; i++) {
        behavior = bestNode.behaviorList[i];
        if (behavior.name === YIELD_KEY) {
            switch (typeof(behavior.action)) {
                case STRING: YIELD_HANLDERS[STRING](bestNode, surrogateRoot, behavior); break;
                case BOOLEAN: YIELD_HANLDERS[BOOLEAN](bestNode, surrogateRoot, behavior); break;
                case FUNC: YIELD_HANLDERS[FUNC](bestNode, surrogateRoot, behavior); break;
                default:
                    throw new Error('$yield handler must be a boolean, string or function');
            }
        }
    };
}

YieldConduit.processStringYield = function(bestNode, surrogateRoot, behavior) {
    surrogates = surrogateRoot.querySelectorAll(behavior.action);
    var wrapper = document.createElement('_wrapper');
    for (var index = 0; index < surrogates.length; index++) {
        wrapper.appendChild(surrogates[index]);
    };
    YieldConduit.addSurrogates(bestNode, behavior.selector, wrapper.childNodes);
}

YieldConduit.processBooleanYield = function(bestNode, surrogateRoot, behavior) {
    if (behavior.action) {
        YieldConduit.addSurrogates(bestNode, behavior.selector, surrogateRoot.childNodes);
    }
}

YieldConduit.processFuncYield = function(bestNode, surrogateRoot, behavior) {
    var payload = behavior.action.call(null, surrogateRoot.childNodes);
    if (typeof(payload) === STRING) YIELD_HANLDERS[STRING](bestNode, surrogateRoot, behavior)
    else if (typeof(payload) === BOOLEAN) YIELD_HANLDERS[BOOLEAN](bestNode, surrogateRoot, behavior)
    else {
        if (payload.toString().indexOf('NodeList') === -1 || Array.isArray(payload)) {
            throw new Error('$yield handler function must return a NodeList');
        }
        else {
            YieldConduit.addSurrogates(bestNode, behavior.selector, payload)
        }
    }
}

YieldConduit.containsElementNode = function(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].nodeType === ELEMENT_NODE_TYPE) return true;
    };
    return false;
}


YieldConduit.addSurrogates = function(bestNode, targetSelector, surrogates) {
    // TODO: Implement some logic supporting multiple target DOM nodes.
    // This may need to involve cloning the surrogates.
    var targetDOMNode = targetSelector === SELF_KEY ? 
                                            bestNode.DOMNode :
                                            bestNode.DOMNode.querySelectorAll(targetSelector)[0];

    // Only remove children & add surrogates if there is at least 1 node in the
    // surrogates that is ELEMENT_NODE type.
    // (https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType).
    // This enables components to define 'default' content that will not
    // accidentately be replaced by white-space or comment nodes.
    if (YieldConduit.containsElementNode(surrogates)) {
        while (targetDOMNode.firstChild) targetDOMNode.removeChild(targetDOMNode.firstChild);
        while (surrogates.length > 0) targetDOMNode.appendChild(surrogates[0]);
    }
}

var YIELD_HANLDERS = {};
YIELD_HANLDERS[STRING] = YieldConduit.processStringYield;
YIELD_HANLDERS[BOOLEAN] = YieldConduit.processBooleanYield;
YIELD_HANLDERS[FUNC] = YieldConduit.processFuncYield;

module.exports = YieldConduit;