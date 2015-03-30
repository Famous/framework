'use strict';

var VirtualDOM = require('./../../virtual-dom');

var SELF_KEY = '$self';
var BOOLEAN = 'boolean';
var STRING = 'string';

function handle(selector, payload, domRoot, injectionRoot) {
    var targets;
    if (selector === SELF_KEY) {
        targets = [domRoot];
    }
    else {
        targets = VirtualDOM.query(domRoot, selector);
    }

    var sources;
    switch (typeof payload) {
        case BOOLEAN:
            sources = injectionRoot.childNodes;
            break;
        case STRING:
            sources = VirtualDOM.query(injectionRoot, payload);
            break;
        default:
            throw new Error('Unsupported payload type for $yield');
    }

    for (var i = 0; i < targets.length; i++) {
        if (sources.length > 0) {
            var target = targets[i];
            while (target.firstChild) {
                target.removeChild(target.firstChild);
            }
            for (var j = 0; j < sources.length; j++) {
                var clone = VirtualDOM.clone(sources[j]);
                target.appendChild(clone);
            }
        }
    }
}

module.exports = {
    handle: handle
};
