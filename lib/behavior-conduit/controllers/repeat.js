'use strict';

var VirtualDOM = require('./../../virtual-dom');

var MESSAGES_ATTR_KEY = 'data-messages';

function updateVirtualDOM(elements, payload) {
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var parent = element.parentNode;
        parent.removeChild(element);
        for (var j = 0; j < payload.length; j++) {
            var messages = JSON.stringify(payload[j]);
            var clone = VirtualDOM.clone(element);
            clone.setAttribute(MESSAGES_ATTR_KEY, messages);
            parent.appendChild(clone);
        }
    }
}

function initialization(info) {
    if (info.payload instanceof Array) {
        var elements = VirtualDOM.query(info.domStore.childrenRoot, info.selector);
        updateVirtualDOM(elements, info.payload)
    }
    else {
        throw new Error('Unsupported payload type for $repeat');
    }
}

module.exports = {
    initialization: initialization,
    runTime: initialization
};
