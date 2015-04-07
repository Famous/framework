'use strict';

var VirtualDOM = require('./../../virtual-dom');

var MESSAGES_ATTR_KEY = 'data-messages';

function handle(info) {
    var elements = VirtualDOM.query(info.childrenRoot, info.selector);
    if (info.payload instanceof Array) {
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var parent = element.parentNode;
            parent.removeChild(element);
            for (var j = 0; j < info.payload.length; j++) {
                var messages = JSON.stringify(info.payload[j]);
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
