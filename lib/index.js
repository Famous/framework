'use strict';

var operators = require('./operators');

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
  this._currentState = '';

  this._operators = operators;
}

/**
 * Initializes observers by copying over
 * and creating an array for each state key.
 */
StateManager.prototype._initObservers = function _initObservers() {
  for (var key in this._state) {
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
  if (this._observerExists(key, observer)) {
    var observerIndex = this._observers.indexOf(observer);
    this._observers[key].splice(observerIndex)
  }
}

/**
 * State setter function.
 */
StateManager.prototype.setState = function setState(key, value) {
  if (!!this._currentState) key = this._currentState;
  this._state[key] = value;
  this._notifyObservers(key, value);
  return this;
}

/**
 * State getter function.
 */
StateManager.prototype.getState = function getState(key) {
  return this._state[key];
}

/**
 * State getter function for chaining.
 */
StateManager.prototype.get = function get(key) {
  this._currentState = key;
  return this;
}

/**
 * Add function
 */
StateManager.prototype.add = function add(amount) {
  this.operate(amount, '+');
  return this;
}

/**
 * Subtract function
 */
StateManager.prototype.subtract = function subtract(amount) {
  this.operate(amount, '-');
  return this;
}

/**
 * Multiply function
 */
StateManager.prototype.multiply = function multiply(amount) {
  this.operate(amount, '*');
  return this;
}

/**
 * Multiply by PI function
 */
StateManager.prototype.timesPI = function timesPI() {
  this.multiply(Math.PI);
  return this;
}

/**
 * Divide function
 */
StateManager.prototype.divide = function divide(amount) {
  this.operate(amount, '/')
  return this;
}

/**
 * Power function
 */
StateManager.prototype.pow = function pow(amount) {
  this.operate(amount, 'pow');
  return this;
}

/**
 * Square root function
 */
StateManager.prototype.sqrt = function sqrt() {
  this.operate(null, 'sqrt');
  return this;
}

/**
 * Absolute value function
 */
StateManager.prototype.abs = function abs() {
  this.operate(null, 'abs');
  return this;
}

/**
 * Sine function
 */
StateManager.prototype.sin = function sin() {
  this.operate(null, 'sin');
  return this;
}

/**
 * Cosine function
 */
StateManager.prototype.cos = function cos() {
  this.operate(null, 'cos');
  return this;
}

/**
 * Tangent function
 */
StateManager.prototype.tan = function tan() {
  this.operate(null, 'tan');
  return this;
}

/**
 * Ceiling function
 */
StateManager.prototype.ceil = function ceil() {
  this.operate(null, 'ceil');
  return this;
}

/**
 * Flooring function
 */
StateManager.prototype.floor = function floor() {
  this.operate(null, 'floor');
  return this;
}

/**
 * Concat function
 */
StateManager.prototype.concat = function concat(amount) {
  this.operate(amount, 'concat');
  return this;
}

/**
 * Splice function
 */
StateManager.prototype.substring = function splice(amount) {
  this.operate(amount, 'substring');
  return this;
}

/**
 * Lowercase function
 */
StateManager.prototype.toLower = function toLower() {
  this.operate(null, 'toLower');
  return this;
}

/**
 * Uppercase function
 */
StateManager.prototype.toUpper = function toUpper() {
  this.operate(null, 'toUpper');
  return this;
}

/**
 * Toggle boolean function
 */
StateManager.prototype.flip = function flip() {
  this.operate(null, 'flip');
  return this;
}

/**
 * Boolean to Integer function
 */
StateManager.prototype.toInt = function toInt() {
  this.operate(null, 'toInt');
  return this;
}

/**
 * Main operate function to keep code
 * DRY with many operator functions.
 */
StateManager.prototype.operate = function operate(amount, operation) {
  var key = this._currentState;
  this.setState(key, this._operators[operation](this.getState(key), amount));
}

/**
 * Allows for ability to add your own
 * operators to use with operate function.
 */
StateManager.prototype.addOperator = function setOperator(name, func) {
  this._operators[name] = func;
  return this;
}

/**
 * Checks if a key is being observed
 * and if an associated observer exists.
 */
StateManager.prototype._observerExists = function _observerExists(key, observer) {
  return this._observers.hasOwnProperty(key) &&
         this._observers[key].indexOf(observer) !== -1;
}

/**
 * Invokes all observers
 * associated with a key.
 */
StateManager.prototype._notifyObservers = function _notifyObservers(key, value) {
    for (var i in this._observers[key]) {
      var observer = this._observers[key][i]
      if (this._observerExists(key, observer)) {
        observer(key, value);
      }
    }
}

module.exports = StateManager;
