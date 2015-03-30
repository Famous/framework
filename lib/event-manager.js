'use strict';

function EventManager(node) {
    this.node = node;
    this.publicEvents = node.publicEvents;
    this.stateManager = node.stateManager;
}

EventManager.prototype.sendMessage = function(key, message) {
    if (this.publicEvents[key]) {
        this.publicEvents[key](this.stateManager, message);
    }
    else {
        console.warn('No public `' + key + '` event found');
    }
};

EventManager.prototype.sendMessages = function(messages) {
    for (var key in messages) {
        this.sendMessage(key, messages[key]);
    }
};

function create(node) {
    return new EventManager(node);
}

module.exports = {
    create: create
};
