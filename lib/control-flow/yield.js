var VirtualDOM = require('../virtual-dom/virtual-dom');

var BOOLEAN = 'boolean';
var STRING = 'string';

var Yield = {};

Yield.process = function process(yieldBehavior, target, injectablesRoot) {
    var selector = yieldBehavior.selector;
    var targets;
    if (selector === STRING) {
        targets = VirtualDOM.query(target, selector);
    }
    else if (selector === true) {
        targets = [target];
    }
    else if (selector === false) {
        return;
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
            var target = target[i];
            VirtualDOM.removeChildNodes(target);

            for (var j = 0; j < injectables.length; j++) {
                var clone = VirtualDOM.clone(injectables[j]);
                target.appendChild(clone);
            }
        }
    }
}

module.exports = Yield;
