'use strict';

var Famous = require('./famous');
var StateManager = require('best-state-manager');

function create(states) {
    var Clock = Famous.getClock();
    var Transitionable = Famous.getTransitionable();
    return new StateManager(states, Clock, Transitionable);
}

module.exports = {
    create: create
};
