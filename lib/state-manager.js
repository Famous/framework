'use strict';

var Famous = require('./famous');
var StateManager = require('best-state-manager');

function create(states) {
    var FamousCore = Famous.getCoreFamous();
    var Transitionable = Famous.getTransitionable();
    return new StateManager(states, FamousCore, Transitionable);
}

module.exports = {
    create: create
};
