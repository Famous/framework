'use strict';

var EventHandler = require('./../utilities/event-handler');
var FamousConnector = require('./../famous-connector/famous-connector');
var StateManager = require('best-state-manager');

function States(initialState) {
    EventHandler.apply(this);
    var FamousCore = FamousConnector.getCoreFamous();
    var Transitionable = FamousConnector.getTransitionable();
    this.stateManager = new StateManager(initialState, FamousCore, Transitionable);
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
}

States.prototype.triggerGlobalChange = function triggerGlobalChange(whiteList, blackList) {
    this.stateManager.triggerGlobalChange(whiteList, blackList);
}

States.prototype.getValues = function getValues(names) {
    var result = [];
    for (var i = 0; i < names.length; i++) {
        result.push(this.stateManager.get(names[i]));
    }
    return result;
}

module.exports = States;
