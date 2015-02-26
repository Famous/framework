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
  if (!this._observers.hasOwnProperty(key)) {
    this._observers[key] = [];
  }
  this._observers[key].push(observer);
}

/**
 * Removes an observer from a key's list of observables.
 */
stateManager.prototype.unsubscribe = function unsubscribe(key, observer) {
  if (observerExists(key, observer)) {
    var observerIndex = this._observers.indexOf(observer);
    this._observers[key].splice(observerIndex)
  }
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

/**
 * Helper function to check if a key is being
 * observed and if an associated observer exists.
 */
function observerExists(key, observer) {
  return this._observers.hasOwnProperty(key) &&
         this._observers[key].indexOf(observer) !== -1;
}

module.exports = {
  stateManager: stateManager
};
