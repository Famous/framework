'use strict';

var EventHandler = require('./../utilities/event-handler');
var FamousConnector = require('./../famous-connector/famous-connector');
var StateManager = require('./../state-manager/state-manager');

var STATE_AUTOTRIGGER_RE = /^[a-zA-Z0-9$].*/i;

function States(famousNode, initialState) {
    EventHandler.apply(this);
    var Transitionable = FamousConnector.Transitionable;
    this.stateManager = new StateManager(initialState, famousNode, Transitionable);
}

States.prototype = Object.create(EventHandler.prototype);
States.prototype.constructor = States;

States.prototype.handleStateChange = function handleStateChange(behaviorDefinition) {
    this.emit('behavior-update', behaviorDefinition);
};

States.prototype.createBehaviorListener = function createBehaviorListener(behaviorDefinition) {
    var params = behaviorDefinition.params;
    if (!params || params.length < 1) {
        this.stateManager.subscribeToGlobalChange(
            this.handleStateChange.bind(this, behaviorDefinition)
        );
    }
    else {
        for (var i = 0; i < params.length; i++) {
            this.stateManager.subscribeTo(
                params[i],
                this.handleStateChange.bind(this, behaviorDefinition)
            );
        }
    }
};

States.prototype.getStateManager = function getStateManager() {
    return this.stateManager;
};

States.prototype.set = function set(key, value, transition) {
    this.stateManager.set(key, value, transition);
};

States.prototype.get = function get(key) {
    return this.stateManager.get(key);
};

States.prototype.subscribeTo = function subscribeTo(key, observer) {
    this.stateManager.subscribeTo(key, observer);
};

States.prototype.unsubscribeFrom = function unsubscribeFrom (key, observer) {
    this.stateManager.unsubscribeFrom(key, observer);
};

States.prototype.unsubscribeAllFromKey = function unsubscribeAllFromKey (key) {
    this.stateManager._unsubscribeAllFromKey(key);
};

States.prototype.triggerGlobalChange = function triggerGlobalChange(whiteList, blackList) {
    whiteList = whiteList || STATE_AUTOTRIGGER_RE;
    this.stateManager.triggerGlobalChange(whiteList, blackList);
};

States.prototype.getValues = function getValues(names) {
    var result = [];
    for (var i = 0; i < names.length; i++) {
        result.push(this.stateManager.get(names[i]));
    }
    return result;
};

States.prototype.getNames = function getNames() {
    return Object.keys(this.stateManager._state);
};

module.exports = States;
