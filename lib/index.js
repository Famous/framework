'use strict';

var operator = require('./operator');

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function StateManager(initialState) {
    this._state = initialState || {};
    this._observers = {};
    this._globalObservers = [];
    this._once = [];

    this._initObservers();
    this._currentState = '';
    this._operator = operator;
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
    this._globalObservers.push(observer);
}

/**
 * Adds an observer that will be fired a single time as soon
 * as triggerGlobalChange is invoked.
 */
StateManager.prototype.subscribeOnce = function subscribeOnce(observer) {
    this._once.push(observer);
}

/**
 * Removes an observer from all observables.
 */
StateManager.prototype.unsubscribe = function unsubscribe(observer) {
    // Remove from global
    var globalIndex = this._globalObservers.indexOf(observer);
    if (globalIndex !== -1) {
        this._globalObservers.splice(globalIndex);
    }

    // Remove from all key based observers
    for (var key in this._observers) {
        this.unsubscribeFrom(key, observer);
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
    if (this._observers.hasOwnProperty(key)) {
        var index = this._observers[key].indexOf(observer);
        if (index !== -1) {
            this._observers[key].splice(index);
        }
    }
}

/**
 * State setter function.
 */
StateManager.prototype.setState = function setState(key, value) {
    this._state[key] = value;
    this._notifyObservers(key, value);
    return this;
}
StateManager.prototype.set = StateManager.prototype.setState;

/**
 * State getter function.
 */
StateManager.prototype.getState = function getState(key) {
    return this._state[key];
}
StateManager.prototype.get = StateManager.prototype.getState;


/**
 * Calls set state with current state's value on each state.
 * @param {RegEx} whiteList RegEx defining which keys state should be triggered on. 
 *                          If both a whiteList & blackList are passed in, the whiteList's result 
 *                          takes precedence over the blackList.
 * @param {RegEx} blackList RegEx defining which keys state should NOT be triggered on.
 */
StateManager.prototype.triggerGlobalChange = function triggerGlobalChange(whiteList, blackList) {
    for(var key in this._state) {
        if (whiteList) {
            if (whiteList.test(key)) {
                this.setState(key, this.getState(key));
            }
        }
        else if (blackList) {
            if (!blackList.test(key)) {
                this.setState(key, this.getState(key));
            }
        }
        else {
            this.setState(key, this.getState(key));
        }
    }

    for (var i = 0; i < this._globalObservers.length; i++) {
        this._globalObservers[i]();
    };

    var observer;
    while(this._once.length) {
        observer = this._once.pop();
        observer();
    }
}

/**
 * State getter function for chaining.
 */
StateManager.prototype.chain = function chain(key) {
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
    var newValue = this._operator.operate(operation, this.getState(key), amount);
    this.setState(key, newValue);
}

/**
 * Allows for creation of custom
 * convenience operators.
 */
StateManager.prototype.addOperator = function setOperator(operationName, func) {
    this._operator.addOperation(operationName, func);

    StateManager.prototype[operationName] = function(amount) {
        this.operate(amount, operationName);
        return this;
    }
    return this;
}

/**
 * Invokes all observers
 * associated with a key.
 */
StateManager.prototype._notifyObservers = function _notifyObservers(key, value) {
    if (this._observers[key]) {
        for (var i = 0; i < this._observers[key].length; i++) {
            this._observers[key][i](key, value);
        };
    }

    for (var i = 0; i < this._globalObservers.length; i++) {
        this._globalObservers[i](key, value);
    };
}

module.exports = StateManager;
