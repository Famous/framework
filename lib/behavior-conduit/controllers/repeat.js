'use strict';

var VirtualDOM = require('./../../virtual-dom');

var MESSAGES_ATTR_KEY = 'data-messages';

function handle(selector, payload, domRoot) {
    var elements = VirtualDOM.query(domRoot, selector);
    if (payload instanceof Array) {
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
    else {
        throw new Error('Unsupported payload type for $repeat');
    }
}

module.exports = {
    handle: handle
};
