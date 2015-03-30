'use strict';

var Args = require('./../../helpers/args');
var VirtualDOM = require('./../../virtual-dom');

var BOOLEAN = 'boolean';

function handle(selector, payload, domRoot) {
    var elements = VirtualDOM.query(domRoot, selector);
    switch (typeof payload) {
        case BOOLEAN:
            if (!payload) {
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
    handle: handle
};
