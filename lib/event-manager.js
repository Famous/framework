'use strict';

var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;
var Injector = require('./injector');

var MISS_KEY = '$miss';
var ANY_KEY = '$any';

function EventManager(node) {
    this.node = node;
    this.eventsObject = node.eventsObject;
    this.stateManager = node.stateManager;
}

EventManager.prototype.sendMessage = function(key, message) {
    var events = [];
    if (this.eventsObject[ANY_KEY]) {
        events.push(this.eventObject[ANY_KEY]);
    }
    if (this.eventsObject[key]) {
        events.push(this.eventsObject[key]);
    }
    else {
        if (this.eventsObject[MISS_KEY]) {
            events.push(this.eventsObject[MISS_KEY]);
        }
        else {
            console.warn('No public `' + key + '` event found for `' + this.node.name + '`');
        }
    }
    for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var params = getParameterNames(event);
        var args = Injector.getArgs(params, message, this.node);
        event.apply(null, args);
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
