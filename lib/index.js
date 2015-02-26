'use strict';

var operators = require('/operators');

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function StateManager(initialState, globalObserver) {
  this._state = initialState || {};
  this._observers = {};

  this._initObservers();
  if (globalObserver) this.subscribe(globalObserver);

  this._operators = operators;

/**
 * Initialized observers by copying over
 * and creating an array for each state key.
 */
StateManager.prototype._initObservers = function _initObservers() {
  for (var key in this._observers) {
      this._observers[key] = [];
  }
}

/**
 * Adds an observer to all observables.
 */
StateManager.prototype.subscribe = function subscribe(observer) {
  for (var observable in this._observers) {
    this.subscribeTo(observable, observer)
  }
}

/**
 * Removes an observer from all observables.
 */
StateManager.prototype.unsubscribe = function unsubscribe(observer) {
  for (var observable in this._observers) {
    this.unsubscribeFrom(observable, observer);
  }
}

/**
 * Adds an observer to a key's list of observables.
 */
StateManager.prototype.subscribeTo = function subscribeTo(key, observer) {
  if (!this._observers.hasOwnProperty(key)) {
    this._observers[key] = [];
  }
  this._observers[key].push(observer);
}

/**
 * Removes an observer from a key's list of observables.
 */
StateManager.prototype.unsubscribeFrom = function unsubscribeFrom(key, observer) {
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
 * Add function
 */
StateManager.prototype.add = function add(key, amount) {
  this.set(key, operate(key, amount, '+'));
}

/**
 * Subtract function
 */
StateManager.prototype.subtract = function subtract(key, amount) {
  this.set(key, operate(key, amount, '-'));
}

/**
 * Multiply function
 */
StateManager.prototype.multiply = function multiply(key, amount) {
  this.set(key, operate(key, amount, '*'));
}

/**
 * Divide function
 */
StateManager.prototype.divide = function divide(key, amount) {
  this.set(key, operate(key, amount, '/'));
}

/**
 * Main operate function to keep code
 * DRY with many operator functions.
 */
StateManager.prototype.operate = function operate(key, amount, operation) {
  return this._operators[operation](this.get(key), amount);
}

/**
 * Allows for ability to add your own
 * operators to use with operate function.
 */
StateManager.prototype.setOperator = function setOperator(name, func) {
  this._operators[name] = func;
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
