'use strict';

var operator = require('./operator');

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function StateManager(initialState, Clock, Transitionable) {
    this._state = initialState || {};
    this._observers = {};
    this._globalObservers = [];
    this._once = [];
    this._globalChangeListeners = [];
    this._latestStateChange = {};
    this._Clock = Clock;
    this._Transitionable = Transitionable;

    //keep track of Transitionables associated with states
    //when transitions are specified in `.set`
    this._transitionables = {};

    this._initObservers();
    this._currentState = '';
    this._operator = operator;
    this._thenQueue = [];

    Clock.update(this);
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
 * Adds an observer that will be fired every time a global change
 * is triggered.
 */
StateManager.prototype.subscribeToGlobalChange = function subscribeToGlobalChange(observer) {
    this._globalChangeListeners.push(observer);
}

/**
 * Removes an observer from all observables.
 */
StateManager.prototype.unsubscribe = function unsubscribe(observer) {
    // Remove from global
    var globalKeys = {
        '_globalObservers': true,
        '_globalChangeListeners': true
    };

    var index;
    var listenerStack;
    var key;
    for (key in globalKeys) {
        listenerStack = this[globalKeys];
        index = listenerStack.indexOf(observer);
        if (index !== -1) {
            listenerStack.splice(index);
        }
    }

    // Remove from all key based observers
    for (key in this._observers) {
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
 * Convenience callback wrapper.
 * Usage:
 *      state
 *          .set('size', [100, 100], {duration: 1000, curve: 'outBounce'})
 *          .thenSet('position', [50, 50], {duration: 2000, curve: 'easeInOut'})
 *          .thenSet('color', red)
 *
 */
StateManager.prototype.thenSet = function thenSet(key, value, transition) {
    this._thenQueue.push([key, value, transition]);
    return this;
}

/**
 * State setter function.
 * Accepts calls in the format `setState('key', 'value') or
 * `setState('key', 5, {duration: 1000, curve: 'linear'});
 * (all numeric values can be treated as Transitionables)
 */
StateManager.prototype.setState = function setState(key, value, transition) {
    var previousState = this._state[key] || 0;
    var self = this;

    // set callback function
    var cb = function() {
        // check the then queue and pop off arguments
        if (self._thenQueue.length > 0) {
            var args = self._thenQueue.shift();
            self.setState(args[0], args[1], args[2]);
        }
    }

    if(transition){
        // make sure we have a reference to a transitionable
        if(!(this._transitionables[key] instanceof this._Transitionable)){
            this._transitionables[key] = new this._Transitionable(previousState);
        } else{
            // we already have a t9able; halt it so we can start anew
            this._transitionables[key].halt();
        }

        // wait for event queue to process .thenSet before firing cb
        setTimeout(function() {
            transition.curve = transition.curve || 'linear';
            transition.duration = transition.duration || 0;

            self._transitionables[key]
                .from(previousState)
                .to(value, transition.curve, transition.duration, cb)
        }, 0);

    } else{
        // If this used to be a t9able and isn't anymore,
        // clean up by halting and removing
        if(this._transitionables[key] && (this._transitionables[key] instanceof this._Transitionable)){
            this._transitionables[key].halt();
        }
        delete this._transitionables[key];

        this._state[key] = value;
        this._latestStateChange = {};
        this._latestStateChange[key] = value;
        this._notifyObservers(key, value);
    }
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

    var i;
    for (i = 0; i < this._globalObservers.length; i++) {
        this._globalObservers[i]();
    };
    for (i=0; i < this._globalChangeListeners.length; i++) {
        this._globalChangeListeners[i]();
    }

    var observer;
    while(this._once.length) {
        observer = this._once.pop();
        observer();
    }
}

/**
 * Get the key and value associated with the latest change to state.
 * @return {Object} Latest state change
 */
StateManager.prototype.getLatestStateChange = function getLatestStateChange() {
    return this._latestStateChange;
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
        }
    }

    for (var i = 0; i < this._globalObservers.length; i++) {
        this._globalObservers[i](key, value);
    }
}

/**
 * Update all observers that are watching
 * currently transitioning Transitionables.
 * Used with Clock.update to be called upon every
 * requestAnimationFrame cycle
 * this is called `update` specifically because
 * the Clock.update function expects an object with
 * a function member named `update`
 */
StateManager.prototype.update = function update(){
    for(var key in this._transitionables){
        if(this._transitionables.hasOwnProperty(key)){
            var t = this._transitionables[key];
            if(t && t.isActive()){
                this._state[key] = t.get();
                this._notifyObservers(key);
            }
        }
    }
}

module.exports = StateManager;
