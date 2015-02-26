'use strict';

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function stateManager() {
  this._state = {};
  this._observers = {}
}

/**
 * Adds an observer to a key's list of observables.
 */
stateManager.prototype.subscribe = function subscribe(key, observer) {

}

/**
 * Removes an observer from a key's list of observables.
 */
stateManager.prototype.unsubscribe = function unsubscribe(observer) {

}

/**
 * State setter function.
 */
stateManager.prototype.set = function set(key, value) {
  this._state[key] = value;
  return this;
}

/**
 * State getter function.
 */
stateManager.prototype.get = function get(key) {
  return this._state[key];
}

module.exports = {
  stateManager: stateManager
};
