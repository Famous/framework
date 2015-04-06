'use strict';

var MISS_KEY = '$miss';
var ANY_KEY = '$any';

function EventManager(node) {
    this.node = node;
    this.publicEvents = node.publicEvents;
    this.stateManager = node.stateManager;
}

EventManager.prototype.sendMessage = function(key, message) {
    if (this.publicEvents[ANY_KEY]) {
        this.publicEvents[ANY_KEY](key, this.stateManager, message);
    }
    if (this.publicEvents[key]) {
        this.publicEvents[key](this.stateManager, message);
    }
    else {
        if (this.publicEvents[MISS_KEY]) {
            this.publicEvents[MISS_KEY](key, this.stateManager, message);
        }
        else {
            console.warn('No public `' + key + '` event found for `' + this.node.name + '`');
        }
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
