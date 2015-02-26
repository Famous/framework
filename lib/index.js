'use strict';

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function StateManager() {
  this._state = {};
  this._observers = {}
}

/**
 * Adds an observer to a key's list of observables.
 */
StateManager.prototype.subscribe = function subscribe(key, observer) {
  if (!this._observers.hasOwnProperty(key)) {
    this._observers[key] = [];
  }
  this._observers[key].push(observer);
}

/**
 * Removes an observer from a key's list of observables.
 */
StateManager.prototype.unsubscribe = function unsubscribe(key, observer) {
  if (observerExists(key, observer)) {
    var observerIndex = this._observers.indexOf(observer);
    this._observers[key].splice(observerIndex)
  }
}

/**
 * State setter function.
 */
StateManager.prototype.set = function set(key, value) {
  this._state[key] = value;
  notifyObservers(key, value);
  return this;
}

/**
 * State getter function.
 */
StateManager.prototype.get = function get(key) {
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

/**
 * Helper function to invoke all
 * observers associated with a key.
 */
function notifyObservers(key, value) {
  if (observerExists(key, value)) {
    for (var observer in this._observers) {
        observer(key, value);
    }
  }
}

module.exports = {
  StateManager: StateManager
};
