'use strict';

var DirectController = require('./direct');
var MessagingController = require('./messaging');

var COMPONENT_DELIM = ':';

function create(behavior, node) {
    if (behavior.name.indexOf(COMPONENT_DELIM) === -1) {
        return MessagingController.create(behavior, node);
    }
    else {
        return DirectController.create(behavior, node);
    }
}

module.exports = {
    create: create
};
