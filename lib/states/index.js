var EventHandler = require('./../utilities/event-handler');
var FamousConnector = require('./../famous-connector');
var StateManager = require('best-state-manager');

function States(initialState) {
    EventHandler.apply(this);
    var FamousCore = FamousConnector.getCoreFamous();
    var Transitionable = FamousConnector.getTransitionable();
    this.stateManager = new StateManager(initialState, FamousCore, Transitionable);
}

States.prototype = Object.create(EventHandler.prototype);
States.prototype.constructor = States;

States.prototype.handleStateChange = function(behaviorDefinition) {
    this.emit('behavior-update', behaviorDefinition);
};

States.prototype.createBehaviorListener = function(behaviorDefinition) {
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
    this.stateManager.set('count', 1000);
};

module.exports = States;
