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

    while (domRoot.firstChild) {
        domRoot.removeChild(domRoot.firstChild);
    }
    for (var i = 0; i < sources.length; i++) {
        var clone = VirtualDOM.clone(sources[i]);
        domRoot.appendChild(clone);
    }
}

module.exports = {
    handle: handle
};
