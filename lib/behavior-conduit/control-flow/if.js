'use strict';

var VirtualDOM = require('./../../virtual-dom');

var BOOLEAN = 'boolean';

function initialization(info) {
    var elements = VirtualDOM.query(info.domStore.childrenRoot, info.selector);
    switch (typeof info.payload) {
        case BOOLEAN:
            if (!info.payload) {
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    var parent = element.parentNode;
                    parent.removeChild(element);
                }
            }
            break;
        default:
            throw new Error('Unsupported payload type for $if');
    }
}

module.exports = {
    initialization: initialization,
    runTime: initialization
};
