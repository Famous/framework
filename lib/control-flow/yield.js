var VirtualDOM = require('../virtual-dom/virtual-dom');

var BOOLEAN = 'boolean';
var STRING = 'string';
var SELF_KEY = '$self';

var Yield = {};

Yield.process = function process(yieldBehavior, target, injectablesRoot) {
    var selector = yieldBehavior.selector;
    var targets;
    if (selector === SELF_KEY) {
        targets = [target];
    }
    else {
        targets = VirtualDOM.query(target, selector);
    }

    var yieldValue = yieldBehavior.action();
    var injectables;
    switch (typeof yieldValue) {
        case BOOLEAN:
            injectables = yieldValue ? injectablesRoot.childNodes : [];
            break;
        case STRING:
            injectables = VirtualDOM.query(injectablesRoot, yieldValue);
            break;
        default:
            throw new Error('Unsupported payload type for $yield');
    }

    for (var i = 0; i < targets.length; i++) {
        if (injectables.length > 0) {
            VirtualDOM.removeChildNodes(targets[i]);

            for (var j = 0; j < injectables.length; j++) {
                var clone = VirtualDOM.clone(injectables[j]);
                targets[i].appendChild(clone);
            }
        }
    }
}

module.exports = Yield;
