(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Famous = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _defaultCurves = {
    /**
     * @property linear
     * @static
     * @type {Function}
     */
    linear: function(t) {
        return t;
    },

    /**
     * @property easeIn
     * @static
     * @type {Function}
     */
    easeIn: function(t) {
        return t*t;
    },

    /**
     * @property easeOut
     * @static
     * @type {Function}
     */
    easeOut: function(t) {
        return t*(2-t);
    },

    /**
     * @property easeInOut
     * @static
     * @type {Function}
     */
    easeInOut: function(t) {
        if (t <= 0.5) return 2*t*t;
        else return -2*t*t + 4*t - 1;
    },

    /**
     * @property easeOutBounce
     * @static
     * @type {Function}
     */
    easeOutBounce: function(t) {
        return t*(3 - 2*t);
    },

    /**
     * @property spring
     * @static
     * @type {Function}
     */
    spring: function(t) {
        return (1 - t) * Math.sin(6 * Math.PI * t) + t;
    },

    /**
     * @property inQuad
     * @static
     * @type {Function}
     */
    inQuad: function(t) {
        return t*t;
    },

    /**
     * @property outQuad
     * @static
     * @type {Function}
     */
    outQuad: function(t) {
        return -(t-=1)*t+1;
    },

    /**
     * @property inOutQuad
     * @static
     * @type {Function}
     */
    inOutQuad: function(t) {
        if ((t/=.5) < 1) return .5*t*t;
        return -.5*((--t)*(t-2) - 1);
    },

    /**
     * @property inCubic
     * @static
     * @type {Function}
     */
    inCubic: function(t) {
        return t*t*t;
    },

    /**
     * @property outCubic
     * @static
     * @type {Function}
     */
    outCubic: function(t) {
        return ((--t)*t*t + 1);
    },

    /**
     * @property inOutCubic
     * @static
     * @type {Function}
     */
    inOutCubic: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t;
        return .5*((t-=2)*t*t + 2);
    },

    /**
     * @property inQuart
     * @static
     * @type {Function}
     */
    inQuart: function(t) {
        return t*t*t*t;
    },

    /**
     * @property outQuart
     * @static
     * @type {Function}
     */
    outQuart: function(t) {
        return -((--t)*t*t*t - 1);
    },

    /**
     * @property inOutQuart
     * @static
     * @type {Function}
     */
    inOutQuart: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t;
        return -.5 * ((t-=2)*t*t*t - 2);
    },

    /**
     * @property inQuint
     * @static
     * @type {Function}
     */
    inQuint: function(t) {
        return t*t*t*t*t;
    },

    /**
     * @property outQuint
     * @static
     * @type {Function}
     */
    outQuint: function(t) {
        return ((--t)*t*t*t*t + 1);
    },

    /**
     * @property inOutQuint
     * @static
     * @type {Function}
     */
    inOutQuint: function(t) {
        if ((t/=.5) < 1) return .5*t*t*t*t*t;
        return .5*((t-=2)*t*t*t*t + 2);
    },

    /**
     * @property inSine
     * @static
     * @type {Function}
     */
    inSine: function(t) {
        return -1.0*Math.cos(t * (Math.PI/2)) + 1.0;
    },

    /**
     * @property outSine
     * @static
     * @type {Function}
     */
    outSine: function(t) {
        return Math.sin(t * (Math.PI/2));
    },

    /**
     * @property inOutSine
     * @static
     * @type {Function}
     */
    inOutSine: function(t) {
        return -.5*(Math.cos(Math.PI*t) - 1);
    },

    /**
     * @property inExpo
     * @static
     * @type {Function}
     */
    inExpo: function(t) {
        return (t===0) ? 0.0 : Math.pow(2, 10 * (t - 1));
    },

    /**
     * @property outExpo
     * @static
     * @type {Function}
     */
    outExpo: function(t) {
        return (t===1.0) ? 1.0 : (-Math.pow(2, -10 * t) + 1);
    },

    /**
     * @property inOutExpo
     * @static
     * @type {Function}
     */
    inOutExpo: function(t) {
        if (t===0) return 0.0;
        if (t===1.0) return 1.0;
        if ((t/=.5) < 1) return .5 * Math.pow(2, 10 * (t - 1));
        return .5 * (-Math.pow(2, -10 * --t) + 2);
    },

    /**
     * @property inCirc
     * @static
     * @type {Function}
     */
    inCirc: function(t) {
        return -(Math.sqrt(1 - t*t) - 1);
    },

    /**
     * @property outCirc
     * @static
     * @type {Function}
     */
    outCirc: function(t) {
        return Math.sqrt(1 - (--t)*t);
    },

    /**
     * @property inOutCirc
     * @static
     * @type {Function}
     */
    inOutCirc: function(t) {
        if ((t/=.5) < 1) return -.5 * (Math.sqrt(1 - t*t) - 1);
        return .5 * (Math.sqrt(1 - (t-=2)*t) + 1);
    },

    /**
     * @property inElastic
     * @static
     * @type {Function}
     */
    inElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/ p));
    },

    /**
     * @property outElastic
     * @static
     * @type {Function}
     */
    outElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if (t===1) return 1.0;  if (!p) p=.3;
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        return a*Math.pow(2,-10*t) * Math.sin((t-s)*(2*Math.PI)/p) + 1.0;
    },

    /**
     * @property inOutElastic
     * @static
     * @type {Function}
     */
    inOutElastic: function(t) {
        var s=1.70158;var p=0;var a=1.0;
        if (t===0) return 0.0;  if ((t/=.5)===2) return 1.0;  if (!p) p=(.3*1.5);
        s = p/(2*Math.PI) * Math.asin(1.0/a);
        if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p));
        return a*Math.pow(2,-10*(t-=1)) * Math.sin((t-s)*(2*Math.PI)/p)*.5 + 1.0;
    },

    /**
     * @property inBack
     * @static
     * @type {Function}
     */
    inBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return t*t*((s+1)*t - s);
    },

    /**
     * @property outBack
     * @static
     * @type {Function}
     */
    outBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        return ((--t)*t*((s+1)*t + s) + 1);
    },

    /**
     * @property inOutBack
     * @static
     * @type {Function}
     */
    inOutBack: function(t, s) {
        if (s === undefined) s = 1.70158;
        if ((t/=.5) < 1) return .5*(t*t*(((s*=(1.525))+1)*t - s));
        return .5*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2);
    },

    /**
     * @property inBounce
     * @static
     * @type {Function}
     */
    inBounce: function(t) {
        return 1.0 - _defaultCurves.outBounce(1.0-t);
    },

    /**
     * @property outBounce
     * @static
     * @type {Function}
     */
    outBounce: function(t) {
        if (t < (1/2.75)) {
            return (7.5625*t*t);
        } else if (t < (2/2.75)) {
            return (7.5625*(t-=(1.5/2.75))*t + .75);
        } else if (t < (2.5/2.75)) {
            return (7.5625*(t-=(2.25/2.75))*t + .9375);
        } else {
            return (7.5625*(t-=(2.625/2.75))*t + .984375);
        }
    },

    /**
     * @property inOutBounce
     * @static
     * @type {Function}
     */
    inOutBounce: function(t) {
        if (t < .5) return _defaultCurves.inBounce(t*2) * .5;
        return _defaultCurves.outBounce(t*2-1.0) * .5 + .5;
    }
};

var _curves = Object.create(_defaultCurves);

/*
 * A library of curves which map an animation explicitly as a function of time.
 *    The following easing curves are available by default and can not be
 *    unregistered or overwritten:
 *
 *    linear,
 *    easeIn, easeOut, easeInOut,
 *    easeOutBounce,
 *    spring,
 *    inQuad, outQuad, inOutQuad,
 *    inCubic, outCubic, inOutCubic,
 *    inQuart, outQuart, inOutQuart,
 *    inQuint, outQuint, inOutQuint,
 *    inSine, outSine, inOutSine,
 *    inExpo, outExpo, inOutExpo,
 *    inCirc, outCirc, inOutCirc,
 *    inElastic, outElastic, inOutElastic,
 *    inBack, outBack, inOutBack,
 *    inBounce, outBounce, inOutBounce
 *
 * @class Easing
 */
var Easing = {
    /**
     * Registers a given curve to be available in subsequent transitions by
     *    adding it to the interal dictionary of registered curves.
     *
     * @method registerCurve
     * @chainable
     * @static
     *
     * @throws {Error} Will throw an error when attempting to overwrite default
     *    curve.
     * @throws {Error} Will throw an error if curve has already been registered.
     * 
     * @param {String} name unique name for later access
     * @param {Function} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     * @return {Easing} this
     */
    registerCurve: function(name, curve) {
        if (_defaultCurves[name]) throw new Error('Default curves can not be overwritten');
        if (_curves[name]) throw new Error('Curve has already been registered');
        _curves[name] = curve;
        return this;
    },

    /**
     * Unregisters the curve registered under the given name by removing it from
     *    the internal dictionary of registered curves. This won't effect
     *    currently active transitions.
     *
     * @method unregisterCurve
     * @chainable
     * @static
     *
     * @throws {Error} Will throw an error if curve does not exist.
     * @param {String} name name of curve
     * @return {Easing} this
     */
    unregisterCurve: function(name) {
        if (_defaultCurves[name]) throw new Error('Default curves can not be unregistered');
        if (!_curves[name]) throw new Error('Curve has not been registered');
        delete _curves[name];
        return this;
    },

    /**
     * Returns the easing curve with the given name.
     *
     * @method getCurve
     * @static
     * 
     * @param {String} name name of curve
     * @return {Function} curve function of one numeric variable mapping [0,1]
     *    to range inside [0,1]
     */
    getCurve: function(name) {
        return _curves[name];
    },

    /**
     * Retrieves the names of all previously registered easing curves.
     * 
     * @method getCurves
     * @static
     * 
     * @return {String[]} array of registered easing curves
     */
    getCurves: function() {
        return Object.keys(_defaultCurves).concat(Object.keys(_curves));
    },

    createBezierCurve: function(v1, v2) {
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    }
};

module.exports = Easing;

},{}],2:[function(require,module,exports){
'use strict';

var after = require('./after');

/**
 * Transition meta-method to support transitioning multiple
 *   values with scalar-only methods.
 *
 *
 * @class MultipleTransition
 * @constructor
 *
 * @param {Transitionable} Transionable class to multiplex
 */
function MultipleTransition(method) {
    this.method = method;
    this._instances = [];
    this.state = [];
}

MultipleTransition.SUPPORTS_MULTIPLE = true;

/**
 * Get the state of each transition.
 *
 * @method get
 *
 * @param {number=} Evaluate the curve at a normalized version of this
 *    time. If omitted, use current time. (Unix epoch time)
 *
 * @return state {Array} state array
 */
MultipleTransition.prototype.get = function get(timestamp) {
    for (var i = 0; i < this._instances.length; i++) {
        this.state[i] = this._instances[i].get(timestamp);
    }
    return this.state;
};

/**
 * Set the end states with a shared transition, with optional callback.
 *
 * @method set
 *
 * @param {Array} endState Final State. Use a multi-element argument
 *    for multiple transitions.
 * @param {Object} transition Transition definition, shared among all instances
 * @param {Function} callback called when all endStates have been reached.
 */
MultipleTransition.prototype.set = function set(endState, transition, callback) {
    var finalCallback;
    if (callback) finalCallback = after(endState.length, callback);
    for (var i = 0; i < endState.length; i++) {
        if (!this._instances[i]) this._instances[i] = new (this.method)();
        this._instances[i].set(endState[i], transition, finalCallback);
    }
    return this;
};

/**
 * Pause all transitions.
 *
 * @method pause
 *
 * @return {MultipleTransition} this
 */
MultipleTransition.prototype.pause = function pause() {
    for (var i = 0; i < this._instances.length; i++) {
        this._instances[i].pause();
    }
    return this;
};

/**
 * Resume all transitions.
 *
 * @method resume
 *
 * @return {MultipleTransition} this
 */
MultipleTransition.prototype.resume = function resume() {
    for (var i = 0; i < this._instances.length; i++) {
        this._instances[i].resume();
    }
    return this;
};

/**
 * Check if all muliplexed Transitionable instances have been paused.
 *
 * @method isPaused
 * 
 * @return {Boolean} if every Transitionable instance has been paused
 */
MultipleTransition.prototype.isPaused = function isPaused(){
    for (var i = 0; i < this._instances.length; i++) {
        if (!this._instances[i].isPaused()) return false;
    }
    return true;
};

/**
 * Reset all transitions to start state.
 *
 * @method reset
 *
 * @param {Array} startState Start state
 */
MultipleTransition.prototype.reset = function reset(startState) {
    for (var i = 0; i < startState.length; i++) {
        if (!this._instances[i]) this._instances[i] = new (this.method)();
        this._instances[i].reset(startState[i]);
    }
    this._instances.splice(startState.length, this._instances.length);
    this.state.splice(startState.length, this.state.length);
    return this;
};

module.exports = MultipleTransition;

},{"./after":5}],3:[function(require,module,exports){
'use strict';

var MultipleTransition = require('./MultipleTransition');
var TweenTransition = require('./TweenTransition');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats or
 *    Transform objects.
 *
 * An initial state is set with the constructor or set(startState). A
 *    corresponding end state and transition are set with set(endState,
 *    transition). Subsequent calls to set(endState, transition) begin at
 *    the last state. Calls to get(timestamp) provide the interpolated state
 *    along the way.
 *
 * Note that there is no event loop here - calls to get() are the only way
 *    to find state projected to the current (or provided) time and are
 *    the only way to trigger callbacks. Usually this kind of object would
 *    be part of the render() path of a visible component.
 *
 * @class Transitionable
 * @constructor
 * @param {number|Array.Number|Object.<number|string, number>} start
 *    beginning state
 */
function Transitionable(start) {
    this._endStateQueue = [];
    this._transitionQueue = [];
    this._callbackQueue = [];

    this.reset(start);

    var _this = this;
    this._boundLoadNext = function() {
        _this._loadNext();
    };
}

var transitionMethods = {};

Transitionable.registerMethod = function registerMethod(name, engineClass) {
    if (!(name in transitionMethods)) {
        transitionMethods[name] = engineClass;
        return true;
    }
    else return false;
};

Transitionable.unregisterMethod = function unregisterMethod(name) {
    if (name in transitionMethods) {
        delete transitionMethods[name];
        return true;
    }
    else return false;
};

Transitionable.prototype._loadNext = function _loadNext() {
    if (this._callback) {
        var callback = this._callback;
        this._callback = null;
        callback();
    }
    if (this._transitionQueue.length === 0) {
        this.set(this.get()); // no update required
        return;
    }
    this._currentEndState = this._endStateQueue.shift();
    this._currentTransition = this._transitionQueue.shift();
    this._callback = this._callbackQueue.shift();

    var method = null;
    if (this._currentTransition instanceof Object && this._currentTransition.method) {
        method = this._currentTransition.method;
        if (typeof method === 'string') method = transitionMethods[method];
    }
    else {
        method = TweenTransition;
    }

    if (this._currentMethod !== method) {
        if (!(this._currentEndState instanceof Object) || method.SUPPORTS_MULTIPLE === true || this._currentEndState.length <= method.SUPPORTS_MULTIPLE) {
            this._engineInstance = new method();
        }
        else {
            this._engineInstance = new MultipleTransition(method);
        }
        this._currentMethod = method;
    }

    this._engineInstance.reset(this.state, this.velocity);
    if (this.velocity !== undefined) this._currentTransition.velocity = this.velocity;

    this._engineInstance.set(this._currentEndState, this._currentTransition, this._boundLoadNext);
};


/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 *
 * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endState
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 */
Transitionable.prototype.set = function set(endState, transition, callback) {
    if (!transition) {
        this.reset(endState);
        if (callback) callback();
        return this;
    }

    this._endStateQueue.push(endState);
    this._transitionQueue.push(transition);
    this._callbackQueue.push(callback);

    if (!this._currentTransition && !this._currentEndState) this._loadNext();
    return this;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 *
 * @param {number|Array.Number|Object.<number, number>} startState
 *    stable state to set to
 */
Transitionable.prototype.reset = function reset(startState, startVelocity) {
    this._currentMethod = null;
    this._engineInstance = null;
    this.state = startState;
    this.velocity = startVelocity;

    this._currentEndState = null;
    this._currentTransition = null;
    this._callback = null;

    this._endStateQueue.length = 0;
    this._transitionQueue.length = 0;
    this._callbackQueue.length = 0;
    return this;
};

/**
 * Add delay action to the pending action queue queue.
 *
 * @method delay
 * @chainable
 *
 * @param {number} duration delay time (ms)
 * @param {function} callback Zero-argument function to call on observed
 *    completion (t=1)
 * @return {Transitionable} this
 */
Transitionable.prototype.delay = function delay(duration, callback) {
    var endValue;
    if (this._endStateQueue.length) {
        endValue = this._endStateQueue[this._endStateQueue.length - 1];
    } else if (this._currentEndState) {
        endValue = this._currentEndState;
    } else {
        endValue = this.get();
    }

    return this.set(endValue, {
        duration: duration,
        curve: function() {
            return 0;
        }
    }, callback);
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {number=} timestamp Evaluate the curve at a normalized version of this
 *    time. If omitted, use current time. (Unix epoch time)
 * @return {number|Object.<number|string, number>} beginning state
 *    interpolated to this point in time.
 */
Transitionable.prototype.get = function get(timestamp) {
    if (this._engineInstance) {
        if (this._engineInstance.getVelocity)
            this.velocity = this._engineInstance.getVelocity();
        this.state = this._engineInstance.get(timestamp);
    }
    return this.state;
};

/**
 * Is there at least one action pending completion?
 *
 * @method isActive
 *
 * @return {boolean}
 */
Transitionable.prototype.isActive = function isActive() {
    return !!this._currentTransition;
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 * 
 * @return {Transitionable} this
 */
Transitionable.prototype.halt = function halt() {
    this.set(this.get());
    return this;
};

/**
 * Pause transition. This will not erase any actions.
 * 
 * @method pause
 * @chainable
 * 
 * @return {Transitionable} this
 */
Transitionable.prototype.pause = function pause() {
    if (this._engineInstance) this._engineInstance.pause();
    return this;
};

/**
 * Has the current action been paused?
 *
 * @method isPaused
 * @chainable
 * 
 * @return {Boolean} if the current action has been paused
 */
Transitionable.prototype.isPaused = function isPaused() {
    if (!this._engineInstance) {
        return false;
    }
    else {
        return this._engineInstance.isPaused();
    }
};

/**
 * Resume transition.
 * 
 * @method resume
 * @chainable
 * 
 * @return {Transitionable} this
 */
Transitionable.prototype.resume = function resume() {
    if (this._engineInstance) this._engineInstance.resume();
    return this;
};

module.exports = Transitionable;

},{"./MultipleTransition":2,"./TweenTransition":4}],4:[function(require,module,exports){
'use strict';

var Easing = require('./Easing');

/**
 *
 * A state maintainer for a smooth transition between
 *    numerically-specified states.  Example numeric states include floats or
 *    Transfornm objects.
 *
 *    An initial state is set with the constructor or set(startValue). A
 *    corresponding end state and transition are set with set(endValue,
 *    transition). Subsequent calls to set(endValue, transition) begin at
 *    the last state. Calls to get(timestamp) provide the _interpolated state
 *    along the way.
 *
 *   Note that there is no event loop here - calls to get() are the only way
 *    to find out state projected to the current (or provided) time and are
 *    the only way to trigger callbacks. Usually this kind of object would
 *    be part of the render() path of a visible component.
 *
 * @class TweenTransition
 * @constructor
 *
 * @param {Object} options TODO
 *    beginning state
 */
function TweenTransition(options) {
    this.options = Object.create(TweenTransition.DEFAULT_OPTIONS);
    if (options) this.setOptions(options);

    this._startTime = 0;
    this._startValue = 0;
    this._updateTime = 0;
    this._endValue = 0;
    this._curve = undefined;
    this._duration = 0;
    this._active = false;
    this._callback = undefined;
    this.state = 0;
    this.velocity = undefined;
    this._paused = 0;
}

TweenTransition.now = function() {
    return Date.now();
};

TweenTransition.SUPPORTS_MULTIPLE = true;
TweenTransition.DEFAULT_OPTIONS = {
    curve: 'linear',
    duration: 500,
    speed: 0 /* considered only if positive */
};

 // Interpolate: If a linear function f(0) = a, f(1) = b, then return f(t)
function _interpolate(a, b, t) {
    return ((1 - t) * a) + (t * b);
}

function _clone(obj) {
    if (obj instanceof Object) {
        if (obj instanceof Array) return obj.slice(0);
        else return Object.create(obj);
    }
    else return obj;
}

// Fill in missing properties in "transition" with those in defaultTransition, and
//   convert internal named curve to function object, returning as new
//   object.
function _normalize(transition, defaultTransition) {
    var result = {curve: defaultTransition.curve};
    if (defaultTransition.duration) result.duration = defaultTransition.duration;
    if (defaultTransition.speed) result.speed = defaultTransition.speed;
    if (transition instanceof Object) {
        if (transition.duration !== undefined) result.duration = transition.duration;
        if (transition.curve) result.curve = transition.curve;
        if (transition.speed) result.speed = transition.speed;
    }
    if (typeof result.curve === 'string') result.curve = Easing.getCurve(result.curve);
    return result;
}

/**
 * Set internal options, overriding any default options.
 *
 * @method setOptions
 *
 *
 * @param {Object} options options object
 * @param {Object} [options.curve] function mapping [0,1] to [0,1] or identifier
 * @param {Number} [options.duration] duration in ms
 * @param {Number} [options.speed] speed in pixels per ms
 */
TweenTransition.prototype.setOptions = function setOptions(options) {
    if (options.curve !== undefined) this.options.curve = options.curve;
    if (options.duration !== undefined) this.options.duration = options.duration;
    if (options.speed !== undefined) this.options.speed = options.speed;
};

/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 *
 *
 * @param {number|FamousMatrix|Array.Number|Object.<number, number>} endValue
 *    end state to which we _interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 */
TweenTransition.prototype.set = function set(endValue, transition, callback) {
    if (!transition) {
        this.reset(endValue);
        if (callback) callback();
        return;
    }

    this._startValue = _clone(this.get());
    transition = _normalize(transition, this.options);
    if (transition.speed) {
        var startValue = this._startValue;
        if (startValue instanceof Object) {
            var variance = 0;
            for (var i in startValue) variance += (endValue[i] - startValue[i]) * (endValue[i] - startValue[i]);
            transition.duration = Math.sqrt(variance) / transition.speed;
        }
        else {
            transition.duration = Math.abs(endValue - startValue) / transition.speed;
        }
    }

    this._startTime = TweenTransition.now();
    this._endValue = _clone(endValue);
    this._startVelocity = _clone(transition.velocity);
    this._duration = transition.duration;
    this._curve = transition.curve;
    this._active = true;
    this._callback = callback;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 *
 * @param {number|Array.Number|Object.<number, number>} startValue
 *    starting state
 * @param {number} startVelocity
 *    starting velocity
 */
TweenTransition.prototype.reset = function reset(startValue, startVelocity) {
    if (this._callback) {
        var callback = this._callback;
        this._callback = undefined;
        callback();
    }
    this.state = _clone(startValue);
    this.velocity = _clone(startVelocity);
    this._startTime = 0;
    this._duration = 0;
    this._updateTime = 0;
    this._startValue = this.state;
    this._startVelocity = this.velocity;
    this._endValue = this.state;
    this._active = false;
};

/**
 * Get current velocity
 *
 * @method getVelocity
 *
 * @returns {Number} velocity
 */
TweenTransition.prototype.getVelocity = function getVelocity() {
    return this.velocity;
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 *
 * @param {number=} timestamp Evaluate the curve at a normalized version of this
 *    time. If omitted, use current time. (Unix epoch time)
 * @return {number|Object.<number|string, number>} beginning state
 *    _interpolated to this point in time.
 */
TweenTransition.prototype.get = function get(timestamp) {
    if (this._paused) timestamp = this._paused;
    this.update(timestamp);
    return this.state;
};

function _calculateVelocity(current, start, curve, duration, t) {
    var velocity;
    var eps = 1e-7;
    var speed = (curve(t) - curve(t - eps)) / eps;
    if (current instanceof Array) {
        velocity = [];
        for (var i = 0; i < current.length; i++){
            if (typeof current[i] === 'number')
                velocity[i] = speed * (current[i] - start[i]) / duration;
            else
                velocity[i] = 0;
        }

    }
    else velocity = speed * (current - start) / duration;
    return velocity;
}

function _calculateState(start, end, t) {
    var state;
    if (start instanceof Array) {
        state = [];
        for (var i = 0; i < start.length; i++) {
            if (typeof start[i] === 'number')
                state[i] = _interpolate(start[i], end[i], t);
            else
                state[i] = start[i];
        }
    }
    else state = _interpolate(start, end, t);
    return state;
}

/**
 * Update internal state to the provided timestamp. This may invoke the last
 *    callback and begin a new action.
 *
 * @method update
 *
 *
 * @param {number=} timestamp Evaluate the curve at a normalized version of this
 *    time. If omitted, use current time. (Unix epoch time)
 */
TweenTransition.prototype.update = function update(timestamp) {
    if (!this._active) {
        if (this._callback) {
            var callback = this._callback;
            this._callback = undefined;
            callback();
        }
        return;
    }

    if (!timestamp) timestamp = TweenTransition.now();
    if (this._updateTime >= timestamp) return;
    this._updateTime = timestamp;

    var timeSinceStart = timestamp - this._startTime;
    if (timeSinceStart >= this._duration) {
        this.state = this._endValue;
        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, 1);
        this._active = false;
    }
    else if (timeSinceStart < 0) {
        this.state = this._startValue;
        this.velocity = this._startVelocity;
    }
    else {
        var t = timeSinceStart / this._duration;
        this.state = _calculateState(this._startValue, this._endValue, this._curve(t));
        this.velocity = _calculateVelocity(this.state, this._startValue, this._curve, this._duration, t);
    }
};

/**
 * Is there at least one action pending completion?
 *
 * @method isActive
 *
 *
 * @return {boolean}
 */
TweenTransition.prototype.isActive = function isActive() {
    return this._active;
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 *
 */
TweenTransition.prototype.halt = function halt() {
    this.reset(this.get());
};

/**
 * Pause transition.
 *
 * @method pause
 * @return {TweenTransition} this
 */
TweenTransition.prototype.pause = function pause() {
    this._paused = TweenTransition.now();
    return this;
};

/**
 * Check if transition has been paused.
 *
 * @method isPaused
 *
 * @return {Boolean} if current transition is paused
 */
TweenTransition.prototype.isPaused = function isPaused() {
    return !!this._paused;
};

/**
 * Resume transition.
 *
 * @method resume
 * @return {TweenTransition} this
 */
TweenTransition.prototype.resume = function resume() {
    var progressBeforePause = this._paused - this._startTime;
    this._startTime = TweenTransition.now() - progressBeforePause;
    this._paused = 0;
    return this;
};

module.exports = TweenTransition;

},{"./Easing":1}],5:[function(require,module,exports){
'use strict';

/**
 * Return wrapper around callback function. Once the wrapper is called N
 *   times, invoke the callback function. Arguments and scope preserved.
 *
 * @method after
 *
 * @param {number} count number of calls before callback function invoked
 * @param {Function} callback wrapped callback function
 *
 * @return {function} wrapped callback with coundown feature
 */
var after = function after(count, callback) {
    var counter = count;
    return function() {
        counter--;
        if (counter === 0) callback.apply(this, arguments);
    };
};

module.exports = after;

},{}],6:[function(require,module,exports){
'use strict';

module.exports = {
    after: require('./after'),
    Easing: require('./Easing'),
    MultipleTransition: require('./MultipleTransition'),
    Transitionable: require('./Transitionable'),
    TweenTransition: require('./TweenTransition')
};

},{"./Easing":1,"./MultipleTransition":2,"./Transitionable":3,"./TweenTransition":4,"./after":5}],7:[function(require,module,exports){
'use strict';

var Position = require('./Position');

/**
 * @class Align
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Align component
 */

function Align(dispatch) {
    Position.call(this, dispatch);
}

/**
*
* stringifies Align
*
* @method
* @return {String} the name of the Component Class: 'Align'
*/
Align.toString = function toString() {
    return Align.toString;
};

Align.prototype = Object.create(Position.prototype);
Align.prototype.constructor = Align;

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Align.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setAlign(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Align;

},{"./Position":15}],8:[function(require,module,exports){
'use strict';

/**
 * @class Camera
 * @constructor
 * @component
 * @param {RenderNode} RenderNode to which the instance of Camera will be a component of
 */
function Camera(dispatch) {
    this._dispatch = dispatch;
    this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
    this._focalDepth = 0;
    this._near = 0;
    this._far = 0;
    this._id = dispatch.addComponent(this);
    this._viewTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

    dispatch.onTransformChange(buildViewTransform.bind(this));

    this.setFlat();
}

Camera.FRUSTUM_PROJECTION = 0;
Camera.PINHOLE_PROJECTION = 1;
Camera.ORTHOGRAPHIC_PROJECTION = 2;

// Return the name of the Element Class: 'Camera'
Camera.toString = function toString() {
    return 'Camera';
};

Camera.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        projectionType: this._projectionType,
        focalDepth: this._focalDepth,
        near: this._near,
        far: this._far
    };
};


Camera.prototype.setState = function setState(state) {
    this._dispatch.dirtyComponent(this._id);
    if (state.component === this.constructor.toString()) {
        this.set(state.projectionType, state.focalDepth, state.near, state.far);
        return true;
    }
    return false;
};

Camera.prototype.set = function set(type, depth, near, far) {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = type;
    this._focalDepth = depth;
    this._near = near;
    this._far = far;
};

Camera.prototype.setDepth = function setDepth(depth) {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = Camera.PINHOLE_PROJECTION;
    this._focalDepth = depth;
    this._near = 0;
    this._far = 0;

    return this;
};

Camera.prototype.setFrustum = function setFrustum(near, far) {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = Camera.FRUSTUM_PROJECTION;
    this._focalDepth = 0;
    this._near = near;
    this._far = far;

    return this;
};

Camera.prototype.setFlat = function setFlat() {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
    this._focalDepth = 0;
    this._near = 0;
    this._far = 0;

    return this;
};

Camera.prototype.clean = function clean() {
    switch (this._projectionType) {
        case Camera.FRUSTUM_PROJECTION:
            this._dispatch.sendDrawCommand('FRUSTUM_PROJECTION');
            this._dispatch.sendDrawCommand(this._near);
            this._dispatch.sendDrawCommand(this._far);
            break;
        case Camera.PINHOLE_PROJECTION:
            this._dispatch.sendDrawCommand('PINHOLE_PROJECTION');
            this._dispatch.sendDrawCommand(this._focalDepth);
            break;
        case Camera.ORTHOGRAPHIC_PROJECTION:
            this._dispatch.sendDrawCommand('ORTHOGRAPHIC_PROJECTION');
            break;
    }

    if (this._viewDirty) {
        this._viewDirty = false;
        
        this._dispatch.sendDrawCommand('CHANGE_VIEW_TRANSFORM');
        this._dispatch.sendDrawCommand(this._viewTransform[0]);
        this._dispatch.sendDrawCommand(this._viewTransform[1]);
        this._dispatch.sendDrawCommand(this._viewTransform[2]);
        this._dispatch.sendDrawCommand(this._viewTransform[3]);

        this._dispatch.sendDrawCommand(this._viewTransform[4]);
        this._dispatch.sendDrawCommand(this._viewTransform[5]);
        this._dispatch.sendDrawCommand(this._viewTransform[6]);
        this._dispatch.sendDrawCommand(this._viewTransform[7]);

        this._dispatch.sendDrawCommand(this._viewTransform[8]);
        this._dispatch.sendDrawCommand(this._viewTransform[9]);
        this._dispatch.sendDrawCommand(this._viewTransform[10]);
        this._dispatch.sendDrawCommand(this._viewTransform[11]);

        this._dispatch.sendDrawCommand(this._viewTransform[12]);
        this._dispatch.sendDrawCommand(this._viewTransform[13]);
        this._dispatch.sendDrawCommand(this._viewTransform[14]);
        this._dispatch.sendDrawCommand(this._viewTransform[15]);
    }
    return false;
};


function buildViewTransform(transform) {
    var a = transform._matrix;
    this._viewDirty = true;
    this._dispatch.dirtyComponent(this._id);

    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
    a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
    a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
    a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

    b00 = a00 * a11 - a01 * a10,
    b01 = a00 * a12 - a02 * a10,
    b02 = a00 * a13 - a03 * a10,
    b03 = a01 * a12 - a02 * a11,
    b04 = a01 * a13 - a03 * a11,
    b05 = a02 * a13 - a03 * a12,
    b06 = a20 * a31 - a21 * a30,
    b07 = a20 * a32 - a22 * a30,
    b08 = a20 * a33 - a23 * a30,
    b09 = a21 * a32 - a22 * a31,
    b10 = a21 * a33 - a23 * a31,
    b11 = a22 * a33 - a23 * a32,

    det = 1/(b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06);

    this._viewTransform[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this._viewTransform[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this._viewTransform[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this._viewTransform[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this._viewTransform[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this._viewTransform[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this._viewTransform[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this._viewTransform[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this._viewTransform[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this._viewTransform[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this._viewTransform[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this._viewTransform[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this._viewTransform[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this._viewTransform[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this._viewTransform[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this._viewTransform[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
}

module.exports = Camera;

},{}],9:[function(require,module,exports){
'use strict';

/**
 * Component to manage general event emission.
 *
 * @class EventEmitter
 * @param {LocalDispatch} dispatch The dispatch with which to register the handler.
 */
function EventEmitter(dispatch) {
    this.dispatch = dispatch;
}

/**
 * Returns the name of EventEmitter as a string.
 *
 * @method toString
 * @static
 * @return {String} 'EventEmitter'
 */
EventEmitter.toString = function toString() {
    return 'EventEmitter';
};

/**
 * Emit an event with a payload.
 *
 * @method emit
 * @param {Object} event The event name.
 * @param {Object} payload The event payload.
 */
EventEmitter.prototype.emit = function emit(event, payload) {
    this.dispatch.emit(event, payload);
    return this;
};

module.exports = EventEmitter;

},{}],10:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

/**
 * Component to handle general events.
 *
 * @class EventHandler
 * @param {LocalDispatch} dispatch The dispatch with which to register the handler.
 * @param {Object[]} events An array of event objects specifying .event and .callback properties.
 */
function EventHandler (dispatch, events) {
    this.dispatch = dispatch;
    this._events = new CallbackStore();

    if (events) {
        for (var i = 0, len = events.length; i < len; i++) {
            var eventName = events[i].event;
            var callback = events[i].callback;
            this._events.on(eventName, callback);
            dispatch.registerGlobalEvent(eventName, this.trigger.bind(this, eventName));
        }
    }
}

/**
 * Returns the name of EventHandler as a string.
 *
 * @method toString
 * @static
 * @return {String} 'EventHandler'
 */
EventHandler.toString = function toString() {
    return 'EventHandler';
};

/**
 * Register a callback to be invoked on an event.
 *
 * @method on
 * @param {String} ev The event name.
 * @param {Function} cb The callback.
 */
EventHandler.prototype.on = function on (ev, cb) {
    this._events.on(ev, cb);
    this.dispatch.registerGlobalEvent(ev, this.trigger.bind(this, ev));
};

/**
 * Deregister a callback from an event.
 *
 * @method on
 * @param {String} ev The event name.
 * @param {Function} cb The callback.
 */
EventHandler.prototype.off = function off (ev, cb) {
    this._events.off(ev, cb);
    this.dispatch.deregisterGlobalEvent(ev, this.trigger.bind(this, ev))
};

/**
 * Trigger the callback associated with an event, passing in a payload.
 *
 * @method trigger
 * @param {String} ev The event name.
 * @param {Object} payload The event payload.
 */
EventHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

module.exports = EventHandler;

},{"famous-utilities":70}],11:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;
var Vec2 = require('famous-math').Vec2;

var VEC_REGISTER = new Vec2();

var gestures = {drag: true, tap: true, rotate: true, pinch: true};
var progressbacks = [_processPointerStart, _processPointerMove, _processPointerEnd];

var touchEvents = ['touchstart', 'touchmove', 'touchend'];
var mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
var methods = ['preventDefault'];
var touchProperties = [{targetTouches: {0: ['pageX', 'pageY', 'identifier'], 1: ['pageX', 'pageY', 'identifier']}}];
var mouseProperties = ['pageX', 'pageY'];

/**
 * Component to manage gesture events. Will track 'pinch', 'rotate', 'tap', and 'drag' events, on an
 * as-requested basis.
 *
 * @class GestureHandler
 * @param {LocalDispatch} dispatch The dispatch with which to register the handler.
 * @param {Object[]} events An array of event objects specifying .event and .callback properties.
 */

function GestureHandler (dispatch, events) {
    this.dispatch = dispatch;

    this.last1 = new Vec2();
    this.last2 = new Vec2();

    this.delta1 = new Vec2();
    this.delta2 = new Vec2();

    this.velocity1 = new Vec2();
    this.velocity2 = new Vec2();

    this.dist = 0;
    this.diff12 = new Vec2();

    this.center = new Vec2();
    this.centerDelta = new Vec2();
    this.centerVelocity = new Vec2();

    this.pointer1 = {
            position: this.last1,
            delta: this.delta1,
            velocity: this.velocity1,
    };

    this.pointer2 = {
            position: this.last2,
            delta: this.delta2,
            velocity: this.velocity2,
    };

    this.event = {
        status: null,
        time: 0,
        pointers: [],
        center: this.center,
        centerDelta: this.centerDelta,
        centerVelocity: this.centerVelocity,
        points: 0,
        current: 0
    };

    this.trackedPointerIDs = [-1, -1];
    this.timeOfPointer = 0;
    this.multiTap = 0;

    this.mice = [];

    this.gestures = [];
    this.options = {};
    this.trackedGestures = {};

    this._events = new CallbackStore();
    for (var i = 0, len = events.length; i < len; i++) {
        var gesture = events[i].event;
        var callback = events[i].callback;
        if (gestures[gesture]) {
            this.trackedGestures[gesture] = true;
            this.gestures.push(gesture);
            if (events[i].event) this.options[gesture] = events[i];
            this._events.on(gesture, callback);
        }
    }

    var renderables = dispatch.getRenderables();
    for (var i = 0, len = renderables.length; i < len; i++) {
        for (var j = 0; j < 3; j++) {
            var touchEvent = touchEvents[j];
            var mouseEvent = mouseEvents[j];
            if (renderables[i].on) renderables[i].on(touchEvent, methods, touchProperties);
            dispatch.registerTargetedEvent(touchEvent, progressbacks[j].bind(this));
            if (renderables[i].on) renderables[i].on(mouseEvent, methods, mouseProperties);
            dispatch.registerTargetedEvent(mouseEvent, progressbacks[j].bind(this));
        }
        if (renderables[i].on) renderables[i].on('mouseleave', methods, mouseProperties);
        dispatch.registerTargetedEvent('mouseleave', _processMouseLeave.bind(this));
    }
}

/**
 * Returns the name of GestureHandler as a string.
 *
 * @method toString
 * @static
 * @return {String} 'GestureHandler'
 */
GestureHandler.toString = function toString() {
    return 'GestureHandler';
};

/**
 * Trigger gestures in the order they were requested, if they occured.
 *
 * @method triggerGestures
 */
GestureHandler.prototype.triggerGestures = function() {
    var payload = this.event;
    for (var i = 0, len = this.gestures.length; i < len; i++) {
        var gesture = this.gestures[i];
        switch (gesture) {
            case 'rotate':
            case 'pinch':
                if (payload.points === 2) this.trigger(gesture, payload);
                break;
            case 'tap':
                if (payload.status !== 'move') {
                    if (this.options['tap']) {
                        var pts = this.options['tap'].points || 1;
                        if(this.multiTap >= pts && payload.points >= pts) this.trigger(gesture, payload);
                    }
                    else this.trigger(gesture, payload);
                }
                break;
            default:
                this.trigger(gesture, payload);
                break;
        }
    }
};

/**
 * Trigger the callback associated with an event, passing in a payload.
 *
 * @method trigger
 * @param {String} ev The event name.
 * @param {Object} payload The event payload.
 */
GestureHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

/**
 * Process up to the first two touch/mouse move events. Exit out if the first two points are already being tracked.
 *
 * @method _processPointerStart
 * @private
 * @param {Object} e The event object.
 */
function _processPointerStart(e) {
    var t;
    if (!e.targetTouches) {
        this.mice[0] = e;
        t = this.mice;
        e.identifier = 1;
    }
    else t = e.targetTouches;

    if (t[0] && t[1] && this.trackedPointerIDs[0] === t[0].identifier && this.trackedPointerIDs[1] === t[1].identifier) {
        return;
    }

    this.event.time = Date.now();

    if (this.trackedPointerIDs[0] !== t[0].identifier) {
        if (this.trackedGestures['tap']) {
            var threshold = (this.options['tap'] && this.options['tap'].threshold) || 250;
            if (this.event.time - this.timeOfPointer < threshold) this.event.taps++;
            else this.event.taps = 1;
            this.timeOfPointer = this.event.time;
            this.multiTap = 1;
        }
        this.event.current = 1;
        this.event.points = 1;
        var id = t[0].identifier;
        this.trackedPointerIDs[0] = id;

        this.last1.set(t[0].pageX, t[0].pageY);
        this.velocity1.clear();
        this.delta1.clear();
        this.event.pointers.push(this.pointer1);
    }
    if (t[1] && this.trackedPointerIDs[1] !== t[1].identifier) {
        if (this.trackedGestures['tap']) {
            var threshold = (this.options['tap'] && this.options['tap'].threshold) || 250;
            if (this.event.time - this.timeOfPointer < threshold) this.multiTap = 2;
        }
        this.event.current = 2;
        this.event.points = 2;
        var id = t[1].identifier;
        this.trackedPointerIDs[1] = id;

        this.last2.set(t[1].pageX, t[1].pageY);
        this.velocity2.clear();
        this.delta2.clear();

        Vec2.add(this.last1, this.last2, this.center).scale(0.5);
        this.centerDelta.clear();
        this.centerVelocity.clear();

        Vec2.subtract(this.last2, this.last1, this.diff12);
        this.dist = this.diff12.length();

        if (this.trackedGestures['pinch']) {
            this.event.scale = this.event.scale || 1;
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotation = this.event.rotation || 0;
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
        this.event.pointers.push(this.pointer2);
    }

    this.event.status = 'start';
    if (this.event.points === 1) {
        this.center.copy(this.last1);
        this.centerDelta.clear();
        this.centerVelocity.clear();
        if (this.trackedGestures['pinch']) {
            this.event.scale = 1;
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotation = 0;
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
    }
    this.triggerGestures();
}

/**
 * Process up to the first two touch/mouse move events.
 *
 * @method _processPointerMove
 * @private
 * @param {Object} e The event object.
 */
function _processPointerMove(e) {
    var t;
    if (!e.targetTouches) {
        if (!this.event.current) return;
        this.mice[0] = e;
        t = this.mice;
        e.identifier = 1;
    }
    else t = e.targetTouches;

    var time = Date.now();
    var dt = time - this.event.time;
    if (dt === 0) return;
    var invDt = 1000 / dt;
    this.event.time = time;

    this.event.current = 1;
    this.event.points = 1;
    if (this.trackedPointerIDs[0] === t[0].identifier) {
        VEC_REGISTER.set(t[0].pageX, t[0].pageY);
        Vec2.subtract(VEC_REGISTER, this.last1, this.delta1);
        Vec2.scale(this.delta1, invDt, this.velocity1);
        this.last1.copy(VEC_REGISTER);

    }
    if (t[1]) {
        this.event.current = 2;
        this.event.points = 2;
        VEC_REGISTER.set(t[1].pageX, t[1].pageY);
        Vec2.subtract(VEC_REGISTER, this.last2, this.delta2);
        Vec2.scale(this.delta2, invDt, this.velocity2);
        this.last2.copy(VEC_REGISTER);

        Vec2.add(this.last1, this.last2, VEC_REGISTER).scale(0.5);
        Vec2.subtract(VEC_REGISTER, this.center, this.centerDelta);
        Vec2.add(this.velocity1, this.velocity2, this.centerVelocity).scale(0.5);
        this.center.copy(VEC_REGISTER);

        Vec2.subtract(this.last2, this.last1, VEC_REGISTER);

        if (this.trackedGestures['rotate']) {
            var dot = VEC_REGISTER.dot(this.diff12);
            var cross = VEC_REGISTER.cross(this.diff12);
            var theta = -Math.atan2(cross, dot);
            this.event.rotation += theta;
            this.event.rotationDelta = theta;
            this.event.rotationVelocity = theta * invDt;
        }

        var dist = VEC_REGISTER.length();
        var scale = dist / this.dist;
        this.diff12.copy(VEC_REGISTER);
        this.dist = dist;

        if (this.trackedGestures['pinch']) {
            this.event.scale *= scale;
            scale -= 1.0;
            this.event.scaleDelta = scale;
            this.event.scaleVelocity = scale * invDt;
        }
    }

    this.event.status = 'move';
    if (this.event.points === 1) {
        this.center.copy(this.last1);
        this.centerDelta.copy(this.delta1);
        this.centerVelocity.copy(this.velocity1);
        if (this.trackedGestures['pinch']) {
            this.event.scale = 1;
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotation = 0;
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
    }
    this.triggerGestures();
}

/**
 * Process up to the first two touch/mouse end events. Exit out if the two points being tracked are still active.
 *
 * @method _processPointerEnd
 * @private
 * @param {Object} e The event object.
 */
function _processPointerEnd(e) {
    var t;
    if (!e.targetTouches) {
        if (!this.event.current) return;
        this.mice.pop();
        t = this.mice;
    }
    else t = e.targetTouches;

    if (t[0] && t[1] && this.trackedPointerIDs[0] === t[0].identifier && this.trackedPointerIDs[1] === t[1].identifier) {
            return;
    }

    this.event.status = 'end';
    if (!t[0]) {
        this.event.current = 0;
        this.trackedPointerIDs[0] = -1;
        this.trackedPointerIDs[1] = -1;
        this.triggerGestures();
        this.event.pointers.pop();
        this.event.pointers.pop();
        return;
    }
    else if(this.trackedPointerIDs[0] !== t[0].identifier) {
        this.trackedPointerIDs[0] = -1;
        var id = t[0].identifier;
        this.trackedPointerIDs[0] = id;

        this.last1.set(t[0].pageX, t[0].pageY);
        this.velocity1.clear();
        this.delta1.clear();
    }
    if (!t[1]) {
        this.event.current = 1;
        this.trackedPointerIDs[1] = -1;
        this.triggerGestures();
        this.event.points = 1;
        this.event.pointers.pop();
    }
    else if (this.trackedPointerIDs[1] !== t[1].identifier) {
        this.trackedPointerIDs[1] = -1;
        this.event.points = 2;
        var id = t[1].identifier;
        this.trackedPointerIDs[1] = id;

        this.last2.set(t[1].pageX, t[1].pageY);
        this.velocity2.clear();
        this.delta2.clear();

        Vec2.add(this.last1, this.last2, this.center).scale(0.5);
        this.centerDelta.clear();
        this.centerVelocity.clear();

        Vec2.subtract(this.last2, this.last1, this.diff12);
        this.dist = this.diff12.length();
    }
}

/**
 * Treats a mouseleave event as a gesture end.
 *
 * @method _processMouseLeave
 * @private
 * @param {Object} e The event object.
 */
function _processMouseLeave(e) {
    if (this.event.current) {
        this.event.status = 'end';
        this.event.current = 0;
        this.trackedPointerIDs[0] = -1;
        this.triggerGestures();
        this.event.pointers.pop();
    }
}

module.exports = GestureHandler;

},{"famous-math":227,"famous-utilities":70}],12:[function(require,module,exports){
'use strict';

var Position = require('./Position');

/**
 * @class MountPoint
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the MountPoint component
 */
function MountPoint(dispatch) {
    Position.call(this, dispatch);
}

/**
*
* Stringifies MountPoint
*
* @method
* @return {String} the name of the Component Class: 'MountPoint'
*/
MountPoint.toString = function toString() {
    return 'MountPoint';
};

MountPoint.prototype = Object.create(Position.prototype);
MountPoint.prototype.constructor = MountPoint;

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean} 
*/
MountPoint.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setMountPoint(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = MountPoint;

},{"./Position":15}],13:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;


/**
 * @class Opacity
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Opacity component
 */
function Opacity(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    this._value = new Transitionable(1);
}

/**
*
* returns stringified Opacity
*
* @method
* @return {String} the name of the Component Class: 'Opacity'
*/
Opacity.toString = function toString() {
    return 'Opacity';
};

/**
*
* Retrieves state of Opacity
*
* @method
* @return {Object} contains component key which holds the stringified constructor 
* and value key which contains the numeric value
*/
Opacity.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        value: this._value.get()
    };
};

/**
*
* Setter for Opacity state
*
* @method
* @param {Object} state contains component key, which holds stringified constructor, and a value key, which contains a numeric value used to set opacity if the constructor value matches
* @return {Boolean} true if set is successful, false otherwise
*/
Opacity.prototype.setState = function setState(state) {
    if (this.constructor.toString() === state.component) {
        this.set(state.value);
        return true;
    }
    return false;
};

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Opacity.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setOpacity(this._value.get());
    return this._value.isActive();
};

/**
*
* Setter for Opacity with callback
*
* @method
* @param {Number} value value used to set Opacity
* @param {Object} options options hash
* @param {Function} callback to be called following Opacity set
* @chainable
*/
Opacity.prototype.set = function set(value, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._value.set(value, options, callback);
    return this;
};

/**
*
* Getter for Opacity
*
* @method
* @return {Number}
*/
Opacity.prototype.get = function get() {
    return this._value.get();
};

/**
*
* Stops Opacity transition
*
* @method
* @chainable
*/
Opacity.prototype.halt = function halt() {
    this._value.halt();
    return this;
};

module.exports = Opacity;

},{"famous-transitions":6}],14:[function(require,module,exports){
'use strict';

var Position = require('./Position');

/**
 * @class Origin
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Origin component
 */
function Origin(dispatch) {
    Position.call(this, dispatch);
}


/**
*
* returns stringified Origin
*
* @method
* @return {String} the name of the Component Class: 'Origin'
*/
Origin.toString = function toString() {
    return 'Origin';
};

Origin.prototype = Object.create(Position.prototype);
Origin.prototype.constructor = Origin;

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Origin.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setOrigin(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Origin;

},{"./Position":15}],15:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

/**
 * @class Position
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Position component
 */
function Position(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    this._x = new Transitionable(0);
    this._y = new Transitionable(0);
    this._z = new Transitionable(0);
}

/** 
*
* stringifies Position constructor
*
* @method
* @return {String} the definition of the Component Class: 'Position'
*/
Position.toString = function toString() {
    return 'Position';
};

/**
*
* Gets object containing stringified constructor, x, y, z coordinates
*
* @method
* @return {Object}
*/
Position.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        x: this._x.get(),
        y: this._y.get(),
        z: this._z.get()
    };
};

/**
*
* Setter for position coordinates
*
* @method
* @param {Object} state Object -- component: stringified constructor, x: number, y: number, z: number
* @return {Boolean} true on success
*/
Position.prototype.setState = function setState(state) {
    if (state.component === this.constructor.toString()) {
        this.set(state.x, state.y, state.z);
        return true;
    }
    return false;
};

/**
*
* Getter for X position
*
* @method
* @return {Number}
*/
Position.prototype.getX = function getX() {
    return this._x.get();
};

/**
*
* Getter for Y position
*
* @method
* @return {Number}
*/
Position.prototype.getY = function getY() {
    return this._y.get();
};

/**
*
* Getter for Z position
*
* @method
* @return {Number}
*/
Position.prototype.getZ = function getZ() {
    return this._z.get();
};

/**
*
* Getter for any active coordinates
*
* @method
* @return {Boolean}
*/
Position.prototype.isActive = function isActive() {
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

/** 
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Position.prototype.clean = function clean() {
    var context = this._dispatch.getContext();
    context.setPosition(this._x.get(), this._y.get(), this._z.get());
    return this.isActive();
};

/** 
*
* Setter for X position
*
* @method
* @param {Number} val used to set x coordinate
* @param {Object} options options hash
* @param {Function} callback function to execute after setting X
* @chainable
*/
Position.prototype.setX = function setX(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._x.set(val, options, callback);
    return this;
};

/** 
*
* Setter for Y position
*
* @method
* @param {Number} val used to set y coordinate
* @param {Object} options options hash
* @param {Function} callback function to execute after setting Y
* @chainable
*/
Position.prototype.setY = function setY(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._y.set(val, options, callback);
    return this;
};

/** 
*
* Setter for Z position
*
* @method
* @param {Number} val used to set z coordinate
* @param {Object} options options hash
* @param {Function} callback function to execute after setting Z
* @chainable
*/
Position.prototype.setZ = function setZ(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._z.set(val, options, callback);
    return this;
};


/**
*
* Setter for XYZ position with callback
*
* @method
* @param {Number} x used to set x coordinate
* @param {Number} y used to set y coordinate
* @param {Number} z used to set z coordinate
* @param {Object} options options hash
* @param {Function} callback function to execute after setting each coordinate
* @chainable
*/
Position.prototype.set = function set(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._x.set(x, options);
    this._y.set(y, options);
    this._z.set(z, options, callback);
    return this;
};

/**
*
* Stops transition of Position component
*
* @method
* @chainable
*/
Position.prototype.halt = function halt() {
    this._x.halt();
    this._y.halt();
    this._z.halt();
    return this;
};

module.exports = Position;

},{"famous-transitions":6}],16:[function(require,module,exports){
'use strict';

var Position = require('./Position');

/**
 * @class Rotation
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Rotation component
 */
function Rotation(dispatch) {
    Position.call(this, dispatch);
}

/**
*
* stringifies Rotation
*
* @method
* @return {String} the name of the Component Class: 'Rotation'
*/
Rotation.toString = function toString() {
    return 'Rotation';
};

Rotation.prototype = Object.create(Position.prototype);
Rotation.prototype.constructor = Rotation;

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Rotation.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setRotation(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Rotation;

},{"./Position":15}],17:[function(require,module,exports){
'use strict';

var Position = require('./Position');

/**
 * @class Scale
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Scale component
 */

function Scale(dispatch) {
    Position.call(this, dispatch);
    this._x.set(1);
    this._y.set(1);
    this._z.set(1);
}

/**
*
* stringifies Scale
*
* @method 
* @return {String} the name of the Component Class: 'Scale'
*/
Scale.toString = function toString() {
    return 'Scale';
};

Scale.prototype = Object.create(Position.prototype);
Scale.prototype.constructor = Scale;

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean}
*/
Scale.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setScale(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Scale;

},{"./Position":15}],18:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

/**
 * @class Size
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from corresponding Render Node of the Size component
 */
function Size(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    dispatch.dirtyComponent(this._id);
    this._absoluteMode = false;
    this._proportional = {
        x: new Transitionable(1),
        y: new Transitionable(1),
        z: new Transitionable(1)
    };
    this._differential = {
        x: new Transitionable(0),
        y: new Transitionable(0),
        z: new Transitionable(0)
    };
    this._absolute = {
        x: new Transitionable(0),
        y: new Transitionable(0),
        z: new Transitionable(0)
    };
}

/** 
* stringifies Size
*
* @method
* @return {String} the name of the Component Class: 'Align' 
*/
Size.toString = function toString() {
    return 'Size';
};

/**
*
* Returns state object
*
* @method 
* @return {Object} containing stringified constructor, x, y, z numeric size
*/
Size.prototype.getState = function getState() {
    if (this._absoluteMode) {
        return {
            component: this.constructor.toString(),
            type: 'absolute',
            x: this._absolute.x.get(),
            y: this._absolute.y.get(),
            z: this._absolute.z.get()
        };
    }
    return {
        component: this.constructor.toString(),
        type: 'relative',
        differential: {
            x: this._differential.x.get(),
            y: this._differential.y.get(),
            z: this._differential.z.get()
        },
        proportional: {
            x: this._proportional.x.get(),
            y: this._proportional.y.get(),
            z: this._proportional.z.get()
        }
    };
};

/**
* 
* Sets state of size
*
* @method
* @param {Object} state -- component: stringified constructor, x: number, y: number, z: number
* @return {Boolean} true if component deeply equals stringified constructor, sets position coordinates, else returns false
*/
Size.prototype.setState = function setState(state) {
    if (state.component === this.constructor.toString()) {
        this._absoluteMode = state.type === 'absolute';
        if (this._absoluteMode)
            this.setAbsolute(state.x, state.y, state.z);
        else {
            this.setProportional(state.proportional.x, state.proportional.y, state.proportional.z);
            this.setDifferential(state.differential.x, state.differential.y, state.differential.z);
        }
        return true;
    }
    return false;
};

Size.prototype._cleanAbsoluteX = function _cleanAbsoluteX(prop) {
    if (prop.dirtyX) {
        prop.dirtyX = prop.x.isActive();
        return prop.x.get();
    } else return null;
};

Size.prototype._cleanAbsoluteY = function _cleanAbsoluteY(prop) {
    if (prop.dirtyY) {
        prop.dirtyY = prop.y.isActive();
        return prop.y.get();
    } else return null;
};

Size.prototype._cleanAbsoluteZ = function _cleanAbsoluteZ(prop) {
    if (prop.dirtyZ) {
        prop.dirtyZ = prop.z.isActive();
        return prop.z.get();
    } else return null;
};

/**
*
* If true, component is to be updated on next engine tick
*
* @method
* @return {Boolean} 
*/
Size.prototype.clean = function clean () {
    var context = this._dispatch._context;
    if (this._absoluteMode) {
        var abs = this._absolute;
        context.setAbsolute(
            this._cleanAbsoluteX(abs),
            this._cleanAbsoluteY(abs),
            this._cleanAbsoluteZ(abs)
        );
        return abs.x.isActive() ||
            abs.y.isActive() ||
            abs.z.isActive();
    } else {
        var prop = this._proportional;
        var diff = this._differential;
        context.setProportions(
            this._cleanAbsoluteX(prop),
            this._cleanAbsoluteY(prop),
            this._cleanAbsoluteZ(prop)
        );
        context.setDifferential(
            this._cleanAbsoluteX(diff),
            this._cleanAbsoluteY(diff),
            this._cleanAbsoluteZ(diff)
        );
        return prop.x.isActive() ||
            prop.y.isActive() ||
            prop.z.isActive() ||
            diff.x.isActive() ||
            diff.y.isActive() ||
            diff.z.isActive();
    }
};

/**
*
* Sets absolute Size
*
* @method
* @param {Number} x used to set x size
* @param {Number} y used to set y size
* @param {Number} z used to set z size
* @param {Object} options options hash
* @param {Function} callback function to execute after setting each size
* @chainable
*/
Size.prototype.setAbsolute = function setAbsolute(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    var abs = this._absolute;
    this._absoluteMode = true;
    if (x != null) {
        abs.x.set(x, options, callback);
        abs.dirtyX = true;
    }
    if (y != null) {
        abs.y.set(y, options, callback);
        abs.dirtyY = true;
    }
    if (z != null) {
        abs.z.set(z, options, callback);
        abs.dirtyZ = true;
    }
    return this;
};

Size.prototype.setProportional = function setProportional(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._needsDEBUG = true;
    var prop = this._proportional;
    this._absoluteMode = false;
    if (x != null) {
        prop.x.set(x, options, callback);
        prop.dirtyX = true;
    }
    if (y != null) {
        prop.y.set(y, options, callback);
        prop.dirtyY = true;
    }
    if (z != null) {
        prop.z.set(z, options, callback);
        prop.dirtyZ = true;
    }
    return this;
};

Size.prototype.setDifferential = function setDifferential(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    var prop = this._differential;
    this._absoluteMode = false;
    if (x != null) {
        prop.x.set(x, options, callback);
        prop.dirtyX = true;
    }
    if (y != null) {
        prop.y.set(y, options, callback);
        prop.dirtyY = true;
    }
    if (z != null) {
        prop.z.set(z, options, callback);
        prop.dirtyZ = true;
    }
    return this;
};

/**
*
* Size getter method
*
* @method
* @return {Array} size
*/
Size.prototype.get = function get () {
    return this._dispatch.getContext().getSize();
};

module.exports = Size;

},{"famous-transitions":6}],19:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

/**
 * Component to manage DOM events. When registering an event, the user may specify .methods and
 * .properties to preprocess the event object.
 *
 * @class UIEventHandler
 * @param {LocalDispatch} dispatch The dispatch with which to register the handler.
 * @param {Object[]} events An array of event objects specifying .event and .callback properties.
 */
function UIEventHandler (dispatch, events) {
    this._events = new CallbackStore();
    var renderables = dispatch.getRenderables();
    for (var i = 0, len = renderables.length; i < len; i++)
        for (var j = 0, len2 = events.length; j < len2; j++) {
            var eventName = events[j].event;
            var methods = events[j].methods;
            var properties = events[j].properties;
            var callback = events[j].callback;
            this._events.on(eventName, callback);
            if (renderables[i].on) renderables[i].on(eventName, methods, properties);
            dispatch.registerTargetedEvent(eventName, this.trigger.bind(this, eventName));
        }
}

/**
 * Returns the name of UIEventHandler as a string.
 *
 * @method toString
 * @static
 * @return {String} 'UIEventHandler'
 */
UIEventHandler.toString = function toString() {
    return 'UIEventHandler';
};

/**
 * Trigger the callback associated with an event, passing in a payload.
 *
 * @method trigger
 * @param {String} ev The event name.
 * @param {Object} payload The event payload.
 */
UIEventHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

module.exports = UIEventHandler;

},{"famous-utilities":70}],20:[function(require,module,exports){
'use strict';

module.exports = {
    Align: require('./Align'),
    Camera: require('./Camera'),
    EventEmitter: require('./EventEmitter'),
    EventHandler: require('./EventHandler'),
    GestureHandler: require('./GestureHandler'),
    UIEventHandler: require('./UIEventHandler'),
    MountPoint: require('./MountPoint'),
    Opacity: require('./Opacity'),
    Origin: require('./Origin'),
    Position: require('./Position'),
    Rotation: require('./Rotation'),
    Scale: require('./Scale'),
    Size: require('./Size')
};

},{"./Align":7,"./Camera":8,"./EventEmitter":9,"./EventHandler":10,"./GestureHandler":11,"./MountPoint":12,"./Opacity":13,"./Origin":14,"./Position":15,"./Rotation":16,"./Scale":17,"./Size":18,"./UIEventHandler":19}],21:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],22:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":25,"dup":2}],23:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":22,"./TweenTransition":24,"dup":3}],24:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":21,"dup":4}],25:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],26:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":21,"./MultipleTransition":22,"./Transitionable":23,"./TweenTransition":24,"./after":25,"dup":6}],27:[function(require,module,exports){
'use strict';

/**
 * A lightweight, featureless EventEmitter.
 * 
 * @class CallbackStore
 * @constructor
 */
function CallbackStore () {
    this._events = {};
}

/**
 * Adds a listener for the specified event (= key).
 *
 * @method on
 * @chainable
 * 
 * @param  {String}   key
 * @param  {Function} callback
 * @return {Function} A function to call if you want to remove the callback
 */
CallbackStore.prototype.on = function on (key, callback) {
    if (!this._events[key]) this._events[key] = [];
    var callbackList = this._events[key];
    callbackList.push(callback);
    return function () {
        callbackList.splice(callbackList.indexOf(callback), 1);
    }
};

/**
 * Removes a previously added event listener.
 *
 * @method off
 * @chainable
 * 
 * @param  {String}          key
 * @param  {Function}        callback
 * @return {CallbackStore}   this
 */
CallbackStore.prototype.off = function off (key, callback) {
    var events = this._events[key];
    if (events) events.splice(events.indexOf(callback), 1);
    return this;
};

/**
 * Invokes all the previously for this key registered callbacks.
 *
 * @method trigger
 * @chainable
 * 
 * @param  {String}        key
 * @param  {Object}        payload
 * @return {CallbackStore} this
 */
CallbackStore.prototype.trigger = function trigger (key, payload) {
    var events = this._events[key];
    if (events) {
        var i = 0;
        var len = events.length;
        for (; i < len ; i++) events[i](payload);
    }
    return this;
};

module.exports = CallbackStore;

},{}],28:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

/**
 * @class Color
 * @constructor
 * @component
 * @param Optional options for setting the color at instantiation.
 */
var Color = function Color() {
    this._r = new Transitionable(0);
    this._g = new Transitionable(0);
    this._b = new Transitionable(0);
    var options = Color.flattenArguments(arguments);
    if (options.length) this.set(options);
};

/**
* Returns the definition of the Class: 'Color'
*
* @method toString
* @return {string} definition
*/
Color.toString = function toString() {
    return 'Color';
};

/**
* Sets the color. It accepts an optional options parameter for tweening colors. Its default parameters are
* in RGB, however, you can also specify different inputs.
* set(r, g, b, option)
* set('rgb', 0, 0, 0, option)
* set('hsl', 0, 0, 0, option)
* set('hsv', 0, 0, 0, option)
* set('hex', '#000000', option)
* set('#000000', option)
* set('black', option)
* set(Color)
* @method set
* @param {number} r Used to set the r value of Color
* @param {number} g Used to set the g value of Color
* @param {number} b Used to set the b value of Color
* @param {object} options Optional options argument for tweening colors
* @chainable
*/
Color.prototype.set = function set() {
    var options = Color.flattenArguments(arguments);
    var type = this.determineType(options[0]);

    switch (type) {
        case 'hsl': this.setHSL(options.slice(1)); break;
        case 'rgb': this.setRGB(options.slice(1)); break;
        case 'hsv': this.setHSV(options.slice(1)); break;
        case 'hex': this.setHex(options); break;
        case 'color': this.setColor(options); break;
        case 'instance': this.copy(options); break;
        default: this.setRGB(options);
    }
    return this;
};

/**
 * Returns whether Color is still in an animating (tweening) state.
 *
 * @method isActive
 * @returns {boolean} boolean
 */
Color.prototype.isActive = function isActive() {
    return this._r.isActive() || this._g.isActive() || this._b.isActive();
};

/**
 * Tweens to another color values which can be set with
 * various inputs: RGB, HSL, Hex, HSV or another Color instance.
 *
 * @method changeTo
 * @param Color values
 * @chainable
 */
Color.prototype.changeTo = function changeTo() {
    var options = Color.flattenArguments(arguments);
    if (options.length) this.set(options);
    return this;
};

/**
 * Copies the color values from another Color instance
 *
 * @method copy
 * @param Color instance
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.copy = function copy() {
    var values = Color.flattenArguments(arguments);
    var color = values[0], options = values[1], cb = values[2];
    if (this.isColorInstance(color)) {
        this.setRGB(color.getRGB(), options, cb);
    }
    return this;
};

/**
 * Clone another Color instance
 *
 * @method clone
 * @returns {Color} Color Returns a new Color instance with the same values
 */
Color.prototype.clone = function clone() {
    var rgb = this.getRGB();
    return new Color('rgb', rgb[0], rgb[1], rgb[2]);
};

/**
 * Sets the color based on static color names
 *
 * @method setColor
 * @param Color name
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setColor = function setColor() {
    var values = Color.flattenArguments(arguments);
    var color = values[0], options = values[1], cb = values[2];
    this.setHex(colorNames[color], options, cb);
    return this;
};

/**
 * Returns the color in either RGB or with the requested format.
 *
 * @method getColor
 * @param Optional argument for determining which type of color to get (default is RGB)
 * @returns Color in either RGB or specific value
 */
Color.prototype.getColor = function getColor(option) {
    option = option || 'undefined';
    switch (option.toLowerCase()) {
        case 'undefined': return this.getRGB();
        case 'rgb': return this.getRGB();
        case 'hsl': return this.getHSL();
        case 'hex': return this.getHex();
        case 'hsv': return this.getHSV();
        default: return this.getRGB();;
    }
};

/**
 * Returns boolean whether the input is a Color instance
 *
 * @method isColorInstance
 * @param Color instance
 * @returns {Boolean} Boolean
 */
Color.prototype.isColorInstance = function isColorInstance(val) {
    return (val instanceof Color);
};

/**
 * Parses the given input to the appropriate color configuration
 *
 * @method determineType
 * @param Color type
 * @returns {string} Appropriate color type
 */
Color.prototype.determineType = function determineType(val) {
    if (this.isColorInstance(val)) return 'instance';
    if (Color.isHex(val)) return 'hex';
    if (colorNames[val]) return 'color';
    var types = ['rgb', 'hsl', 'hex', 'hsv'];
    for(var i = 0; i < types.length; i++) {
        if (Color.isType(val, types[i])) return types[i];
    }
};

/**
 * Sets the R of the Color's RGB
 *
 * @method setR
 * @param R component of Color
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setR = function setR(r, options, cb) {
    this._r.set(r, options, cb);
    return this;
};

/**
 * Sets the G of the Color's RGB
 *
 * @method setG
 * @param G component of Color
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setG = function setG(g, options, cb) {
    this._g.set(g, options, cb);
    return this;
};

/**
 * Sets the B of the Color's RGB
 *
 * @method setB
 * @param B component of Color
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setB = function setB(b, options, cb) {
    this._b.set(b, options, cb);
    return this;
};

/**
 * Sets RGB
 *
 * @method setRGB
 * @param RGB component of Color
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setRGB = function setRGB() {
    var values = Color.flattenArguments(arguments);
    var options = values[3];
    var cb = values[4];
    this.setR(values[0], options);
    this.setG(values[1], options);
    this.setB(values[2], options, cb);
    return this;
};

/**
 * Returns R of RGB
 *
 * @method getR
 * @returns R of Color
 */
Color.prototype.getR = function getR() {
    return this._r.get();
};

/**
 * Returns G of RGB
 *
 * @method getG
 * @returns G of Color
 */
Color.prototype.getG = function getG() {
    return this._g.get();
};

/**
 * Returns B of RGB
 *
 * @method getB
 * @returns B of Color
 */
Color.prototype.getB = function getB() {
    return this._b.get();
};

/**
 * Returns RGB
 *
 * @method getRGB
 * @returns RGB
 */
Color.prototype.getRGB = function getRGB() {
    return [this.getR(), this.getG(), this.getB()];
};

/**
 * Returns Normalized RGB
 *
 * @method getNormalizedRGB
 * @returns Normalized RGB
 */
Color.prototype.getNormalizedRGB = function getNormalizedRGB() {
    var r = this.getR() / 255.0;
    var g = this.getG() / 255.0;
    var b = this.getB() / 255.0;
    return [r, g, b];
};

/**
 * Returns the stringified RGB value
 *
 * @method getRGBString
 * @returns Returns the stringified RGB value
 */
Color.prototype.getRGBString = function toRGBString() {
    var r = this.getR();
    var g = this.getG();
    var b = this.getB();
    return 'rgb('+ r +', '+ g +', '+ b +');';
};

/**
 * Adds the given RGB values to the current RGB.
 *
 * @method addRGB
 * @param RGB values
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.addRGB = function addRGB(r, g, b, options, cb) {
    var r = Color.clamp(this.getR() + r);
    var g = Color.clamp(this.getG() + g);
    var b = Color.clamp(this.getB() + b);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Adds a scalar values with the current RGB.
 *
 * @method addScalar
 * @param Scalar value
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.addScalar = function addScalar(s, options, cb) {
    var r = Color.clamp(this.getR() + s);
    var g = Color.clamp(this.getG() + s);
    var b = Color.clamp(this.getB() + s);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Multiplies RGB values with the current RGB.
 *
 * @method multiplyRGB
 * @param RGB values
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.multiplyRGB = function multiplyRGB(r, g, b, options, cb) {
    var r = Color.clamp(this.getR() * r);
    var g = Color.clamp(this.getG() * g);
    var b = Color.clamp(this.getB() * b);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Multiplies a scalar values with the current RGB.
 *
 * @method multiplyScalar
 * @param Scalar value
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.multiplyScalar = function multiplyScalar(s, options, cb) {
    var r = Color.clamp(this.getR() * s);
    var g = Color.clamp(this.getG() * s);
    var b = Color.clamp(this.getB() * s);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Determines whether another Color instance equals the current one.
 *
 * @method equals
 * @param Color instance
 * @returns {Boolean}
 */
Color.prototype.equals = function equals(color) {
    if (this.isColorInstance(color)) {
        return  this.getR() === color.getR() &&
                this.getG() === color.getG() &&
                this.getB() === color.getB();
    }
    return false;
};

/**
 * Copies the gamma values with the current RGB values
 *
 * @method copyGammaToLinear
 * @param Color instance
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.copyGammaToLinear = function copyGammaToLinear(color, options, cb) {
    if (this.isColorInstance(color)) {
        var r = color.getR();
        var g = color.getG();
        var b = color.getB();
        this.setRGB(r*r, g*g, b*b, options, cb);
    }
    return this;
};

/**
 * Converts the gamma values of the current RGB values
 *
 * @method convertGammaToLinear
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.convertGammaToLinear = function convertGammaToLinear(options, cb) {
    var r = this.getR();
    var g = this.getG();
    var b = this.getB();
    this.setRGB(r*r, g*g, b*b, options, cb);
    return this;
};

/**
 * Adds two different Color instances together and returns the RGB value
 *
 * @method addColors
 * @param Color
 * @param Color
 * @returns RGB value of the added values
 */
Color.prototype.addColors = function addColors(color1, color2) {
    var r = color1.getR() + color2.getR();
    var g = color1.getG() + color2.getG();
    var b = color1.getB() + color2.getB();
    return [r, g, b];
};

/**
 * Converts a number to a hex value
 *
 * @method toHex
 * @param Number
 * @returns Hex value
 */
Color.prototype.toHex = function toHex(num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

/**
 * Returns the current color in Hex
 *
 * @method getHex
 * @returns Hex value
 */
Color.prototype.getHex = function getHex() {
    var r = this.toHex(this.getR());
    var g = this.toHex(this.getG());
    var b = this.toHex(this.getB());
    return '#' + r + g + b;
};

/**
 * Sets color using Hex
 *
 * @method setHex
 * @param Hex value
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setHex = function setHex() {
    var values = Color.flattenArguments(arguments);
    var hex, options, cb;

    if (Color.isHex(values[0])) {
        hex = values[0];
        options = values[1];
        cb = values[2];
    }
    else {
        hex = values[1]; options = values[2], cb = values[3];
    }
    hex = (hex.charAt(0) === '#') ? hex.substring(1, hex.length) : hex;

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Converts Hue to RGB
 *
 * @method hueToRGB
 * @returns Hue value
 */
Color.prototype.hueToRGB = function hueToRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

/**
 * Sets color using HSL
 *
 * @method setHSL
 * @param HSL values
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setHSL = function setHSL() {
    var values = Color.flattenArguments(arguments);
    var h = values[0], s = values[1], l = values[2];
    var options = values[3], cb = values[4];
    h /= 360.0;
    s /= 100.0;
    l /= 100.0;
    var r, g, b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = this.hueToRGB(p, q, h + 1/3);
        g = this.hueToRGB(p, q, h);
        b = this.hueToRGB(p, q, h - 1/3);
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    this.setRGB(r, g, b, options, cb);
    return this;
};

/**
 * Returns color in HSL
 *
 * @method getHSL
 * @returns HSL value
 */
Color.prototype.getHSL = function getHSL() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s*100, l*100];
};

/**
 * Returns hue
 *
 * @method getHue
 * @returns Hue value
 */
Color.prototype.getHue = function getHue() {
    var hsl = this.getHSL();
    return hsl[0];
};

/**
 * Sets hue
 *
 * @method setHue
 * @param Hue
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setHue = function setHue(h, options, cb) {
    var hsl = this.getHSL();
    this.setHSL(h, hsl[1], hsl[2], options, cb);
    return this;
};

/**
 * Returns saturation
 *
 * @method getSaturation
 * @returns Saturation value
 */
Color.prototype.getSaturation = function getSaturation() {
    var hsl = this.getHSL();
    return hsl[1];
};

/**
 * Sets saturation
 *
 * @method setSaturation
 * @param Saturation
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setSaturation = function setSaturation(s, options, cb) {
    var hsl = this.getHSL();
    this.setHSL(hsl[0], s, hsl[2], options, cb);
    return this;
};

/**
 * Returns brightness
 *
 * @method getBrightness
 * @returns Brightness
 */
Color.prototype.getBrightness = function getBrightness() {
    var rgb = this.getNormalizedRGB();
    return Math.max(rgb[0], rgb[1], rgb[2]) * 100.0;
};

/**
 * Returns Lightness
 *
 * @method getLightness
 * @returns Lightness
 */
Color.prototype.getLightness = function getLightness() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2.0) * 100.0;
};

/**
 * Sets lightness
 *
 * @method setLightness
 * @param Lightness
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setLightness = function setLightness(l, options, cb) {
    var hsl = this.getHSL();
    this.setHSL(hsl[0], hsl[0], l, options, cb);
    return this;
};

/**
 * Sets color using HSV
 *
 * @method setHSV
 * @param HSV values
 * @param Optional options arguments for animating
 * @param Optional callback
 * @chainable
 */
Color.prototype.setHSV = function setHSV() {
    var values = Color.flattenArguments(arguments);
    var h = values[0], s = values[1], v = values[2];
    var options = values[3], cb = values[4];
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    this.setRGB(r*255, g*255, b*255, options, cb);
    return this;
};

/**
 * Returns color in HSV
 *
 * @method getHSV
 * @returns HSV values
 */
Color.prototype.getHSV = function getHSV() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0;
    }
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
};

/**
 * Common color names with their associated Hex values
 */
var colorNames = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};


/**
 * One level deep flattening of arguments
 *
 * @method flattenArguments
 * @returns A flattened array
 */
Color.flattenArguments = function flattenArguments(options) {
    return Array.prototype.concat.apply([], options);
};

/**
 * Converts arguments into an array
 *
 * @method argsToArray
 * @returns Array
 */
Color.argsToArray = function argsToArray(val) {
    return Array.prototype.slice.call(val);
};

/**
 * Returns a boolean checking whether input is a 'String'
 *
 * @method isString
 * @param Primitive
 * @returns {Boolean} Boolean
 */
Color.isString = function isString(val) {
    return (typeof val === 'string');
};

/**
 * Returns a boolean checking whether input is an 'Integer'
 *
 * @method isInt
 * @param Primitive
 * @returns {Boolean} Boolean
 */
Color.isInt = function isInt(val) {
    return parseInt(val) === val;
};

/**
 * Returns a boolean checking whether input is a 'Float'
 *
 * @method isFloat
 * @param Primitive
 * @returns {Boolean} Boolean
 */
Color.isFloat = function isFloat(val) {
    return !Color.isInt(val);
};

/**
 * Returns a boolean checking whether all inputs are of type 'Float'
 *
 * @method allFloats
 * @param list
 * @returns {Boolean} Boolean
 */
Color.allFloats = function allFloats() {
    var val = Color.argsToArray(arguments);
    for(var i = 0; i < val.length; i++) {
        if (!Color.isFloat(val[i])) return false;
    }
    return true;
};

/**
 * Returns a boolean checking whether all inputs are of type 'Integer'
 *
 * @method allInts
 * @param list
 * @returns {Boolean} Boolean
 */
Color.allInts = function allInts(val) {
    return !Color.allFloats(val);
};

/**
 * Returns a boolean checking whether all inputs are of type 'String'
 *
 * @method allStrings
 * @param list
 * @returns {Boolean} Boolean
 */
Color.allStrings = function allStrings() {
    var values = Color.argsToArray(arguments);
    for(var i = 0; i < values.length; i++) {
        if (!Color.isString(values[i])) return false;
    }
    return true;
};

/**
 * Returns a boolean checking whether string input has a percentage symbol
 *
 * @method isPercentage
 * @param String
 * @returns {Boolean} Boolean
 */
Color.isPercentage = function isPercentage(val) {
    return /%/.test(val);
};

/**
 * Returns a boolean checking whether string input has a hash (#) symbol
 *
 * @method isHex
 * @param String
 * @returns {Boolean} Boolean
 */
Color.isHex = function isHex(val) {
    return /#/.test(val);
};

/**
 * Returns a boolean checking whether the value and type are same
 *
 * @method isType
 * @param String
 * @param String
 * @returns {Boolean} Boolean
 */
Color.isType = function isType(type, value) {
    return Color.allStrings(type, value) && type.toLowerCase() === value.toLowerCase();
};

/**
 * Clamps a value between a minimum and a maximum
 *
 * @method clamp
 * @param Number input
 * @param Minumum
 * @param Maximum
 * @returns Clamped value
 */
Color.clamp = function clamp(val, min, max) {
    min = min || 0;
    max = max || 255;
    return Math.max(Math.min(val, max), min);
};

module.exports = Color;

},{"famous-transitions":26}],29:[function(require,module,exports){
'use strict';

var Color = require('./Color');

/**
 * @class Stores multiple palettes in a collection and provides methods for
 *        accessing, adding, and retrieving a random palette from a pre-set
 *        collection.
 * @description
 * @name ColorPalettes
 * @constructor
 */
var ColorPalette = function ColorPalette() {
    this._palette = [];
    var options = Color.flattenArguments(arguments);
    (options.length) ? this.makePalette(options) : this.setRandomPalette();
};

/**
 * Returns the stored palette
 *
 * @method getPalette
 * @returns Palette
 */
ColorPalette.prototype.getPalette = function getPalette() {
    return this._palette;
};

/**
 * Returns the color at a given index within the palette
 *
 * @method getColor
 * @param Index
 * @returns {Color} Color
 */
ColorPalette.prototype.getColor = function getColor(i) {
    return this._palette[i];
};

/**
 * Makes a Color from the given inputs
 *
 * @method makeColor
 * @param Color values in RGB, HSL, Hex, or HSV
 * @returns {Color} Color
 */
ColorPalette.prototype.makeColor = function makeColor() {
    var options = Color.flattenArguments(arguments);
    return new Color(options[0], options[1], options[2]);
};

/**
 * Makes a palette from a given set of Colors
 *
 * @method makePalette
 * @param Color inputs
 * @chainable
 * @returns Palette
 */
ColorPalette.prototype.makePalette = function makePalette() {
    var options = Color.flattenArguments(arguments);
    var palette = [];
    for(var i = 0; i < options.length; i++) {
        var color = this.makeColor(options[i]);
        palette.push(color);
    }
    this._palette = palette;
    return this;
};

/**
 * Sets the color palette from a given set of palettes
 *
 * @method setRandomPalette
 * @returns Color palette
 */
ColorPalette.prototype.setRandomPalette = function setRandomPalette() {
    var index = Math.floor(Math.random() * rawPalettes.length);
    this.makePalette(rawPalettes[Math.floor(index)]);
    return this;
};

/**
 * Returns the lightest color in the color palette
 *
 * @method getLighestColor
 * @returns Lightest color
 */
ColorPalette.prototype.getLighestColor = function() {
    var lightestValue = 0, lightestRef;

    for (var i = 0; i < this._palette.length; i++) {
        var light = this._palette[i].getLightness();
        if (light > lightestValue) {
            lightestRef = this._palette[i];
            lightestValue = light;
        }
    }
    return lightestRef;
};

/**
 * Returns the darkest color in the color palette
 *
 * @method getDarkestColor
 * @returns Darkest color
 */
ColorPalette.prototype.getDarkestColor = function() {
    var darkestValue = 100, darkestRef;

    for (var i = 0; i < this._palette.length; i++) {
        var dark = this._palette[i].getLightness();
        if( dark < darkestValue ) {
            darkestRef = this._palette[i];
            darkestValue = dark;
        }
    }
    return darkestRef;
};

/**
 * Returns the number of colors inside of the palette
 *
 * @method getPaletteCount
 * @returns {Integer} Palette color length
 */
ColorPalette.prototype.getPaletteCount = function getPaletteCount() {
    return this._palette.length;
};

/**
 * A set of defined color palettes
 */
var rawPalettes = [
    [[53,92,125], [108,91,123], [192,108,132], [246,114,128], [248,177,149]],
    [[27,21,33], [181,172,1], [212,30,69], [232,110,28], [236,186,9]],
    [[63,54,42], [231,69,13], [250,157,4], [251,222,3], [254,245,150]],
    [[10,103,137], [10,153,111], [207,6,56], [250,102,50], [254,205,35]],
    [[157,85,105], [192,227,217], [202,55,99], [227,237,195], [235,113,84]],
    [[110,110,110], [145,217,255], [237,255,135], [255,133,167], [255,255,255]],
    [[0,0,0], [25,26,36], [51,44,44], [250,101,87], [255,255,255]],
    [[27,103,107], [81,149,72], [136,196,37], [190,242,2], [234,253,230]],
    [[31,11,12], [48,5,17], [179,84,79], [214,195,150], [231,252,207]],
    [[172,248,248], [223,235,24], [230,95,95], [235,54,24], [235,207,24]],
    [[196,182,109], [213,39,5], [240,211,119], [243,232,228], [247,109,60]],
    [[11,72,107], [59,134,134], [121,189,154], [168,219,168], [207,240,158]],
    [[0,188,209], [118,211,222], [174,232,251], [176,248,255], [254,249,240]],
    [[85,73,57], [112,108,77], [241,230,143], [255,100,100], [255,151,111]],
    [[36,244,161], [178,42,58], [199,244,36], [244,36,182], [249,246,49]],
    [[108,144,134], [169,204,24], [207,73,108], [235,234,188], [252,84,99]],
    [[78,79,75], [130,35,57], [247,62,62], [255,119,61], [255,213,115]],
    [[121,28,49], [145,213,152], [191,178,64], [202,51,68], [237,126,80]],
    [[104,73,83], [127,191,151], [182,219,145], [250,107,41], [253,158,41]],
    [[0,203,231], [0,218,60], [223,21,26], [244,243,40], [253,134,3]],
    [[56,222,231], [232,255,0], [254,62,71], [255,130,0]],
    [[27,32,38], [75,89,107], [153,228,255], [247,79,79], [255,59,59]],
    [[0,0,0], [0,173,239], [236,0,140], [255,242,0]],
    [[47,43,173], [173,43,173], [228,38,146], [247,21,104], [247,219,21]],
    [[101,150,158], [171,20,44], [189,219,222], [205,212,108], [219,217,210]],
    [[97,24,36], [193,47,42], [247,255,238], [254,222,123], [255,101,64]],
    [[118,85,66], [124,231,163], [220,93,110], [255,174,60], [255,229,156]],
    [[63,184,175], [127,199,175], [218,216,167], [255,61,127], [255,158,157]],
    [[217,251,223], [219,255,210], [231,254,235], [234,255,210], [243,255,210]],
    [[0,23,42], [27,139,163], [94,202,214], [178,222,249], [206,254,255]],
    [[225,245,196], [237,229,116], [249,212,35], [252,145,58], [255,78,80]],
    [[7,9,61], [11,16,140], [12,15,102], [14,78,173], [16,127,201]],
    [[5,177,240], [5,232,240], [94,87,230], [230,87,149], [255,5,113]],
    [[48,0,24], [90,61,49], [131,123,71], [173,184,95], [229,237,184]],
    [[111,191,162], [191,184,174], [242,199,119], [242,230,194], [255,255,255]],
    [[22,147,165], [69,181,196], [126,206,202], [160,222,214], [199,237,232]],
    [[8,26,48], [50,64,90], [59,100,128], [155,153,130], [255,134,17]],
    [[74,186,176], [152,33,0], [255,211,0], [255,245,158]],
    [[42,135,50], [49,48,66], [107,85,48], [255,109,36], [255,235,107]],
    [[0,0,0], [25,134,219], [105,172,224], [149,199,24], [184,212,40]],
    [[64,0,20], [127,0,40], [191,0,59], [229,0,71], [255,0,79]],
    [[56,69,59], [78,133,136], [255,70,84], [255,213,106], [255,254,211]],
    [[29,44,143], [57,179,162], [209,146,191], [222,75,107], [252,180,121]],
    [[14,36,48], [232,213,183], [232,213,185], [245,179,73], [252,58,81]],
    [[0,210,255], [222,255,0], [255,0,168], [255,66,0]],
    [[21,99,105], [51,53,84], [169,186,181], [216,69,148], [236,196,89]],
    [[105,210,231], [167,219,216], [224,228,204], [243,134,48], [250,105,0]],
    [[122,106,83], [148,140,117], [153,178,183], [213,222,217], [217,206,178]],
    [[34,104,136], [57,142,182], [255,162,0], [255,214,0], [255,245,0]],
    [[2,100,117], [194,163,79], [251,184,41], [254,251,175], [255,229,69]],
    [[214,37,77], [246,215,107], [253,235,169], [255,84,117], [255,144,54]],
    [[0,0,0], [124,180,144], [211,25,0], [255,102,0], [255,242,175]],
    [[35,116,222], [38,38,38], [87,54,255], [231,255,54], [255,54,111]],
    [[64,18,44], [89,186,169], [101,98,115], [216,241,113], [252,255,217]],
    [[126,148,158], [174,194,171], [235,206,160], [252,119,101], [255,51,95]],
    [[75,73,11], [117,116,73], [226,223,154], [235,229,77], [255,0,81]],
    [[159,112,69], [183,98,5], [208,167,124], [253,169,43], [254,238,171]],
    [[38,37,28], [160,232,183], [235,10,68], [242,100,61], [242,167,61]],
    [[0,0,0], [67,110,217], [120,0,0], [216,216,216], [240,24,0]],
    [[51,51,51], [131,163,0], [158,12,57], [226,27,90], [251,255,227]],
    [[79,156,52], [108,186,85], [125,210,89], [158,228,70], [187,255,133]],
    [[0,44,43], [7,100,97], [10,131,127], [255,61,0], [255,188,17]],
    [[149,207,183], [240,65,85], [242,242,111], [255,130,58], [255,247,189]],
    [[89,168,15], [158,213,76], [196,237,104], [226,255,158], [240,242,221]],
    [[54,42,44], [189,223,38], [237,38,105], [238,189,97], [252,84,99]],
    [[11,246,147], [38,137,233], [233,26,157], [246,182,11], [246,242,11]],
    [[8,0,9], [65,242,221], [207,242,65], [249,44,130], [252,241,30]],
    [[198,164,154], [198,229,217], [214,129,137], [233,78,119], [244,234,213]],
    [[6,71,128], [8,84,199], [160,194,222], [205,239,255], [237,237,244]],
    [[93,66,63], [124,87,83], [238,128,117], [255,177,169], [255,233,231]],
    [[59,129,131], [237,48,60], [245,99,74], [250,208,137], [255,156,91]],
    [[56,166,155], [104,191,101], [204,217,106], [242,88,53], [242,218,94]],
    [[60,197,234], [70,70,70], [233,234,60], [246,246,246]],
    [[97,99,130], [102,36,91], [105,165,164], [168,196,162], [229,234,164]],
    [[10,191,188], [19,116,125], [41,34,31], [252,53,76], [252,247,197]],
    [[7,0,4], [236,67,8], [252,129,10], [255,172,35], [255,251,214]],
    [[0,5,1], [8,138,19], [237,20,9], [240,249,241], [247,249,21]],
    [[64,197,132], [131,218,232], [170,46,154], [251,35,137], [251,132,137]],
    [[64,47,58], [217,119,119], [255,198,158], [255,219,196]],
    [[243,96,49], [249,236,95], [255,102,0], [255,153,0], [255,204,0]],
    [[33,90,109], [45,45,41], [60,162,162], [146,199,163], [223,236,230]],
    [[10,42,63], [101,147,160], [185,204,184], [219,21,34], [255,239,167]],
    [[0,160,176], [106,74,60], [204,51,63], [235,104,65], [237,201,81]],
    [[14,141,148], [67,77,83], [114,173,117], [233,213,88], [255,171,7]],
    [[94,159,163], [176,85,116], [220,209,180], [248,126,123], [250,184,127]],
    [[31,31,31], [122,91,62], [205,189,174], [250,75,0], [250,250,250]],
    [[176,230,41], [180,35,16], [247,207,10], [250,124,7], [252,231,13]],
    [[94,65,47], [120,192,168], [240,120,24], [240,168,48], [252,235,182]],
    [[31,26,28], [98,128,125], [134,158,138], [201,107,30], [209,205,178]],
    [[40,60,0], [100,153,125], [237,143,69], [241,169,48], [254,204,109]],
    [[37,2,15], [143,143,143], [158,30,76], [236,236,236], [255,17,104]],
    [[207,108,116], [244,93,120], [255,112,136], [255,130,153], [255,187,193]],
    [[0,0,0], [12,13,5], [168,171,132], [198,201,157], [231,235,176]],
    [[0,170,255], [170,0,255], [170,255,0], [255,0,170], [255,170,0]],
    [[78,150,137], [126,208,214], [135,214,155], [195,255,104], [244,252,232]],
    [[10,10,10], [227,246,255], [255,20,87], [255,216,125]],
    [[51,51,153], [102,153,204], [153,204,255], [255,0,51], [255,204,0]],
    [[23,22,92], [190,191,158], [216,210,153], [229,228,218], [245,224,56]],
    [[49,99,64], [96,158,77], [159,252,88], [195,252,88], [242,252,88]],
    [[92,88,99], [168,81,99], [180,222,193], [207,255,221], [255,31,76]],
    [[61,67,7], [161,253,17], [225,244,56], [244,251,196], [255,208,79]],
    [[0,205,172], [2,170,176], [22,147,165], [127,255,36], [195,255,104]],
    [[0,203,231], [0,218,60], [223,21,26], [244,243,40], [253,134,3]],
    [[34,104,136], [57,142,182], [255,162,0], [255,214,0], [255,245,0]],
    [[3,13,79], [206,236,239], [231,237,234], [251,12,6], [255,197,44]],
    [[253,255,0], [255,0,0], [255,90,0], [255,114,0], [255,167,0]],
    [[108,66,18], [179,0,176], [183,255,55], [255,124,69], [255,234,155]],
    [[0,4,49], [59,69,58], [90,224,151], [204,46,9], [255,253,202]],
    [[59,45,56], [188,189,172], [207,190,39], [240,36,117], [242,116,53]],
    [[101,145,155], [120,185,168], [168,212,148], [242,177,73], [244,229,97]],
    [[0,193,118], [136,193,0], [250,190,40], [255,0,60], [255,138,0]],
    [[110,37,63], [165,199,185], [199,94,106], [241,245,244], [251,236,236]],
    [[39,112,140], [111,191,162], [190,191,149], [227,208,116], [255,180,115]],
    [[62,72,76], [82,91,96], [105,158,81], [131,178,107], [242,232,97]],
    [[248,135,46], [252,88,12], [252,107,10], [253,202,73], [255,169,39]],
    [[83,119,122], [84,36,55], [192,41,66], [217,91,67], [236,208,120]],
    [[41,136,140], [54,19,0], [162,121,15], [188,53,33], [255,208,130]],
    [[10,186,181], [58,203,199], [106,219,216], [153,236,234], [201,252,251]],
    [[8,158,42], [9,42,100], [90,204,191], [229,4,4], [251,235,175]],
    [[187,187,136], [204,198,141], [238,170,136], [238,194,144], [238,221,153]],
    [[121,219,204], [134,78,65], [234,169,167], [242,199,196], [248,245,226]],
    [[96,136,213], [114,170,222], [157,200,233], [192,222,245], [217,239,244]],
    [[30,30,30], [177,255,0], [209,210,212], [242,240,240]],
    [[255,102,0], [255,153,0], [255,204,0], [255,255,204], [255,255,255]],
    [[35,15,43], [130,179,174], [188,227,197], [235,235,188], [242,29,65]],
    [[212,238,94], [225,237,185], [240,242,235], [244,250,210], [255,66,66]],
    [[20,32,71], [168,95,59], [247,92,92], [255,255,255]],
    [[63,184,240], [80,208,240], [196,251,93], [224,240,240], [236,255,224]],
    [[185,222,81], [209,227,137], [224,72,145], [225,183,237], [245,225,226]],
    [[185,222,81], [209,227,137], [224,72,145], [225,183,237], [245,225,226]],
    [[17,68,34], [51,170,170], [51,221,51], [221,238,68], [221,238,187]],
    [[46,13,35], [245,72,40], [247,128,60], [248,228,193], [255,237,191]],
    [[204,243,144], [224,224,90], [247,196,31], [252,147,10], [255,0,61]],
    [[18,18,18], [255,89,56], [255,255,255]],
    [[53,38,48], [85,72,101], [205,91,81], [233,223,204], [243,163,107]],
    [[236,250,1], [236,250,2], [247,220,2], [248,227,113], [250,173,9]],
    [[77,129,121], [161,129,121], [236,85,101], [249,220,159], [254,157,93]],
    [[4,0,4], [65,61,61], [75,0,15], [200,255,0], [250,2,60]],
    [[66,50,56], [179,112,45], [200,209,151], [235,33,56], [245,222,140]],
    [[143,153,36], [172,201,95], [241,57,109], [243,255,235], [253,96,129]],
    [[18,18,18], [23,122,135], [250,245,240], [255,180,143]],
    [[67,197,210], [182,108,97], [241,155,140], [254,247,237], [255,234,215]],
    [[78,205,196], [85,98,112], [196,77,88], [199,244,100], [255,107,107]],
    [[0,0,0], [137,161,160], [154,227,226], [255,71,103], [255,118,5]],
    [[248,200,221], [253,231,120], [255,61,61], [255,92,143], [255,103,65]],
    [[23,138,132], [145,145,145], [229,255,125], [235,143,172], [255,255,255]],
    [[73,112,138], [136,171,194], [202,255,66], [208,224,235], [235,247,248]],
    [[51,222,245], [122,245,51], [245,51,145], [245,161,52], [248,248,101]],
    [[57,13,45], [172,222,178], [225,234,181], [237,173,158], [254,75,116]],
    [[192,107,129], [233,22,67], [245,175,145], [247,201,182], [249,210,182]],
    [[131,196,192], [156,100,53], [190,215,62], [237,66,98], [240,233,226]],
    [[136,145,136], [191,218,223], [207,246,247], [233,26,82], [237,242,210]],
    [[64,44,56], [209,212,169], [227,164,129], [245,215,165], [255,111,121]],
    [[93,65,87], [131,134,137], [168,202,186], [202,215,178], [235,227,170]],
    [[0,168,198], [64,192,203], [143,190,0], [174,226,57], [249,242,231]],
    [[0,204,190], [9,166,163], [157,191,175], [237,235,201], [252,249,216]],
    [[0,205,172], [2,170,176], [22,147,165], [127,255,36], [195,255,104]],
    [[51,39,23], [107,172,191], [157,188,188], [240,240,175], [255,55,15]],
    [[51,51,53], [101,99,106], [139,135,149], [193,190,200], [233,232,238]],
    [[17,118,109], [65,9,54], [164,11,84], [228,111,10], [240,179,0]],
    [[73,10,61], [138,155,15], [189,21,80], [233,127,2], [248,202,0]],
    [[71,162,145], [144,79,135], [213,28,122], [219,213,139], [244,127,143]],
    [[55,191,230], [169,232,250], [186,255,21], [211,255,106], [247,239,236]],
    [[69,173,168], [84,121,128], [89,79,79], [157,224,173], [229,252,194]],
    [[248,241,224], [249,246,241], [250,244,227], [251,106,79], [255,193,150]],
    [[0,98,125], [1,64,87], [51,50,49], [66,153,15], [255,255,255]],
    [[52,17,57], [53,150,104], [60,50,81], [168,212,111], [255,237,144]],
    [[0,153,137], [163,169,72], [206,24,54], [237,185,46], [248,89,49]],
    [[26,31,30], [108,189,181], [147,204,198], [200,214,191], [227,223,186]],
    [[165,222,190], [183,234,201], [251,178,163], [252,37,55], [255,215,183]],
    [[26,20,14], [90,142,161], [204,65,65], [255,255,255]],
    [[51,51,51], [111,111,111], [204,204,204], [255,100,0], [255,255,255]],
    [[51,145,148], [167,2,103], [241,12,73], [246,216,107], [251,107,65]],
    [[31,3,51], [31,57,77], [39,130,92], [112,179,112], [171,204,120]],
    [[209,242,165], [239,250,180], [245,105,145], [255,159,128], [255,196,140]],
    [[60,54,79], [109,124,157], [124,144,179], [149,181,194], [185,224,220]],
    [[35,179,218], [153,214,241], [168,153,241], [208,89,218], [248,78,150]],
    [[85,66,54], [96,185,154], [211,206,61], [241,239,165], [247,120,37]],
    [[20,20,20], [177,198,204], [255,239,94], [255,255,255]],
    [[136,238,208], [202,224,129], [239,67,53], [242,205,79], [246,139,54]],
    [[53,38,29], [95,79,69], [151,123,105], [206,173,142], [253,115,26]],
    [[68,66,89], [159,189,166], [219,101,68], [240,145,67], [252,177,71]],
    [[191,208,0], [196,60,39], [233,60,31], [242,83,58], [242,240,235]],
    [[43,43,43], [53,54,52], [230,50,75], [242,227,198], [255,198,165]],
    [[23,20,38], [26,15,12], [207,207,207], [240,240,240], [255,77,148]],
    [[28,1,19], [107,1,3], [163,0,6], [194,26,1], [240,60,2]],
    [[10,10,10], [140,97,70], [214,179,156], [242,76,61], [255,255,255]],
    [[46,13,35], [245,72,40], [247,128,60], [248,228,193], [255,237,191]],
    [[0,62,95], [0,67,132], [22,147,165], [150,207,234], [247,249,114]],
    [[66,29,56], [87,0,69], [190,226,232], [205,255,24], [255,8,90]],
    [[47,59,97], [121,128,146], [187,235,185], [233,236,229], [255,103,89]],
    [[58,17,28], [87,73,81], [131,152,142], [188,222,165], [230,249,188]],
    [[147,193,196], [198,182,204], [242,202,174], [250,12,195], [255,123,15]],
    [[255,3,149], [255,9,3], [255,139,3], [255,216,3], [255,251,3]],
    [[4,0,4], [254,26,138], [254,53,26], [254,143,26], [254,240,26]],
    [[125,173,154], [196,199,169], [249,213,177], [254,126,142], [255,62,97]],
    [[69,38,50], [145,32,77], [226,247,206], [228,132,74], [232,191,86]],
    [[0,0,0], [38,173,228], [77,188,233], [209,231,81], [255,255,255]],
    [[44,87,133], [209,19,47], [235,241,247], [237,214,130]],
    [[92,172,196], [140,209,157], [206,232,121], [252,182,83], [255,82,84]],
    [[58,68,8], [74,88,7], [125,146,22], [157,222,13], [199,237,14]],
    [[22,147,167], [200,207,2], [204,12,57], [230,120,30], [248,252,193]],
    [[59,12,44], [210,255,31], [250,244,224], [255,106,0], [255,195,0]],
    [[44,13,26], [52,158,151], [200,206,19], [222,26,114], [248,245,193]],
    [[28,20,13], [203,232,107], [242,233,225], [255,255,255]],
    [[75,88,191], [161,206,247], [247,255,133], [255,54,134]],
    [[74,95,103], [92,55,75], [204,55,71], [209,92,87], [217,212,168]]
];

 module.exports = ColorPalette;

},{"./Color":28}],30:[function(require,module,exports){
'use strict';

/**
 * Collection to map keyboard codes in plain english
 *
 * @class KeyCodes
 * @static
 */
module.exports = {
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    a: 97,
    b: 98,
    c: 99,
    d: 100,
    e: 101,
    f: 102,
    g: 103,
    h: 104,
    i: 105,
    j: 106,
    k: 107,
    l: 108,
    m: 109,
    n: 110,
    o: 111,
    p: 112,
    q: 113,
    r: 114,
    s: 115,
    t: 116,
    u: 117,
    v: 118,
    w: 119,
    x: 120,
    y: 121,
    z: 122,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    ENTER : 13,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39,
    UP_ARROW: 38,
    DOWN_ARROW: 40,
    SPACE: 32,
    SHIFT: 16,
    TAB: 9
};


},{}],31:[function(require,module,exports){
'use strict';

function MethodStore () {
    this._events = {};
}

MethodStore.prototype.on = function on (key, cbclass, cbname) {
    var events = this._events[key];
    if (!events) events = [];
    events.push(cbclass, cbname);
    return this;
}

MethodStore.prototype.off = function off (key, cbclass) {
    var events = this._events[key];
    if (events) {
        var index = events.indexOf(cbclass);
        if (index > -1) events.splice(index, 2);
    }
    return this;
}

MethodStore.prototype.trigger = function trigger (key, payload) {
    var events = this._events[key];
    if (events) {
        var i = 0;
        var len = events.length;
        for (; i < len ; i += 2) events[i][events[i + 1]](payload);
    }
    return this;
};

module.exports = MethodStore;

},{}],32:[function(require,module,exports){
'use strict';

/**
 * Singleton object to manage recycling of objects with typically short lifespans, used to cut down on the
 * amount of garbage collection required.
 *
 * @singleton
 */
var ObjectManager = {};

ObjectManager.pools = {};

/**
 * Register request and free functions for the given type.
 *
 * @method register
 * @param {String} type
 * @param {Function} Constructor
 */
ObjectManager.register = function(type, Constructor) {
    var pool = this.pools[type] = [];

    this['request' + type] = _request(pool, Constructor);
    this['free' + type] = _free(pool);
};

function _request(pool, Constructor) {
    return function request() {
        if (pool.length !== 0) return pool.pop();
        else return new Constructor();
    }
}

function _free(pool) {
    return function free(obj) {
        pool.push(obj);
    }
}

/**
 * Untrack all object of the given type. Used to allow allocated objects to be garbage collected.
 *
 * @method disposeOf
 * @param {String}
 */
ObjectManager.disposeOf= function(type) {
    var pool = this.pools[type];
    var i = pool.length;
    while (i--) pool.pop();
};

module.exports = ObjectManager;

},{}],33:[function(require,module,exports){
'use strict';

/**
 *  Deep clone an object.
 *  @param b {Object} Object to clone
 *  @return a {Object} Cloned object.
 */
var clone = function clone(b) {
    var a;
    if (typeof b === 'object') {
        a = (b instanceof Array) ? [] : {};
        for (var key in b) {
            if (typeof b[key] === 'object' && b[key] !== null) {
                if (b[key] instanceof Array) {
                    a[key] = new Array(b[key].length);
                    for (var i = 0; i < b[key].length; i++) {
                        a[key][i] = clone(b[key][i]);
                    }
                }
                else {
                  a[key] = clone(b[key]);
                }
            }
            else {
                a[key] = b[key];
            }
        }
    }
    else {
        a = b;
    }
    return a;
};

module.exports = clone;

},{}],34:[function(require,module,exports){
'use strict';

function flatClone(obj) {
    var clone = {};
    for (var key in obj) clone[key] = obj[key];
    return clone;
}

module.exports = flatClone;

},{}],35:[function(require,module,exports){
'use strict';

module.exports = {
    CallbackStore: require('./CallbackStore'),
    clone: require('./clone'),
    flatClone: require('./flatClone'),
    KeyCodes: require('./KeyCodes'),
    loadURL: require('./loadURL'),
    MethodStore: require('./MethodStore'),
    ObjectManager: require('./ObjectManager'),
    Color: require('./Color'),
    ColorPalette: require('./ColorPalette'),
    strip: require('./strip')
};


},{"./CallbackStore":27,"./Color":28,"./ColorPalette":29,"./KeyCodes":30,"./MethodStore":31,"./ObjectManager":32,"./clone":33,"./flatClone":34,"./loadURL":36,"./strip":37}],36:[function(require,module,exports){
'use strict';

/**
 * Load a URL and return its contents in a callback
 *
 * @method loadURL
 *
 * @param {string} url URL of object
 * @param {function} callback callback to dispatch with content
 */
var loadURL = function loadURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function onreadystatechange() {
        if (this.readyState === 4) {
            if (callback) callback(this.responseText);
        }
    };
    xhr.open('GET', url);
    xhr.send();
};

module.exports = loadURL;

},{}],37:[function(require,module,exports){
'use strict';

/**
 * Removes all values not being of a primitive type from an arbitrary object
 * literal.
 *
 * @method strip
 * 
 * @param  {any}        primitive or (non-)serializable object without
 *                      circular references
 * @return {any}        primitive or (nested) object only containing primitive
 *                      types (serializable)
 */
function strip(obj) {
    switch (obj) {
        case null:
        case undefined:
            return obj;
    }
    switch (obj.constructor) {
        case Boolean:
        case Number:
        case String:
        case Symbol:
            return obj;
        case Object:
            for (var key in obj) {
                var stripped = strip(obj[key], true);
                obj[key] = stripped;
            }
            return obj;
        default:
            return null;
    }
}

module.exports = strip;

},{}],38:[function(require,module,exports){
'use strict';

var Transform = require('./Transform');

/**
 * Layout is often easily described in terms of "top left", "bottom right",
 * etc. Align is a way of defining an alignment relative to a bounding-box
 * given by a size. Align is given by an array [x, y, z] of proportions betwee
 * 0 and 1. The default value for the align is top left, or [0, 0, 0].
 *
 * @class Align
 * @constructor
 * @private
 */
function Align () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.transform = new Transform();
}

/**
 * Sets the alignment in x direction relative to its parent.
 *
 * @method setX
 * @chainable
 * 
 * @param {Number} x alignment in x direction
 * @return {Align} this
 */
Align.prototype.setX = function setX (x) {
    this.x = x;
    return this;
};

/**
 * Sets the alignment in y direction relative to its parent.
 *
 * @method setX
 * @chainable
 * 
 * @param {Number} y alignment in y direction
 * @return {Align} this
 */
Align.prototype.setY = function setY (y) {
    this.y = y;
    return this;
};

/**
 * Sets the alignment in z direction relative to its parent.
 *
 * @method setX
 * @chainable
 * 
 * @param {Number} z alignment in z direction
 * @return {Align} this
 */
Align.prototype.setZ = function setZ (z) {
    this.z = z;
    return this;
};

/**
 * Sets the alignment relative to its parent.
 *
 * @method set
 * @chainable
 * 
 * @param {Number} [x] alignment in x direction
 * @param {Number} [y] alignment in y direction
 * @param {Number} [z] alignment in z direction
 * @return {Align} this
 */
Align.prototype.set = function set (x, y, z) {
    this.x = x != null ? x : this.x;
    this.y = y != null ? y : this.y;
    this.z = z != null ? z : this.z;
    return this;
};

/**
 * Mutates the internal transform matrix according to the passed in size
 *
 * @method update
 * 
 * @param  {Number[]} size  3D size
 * @return {Transform}      internal Transform class
 */
Align.prototype.update = function update (size) {
    var x = size[0] * this.x;
    var y = size[1] * this.y;
    var z = size[2] * this.z;
    this.transform.setTranslation(x, y, z);
    return this.transform;
};

module.exports = Align;

},{"./Transform":54}],39:[function(require,module,exports){
'use strict';

/**
 * Equivalent of an Engine in the Worker Thread. Used to synchronize and manage
 * time across different Threads.
 *
 * @class  Clock
 * @constructor
 * @private
 */
function Clock () {
    this._updates = [];
    this._nextStepUpdates = [];
    this._time = null;
}

/**
 * Updates the internal clock time.
 *
 * @method  step
 * @chainable
 * 
 * @param  {Number} time unix timstamp
 * @return {Clock}       this
 */
Clock.prototype.step = function step (time) {
    this._time = time;

    for (var i = 0, len = this._updates.length ; i < len ; i++)
        this._updates[i].update(time);

    while (this._nextStepUpdates.length > 0) {
        this._nextStepUpdates.shift().update(time);
    }

    return this;
};

/**
 * Registers an object to be updated on every frame.
 * targets are expected to implement the `Updateable` interface, which means
 * they need an update method, which will be called with the new internal time.
 *
 * @method  update
 * @chainable
 * 
 * @param  {Object} target  Object having an `update` method
 * @return {Clock}          this
 */
Clock.prototype.update = function update (target) {
    this._updates.push(target);
    return this;
};

/**
 * Deregisters a previously using `update` registered object to be no longer
 * updated on every frame.
 *
 * @method  noLongerUpdate
 * @chainable
 * 
 * @param  {Object} target Object previously registerd using the `update` method
 * @return {Clock}         this
 */
Clock.prototype.noLongerUpdate = function noLongerUpdate(target) {
    var index = this._updates.indexOf(target);
    if (index > -1)
        this._updates.splice(index, 1);
    return this;
};

/**
 * Returns the internal clock time.
 *
 * @method  getTime
 * 
 * @return {Number} Unix timestamp
 */
Clock.prototype.getTime = function getTime () {
    return this._time;
};

/**
 * Registers object to be updated **once** on the next step. Regsitered
 * targets are not guaranteed to be unique, therefore multiple updates per
 * frame per object are possible.
 *
 * @method nextStep
 * @chainable
 * 
 * @param  {Object} target  Object having an `update` method.
 * @return {Clock}          this
 */
Clock.prototype.nextStep = function nextStep (target) {
    this._nextStepUpdates.push(target);
    return this;
};

module.exports = Clock;

},{}],40:[function(require,module,exports){
'use strict';

var Layer = require('./Layer');

/**
 * ComponentStore manages `components` and `renderables`. It also keeps track
 * of the size shared by all renderables managed by this ComponentStore.
 *
 * Every LocalDispatch has its own ComponentStore.
 *
 * @class ComponentStore
 * @constructor
 * @private
 */
function ComponentStore () {
    this._components = new Layer();
    this._renderables = new Layer();
    this._currentRenderableSize = [0, 0, 0];
}

/**
 * Clears all components by delegating to the layer they are being managed on.
 *
 * @method clearComponents
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.clearComponents = function clearComponents () {
    this._components.clear();
    return this;
};

/**
 * Clears all renderables by delegating to the layer they are being managed on.
 *
 * @method clearRenderables
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.clearRenderables = function clearRenderables () {
    this._renderables.clear();
    return this;
};

/**
 * Clears all components and renderables managed by this ComponentStore by
 * delegating to the respective layers.
 *
 * @method clear
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.clear = function clear () {
    return this.clearComponents().clearRenderables();
};

/**
 * @alias ComponentStore.prototype.clear
 */
ComponentStore.prototype.kill = ComponentStore.prototype.clear;

/**
 * Cleans the underlying layer responsible for maintaining components.
 *
 * @method cleanComponents
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.cleanComponents = function cleanComponents () {
    this._components.clean();
    return this;
};

/**
 * Cleans the underlying layer responsible for maintaining renderables.
 *
 * @method cleanRenderables
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.cleanRenderables = function cleanRenderables () {
    this._renderables.clean();
    return this;
};

/**
 * Cleans the renderables and components managed by this ComponentStore.
 *
 * @method clean
 * @chainable
 * 
 * @return {ComponentStore} this
 */
ComponentStore.prototype.clean = function clean () {
    return this.cleanComponents().cleanRenderables();
};

/**
 * Returns a new component id that can be used in order to register a new
 * component on the ComponentStore using `registerComponentAt`.
 *
 * @method requestComponentId
 * 
 * @return {Number} id that can be used to register a new component using
 *                     `registerComponentAt`
 */
ComponentStore.prototype.requestComponentId = function requestComponentId () {
    return this._components.requestId();
};

/**
 * Returns a new renderable id that can be used in order to register a new
 * renderable on the ComponentStore using `registerRenderableAt`.
 *
 * @method requestComponentId
 * 
 * @return {Number} id that can be used to register a new renderable using
 *                     `registerRenderableAt`
 */
ComponentStore.prototype.requestRenderableId = function requestRenderableId () {
    return this._renderables.requestId();
};

/**
 * Registers the passed in component on the ComponentStore at the specified id.
 *
 * @method  registerComponentAt
 * @chainable
 * 
 * @param  {Number} id              unique id, preferably previously retrieved using
 *                                  `requestComponentId`
 * @param  {Component} component    component to be registered
 * @return {ComponentStore}         this
 */
ComponentStore.prototype.registerComponentAt = function registerComponentAt (id, component) {
    this._components.registerAt(id, component);
    return this;
};

/**
 * Registers the passed in renderable on the ComponentStore at the specified
 * id.
 *
 * @method  registerRenderableAt
 * @chainable
 * 
 * @param  {Number} id              unique id, preferably previously retrieved using
 *                                  `requestRenderableId`
 * @param  {Component} component    renderable to be registered
 * @return {ComponentStore}         this
 */
ComponentStore.prototype.registerRenderableAt = function registerRenderableAt (id, renderable) {
    this._renderables.registerAt(id, renderable);
    return this;
};

/**
 * Dirties the component registered at the specified id.
 *
 * @method makeComponentDirtyAt
 * @chainable
 * 
 * @param  {Component} id   id at which the component has previously been
 *                          registered using `registerComponentAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.makeComponentDirtyAt = function makeComponentDirtyAt (id) {
    this._components.dirtyAt(id);
    return this;
};

/**
 * Dirties the renderable registered at the specified id.
 *
 * @method makeRenderableDirtyAt
 * @chainable
 * 
 * @param  {Component} id   id at which the renderable has previously been
 *                          registered using `registerComponentAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.makeRenderableDirtyAt = function makeRenderableDirtyAt (id) {
    this._renderables.dirtyAt(id);
    return this;
};

/**
 * Cleans the component registered at the specified id.
 *
 * @method  cleanComponentAt
 * @chainable
 * 
 * @param  {Component} id   id at which the component has previously been
 *                          registered using `registerComponentAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.cleanComponentAt = function cleanComponentAt (id) {
    this._components.cleanAt(id);
    return this;
};

/**
 * Cleans the renderable registered at the specified id.
 *
 * @method  cleanRenderableAt
 * @chainable
 * 
 * @param  {Renderable} id  id at which the renderable has previously been
 *                          registered using `registerRenderableAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.cleanRenderableAt = function cleanRenderableAt (id) {
    this._renderables.cleanAt(id);
    return this;
};

/**
 * Retrieves the component registered at the specified id.
 *
 * @method  getComponentAt
 * @chainable
 * 
 * @param  {Component} id   id at which the component has previously been
 *                          registered using `registerComponentAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.getComponentAt = function getComponentAt (id) {
    return this._components.getAt(id);
};

/**
 * Retrieves the renderable registered at the specified id.
 *
 * @method  getRenderableAt
 * @chainable
 * 
 * @param  {Renderable} id  id at which the renderable has previously been
 *                          registered using `registerRenderableAt`
 * @return {ComponentStore} this
 */
ComponentStore.prototype.getRenderableAt = function getRenderableAt (id) {
    return this._renderables.getAt(id);
};

/**
 * Retrieves all components registered on this ComponentStore.
 *
 * @method getComponents
 * 
 * @return {Components[]} set of all components that have previously been
 *                        registered on this ComponentStore
 */
ComponentStore.prototype.getComponents = function getComponents () {
    return this._components.get();
};

/**
 * Retrieves all renderables registered on this ComponentStore.
 *
 * @method getRenderable
 * 
 * @return {Renderables[]}  set of all renderables that have previously
 *                          been registered on this ComponentStore
 */
ComponentStore.prototype.getRenderables = function getRenderables () {
    return this._renderables.get();
};

/**
 * Determines and returns the absolute, three dimensional **pixel** size
 * allocated to renderables on this ComponentStore.
 *
 * @chainable
 * @method getRenderableSize
 * 
 * @return {Number[]} three dimensional **pixel** size in the format
 *                    `[width, height, depth]`
 */
ComponentStore.prototype.getRenderableSize = function getRenderableSize () {
    var renderables = this._renderables.get();
    var i = 0;
    var len = renderables.length;
    var size;
    this._currentRenderableSize[0] = 0;
    this._currentRenderableSize[1] = 0;
    this._currentRenderableSize[2] = 0;
    for (; i < len ; i++) {
        size = renderables[i].getSize();
        this._currentRenderableSize[0] = size[0] > this._currentRenderableSize[0] ? size[0] : this._currentRenderableSize[0];
        this._currentRenderableSize[1] = size[1] > this._currentRenderableSize[1] ? size[1] : this._currentRenderableSize[1];
        this._currentRenderableSize[2] = size[2] > this._currentRenderableSize[2] ? size[2] : this._currentRenderableSize[2];
    }
    return this._currentRenderableSize;
};

module.exports = ComponentStore;

},{"./Layer":44}],41:[function(require,module,exports){
'use strict';

var Node = require('./Node');
var RenderProxy = require('./RenderProxy');

var Famous = require('./Famous');

/**
 * Context is the top-level node in the scene graph (= tree node).
 * As such, it populates the internal MessageQueue with commands received by
 * subsequent child-nodes. The Context is being updated by the Clock on every
 * FRAME and therefore recursively updates the scene grpah.
 *
 * @class  Context
 * @constructor
 * 
 * @param {String} selector     query selector used to 
 */
function Context (selector) {
    this._messageQueue = Famous.getMessageQueue();
    this._globalDispatch = Famous.getGlobalDispatch();
    this._clock = Famous.getClock();

    this._clock.update(this);

    this.proxy = new RenderProxy(this);
    this.node = new Node(this.proxy, this._globalDispatch);
    this.selector = selector;
    this.dirty = true;
    this.dirtyQueue = [];

    this._messageQueue.enqueue('NEED_SIZE_FOR').enqueue(selector);
    this._globalDispatch.targetedOn(selector, 'resize', this._receiveContextSize.bind(this));
}

/**
 * Adds a child to the internal list of child-nodes.
 *
 * @method addChild
 * @chainable
 *
 * @return {Context}    this
 */
Context.prototype.addChild = function addChild () {
    return this.node.addChild();
};

/**
 * Removes a node returned by `addChild` from the Context's immediate children.
 *
 * @method  removeChild
 * @chainable
 * 
 * @param  {Node} node   node to be removed
 * @return {Context}     this
 */
Context.prototype.removeChild = function removeChild (node) {
    this.node.removeChild(node);
    return this;
};

/**
 * Recursively updates all children.
 *
 * @method  update
 * @chainable
 * 
 * @return {Context}    this
 */
Context.prototype.update = function update () {
    this.node.update();
    return this;
};

/**
 * Returns the selector the Context is attached to. Terminates recursive
 * `getRenderPath` scheduled by `RenderProxy`.
 *
 * @method  getRenderPath
 * @private
 * 
 * @return {String} selector
 */
Context.prototype.getRenderPath = function getRenderPath () {
    return this.selector;
};

/**
 * Appends the passed in command to the internal MessageQueue, thus scheduling
 * it to be sent to the Main Thread on the next FRAME.
 *
 * @method  receive
 * @chainable
 * 
 * @param  {Object} command command to be enqueued
 * @return {Context}        Context
 */
Context.prototype.receive = function receive (command) {
    if (this.dirty) this.dirtyQueue.push(command);
    else this._messageQueue.enqueue(command);
    return this;
};

/**
 * Method being executed whenever the context size changes.
 *
 * @method  _receiveContextSize
 * @chainable
 * @private
 * 
 * @param  {Array} size  new context size in the format `[width, height]`
 * @return {Context}     this
 */
Context.prototype._receiveContextSize = function _receiveContextSize (size) {
    this.node
        .getDispatch()
        .getContext()
        .setAbsolute(size[0], size[1], 0);

    if (this.dirty) {
        this.dirty = false;
        for (var i = 0, len = this.dirtyQueue.length ; i < len ; i++) this.receive(this.dirtyQueue.shift());
    }

    return this;
};

module.exports = Context;
},{"./Famous":42,"./Node":48,"./RenderProxy":52}],42:[function(require,module,exports){
'use strict';

/* global self, console */

var Clock = require('./Clock');
var GlobalDispatch = require('./GlobalDispatch');
var MessageQueue = require('./MessageQueue');

var isWorker = self.window !== self;

/**
 * Famous is the toplevel object being exposed as a singleton inside the Web
 * Worker. It holds a reference to a Clock, MessageQueue and triggers events
 * on the GlobalDispatch. Incoming messages being sent from the Main Thread
 * are defined by the following production rules (EBNF):
 *
 * message = { commmand }
 * command = frame_command | with_command
 * frame_command = "FRAME", unix_timestamp
 * with_command = selector, { action }
 * action = "TRIGGER", event_type, event_object
 * 
 * @class  Famous
 * @constructor
 * @private
 */
function Famous() {
    this._globalDispatch = new GlobalDispatch();
    this._clock = new Clock();
    this._messageQueue = new MessageQueue();

    var _this = this;
    if (isWorker) {
        self.addEventListener('message', function(ev) {
            _this.postMessage(ev.data);
        });
    }
}

/**
 * Updates the internal Clock and flushes (clears and sends) the MessageQueue
 * to the Main Thread. step(time) is being called every time the Worker
 * receives a FRAME command.
 *
 * @method  step
 * @chainable
 * @private
 * 
 * @param  {Number} time Unix timestamp
 * @return {Famous}      this
 */
Famous.prototype.step = function step (time) {
    this._clock.step(time);

    var messages = this._messageQueue.getAll();
    if (messages.length) {
        if (isWorker) self.postMessage(messages);
        else this.onmessage(messages);
    }
    this._messageQueue.clear();
    return this;
};

/**
 * postMessage(message) is being called every time the Worker Thread receives a
 * message from the Main Thread. `postMessage` is being used as a method name
 * to expose the same API as an actual Worker would. This drastically reduces
 * the complexity of maintaining a workerless build.
 *
 * @method  postMessage
 * @chainable
 * @public
 * 
 * @param  {Array} message  incoming message containing commands
 * @return {Famous}         this
 */
Famous.prototype.postMessage = function postMessage (message) {
    while (message.length > 0) {
        var command = message.shift();
        switch (command) {
            case 'WITH':
                this.handleWith(message);
                break;
            case 'FRAME':
                this.handleFrame(message);
                break;
            default:
                console.error('Unknown command ' + command);
                break;
        }
    }
    return this;
};

/**
 * Handles the FRAME command by removing FRAME and the unix timstamp from the
 * incoming message.
 *
 * @method handleFrame
 * @chainable
 * @private
 * 
 * @param  {Array} message  message as received as a Worker message
 * @return {Famous}         this
 */
Famous.prototype.handleFrame = function handleFrame (message) {
    this.step(message.shift());
    return this;
};

/**
 * Handles the WITH (and TRIGGER) command. Triggers the respective targeted
 * callbacks of the internal GlobalDispatch.
 *
 * @method  handleWith
 * @chainable
 * @private
 * 
 * @param  {Array} message  message as received as a Worker message
 * @return {Famous}         this
 */
Famous.prototype.handleWith = function handleWith (message) {
    var path = message.shift();
    var command = message.shift();

    switch (command) {
        case 'TRIGGER':
            var type = message.shift();
            var ev = message.shift();
            this._globalDispatch.targetedTrigger(path, type, ev);
            break;
        default:
            console.error('Unknown command ' + command);
            break;
    }
    return this;
};

/**
 * Intended to be overridden by the ThreadManager to maintain compatibility
 * with the Web Worker API.
 * 
 * @method onmessage
 * @override
 * @public
 */
Famous.prototype.onmessage = function onmessage (message) {};

// Use this when deprecation of `new Context` pattern is complete
// Famous.prototype.createContext = function createContext (selector) {
//     var context = new Context(selector, this._globalDispatch);
//     this._contexts.push(context);
//     this._clock.update(context);
//     return context;
// };

/**
 * Returns the internal Clock, which can be used to schedule updates on a
 * frame-by-frame basis.
 * 
 * @method getClock
 * @public
 * 
 * @return {Clock} internal Clock
 */
Famous.prototype.getClock = function getClock () {
    return this._clock;
};

/**
 * Returns the internal MessageQueue, which can be used to schedule messages
 * to be sent on the next tick.
 *
 * @method  getMessageQueue
 * @public
 * 
 * @return {MessageQueue} internal MessageQueue
 */
Famous.prototype.getMessageQueue = function getMessageQueue () {
    return this._messageQueue;
};

/**
 * Returns the interal GlobalDispatch, which can be used to register event
 * listeners for global (same depth) or targeted (same path) events.
 *
 * @method  getGlobalDispatch
 * @public
 * 
 * @return {GlobalDispatch} internal GlobalDispatch
 */
Famous.prototype.getGlobalDispatch = function getGlobalDispatch () {
    return this._globalDispatch;
};

Famous.prototype.proxyOn = function proxyOn(target, type, callback) {
    this._globalDispatch.targetedOn(target, type, callback);

    this._messageQueue.enqueue('PROXY');
    this._messageQueue.enqueue(target);
    this._messageQueue.enqueue(type);
};

module.exports = new Famous();

},{"./Clock":39,"./GlobalDispatch":43,"./MessageQueue":46}],43:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

/**
 * GlobalDispatch is being used in order to manage scene graph events. It
 * routes and manages events being registered on specific nodes, but also
 * provides the possibility to globally register event listeners on the
 * whole scene graph.
 *
 * @class  GlobalDispatch
 * @constructor
 * @private
 */
function GlobalDispatch () {
    this._targetedCallbacks = {};
    this._globalCallbacks = [];
}

/**
 * Triggers the `event` defined by `key` (type of event) on a Node in the
 * scene graph hierarchy defined as a series of RenderProxy id's composing the
 * path exactly that Node.
 *
 * @method targetedTrigger
 * @chainable
 * 
 * @param  {String} path    path to the respective Node in the scene graph
 *                          defined as series of RenderProxy ids.
 * @param  {String} key     arbitrary event type (e.g. "click", "move")
 * @param  {Object} ev      event object
 * @return {GlobalDispatch} this    
 */
GlobalDispatch.prototype.targetedTrigger = function targetedTrigger(path, key, ev) {
    if (this._targetedCallbacks[path]) this._targetedCallbacks[path].trigger(key, ev);
    return this;
};

/**
 * Registers an event listener for an event being emitted on a specific node in
 * the scene graph hierarchy.
 *
 * @method targetedOn
 * @chainable
 * 
 * @param  {String} path    path to the respective Node in the scene graph
 *                          defined as series of RenderProxy ids.
 * @param  {String} key     arbitrary event type (e.g. "click", "move")
 * @param  {Function} cb    callback function to be invoked whenever the event
 *                          defined by `path` and `key` is being triggered.
 * @return {GlobalDispatch} this
 */
GlobalDispatch.prototype.targetedOn = function targetedOn (path, key, cb) {
    if (!this._targetedCallbacks[path]) this._targetedCallbacks[path] = new CallbackStore();
    this._targetedCallbacks[path].on(key, cb);
    return this;
};

/**
 * Removes a previously via `targetedOn` registered event listener,
 *
 * @method targetedOff
 * @chainable
 * 
 * @param  {String} path    path to the respective Node in the scene graph
 *                          defined as series of RenderProxy ids.
 * @param  {String} key     arbitrary event type (e.g. "click", "move")
 * @param  {Function} cb    previously via `targetedOn` registered callback function
 * @return {GlobalDispatch} this
 */
GlobalDispatch.prototype.targetedOff = function targetedOff (path, key, cb) {
    if (!this._targetedCallbacks[path]) this._targetedCallbacks[path].off(key, cb);
    return this;
};

/**
 * Globally registers an event listener. Listeners registerd using this method
 * can not be triggered by their path, but only globally by the event they
 * have been registered on.
 *
 * @method  globalOn
 * @chainable
 * 
 * @param  {String} path    path to the respective Node in the scene graph
 *                          defined as series of RenderProxy ids. This will
 *                          only be used in order to extract `depth` of this
 *                          Node in the scene graph.
 * @param  {String}   key   arbitrary event type (e.g. "click", "move")
 * @param  {Function} cb    callback function to be called whenever an event
 *                          in the SceneGraph 
 * @return {GlobalDispatch} this
 */
GlobalDispatch.prototype.globalOn = function globalOn (path, key, cb) {
    var depth = path.split('/').length;
    if (!this._globalCallbacks[depth]) this._globalCallbacks[depth] = new CallbackStore();
    this._globalCallbacks[depth].on(key, cb);
    return this;
};

// TODO @dan Do we need this?
// FIXME different path, same depth, same callback -> would deregister cb

/**
 * Removed an event listener that has previously been registered using
 * `globalOn`.
 *
 *
 * @method  globalOn
 * @chainable
 * 
 * @param  {String}   path  path to the respective node the listener has been
 *                          registered on. Used inly to extract the `depth`
 *                          from it.
 * @param  {String}   key   event type used for registering the event listener
 * @param  {Function} cb    registered callback function
 * @return {GlobalDispatch} this
 */
GlobalDispatch.prototype.globalOff = function globalOff (path, key, cb) {
    var depth = path.split('/').length;
    if (this._globalCallbacks[depth]) this._globalCallbacks[depth].off(key, cb);
    return this;
}

/**
 * Triggers all global event listeners registered on the specified type.
 *
 * @method  emit
 * @chainable
 * 
 * @param  {String} key     event type
 * @param  {Object} ev      event object
 * @return {GlobalDispatch} this
 */
GlobalDispatch.prototype.emit = function emit (key, ev) {
    for (var i = 0, len = this._globalCallbacks.length ; i < len ; i++)
        if (this._globalCallbacks[i])
            this._globalCallbacks[i].trigger(key, ev);
    return this;
};

module.exports = GlobalDispatch;

},{"famous-utilities":35}],44:[function(require,module,exports){
'use strict';

/**
 * Layers manage a set of components or renderables.
 * Components are expected to expose a `kill` method. Optionally they can
 * expose a clean method which will be called as soon as the layer they are
 * registered on is being cleaned and they are being dirty.
 *
 * @class  Layer
 * @constructor
 * @private
 */
function Layer () {
    this._components = [];
    this._componentIsDirty = [];
}


/**
 * Clears all components by `kill`ing all components having `kill` set to a
 * truthy value and removing them from the Layer.
 * 
 * @method clear
 * @chainable
 * 
 * @return {Layer} this
 */
Layer.prototype.clear = function clear () {
    var components = this._components;
    var componentIsDirty = this._componentIsDirty;
    var i = 0;
    var len = components.length;
    var component;
    for (; i < len ; i++) {
        component = components.shift();
        componentIsDirty.shift();
        if (component.kill) component.kill();
    }
    return this;
};

/**
 * Returns an id which can be used in order to register a new component using
 * `registerAt`.
 *
 * @method  requestId
 * @chainable
 * 
 * @return {Number} new id
 */
Layer.prototype.requestId = function requestId () {
    return this._components.length;
};

/**
 * Registers the passed in component on the specified id. Does not dirty the
 * component.
 *
 * @method  registerAt
 * @chainable
 * 
 * @param  {Number} id              id to register component ad
 * @param  {Renderable|Component}   component or renderable to be registered
 * @return {Layer}                  this
 */
Layer.prototype.registerAt = function registerAt (id, component) {
    this._components[id] = component;
    this._componentIsDirty[id] = false;
    return this;
};

/**
 * Dirties the component regsitered at the specified id.
 *
 * @method  dirtyAt
 * @chainable
 * 
 * @param  {Number} id internal id of the component to be dirtied
 * @return {Layer}     this
 */
Layer.prototype.dirtyAt = function dirtyAt (id) {
    this._componentIsDirty[id] = true;
    return this;
};

/**
 * Cleans the component registered at the specified id.
 *
 * @method  cleanAt
 * @chainable
 * 
 * @param  {Number} id  internal id of the component to be cleaned
 * @return {Layer}      this
 */
Layer.prototype.cleanAt = function cleanAt (id) {
    this._componentIsDirty[id] = this._components[id].clean ? this._components[id].clean() : true;
    return this;
};

/**
 * Cleans all previously dirtied components.
 *
 * @method  clean
 * @chainable
 * 
 * @return {Layer} this
 */
Layer.prototype.clean = function clean () {
    var i = 0;
    var len = this._components.length;
    for (; i < len ; i++) if (this._componentIsDirty[i]) this.cleanAt(i);
    return this;
};

/**
 * Returns the component registered at the specified id.
 *
 * @method  getAt
 * @chainable
 * 
 * @param  {Number} id                          internal id of the requested component
 * @return {Renderable|Component|undefined}     registered component (if any)
 */
Layer.prototype.getAt = function getAt (id) {
    return this._components[id];
};

/**
 * Returns set of all registered components.
 *
 * @method  get
 * 
 * @return {Array} array of previously registered components
 */
Layer.prototype.get = function get () {
    return this._components;
};

module.exports = Layer;

},{}],45:[function(require,module,exports){
'use strict';

var RenderContext = require('./RenderContext');
var ComponentStore = require('./ComponentStore');
var RenderProxy = require('./RenderProxy');

/**
 * As opposed to a Node, a LocalDispatch does not define hierarchical
 * structures within the scene graph. Thus removing the need to manage
 * children, but at the same time requiring the Node to delegate updates to its
 * own LocalDispatch and all subsequent Nodes.
 *
 * The primary responsibilty of the LocalDispatch is to provide the ability to
 * register events on a specific Node ("targeted events"), without inducing the
 * complexity of determining the Nodes location within the scene graph.
 *
 * It also holds a reference to a RenderContext, therefore being required to
 * delegate invocations of its update function to its RenderContext, which
 * consequently mutates the actual 3D transform matrix associated with the
 * Node.
 *
 * @class  LocalDispatch
 * @constructor
 * 
 * @param {Node} node           Node being managed by the LocalDispatch.
 * @param {RenderProxy} proxy   RenderProxy associated with the managed Node's
 *                              parent.
 */
function LocalDispatch (node, proxy) {
    this._renderProxy = new RenderProxy(proxy);
    this._context = new RenderContext(this);
    this._componentStore = new ComponentStore(this);
    this._node = node;
}

/**
 * Kills the componentstore of the LocalDispatchm therefore killing all
 * Renderables and Components registered for the managed node.
 *
 * @method kill
 * @chainable
 * 
 * @return {LocalDispatch} this
 */
LocalDispatch.prototype.kill = function kill () {
    this._componentStore.kill();
    return this;
};

/**
 * Returns the managed Node.
 *
 * @method getNode
 * 
 * @return {Node} managed Node
 */
LocalDispatch.prototype.getNode = function getNode () {
    return this._node;
};

/**
 * Retrieves the RenderContext managed by the LocalDispatch.
 *
 * @method getContext
 * 
 * @return {RenderContext}  RenderContext managed by the LocalDispatch
 */
LocalDispatch.prototype.getContext = function getContext () {
    return this._context;
};

/**
 * Returns the RenderPath uniquely identifiying the Node managed by the
 * LocalDispatch in the scene graph.
 *
 * @method getRenderPath
 * 
 * @return {String} RenderPath encoded as a string (e.g. "body/1/2/3")
 */
LocalDispatch.prototype.getRenderPath = function getRenderPath () {
    return this._renderProxy.getRenderPath();
};

/**
 * Returns the RenderProxy managed by the LocalDispatch.
 *
 * @method getRenderProxy
 * 
 * @return {RenderProxy} RenderProxy managed by the LocalDispatch.
 */
LocalDispatch.prototype.getRenderProxy = function getRenderProxy () {
    return this._renderProxy;
};

/**
 * Registers an event listener to be triggered whenever the specified event is
 * being triggered on the path defined by the RenderProxy attached to the
 * LocalDispatch describing the Node's location in the Scene graph.
 *
 * @method registerTargetedEvent
 * @chainable
 * 
 * @param  {String}   event event type to listen on
 * @param  {Function} cb    event listener to be invoked whenever the event
 *                          is being triggered
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.registerTargetedEvent = function registerTargetedEvent (event, cb) {
    this._node._globalDispatch.targetedOn(this.getRenderPath(), event, cb);
    return this;
};

/**
 * Register a global event event listener to be triggered whenever the
 * specified event is being triggered. Global in the context of events being
 * emitted in the scene graph means events being emitted on the same depth as
 * the Node.
 * 
 * @method registerGlobalEvent
 * @chainable
 * 
 * @param  {String}   event event type to listen on
 * @param  {Function} cb    event listener to be invoked whenever the event
 *                          is being triggered
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.registerGlobalEvent = function registerGlobalEvent (event, cb) {
    this._node._globalDispatch.globalOn(this.getRenderPath(), event, cb);
    return this;
};

/**
 * Deregisters a global event listener that has previously been registered
 * using `registerGlobalEvent`.
 *
 * @method deregisterGlobalEvent
 * @chainable
 * 
 * @param  {String}   event event type to listen on
 * @param  {Function} cb    event listener to be invoked whenever the event
 *                          is being triggered
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.deregisterGlobalEvent = function deregisterGlobalEvent (event, cb) {
    this._node._globalDispatch.globalOff(this.getRenderPath(), event, cb);
    return this;
};

/**
 * Triggers an event on the Node attached to the LocalDispatch. Events are
 * being managed by the GlobalDispatch.
 *
 * 
 * @param  {String} event   event type to listen on
 * @param  {Object} payload event payload object to be passed in to every
 *                          callback function attached to the specified event
 *                          type
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.emit = function emit (event, payload) {
    this._node._globalDispatch.emit(event, payload);
    return this;
};

/**
 * Cleans all components associated with this component store.
 *
 * @method cleanCompoents
 * @chainable
 * 
 * @return {LocalDispatch} this
 */
LocalDispatch.prototype.cleanComponents = function cleanComponents () {
    this._componentStore.cleanComponents();
    return this;
};

/**
 * Cleans (updates) the RenderContext attached to this LocalDispatch.
 *
 * @method cleanRenderContext
 * @chainable
 * 
 * @param  {RenderContext} parentNode   parent RenderContext
 * @return {LocalDispatch}              this
 */
LocalDispatch.prototype.cleanRenderContext = function cleanRenderContext (parentNode) {
    this._context.update(parentNode ? parentNode.getDispatch()._context : void 0);
    return this;
};

/**
 * Cleans the underlying Layer managing renderables indirectly attached to the
 * LocalDispatch.
 *
 * @method cleanRenderables
 * @chainable
 * 
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.cleanRenderables = function cleanRenderables () {
    this._componentStore.cleanRenderables();
    return this;
};

/**
 * Adds a component to the underlying ComponentStore.
 *
 * @method addComponent
 * @chainable
 * 
 * @param {Component} component component to be added
 * @return {Number} id          id the component has been registered at on the
 *                              underlying ComponentStore
 */
LocalDispatch.prototype.addComponent = function addComponent (component) {
    var store = this._componentStore;
    var id = store.requestComponentId();
    store.registerComponentAt(id, component);
    return id;
};

/**
 * Dirties the component registered at the specified id.
 * The id has typically been obtained using a previous invocation of
 * `addComponent`.
 *
 * @method dirtyComponent
 * @chainable
 * 
 * @param  {Number} id      id obtained via `addComponent`
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.dirtyComponent = function dirtyComponent (id) {
    this._componentStore.makeComponentDirtyAt(id);
    return this;
};

/**
 * Adds a renderable to the underlying ComponentStore.
 *
 * @method addRenderable
 * @chainable
 * 
 * @param {Renderable} renderable   renderable to be added
 * @return {Number} id              id the component has been registered at on the
 *                                  underlying ComponentStore
 */
LocalDispatch.prototype.addRenderable = function addRenderable (renderable) {
    var store = this._componentStore;
    var id = store.requestRenderableId();
    store.registerRenderableAt(id, renderable);
    return id;
};

/**
 * Dirties the renderable registered at the specified id.
 *
 * @method dirtyRenderable
 * @chainable
 * 
 * @param  {Number} id      id obtained via `addRenderable`
 * @return {LocalDispatch}  this
 */
LocalDispatch.prototype.dirtyRenderable = function dirtyRenderable (id) {
    this._componentStore.makeRenderableDirtyAt(id);
    return this;
};

// @dan TODO -> RenderContext Can we remove this redundancy?

LocalDispatch.prototype.onTransformChange = function onTransformChange (cb) {
    this._context.onTransformChange(cb);
    return this;
};

LocalDispatch.prototype.onSizeChange = function onSizeChange (cb) {
    this._context.onSizeChange(cb);
    return this;
};

LocalDispatch.prototype.onOriginChange = function onOriginChange (cb) {
    this._context.onOriginChange(cb);
    return this;
};

LocalDispatch.prototype.onOpacityChange = function onOpacityChange (cb) {
    this._context.onOpacityChange(cb);
    return this;
};

LocalDispatch.prototype.sendDrawCommand = function sendDrawCommand (command) {
    this._renderProxy.receive(command);
    return this;
};

LocalDispatch.prototype.setAbsolute = function setAbsolute (x, y, z) {
    this._context.setAbsolute(x, y, z);
    return this;
};

LocalDispatch.prototype.setDifferential = function setDifferential (x, y, z) {
    this._context.setDifferential(x, y, z);
    return this;
};

LocalDispatch.prototype.setProportions = function setProportions (x, y, z) {
    this._context.setProportions(x, y, z);
    return this;
};

LocalDispatch.prototype.getTotalRenderableSize = function getTotalRenderableSize () {
    return this._componentStore.getRenderableSize();
};

LocalDispatch.prototype.getRenderables = function getRenderables () {
    return this._componentStore.getRenderables();
};

LocalDispatch.prototype.hasRenderables = function hasRenderables () {
    return !!this._componentStore.getRenderables().length;
};

LocalDispatch.prototype.dirtyRenderContext = function dirtyRenderContext () {
    this._context.dirty();
    return this;
};

LocalDispatch.prototype.update = function update (parent) {
    this.cleanComponents()
        .cleanRenderContext(parent)
        .cleanRenderables();
    return this;
};

module.exports = LocalDispatch;

},{"./ComponentStore":40,"./RenderContext":51,"./RenderProxy":52}],46:[function(require,module,exports){
'use strict';

/**
 * Used for scheduling messages to be sent on the next FRAME.
 * The MessageQueue is being cleared after each `postMessage` in the `Famous`
 * singleton.
 *
 * @class  MessageQueue
 * @constructor
 * @private
 */
function MessageQueue() {
    this._messages = [];
}

/**
 * Pushes a message to the end of the queue to be sent on the next FRAME.
 *
 * @method  enqueue
 * @chainable
 * 
 * @param  {Object} message message to be appended to the queue
 * @return {MessageQueue}   this
 */
MessageQueue.prototype.enqueue = function enqueue (message) {
    this._messages.push(message);
    return this;
};

/**
 * Returns an array of all messages currently scheduled for the next FRAME.
 *
 * @method  getAll
 * @chainable
 * 
 * @return {MessageQueue} this
 */
MessageQueue.prototype.getAll = function getAll () {
    return this._messages;
};

/**
 * Empties the queue.
 *
 * @method  clear
 * @chainable
 * 
 * @return {MessageQueue} this
 */
MessageQueue.prototype.clear = function clear() {
    this._messages.length = 0;
    return this;
};

module.exports = MessageQueue;


},{}],47:[function(require,module,exports){
'use strict';

var Align = require('./Align');

/**
 * @class MountPoint
 * @extends {Align}
 * @constructor
 * @private
 */
function MountPoint () {
    Align.call(this);
}

MountPoint.prototype = Object.create(Align.prototype);
MountPoint.prototype.constructor = MountPoint;

MountPoint.prototype.update = function update (size) {
    var x = size[0] * -this.x;
    var y = size[1] * -this.y;
    var z = size[2] * -this.z;
    this.transform.setTranslation(x, y, z);
    return this.transform;
};

module.exports = MountPoint;

},{"./Align":38}],48:[function(require,module,exports){
'use strict';

var LocalDispatch = require('./LocalDispatch');

/**
 * Nodes define hierarchy in the scene graph.
 *
 * @class  Node
 * @constructor
 * 
 * @param {RenderProxy}     [proxy]             proxy used for creating a new
 *                                              LocalDispatch if none has been provided
 * @param {GlobalDispatch}  globalDispatch      GlobalDispatch consecutively
 *                                              passed down from the Context
 * @param {LocalDispatch}   [localDispatch]     LocalDispatch
 */
function Node (proxy, globalDispatch, localDispatch) {
    this._localDispatch = localDispatch != null ? localDispatch : new LocalDispatch(this, proxy);
    this._globalDispatch = globalDispatch;
    this._children = [];
}

/**
 * Adds a child at the specified index. If index is `undefined`, the child
 * will be pushed to the end of the internal children array.
 *
 * @method  addChild
 * @chainable
 * 
 * @param   {Number} [index]    index the child should be inserted at
 * @return  {Node} added        new child node
 */
Node.prototype.addChild = function addChild (index) {
    var child = new this.constructor(this._localDispatch.getRenderProxy(), this._globalDispatch);
    if (index == null) this._children.push(child);
    else this._children.splice(index, 0, child);
    return child;
};

/**
 * Removes the passed in node from the node's children. If the node is not an
 * immediate child of the node the method is being called on, the method will
 * fail silently.
 *
 * @method  removeChild
 * @chainable
 * 
 * @param  {Node} node   child node to be removed
 * @return {Node}        this
 */
Node.prototype.removeChild = function removeChild (node) {
    var index = this._children.indexOf(node);
    if (index !== -1) {
        var result = this._children.splice(index, 1);
        result[0].kill();
    }
    return this;
};

/**
 * Removes the child node at the specified index. E.g. removeChild(0) removes
 * the node's first child, which consequently changes all remanining indices.
 *
 * @method  removeChildAtIndex
 * @chainable
 * 
 * @param  {Number} index index of the node to be removed in the internal
 *                        children array
 * @return {Node}       this
 */
Node.prototype.removeChildAtIndex = function removeChildAtIndex (index) {
    var result = this._children.splice(index, 1);
    if (result.length) result[0].kill();
    return this;
};

/**
 * Removes all children attached to this node.
 *
 * @method  removeAllChildren
 * @chainable
 * 
 * @return {Node} this
 */
Node.prototype.removeAllChildren = function removeAllChildren () {
    for (var i = 0, len = this._children.length ; i < len ; i++) {
        this._children.pop().kill();
    }
    return this;
};

/**
 * Kills the Node by killing its local dispatch and removing all its children.
 * Used internally whenever a child is being removed.
 * 
 * @method  kill
 * @chainable
 * @private
 * 
 * @return {Node} this
 */
Node.prototype.kill = function kill () {
    this._localDispatch.kill();
    this.removeAllChildren();
    return this;
};

/**
 * Returns the local dispatch attached to this node.
 *
 * @method  getDispatch
 * 
 * @return {LocalDispatch} dispatch
 */
Node.prototype.getDispatch = function getDispatch () {
    return this._localDispatch;
};


/**
 * Returns the Node's children.
 *
 * @method getChildren
 * 
 * @return {Node[]} children of this Node
 */
Node.prototype.getChildren = function getChildren () {
    return this._children;
};

/**
 * Recursively updates the node and all its children.
 *
 * @method  update
 * @chainable
 * 
 * @param  {Node} parent    parent node
 * @return {Node}           this
 */
Node.prototype.update = function update (parent) {
    this._localDispatch.update(parent);
    for (var i = 0, len = this._children.length ; i < len ; i++)
        this._children[i].update(this);
    return this;
};

module.exports = Node;

},{"./LocalDispatch":45}],49:[function(require,module,exports){
'use strict';

/**
 * Initilizes the Opacity primitive by settings its value to 1 (default value).
 * Hierarchically setting opacity does not affect the final, local opacity
 * being returned. Rather, this functionality needs to be implemented in the
 * corresponding render targets (e.g. DOM has blending by default).
 *
 * @class Opacity
 * @private
 * @constructor
 */
function Opacity () {
    this.value = 1;
    this.isActive = false;
    this.dirty = false;
}

/**
 * Sets, activates and dirties the internal notion of opacity being read by the
 * RenderContext.
 *
 * @method set
 * @chainable
 * @private
 * 
 * @param {Opacity} value new opacity to be set
 */
Opacity.prototype.set = function set (value) {
    this.isActive = true;
    if (this.value !== value && value != null) {
        this.value = value;
        this.setDirty();
    }
    return this;
};

/**
 * Dirties the opacity.
 * This forces the RenderContext to trigger the `opacity` event on the next
 * invocation of the `update` method on RenderContext.
 *
 * @method setDirty
 * @chainable
 * @private
 *
 * @return {Opacity} this
 */
Opacity.prototype.setDirty = function setDirty () {
    this.dirty = true;
    return this;
};

/**
 * Cleans the opacity. This sets its dirty flag to `false`, thus no longer
 * reading it in `update` of the RenderContext.
 *
 * @method clean
 * @chainable
 * @private
 * 
 * @return {Opacity} this
 */
Opacity.prototype.clean = function clean () {
    this.dirty = false;
    return this;
};

module.exports = Opacity;

},{}],50:[function(require,module,exports){
'use strict';

/**
 * The origin primitive defines the relative position of a point within a
 * RenderContext that should be used to apply further transformations on.
 * 
 * @private
 * @class  Origin
 * @constructor
 */
function Origin () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.isActive = false;
    this.dirty = false;
}

/**
 * Internal helper method used for setting the origin without marking it as active.
 *
 * @method _setWithoutActivating
 * @private
 * @chainable
 * 
 * @param {Number|null} x relative position to RenderContext in interval [0, 1]
 * @param {Number|null} y relative position to RenderContext in interval [0, 1]
 * @param {Number|null} z relative position to RenderContext in interval [0, 1]
 */
Origin.prototype._setWithoutActivating = function _setWithoutActivating (x, y, z) {
    this.set(x, y, z);
    this.isActive = false;
    return this;
};

/**
 * Sets the relative position of the origin.
 *
 * @method  set
 * @private
 * @chainable
 * 
 * @param {Number} x relative position to RenderContext in interval [0, 1]
 * @param {Number} y relative position to RenderContext in interval [0, 1]
 * @param {Number} z relative position to RenderContext in interval [0, 1]
 */
Origin.prototype.set = function set (x, y, z) {
    this.isActive = true;
    if (this.x !== x && x != null) {
        this.x = x;
        this.setDirty();
    }
    if (this.y !== y && y != null) {
        this.y = y;
        this.setDirty();
    }
    if (this.z !== z && z != null) {
        this.z = z;
        this.setDirty();
    }
    return this;
};

/**
 * Dirties the origin by setting its `dirty` property to true. `origin.dirty`
 * will be read by the `LocalDispatch` on the next update.
 *
 * @method  setDirty
 * @chainable
 * @private
 *
 * @return {Origin} this
 */
Origin.prototype.setDirty = function setDirty () {
    this.dirty = true;
    return this;
};

/**
 * Cleans the Origin by setting its `dirty` property to `false`. This prevents
 * the origin from being read on the next update by the `LocalDispatch`.
 *
 * @method clean
 * @chainable
 * @private
 * 
 * @return {Origin} this
 */
Origin.prototype.clean = function clean () {
    this.dirty = false;
    return this;
};

module.exports = Origin;

},{}],51:[function(require,module,exports){
'use strict';

var Transform = require('./Transform');
var Origin = require('./Origin');
var MountPoint = require('./MountPoint');
var Align = require('./Align');
var Opacity = require('./Opacity');
var CallbackStore = require('famous-utilities').CallbackStore;
var Size = require('./Size');

var CHANGE = 'change';
var TRANSFORM = 'transform';
var SIZE = 'size';
var ORIGIN = 'origin';
var OPACITY = 'opacity';

/**
 * A RenderContext does not have a notion of a nested scene graph hierarchy.
 * Its sole purpose it to manage the `origin`, `opacity`, `mountPoint`,
 * `align` and `size` primitives primitives by updating its internal transform
 * matrix.
 *
 * The RenderContext is being created by a LocalDisaptch, which delegates to
 * the RenderContext's update method on every `FRAME` in order to apply
 * corresponding updates to the transform matrix attached to the node and all
 * its children. While the scene graph is being traversed recursively, the RenderContext
 * does not have a notion of children. Instead, the Node recursively updates
 * its LocalDispatch (and therefore its RenderContext) and all its children.
 * 
 * @class RenderContext
 * @constructor
 * @private
 * 
 * @param {LocalDisaptch} dispatch
 */
function RenderContext (dispatch) {
    this._origin = new Origin(this);
    this._opacity = new Opacity(this);
    this._mountPoint = new MountPoint(this);
    this._align = new Align(this);
    this._transform = new Transform(this);
    this._size = new Size(this);
    this._events = new CallbackStore();
    this._needsReflow = false;
    this._recalcAll = true;
    this._dispatch = dispatch;
    this._noParent = false;
}

// TODO @dan Can we remove the CHANGE event? It has never been used.
RenderContext.prototype.onChange = function onChange (cb) {
    this._events.on(CHANGE, cb);
    return this;
};

RenderContext.prototype.offChange = function offChange (cb) {
    this._events.off(CHANGE, cb);
    return this;
};

/**
 * Registers a callback function to be invoked whenever the transform attached
 * to the RenderContext changes.
 *
 * @method  onTransformChange
 * @chainable
 * 
 * @param  {Function} cb    callback function to be invoked whenever the transform
 *                          attached to the RenderContext changes
 * @return {RenderContext}  this
 */
RenderContext.prototype.onTransformChange = function onTransformChange (cb) {
    this._events.on(TRANSFORM, cb);
    return this;
};

/**
 * Deregisters a callback function previously attached to the `transform`
 * event using `onTransformChange`.
 *
 * @method  offTransformChange
 * @chainable
 * 
 * @param  {Function} cb    callback function previously attached to the `transform`
 *                          event using `onTransformChange`
 * @return {RenderContext}  this
 */
RenderContext.prototype.offTransformChange = function offTransformChange (cb) {
    this._events.on(TRANSFORM, cb);
    return this;
};

/**
 * Registers a callback function to be invoked whenever the size of the
 * RenderContext changes.
 *
 * @method  onSizeChange
 * @chainable
 * 
 * @param  {Function} cb    callback function to be invoked whenever the size
 *                          of the RenderContext changes
 * @return {RenderContext}  this
 */
RenderContext.prototype.onSizeChange = function onSizeChange (cb) {
    this._events.on(SIZE, cb);
    return this;
};

/**
 * Deregisters a callback function previously attached to the `size`
 * event using `onSizeChange`.
 *
 * @method  offSizeChange
 * @chainable
 * 
 * @param  {Function} cb    callback function previously attached to the `size`
 *                          event using `onSizeChange`
 * @return {RenderContext}  this
 */
RenderContext.prototype.offSizeChange = function offSizeChange (cb) {
    this._events.off(SIZE, cb);
    return this;
};

/**
 * Registers a callback function to be invoked whenever the origin of the
 * RenderContext changes.
 *
 * @method  onOriginChange
 * @chainable
 * 
 * @param  {Function} cb    callback function to be invoked whenever the
 *                          origin of the RenderContext changes
 * @return {RenderContext}  this
 */
RenderContext.prototype.onOriginChange = function onOriginChange (cb) {
    this._events.on(ORIGIN, cb);
    return this;
};

/**
 * Deregisters a callback function previously attached to the `transform`
 * event using `onTransformChange`.
 *
 * @method  offTransformChange
 * @chainable
 * 
 * @param  {Function} cb    callback function previously attached to the 
 *                          transform` event using `onTransformChange`
 * @return {RenderContext}  this
 */
RenderContext.prototype.offOriginChange = function offOriginChange (cb) {
    this._events.off(ORIGIN, cb);
    return this;
};

/**
 * Registers a callback function to be invoked whenever the transform attached
 * to the RenderContext changes.
 *
 * @method  onTransformChange
 * @chainable
 * 
 * @param  {Function} cb    callback function to be invoked whenever the transform
 *                          attached to the RenderContext changed
 * @return {RenderContext}  this
 */
RenderContext.prototype.onOpacityChange = function onOpacityChange (cb) {
    this._events.on(OPACITY, cb);
    return this;
};

/**
 * Deregisters a callback function previously attached to the `transform`
 * event using `onTransformChange`.
 *
 * @method  offTransformChange
 * @chainable
 * 
 * @param  {Function} cb    callback function previously attached to the `transform`
 *                          event using `onTransformChange`
 * @return {RenderContext}  this
 */
RenderContext.prototype.offOpacityChange = function offOpacityChange (cb) {
    this._events.off(OPACITY, cb);
    return this;
};

/**
 * Sets the opacity of the RenderContext.
 *
 * @method  setOpacity
 * @chainable
 * 
 * @param {Number} opacity  opacity to be set on the RenderContext
 * @return {RenderContext}  this
 */
RenderContext.prototype.setOpacity = function setOpacity (opacity) {
    this._opacity.set(opacity);
    return this;
};

/**
 * Sets the position of the RenderContext.
 *
 * @method setPosition
 * @chainable
 * 
 * @param {Number} x        x position
 * @param {Number} y        y position
 * @param {Number} z        z position
 * @return {RenderContext}  this
 */
RenderContext.prototype.setPosition = function setPosition (x, y, z) {
    this._transform.setTranslation(x, y, z);
    return this;
};

/**
 * Sets the absolute size of the RenderContext.
 *
 * @method setAbsolute
 * @chainable
 * 
 * @param {Number} x        absolute allocated pixel space in x direction
 *                          (absolute width)
 * @param {Number} y        absolute allocated pixel space in y direction
 *                          (absolute height)
 * @param {Number} z        absolute allocated **pixel** space in z direction
 *                          (absolute depth)
 * @return {RenderContext}  this
 */
RenderContext.prototype.setAbsolute = function setAbsolute (x, y, z) {
    this._size.setAbsolute(x, y, z);
    return this;
};

/**
 * Returns the absolute (pixel) size of the RenderContext.
 *
 * @method  getSize
 * @chainable
 * 
 * @return {Number[]} 3D absolute **pixel** size
 */
RenderContext.prototype.getSize = function getSize () {
    return this._size.get();
};

/**
 * Sets the proportional size of the RenderContext, relative to its parent.
 *
 * @method  setProportions
 * @chainable
 * 
 * @param {Number} x        proportional allocated relative space in x direction (relative width)
 * @param {Number} y        proportional allocated relative space in y direction (relative height)
 * @param {Number} z        proportional allocated relative space in z direction (relative depth)
 * @return {RenderContext}  this
 */
RenderContext.prototype.setProportions = function setProportions (x, y, z) {
    this._size.setProportions(x, y, z);
    return this;
};

/**
 * Sets the differential size of the RenderContext. Differential sizing enables
 * adding an additional offset after applying an absolute and proportional size.
 *
 * @method  setDifferntial
 * @chainable
 * 
 * @param {Number} x        absolute pixel size to be added in x direction
 *                          (additional width)
 * @param {Number} y        absolute pixel size to be added in y direction
 *                          (additional height)
 * @param {Number} z        absolute pixel size to be added in z direction
 *                          (additional depth)
 * @return {RenderContext}  this
 */
RenderContext.prototype.setDifferential = function setDifferentials (x, y, z) {
    this._size.setDifferential(x, y, z);
    return this;
};

/**
 * Sets the rotation of the RenderContext in euler angles.
 *
 * @method  setRotation
 * @chainable
 * 
 * @param {RenderContext} x     x rotation
 * @param {RenderContext} y     y rotation
 * @param {RenderContext} z     z rotation
 * @return {RenderContext}      this
 */
RenderContext.prototype.setRotation = function setRotation (x, y, z) {
    this._transform.setRotation(x, y, z);
    return this;
};

/**
 * Sets the three dimensional scale of the RenderContext.
 *
 * @method  setScale
 * @chainable
 * 
 * @param {Number} x        x scale
 * @param {Number} y        y scale
 * @param {Number} z        z scale
 * @return {RenderContext}  this 
 */
RenderContext.prototype.setScale = function setScale (x, y, z) {
    this._transform.setScale(x, y, z);
    return this;
};

/**
 * Sets the align of the RenderContext.
 *
 * @method  setAlign
 * @chainable
 * 
 * @param {Number} x        x align
 * @param {Number} y        y align
 * @param {Number} z        z align
 * @return {RenderContext}  this
 */
RenderContext.prototype.setAlign = function setAlign (x, y, z) {
    this._align.set(x, y, z);
    return this;
};

/**
 * Sets the origin of the RenderContext.
 *
 * @method  setOrigin
 * @chainable
 * 
 * @param {Number} x        x origin
 * @param {Number} y        y origin
 * @param {Number} z        z origin
 * @return {RenderContext}  this
 */
RenderContext.prototype.setOrigin = function setOrigin (x, y, z) {
    this._origin.set(x, y, z);
    return this;
};

/**
 * Sets the mount point of the RenderContext.
 * TODO Come up with some nice ASCII art
 *
 * @method  setMountPoint
 * @chainable
 * 
 * @param {Number} x        mount point in x direction
 * @param {Number} y        mount point in y direction
 * @param {Number} z        mount point in z direction
 * @return {RenderContext}  this
 */
RenderContext.prototype.setMountPoint = function setMountPoint (x, y, z) {
    this._mountPoint.set(x, y, z);
    return this;
};

RenderContext.prototype.dirty = function dirty () {
    this._recalcAll = true;
    return this;
};

var identSize = new Float32Array([0, 0, 0]);
var identTrans = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

/**
 * Updates the RenderContext's internal transform matrix and emits
 * corresponding change events. Takes into account the parentContext's size
 * invalidations in order to maintain high throughput while still updating the
 * entire scene graph on every FRAME command.
 * 
 * @method  update
 * @chainable
 * 
 * @param  {RenderContext} parentContext    parent context passed down recrusively by
 *                                          the Node through the LocalDispatch
 * @return {RenderContext}                  this
 */
RenderContext.prototype.update = function update (parentContext) {
    var sizeInvalidations;

    if (this._recalcAll || (!this._noParent && !parentContext)) {
        sizeInvalidations = 7;
    } else if (this._noParent && !parentContext) {
        sizeInvalidations = 0;
    } else {
        sizeInvalidations = parentContext._size._previouslyInvalidated;
    }

    this._size._update(
        sizeInvalidations,
        parentContext ? parentContext._size.getTopDownSize() : identSize
    );

    if (!this._origin.isActive) 
        this._origin._setWithoutActivating(
            parentContext ? parentContext._origin.x : 0,
            parentContext ? parentContext._origin.y : 0,
            parentContext ? parentContext._origin.z : 0);
    var mySize = this._size.get();
    var parentSize = parentContext ? parentContext._size.get() : identSize;
    this._align.update(parentSize);
    this._mountPoint.update(mySize);

    var alignInvalidations;

    if (this._recalcAll || (!this._noParent && !parentContext)) {
        alignInvalidations = (1 << 16) - 1;
    } else if (this._noParent && !parentContext) {
        alignInvalidations = 0;
    } else {
        alignInvalidations = parentContext._transform._previouslyInvalidated;
    }

    this._align.transform._update(
        alignInvalidations,
        parentContext ? parentContext._transform._matrix : identTrans
    );

    this._mountPoint.transform._update(
        this._align.transform._previouslyInvalidated,
        this._align.transform._matrix
    );

    this._transform._update(
        this._mountPoint.transform._previouslyInvalidated,
        this._mountPoint.transform._matrix
    );

    if (this._transform._previouslyInvalidated)
       this._events.trigger(TRANSFORM, this._transform);

    if (this._origin.dirty) {
        this._events.trigger(ORIGIN, this._origin);
        this._origin.clean();
    }

    if (this._size._previouslyInvalidated)
        this._events.trigger(SIZE, this._size);

    if (this._opacity.dirty) {
        this._events.trigger(OPACITY, this._opacity);
        this._opacity.clean();
    }

    if (this._recalcAll) this._recalcAll = false;
    if (!parentContext) this._noParent = true;

    return this;
};

module.exports = RenderContext;

},{"./Align":38,"./MountPoint":47,"./Opacity":49,"./Origin":50,"./Size":53,"./Transform":54,"famous-utilities":35}],52:[function(require,module,exports){
'use strict';

var index = 0;
var SLASH = '/';

/**
 * RenderProxy recursively delegates commands to its parent in order to queue
 * messages to be sent on the next FRAME and uniquely identifies the node it is
 * being managed by in the scene graph by exposing a global `path` describing
 * its location.
 * 
 * @class  RenderProxy
 * @constructor
 * @private
 * 
 * @param {RenderProxy|Context} parent parent used for recursively obtaining
 *                                     the path to the corresponding node
 */
function RenderProxy (parent) {
    this._parent = parent;
    this._id = SLASH + index++;
}

/**
 * Retrieves the renderpath
 *
 * @method getRenderPath
 * 
 * @return {String} render path
 */
RenderProxy.prototype.getRenderPath = function getRenderPath () {
    return this._parent.getRenderPath() + this._id;
};

/**
 * Appends a command to the MessageQueue by recursively passing it up to its
 * parent until the top-level Context is being reached.
 *
 * @method  receive
 * @chainable
 * 
 * @param  {Object} command command to be appended to the MessageQueue.
 *                          Usually a string literal, but can be any object
 *                          that can be cloned by the by the structured clone
 *                          algorithm used to serialize messages to be sent to
 *                          the main thread. This includes object literals
 *                          containing circular references.
 * @return {RenderProxy}    this
 */
RenderProxy.prototype.receive = function receive (command) {
    this._parent.receive(command);
    return this;
};


// @dan This is never being used. Can we remove it?

RenderProxy.prototype.send = function send () {
    this._parent.send();
    return this;
};

module.exports = RenderProxy;

},{}],53:[function(require,module,exports){
'use strict';

/**
 * The size primitive is being used internally by the RenderContext to manage
 * and update its respective transform matrix. It doesn't expose user-facing
 * APIs, but instead is being exposed on the RenderContext level in form of
 * various methods, e.g. `setProportional` and `setAbsolute`.
 *
 * @class Size
 * @constructor
 * @private
 * 
 * @param {RenderContext} context RenderContext the Size is being attached to
 */
function Size (context) {
    this._context = context;
    this._size = [0, 0, 0];
    this._proportions = [1, 1, 1];
    this._differential = [0, 0, 0];
    this._absolute = [0, 0, 0];
    this._absoluteSized = [false, false, false];
    this._bottomUpSize = [0, 0, 0];
    this._invalidated = 0;
    this._previouslyInvalidated = 0;
}

/**
 * Retrieves the current top-down, absolute pixel size. Incorporates it parent size.
 *
 * @method  get
 * @private
 * 
 * @return {Number[]} absolute pixel size
 */
Size.prototype.get = function get () {
    if (this._context._dispatch.hasRenderables())
        return this._context._dispatch.getTotalRenderableSize();
    else
        return this.getTopDownSize();
};

/**
 * Sets the proportional size.
 *
 * @method setProportions
 * @chainable
 * @private
 * 
 * @param {Number|null} x
 * @param {Number|null} y
 * @param {Number|null} z
 */
Size.prototype.setProportions = function setProportions(x, y, z) {
    if (x !== this._proportions[0] && x != null) {
        this._proportions[0] = x;
        this._invalidated |= 1;
    }
    if (y !== this._proportions[1] && y != null) {
        this._proportions[1] = y;
        this._invalidated |= 2;
    }
    if (z !== this._proportions[2] && z != null) {
        this._proportions[2] = z;
        this._invalidated |= 4;
    }
    return this;
};

/**
 * Sets the differential size.
 *
 * @method  setDifferential
 * @chainable
 * @private
 * 
 * @param {Number|null} x
 * @param {Number|null} y
 * @param {Number|null} z
 */
Size.prototype.setDifferential = function setDifferential (x, y, z) {
    if (x !== this._differential[0] && x != null) {
        this._differential[0] = x;
        this._invalidated |= 1;
    }
    if (y !== this._differential[1] && y != null) {
        this._differential[1] = y;
        this._invalidated |= 2;
    }
    if (z !== this._differential[2] && z != null) {
        this._differential[2] = z;
        this._invalidated |= 4;
    }
    return this;
};

/**
 * Internal helper function called by `setAbsolute` in order to update the absolute size.
 * 
 * @method  _setAbsolute
 * @chainable
 * @private
 * 
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Size.prototype._setAbsolute = function _setAbsolute (x, y, z) {
    if (x !== this._absolute[0] && x != null) {
        this._absolute[0] = x;
        this._invalidated |= 1;
    }
    if (y !== this._absolute[1] && y != null) {
        this._absolute[1] = y;
        this._invalidated |= 2;
    }
    if (z !== this._absolute[2] && z != null) {
        this._absolute[2] = z;
        this._invalidated |= 4;
    }
    return this;
};

/**
 * Updates the internal notion of absolute sizing.
 *
 * @method  setAbsolute
 * @chainable
 * @private
 * 
 * @param {Number|null} x
 * @param {Number|null} y
 * @param {Number|null} z
 */
Size.prototype.setAbsolute = function setAbsolute (x, y, z) {
    this._absoluteSized[0] = x != null;
    this._absoluteSized[1] = y != null;
    this._absoluteSized[2] = z != null;
    this._setAbsolute(x, y, z);
    return this;
};

/**
 * Retrieves the top-down size.
 *
 * @method  getTopDownSize
 * @chainable
 * 
 * @return {Size} this
 */
Size.prototype.getTopDownSize = function getTopDownSize () {
    return this._size;
};

/**
 * Updates the size according to previously set invalidations.
 *
 * @method  _update
 * @private
 * 
 * @param  {Number} parentReport    bit scheme
 * @param  {Number[]} parentSize    absolute parent size
 * @return {Number}                 bit scheme
 */
Size.prototype._update = function _update(parentReport, parentSize) {
    this._invalidated |= parentReport;
    if (this._invalidated & 1)
        if (this._absoluteSized[0]) this._size[0] = this._absolute[0];
        else this._size[0] = parentSize[0] * this._proportions[0] + this._differential[0];
    if (this._invalidated & 2)
        if (this._absoluteSized[1]) this._size[1] = this._absolute[1];
        else this._size[1] = parentSize[1] * this._proportions[1] + this._differential[1];
    if (this._invalidated & 4)
        if (this._absoluteSized[2]) this._size[2] = this._absolute[2];
        else this._size[2] = parentSize[2] * this._proportions[2] + this._differential[2];
    this._previouslyInvalidated = this._invalidated;
    this._invalidated = 0;
    return this._previouslyInvalidated;
};

/**
 * Resets the internal managed size (parent size). Invalidates the primitive
 * and therefore recalculates the size on the next invocation of the _update
 * function.
 *
 * @method  toIdentity
 * @chainable
 * 
 * @return {Size} this
 */
Size.prototype.toIdentity = function toIdentity () {
    this._absolute[0] = this._absolute[1] = this._absolute[2] = 0;
    this._differential[0] = this._differential[1] = this._differential[2] = 0;
    this._proportions[0] = this._proportions[1] = this._proportions[2] = 1;
    this._invalidated = 7;
    return this;
};

module.exports = Size;

},{}],54:[function(require,module,exports){
'use strict';

// CONSTS
var IDENTITY = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

// Functions to be run when an index is marked as invalidated
Transform.prototype._validate = function _validate(counter, parent, translation, precalculated) {
    switch (counter) {
        case 0: return parent[0] * precalculated[0] + parent[4] * precalculated[1] + parent[8] * precalculated[2];
        case 1: return parent[1] * precalculated[0] + parent[5] * precalculated[1] + parent[9] * precalculated[2];
        case 2: return parent[2] * precalculated[0] + parent[6] * precalculated[1] + parent[10] * precalculated[2];
        case 3: return parent[3] * precalculated[0] + parent[7] * precalculated[1] + parent[11] * precalculated[2];
        case 4: return parent[0] * precalculated[3] + parent[4] * precalculated[4] + parent[8] * precalculated[5];
        case 5: return parent[1] * precalculated[3] + parent[5] * precalculated[4] + parent[9] * precalculated[5];
        case 6: return parent[2] * precalculated[3] + parent[6] * precalculated[4] + parent[10] * precalculated[5];
        case 7: return parent[3] * precalculated[3] + parent[7] * precalculated[4] + parent[11] * precalculated[5];
        case 8: return parent[0] * precalculated[6] + parent[4] * precalculated[7] + parent[8] * precalculated[8];
        case 9: return parent[1] * precalculated[6] + parent[5] * precalculated[7] + parent[9] * precalculated[8];
        case 10: return parent[2] * precalculated[6] + parent[6] * precalculated[7] + parent[10] * precalculated[8];
        case 11: return parent[3] * precalculated[6] + parent[7] * precalculated[7] + parent[11] * precalculated[8];
        case 12: return parent[0] * translation[0] + parent[4] * translation[1] + parent[8] * translation[2] + parent[12];
        case 13: return parent[1] * translation[0] + parent[5] * translation[1] + parent[9] * translation[2] + parent[13];
        case 14: return parent[2] * translation[0] + parent[6] * translation[1] + parent[10] * translation[2] + parent[14];
        case 15: return parent[3] * translation[0] + parent[7] * translation[1] + parent[11] * translation[2] + parent[15];
    }
};

// Map of invalidation numbers
var DEPENDENTS = {
    global: [4369, 8738, 17476, 34952, 4369, 8738, 17476, 34952, 4369, 8738, 17476, 34952, 4096, 8192, 16384, 32768],
    local: {
        translation: [61440, 61440, 61440],
        rotation: [4095, 4095, 255],
        scale: [4095, 4095, 4095]
    }
};

/**
 * Transform is an object that is part of every RenderContext, Align and its
 * derivatives Origin and MountPoint.
 * It is responsible for updating its own notion of position in space and
 * incorporating its parent information.
 *
 * @class Transform
 * @constructor
 * @private
 */
function Transform() {
    this._matrix = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    this._memory = new Float32Array([1, 0, 1, 0, 1, 0]);
    this._vectors = {
        translation: new Float32Array([0, 0, 0]),
        rotation: new Float32Array([0, 0, 0]),
        scale: new Float32Array([1, 1, 1])
    };
    this._invalidated = 0;
    this._previouslyInvalidated = 0;

    // precalculated values for validators
    this._precalculated = new Float32Array(9);
    // track what transformations were applied: [scale x, scale y, scale z, rotation x, rotaion y, rotation z]
    this._tracktransforms = [false, false, false, false, false, false];
}

/**
 * Return the transform matrix that represents this Transform's values
 *   being applied to it's parent's global transform.
 *
 * @method getGlobalMatrix
 *
 * @return {Float32Array}   representation of this Transform being applied to
 *                          it's parent
 */
Transform.prototype.getGlobalMatrix = function getGlobalMatrix() {
    return this._matrix;
};

/**
 * Return the vectorized information for this Transform's local
 *   transform.
 *
 * @method getLocalVectors
 *
 * @return {Object} object with translate, rotate, and scale keys
 */
Transform.prototype.getLocalVectors = function getVectors() {
    return this._vectors;
};

/**
 * Updates the local invalidation scheme based on parent information
 *
 * @method _invalidateFromParent
 * @private
 *
 * @param  {Number} parentReport parent's invalidation
 */
Transform.prototype._invalidateFromParent = function _invalidateFromParent(parentReport) {
    var counter = 0;
    while (parentReport) {
        if (parentReport & 1) this._invalidated |= DEPENDENTS.global[counter];
        counter++;
        parentReport >>>= 1;
    }
};

Transform.prototype._isIdentity = function _isIdentity() {
    var vectors = this._vectors;
    var trans = vectors.translation;
    var rot = vectors.rotation;
    var scale = vectors.scale;
    return !(trans[0] || trans[1] || trans[2] || rot[0] || rot[1] || rot[2]) && (scale[0] === 1) && (scale[1] === 1) && (scale[2] === 1);
};

Transform.prototype._copyParent = function _copyParent(parentReport, parentMatrix) {
    var report = parentReport;
    if (parentReport) {
        this._previouslyInvalidated = parentReport;
        var counter = 0;
        while (report) {
            if (report & 1) this._matrix[counter] = parentMatrix[counter];
            counter++;
            report >>>= 1;
        }
    }
    return parentReport;
};

/**
 * Update the global matrix based on local and parent invalidations.
 *
 * @method  _update
 * @private
 *
 * @param  {Number} parentReport invalidations associated with the parent matrix
 * @param  {Array} parentMatrix parent transform matrix as an Array
 * @return {Number} invalidation scheme
 */
Transform.prototype._update = function _update(parentReport, parentMatrix) {
    if (!(parentReport || this._invalidated)) {
        this._previouslyInvalidated = 0;
        return 0;
    }
    if (this._isIdentity()) return this._copyParent(parentReport, parentMatrix);
    if (parentReport) this._invalidateFromParent(parentReport);
    if (!parentMatrix) parentMatrix = IDENTITY;
    var update;
    var counter = 0;
    var invalidated = this._invalidated;

    //prepare precalculations
    this._precalculateTrMatrix();

    // Based on invalidations update only the needed indicies
    while (this._invalidated) {
        if (this._invalidated & 1) {
            update = this._validate(counter, parentMatrix, this._vectors.translation, this._precalculated);
            if (update !== this._matrix[counter])
                this._matrix[counter] = update;
            else
                invalidated &= ((1 << 16) - 1) ^ (1 << counter);
        }

        counter++;
        this._invalidated >>>= 1;
    }

    this._previouslyInvalidated = invalidated;

    return invalidated;
};

/**
 * Add extra translation to the current values.  Invalidates
 *   translation as needed.
 *
 * @method translate
 *
 * @param  {Number} x translation along the x-axis in pixels
 * @param  {Number} y translation along the y-axis in pixels
 * @param  {Number} z translation along the z-axis in pixels
 */
Transform.prototype.translate = function translate(x, y, z) {
    var translation = this._vectors.translation;
    var dirty = false;

    if (x) {
        translation[0] += x;
        dirty = true;
    }

    if (y) {
        translation[1] += y;
        dirty = true;
    }

    if (z) {
        translation[2] += z;
        dirty = true;
    }

    if (dirty) this._invalidated |= 61440;
};

/**
 * Add extra rotation to the current values.  Invalidates
 *   rotation as needed.
 *
 * @method rotate
 *
 * @param  {Number} x rotation about the x-axis in radians
 * @param  {Number} y rotation about the y-axis in radians
 * @param  {Number} z rotation about the z-axis in radians
 */
Transform.prototype.rotate = function rotate(x, y, z) {
    var rotation = this._vectors.rotation;
    this.setRotation((x ? x : 0) + rotation[0], (y ? y : 0) + rotation[1], (z ? z : 0) + rotation[2]);
};

/**
 * Add extra scale to the current values.  Invalidates
 *   scale as needed.
 *
 * @method scale
 *
 * @param  {Number} x scale along the x-axis as a percent
 * @param  {Number} y scale along the y-axis as a percent
 * @param  {Number} z scale along the z-axis as a percent
 */
Transform.prototype.scale = function scale(x, y, z) {
    var scaleVector = this._vectors.scale;
    var tracktransforms = this._tracktransforms;
    var dirty = false;

    if (x) {
        scaleVector[0] += x;
        dirty = dirty || true;
        tracktransforms[0] = true;
    }

    if (y) {
        scaleVector[1] += y;
        dirty = dirty || true;
        tracktransforms[1] = true;
    }

    if (z) {
        scaleVector[2] += z;
        dirty = dirty || true;
        tracktransforms[2] = true;
    }

    if (dirty) this._invalidated |= 4095;
};

/**
 * Absolute set of the Transform's translation.  Invalidates
 *   translation as needed.
 *
 * @method setTranslation
 *
 * @param  {Number} x translation along the x-axis in pixels
 * @param  {Number} y translation along the y-axis in pixels
 * @param  {Number} z translation along the z-axis in pixels
 */
Transform.prototype.setTranslation = function setTranslation(x, y, z) {
    var translation = this._vectors.translation;
    var dirty = false;

    if (x !== translation[0] && x != null) {
        translation[0] = x;
        dirty = dirty || true;
    }

    if (y !== translation[1] && y != null) {
        translation[1] = y;
        dirty = dirty || true;
    }

    if (z !== translation[2] && z != null) {
        translation[2] = z;
        dirty = dirty || true;
    }

    if (dirty) this._invalidated |= 61440;
};

/**
 * Return the current translation.
 *
 * @method getTranslation
 *
 * @return {Float32Array} array representing the current translation
 */
Transform.prototype.getTranslation = function getTranslation() {
    return this._vectors.translation;
};

/**
 * Absolute set of the Transform's rotation.  Invalidates
 *   rotation as needed.
 *
 * @method setRotate
 *
 * @param  {Number} x rotation about the x-axis in radians
 * @param  {Number} y rotation about the y-axis in radians
 * @param  {Number} z rotation about the z-axis in radians
 */
Transform.prototype.setRotation = function setRotation(x, y, z) {
    var rotation = this._vectors.rotation;
    var tracktransforms = this._tracktransforms;
    var dirty = false;

    if (x !== rotation[0] && x != null) {
        rotation[0] = x;
        this._memory[0] = Math.cos(x);
        this._memory[1] = Math.sin(x);
        dirty = dirty || true;
        tracktransforms[3] = true;
    }

    if (y !== rotation[1] && y != null) {
        rotation[1] = y;
        this._memory[2] = Math.cos(y);
        this._memory[3] = Math.sin(y);
        dirty = dirty || true;
        tracktransforms[4] = true;
    }

    if (z !== rotation[2] && z != null) {
        rotation[2] = z;
        this._memory[4] = Math.cos(z);
        this._memory[5] = Math.sin(z);
        this._invalidated |= 255;
        tracktransforms[5] = true;
    }

    if (dirty) this._invalidated |= 4095;
};

/**
 * Return the current rotation.
 *
 * @method getRotation
 *
 * @return {Float32Array} array representing the current rotation
 */
Transform.prototype.getRotation = function getRotation() {
    return this._vectors.rotation;
};

/**
 * Absolute set of the Transform's scale.  Invalidates
 *   scale as needed.
 *
 * @method setScale
 *
 * @param  {Number} x scale along the x-axis as a percent
 * @param  {Number} y scale along the y-axis as a percent
 * @param  {Number} z scale along the z-axis as a percent
 */
Transform.prototype.setScale = function setScale(x, y, z) {
    var scale = this._vectors.scale;
    var tracktransforms = this._tracktransforms;
    var dirty = false;

    if (x !== scale[0]) {
        scale[0] = x;
        dirty = dirty || true;
        tracktransforms[0] = true;
    }

    if (y !== scale[1]) {
        scale[1] = y;
        dirty = dirty || true;
        tracktransforms[1] = true;
    }

    if (z !== scale[2]) {
        scale[2] = z;
        dirty = dirty || true;
        tracktransforms[2] = true;
    }

    if (dirty) this._invalidated |= 4095;
};

/**
 * Return the current scale.
 *
 * @method getScale
 *
 * @return {Float32Array} array representing the current scale
 */
Transform.prototype.getScale = function getScale() {
    return this._vectors.scale;
};

Transform.prototype.toIdentity = function toIdentity() {
    this.setTranslation(0, 0, 0);
    this.setRotation(0, 0, 0);
    this.setScale(1, 1, 1);
    return this;
};

Transform.prototype._precalculateAddRotation = function _precalculateAddRotation(isRotateX, isRotateY, isRotateZ) {
    var precalculated = this._precalculated;
    var memory = this._memory;

    precalculated[1] = memory[0] * memory[5] + memory[1] * memory[3] * memory[4];
    precalculated[2] = memory[1] * memory[5] - memory[0] * memory[3] * memory[4];
    precalculated[4] = memory[0] * memory[4] - memory[1] * memory[3] * memory[5];
    precalculated[5] = memory[1] * memory[4] + memory[0] * memory[3] * memory[5];

    if(isRotateY || isRotateZ) { //by y or z
        precalculated[0] = memory[2] * memory[4];
        precalculated[3] = -memory[2] * memory[5];
    }
    else {
        precalculated[0] = 1;
        precalculated[3] = 0;
    }

    if(isRotateX || isRotateY) {  //by x or y
        precalculated[7] = -memory[1] * memory[2];
        precalculated[8] = memory[0] * memory[2];
    }
    else {
        precalculated[7] = 0;
        precalculated[8] = 1
    }

    precalculated[6] = isRotateY ? memory[3] : 0; //by y
};

Transform.prototype._precalculateAddScale = function _precalculateAddScale(isScaleX, isScaleY, isScaleZ, isRotated) {
    var precalculated = this._precalculated;
    var scale = this._vectors.scale;

    if(isRotated) { // is rotated previously
        if(isScaleX){  //by x
            precalculated[0] *= scale[0];
            precalculated[1] *= scale[0];
            precalculated[2] *= scale[0];
        }

        if(isScaleY){  //by y
            precalculated[3] *= scale[1];
            precalculated[4] *= scale[1];
            precalculated[5] *= scale[1];
        }

        if(isScaleZ){  //by z
            precalculated[6] *= scale[2];
            precalculated[7] *= scale[2];
            precalculated[8] *= scale[2];
        }
    }
    else { //not rotated
        precalculated[0] = scale[0];
        precalculated[4] = scale[1];
        precalculated[8] = scale[2];
        precalculated[1] = precalculated[2] = precalculated[3] = precalculated[5] = precalculated[6] = precalculated[7] = 0;
    }
};

Transform.prototype._precalculatedSetDefault = function _precalculatedSetDefault() {
    var precalculated = this._precalculated;
    precalculated[0] = precalculated[4] = precalculated[8] = 1;
    precalculated[1] = precalculated[2] = precalculated[3] = precalculated[5] = precalculated[6] = precalculated[7] = 0;
};

Transform.prototype._precalculateTrMatrix = function _precalculateTrMatrix() {
    var tracktransforms = this._tracktransforms;
    
    //rotation should go before scale checks
    if(tracktransforms[3] || tracktransforms[4] || tracktransforms[5]){ // is rotate by x or y or z
        this._precalculateAddRotation(tracktransforms[3], tracktransforms[4], tracktransforms[5]);

        if(tracktransforms[0] || tracktransforms[1] || tracktransforms[2]){ // is scale with rotation
            this._precalculateAddScale( tracktransforms[0], tracktransforms[1], tracktransforms[2], true);
        }
    }
    else if(tracktransforms[0] || tracktransforms[1] || tracktransforms[2]){ //is scale w/o rotation
        this._precalculateAddScale( tracktransforms[0], tracktransforms[1], tracktransforms[2], false);
    }
    else {
        this._precalculatedSetDefault();
    }

};

module.exports = Transform;

},{}],55:[function(require,module,exports){
'use strict';

module.exports = {
    Align: require('./Align'),
    ComponentStore: require('./ComponentStore'),
    GlobalDispatch: require('./GlobalDispatch'),
    Context: require('./Context'),
    Famous: require('./Famous'),
    Layer: require('./Layer'),
    Clock: require('./Clock'),
    LocalDispatch: require('./LocalDispatch'),
    MountPoint: require('./MountPoint'),
    Node: require('./Node'),
    Opacity: require('./Opacity'),
    Origin: require('./Origin'),
    RenderContext: require('./RenderContext'),
    RenderProxy: require('./RenderProxy'),
    Size: require('./Size'),
    Transform: require('./Transform')
};

},{"./Align":38,"./Clock":39,"./ComponentStore":40,"./Context":41,"./Famous":42,"./GlobalDispatch":43,"./Layer":44,"./LocalDispatch":45,"./MountPoint":47,"./Node":48,"./Opacity":49,"./Origin":50,"./RenderContext":51,"./RenderProxy":52,"./Size":53,"./Transform":54}],56:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],57:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":60,"dup":2}],58:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":57,"./TweenTransition":59,"dup":3}],59:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":56,"dup":4}],60:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],61:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":56,"./MultipleTransition":57,"./Transitionable":58,"./TweenTransition":59,"./after":60,"dup":6}],62:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],63:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":61}],64:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":63,"dup":29}],65:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],66:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],67:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],68:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],69:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],70:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":62,"./Color":63,"./ColorPalette":64,"./KeyCodes":65,"./MethodStore":66,"./ObjectManager":67,"./clone":68,"./flatClone":69,"./loadURL":71,"./strip":72,"dup":35}],71:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],72:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],73:[function(require,module,exports){
'use strict';

var MethodStore = require('famous-utilities').MethodStore;
var CallbackStore = require('famous-utilities').CallbackStore;

var UPDATE = 'update';
var ADDED = 'added';
var REMOVED = 'removed';

function ArrayObserver (arr, type) {
    this.changes = [];
    this.type = ArrayObserver.PUSH;
    this.observer = function (changes) {
        this.changes = this.changes.concat(changes);
        if (this.type === ArrayObserver.PUSH) this.dispatch();
    }.bind(this);
    this.target = arr;
    switch (type) {
        case ArrayObserver.METHODS:
            this.callbacks = new MethodStore();
            break;
        default:
            this.callbacks = new CallbackStore();
            break;
    }
}

ArrayObserver.PUSH = 0;
ArrayObserver.PULL = 1;
ArrayObserver.METHODS = 2;
ArrayObserver.CALLBACKS = 3;

ArrayObserver.prototype.startObserving = function startObserving () {
    Array.observe(this.target, this.observer);
    return this;
};

ArrayObserver.prototype.stopObserving = function stopObserving () {
    Array.unobserve(this.target, this.observer);
    return this;
};

ArrayObserver.prototype.makePush = function makePush () {
    this.type = ArrayObserver.PUSH;
    return this;
};

ArrayObserver.prototype.makePull = function makePull () {
    this.type = ArrayObserver.PULL;
    return this;
};

ArrayObserver.prototype.subscribe = function subscribe () {
    this.callbacks.on.apply(this.callbacks, arguments);
    return this;
};

ArrayObserver.prototype.dispatch = function dispatch () {
    var i = 0;
    var len = this.changes.length;
    for (; i < len ; i++) {
        var change = this.changes.shift();
        if (change.type === 'update') this.callbacks.trigger(UPDATE, change);
        else {
            if (change.addedCount > 0) this.callbacks.trigger(ADDED, change);
            if (change.removed && change.removed.length > 0) this.callbacks.trigger(REMOVED, change);
        }
    }
    return this;
};

module.exports = ArrayObserver;

},{"famous-utilities":70}],74:[function(require,module,exports){
'use strict';

var core = require('famous-core');
var Famous = core.Famous;
var RenderNode = require('./RenderNode');
var RenderProxy = core.RenderProxy;
var CLOCK = Famous.getClock();
var GLOBAL_DISPATCH = Famous.getGlobalDispatch();

var NEED_SIZE_FOR = 'NEED_SIZE_FOR';
var RESIZE = 'resize';

function Context (model, selector) {
    this._selector = selector;
    this._renderProxy = new RenderProxy(this);
    this._contextNode = new RenderNode(this._renderProxy, GLOBAL_DISPATCH);
    this._drawCommands = [];
    this._globalDispatch = GLOBAL_DISPATCH;
    this._contentNode = this._contextNode.addChild();
    this._model = model;
    this._initialized = false;

    this._globalDispatch.message(NEED_SIZE_FOR).message(this._selector);
    this._globalDispatch.targetedOn(this._selector, RESIZE, this._receiveContextSize.bind(this));
    CLOCK.update(this);
}

Context.prototype.init = function init (model) {
    this._contentNode.getDispatch().acceptModel(model);
    this._initialized = true;
    return this;
};

Context.prototype.getRenderPath = function () {
    return this._selector;
};

Context.prototype.receive = function receive (command) {
    this._drawCommands.push(command);
    return this;
};

Context.prototype.send = function send () {
    for (var i = 0, len = this._drawCommands.length ; i < len ; i++)
        this._globalDispatch.message(this._drawCommands.shift());
    return this;
};

Context.prototype._receiveContextSize = function _receiveContextSize (size) {
    this._contextNode._localDispatch._context._size.setAbsolute(size[0], size[1], 0)._update(7, [0, 0, 0]);
    if (!this._initialized) this.init(this._model);
    this._needsSizeZero = true;
};

Context.prototype._sizeZero = function _sizeZero() {
    this._contextNode._localDispatch._context._size._update(0, [0, 0, 0]);
    this._needsSizeZero = false;
    this._needsReflow = true;
};

Context.prototype._update = function _update (node, parent) {
    var dispatch = node.getDispatch();
    dispatch.updateModelView().update(parent);
    this._needsReflow = this._needsReflow || dispatch.requestingReflow();
    var children = node.getChildren();
    var i = 0;
    var len = children.length;
    for (; i < len ; i++) this._update(children[i], node);
};

Context.prototype.update = function update (time) {
    if (this._needsReflow) this.reflow();
    this._time = time;
    this._update(this._contentNode, this._contextNode);
    if (this._needsSizeZero) this._sizeZero();
    this._renderProxy.send();
    return this;
};

Context.prototype.reflow = function reflow () {
    this._contextNode.reflow();
    this._needsReflow = false;
    return this;
};

module.exports = Context;

},{"./RenderNode":80,"famous-core":55}],75:[function(require,module,exports){
'use strict';

var Node = require('famous-core').Node;
var RenderDispatch = require('./RenderDispatch');
var Position = require('famous-components').Position;
var Rotation = require('famous-components').Rotation;
var Scale = require('famous-components').Scale;
var Align = require('famous-components').Align;
var Origin = require('famous-components').Origin;
var MountPoint = require('famous-components').MountPoint;
var Size = require('famous-components').Size;

function LayoutNode () {
    Node.call(this, void 0, void 0, new RenderDispatch(this));
    this._pos = new Position(this._localDispatch);
    this._rot = new Rotation(this._localDispatch);
    this._siz = new Size(this._localDispatch);
    this._sca = new Scale(this._localDispatch);
    this._ali = new Align(this._localDispatch);
    this._ori = new Origin(this._localDispatch);
    this._mou = new MountPoint(this._localDispatch);
}

LayoutNode.prototype = Object.create(Node.prototype);
LayoutNode.prototype.constructor = LayoutNode;

LayoutNode.prototype.halt = function halt () {
    this._pos.halt();
    this._rot.halt();
    this._sca.halt();
    this._ali.halt();
    this._ori.halt();
    this._mou.halt();
    return this;
};

LayoutNode.prototype.addChild = function addChild (child) {
    this._children[0] = child;
    return this;
};

LayoutNode.prototype.removeChild = function removeChild (child) {
    this._children.pop().kill();
    return this;
};

LayoutNode.prototype.removeAllChildren = function removeAllChildren () {
    var i = 0;
    var len = this._children.length;
    for (; i < len ; i++) this._children.pop().kill();
};

LayoutNode.prototype.setPosition = function setPosition (x, y, z, options) {
    this._pos.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.getPosition = function getPosition () {
    return [this._pos._x.get(), this._pos._y.get(), this._pos._z.get()];
};

LayoutNode.prototype.getSize = function getSize () {
    return this._localDispatch._context._size.getTopDownSize();
};

LayoutNode.prototype.setSize = function setSize (x, y, z, options) {
    this._siz.setAbsolute(x, y, z, options);
    return this;
};

LayoutNode.prototype.setRotation = function setRotation (x, y, z, options) {
    this._rot.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.setScale = function setScale (x, y, z, options) {
    this._sca.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.setOrigin = function setOrigin (x, y, z, options) {
    this._ori.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.setAlign = function setAlign (x, y, z, options) {
    this._ali.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.setMountPoint = function setMountPoint (x, y, z, options) {
    this._mou.set(x, y, z, options);
    return this;
};

LayoutNode.prototype.setDifferential = function setDifferential (x, y, z, options) {
    this._siz.setDifferential(x, y, z, options);
    return this;
};

LayoutNode.prototype.setProportions = function setProportions (x, y, z, options) {
    this._siz.setProportional(x, y, z, options);
    return this;
};

module.exports = LayoutNode;

},{"./RenderDispatch":78,"famous-components":20,"famous-core":55}],76:[function(require,module,exports){
'use strict';

var ObjectObserver = require('./ObjectObserver');
var ArrayObserver = require('./ArrayObserver');
var RenderHandler = require('./RenderHandler');

function ModelView (dispatch) {
    this._model = null;
    this._renderer = null;
    this._modelControllers = [];
    this._rendererControllers = [];
    this._dispatch = dispatch;
}

ModelView.prototype.kill = function kill () {
    if (this._childManager) this._childManager.stopObserving();
    if (this._subscriptionManager) this._subscriptionManager.stopObserving();
    return this;
};

ModelView.prototype.acceptModel = function acceptModel (model) {
    this._model = model;

    var renderer = new model.constructor.renderWith(this._dispatch, this._model);
    var Handler;
    var i;
    var len;

    this._rendererControllers.push(new RenderHandler(renderer, this._dispatch));
    this._renderer = renderer;

    if (model.constructor.handlers) {
        for (i = 0, len = model.constructor.handlers.length ; i < len ; i++) {
            Handler = model.constructor.handlers[i];
            this._modelControllers.push(new Handler(model, this._dispatch));
        }
    }

    if (renderer.constructor.handlers) {
        for (i = 0, len = renderer.constructor.handlers.length ; i < len ; i++) {
            Handler = renderer.constructor.handlers[i];
            this._rendererControllers.push(new Handler(renderer, this._dispatch));
        }
    }

    var subscriptions = this._renderer.constructor.subscribe;
    _findPublication.call(this, model);

    if (subscriptions) {
        this._subscriptionManager = new ObjectObserver(model);
        _manageSubscriptions.call(this, this._subscriptionManager, subscriptions);
    }

    if (this._renderer.draw) this._renderer.draw();

    return this;
};

ModelView.prototype.publishAdd = function publishAdd (change) {
    var addedCount = change.addedCount;
    var index = change.index;
    var node = this._dispatch.getNode();

    for (var i = 0, len = addedCount ; i < len ; i++) {
        node
            .addChild(index + i)
            .getDispatch()
            .acceptModel(change.object[index + i]);

        if (this._renderer.layout)
            node.layout(index + i, this._renderer.layout, this._renderer);
    }
};

ModelView.prototype.update = function update () {
    if (this._subscriptionManager) this._subscriptionManager.callbacks.trigger('*');
};

ModelView.prototype.publishRemove = function publishRemove (change) {
    var removed = change.removed;
    var index = change.index;
    var node = this._dispatch.getNode();

    for (var i = 0, len = removed.length ; i < len ; i++)
        node.removeChildAtIndex(index + i);

    if (this._renderer.layout)
        node.reflowWith(this._renderer.layout, this._renderer);
};

ModelView.prototype.publishSwap = function publishSwap (change) {
    var index = change.index;
    var node = this._dispatch.getNode();

    node.removeChildAtIndex(index);
    node
        .addChild(index)
        .getDispatch()
        .acceptModel(change.object[index]);

    if (this._renderer.layout)
        node.reflowWith(this._renderer.layout, this._renderer);
};

ModelView.prototype.swapChild = function swapChild (change) {
    var name = change.name;
    var obj = change.object;
    var instance = obj[name];
    var node = this._dispatch.getNode();

    node.removeAllChildren();
    node
        .addChild(0)
        .getDispatch()
        .acceptModel(instance);

    if (this._renderer.layout)
        node.layout(0, this._renderer.layout, this.renderer);
};

ModelView.prototype.swapChildAtIndex = function swapChildAtIndex (change) {
    // todo
};

ModelView.prototype.kill = function kill () {
    if (this._subscriptionManager) this._subscriptionManager.stopObserving();
    if (this._childManager) this._childManager.stopObserving();
};

function _findPublication (model) {
    /*jshint validthis: true */
    var publicationKey = model.constructor.publish;
    var node;
    var i;
    var len;

    if (!publicationKey) return;
    else if (publicationKey.constructor === String)

        if (model[publicationKey] && model[publicationKey].constructor === Array) {
            i = 0;
            len = model[publicationKey].length;
            node = this._dispatch.getNode();

            this._childManager = new ArrayObserver(model[publicationKey]);
            this._childManager.subscribe('added', this.publishAdd.bind(this));
            this._childManager.subscribe('removed', this.publishRemove.bind(this));
            this._childManager.subscribe('update', this.publishSwap.bind(this));

            for (; i < len ; i++) {

                node
                    .addChild()
                    .getDispatch()
                    .acceptModel(model[publicationKey][i]);

                if (this._renderer.layout)
                    node.layout(i, this._renderer.layout, this._renderer);
            }
        }
        else {

            node = this._dispatch.getNode();

            this._childManager = new ObjectObserver(model);
            this._childManager.subscribe(publicationKey, this.swapChild.bind(this));

            if (model[publicationKey]) {
                node.removeAllChildren();
                node
                    .addChild(0)
                    .getDispatch()
                    .acceptModel(model[publicationKey]);

                if (this._renderer.layout)
                    node.reflowWith(this._renderer.layout, this._renderer);
            }

        }
    else if (publicationKey.constructor === Array) {
        i = 0;
        len = publicationKey.legnth;
        node = this._dispatch.getNode();
        this._childManager = new ObjectObserver(model);

        node.removeAllChildren();

        for (; i < len ; i++) {

            this._childManager.subscribe(publicationKey[i], this.swapChildAtIndex.bind(this, i));
            if (model[publicationKey[i]])
                node
                    .addChild(i)
                    .getDispatch()
                    .acceptModel(model[publicationKey[i]]);

        }
        if (this._renderer.layout)
            node.reflowWith(this._renderer.layout, this._renderer);
    }
    this._childManager.startObserving();
}

function _manageSubscriptions(manager, subscriptions) {
    var key;
    var i;
    var len;
    var subscriptionKey;
    for (key in subscriptions) {
        i = 0;
        len = subscriptions[key].length;
        for (; i < len ; i++) {
            subscriptionKey = subscriptions[key][i];
            manager.subscribe(subscriptionKey, unwrapUpdate.bind(this, key));
        }
    }
    manager.startObserving();
}

function unwrapUpdate (key, update) {
    /*jshint validthis: true */
    var value;
    var controllers = this._rendererControllers;
    if (update) value = update.object;
    var captured = false;
    for (var i = 0, len = controllers.length ; i < len ; i++)
        captured = controllers[i].trigger(key, value) || captured;

    if (!captured) this._renderer[key](value);
}

module.exports = ModelView;

},{"./ArrayObserver":73,"./ObjectObserver":77,"./RenderHandler":79}],77:[function(require,module,exports){
'use strict';

var MethodStore = require('famous-utilities').MethodStore;
var CallbackStore = require('famous-utilities').CallbackStore;

function ObjectObserver (obj, type) {
    this.changes = [];
    this.type = ObjectObserver.PUSH;

    this.observer = function (changes) {
        this.changes = this.changes.concat(changes);
        if (this.type === ObjectObserver.PUSH) this.dispatch();
    }.bind(this);

    this.target = obj;

    switch (type) {
        case ObjectObserver.METHODS:
            this.callbacks = new MethodStore();
            break;
        default:
            this.callbacks = new CallbackStore();
            break;
    }
}

ObjectObserver.PUSH = 0;
ObjectObserver.PULL = 1;
ObjectObserver.METHODS = 2;
ObjectObserver.CALLBACKS = 3;

ObjectObserver.prototype.startObserving = function startObserving () {
    Object.observe(this.target, this.observer);
    return this;
};

ObjectObserver.prototype.stopObserving = function stopObserving () {
    Object.unobserve(this.target, this.observer);
    return this;
};

ObjectObserver.prototype.makePush = function makePush () {
    this.type = ObjectObserver.PUSH;
    return this;
};

ObjectObserver.prototype.makePull = function makePull () {
    this.type = ObjectObserver.PULL;
    return this;
};

ObjectObserver.prototype.subscribe = function subscribe () {
    this.callbacks.on.apply(this.callbacks, arguments);
    return this;
};

ObjectObserver.prototype.dispatch = function dispatch () {
    var i = 0;
    var len = this.changes.length;
    var change;
    for (; i < len ; i++) {
        change = this.changes.shift();
        this.callbacks.trigger(change.name, change);
    }
    return this;
};

module.exports = ObjectObserver;

},{"famous-utilities":70}],78:[function(require,module,exports){
'use strict';

var LocalDispatch = require('famous-core').LocalDispatch;
var ModelView = require('./ModelView');

function RenderDispatch (node, proxy) {
    LocalDispatch.call(this, node, proxy);
    this._modelView = new ModelView(this);
}

RenderDispatch.prototype = Object.create(LocalDispatch.prototype);
RenderDispatch.prototype.constructor = RenderDispatch;

RenderDispatch.prototype.acceptModel = function acceptModel (model) {
    this._modelView.acceptModel(model);
    return this;
};

RenderDispatch.prototype.updateModelView = function updateModelView () {
    this._modelView.update();
    return this;
};

RenderDispatch.prototype.reflowWith = function reflowWith (fn, ctx) {
    if (this._node.reflow) this._node.reflow(fn, ctx);
    return this;
};

RenderDispatch.prototype.reflow = function reflow () {
    this._needsReflow = true;
};

RenderDispatch.prototype.requestingReflow = function requestingReflow () {
    var result = this._needsReflow;
    this._needsReflow = false;
    return result;
};

RenderDispatch.prototype.getRenderer = function getRenderer () {
    return this._modelView._renderer;
};

module.exports = RenderDispatch;

},{"./ModelView":76,"famous-core":55}],79:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

function RenderHandler (renderer, dispatch) {
    this._events = new CallbackStore();
    if (renderer.layout && renderer.layout.constructor === Function) {
        this._events.on('layout', function () {
            dispatch.reflowWith(renderer.layout, renderer);
        });
    }
    if (renderer.draw && renderer.draw.constructor === Function) {
        this._events.on('draw', function () {
            renderer.draw();
        });
    }
}

RenderHandler.prototype.trigger = function trigger (key, value) {
    this._events.trigger(key, value);
    return key === 'layout' || key === 'draw';
}

module.exports = RenderHandler;
},{"famous-utilities":70}],80:[function(require,module,exports){
'use strict';

var Node = require('famous-core').Node;
var RenderDispatch = require('./RenderDispatch');
var LayoutNode = require('./LayoutNode');

function RenderNode (proxy, globalDispatch) {
    Node.call(this, proxy, globalDispatch, new RenderDispatch(this, proxy));
    this._layoutNodes = [];
}

RenderNode.prototype = Object.create(Node.prototype);
RenderNode.prototype.constructor = RenderNode;

RenderNode.prototype.addChild = function addChild (index) {
    var layoutNode = new LayoutNode();
    layoutNode._localDispatch.dirtyRenderContext();
    var childNode = new RenderNode(this._localDispatch._renderProxy, this._globalDispatch);
    layoutNode.addChild(childNode);
    if (index == null) {
        this._layoutNodes.push(layoutNode);
        this._children.push(childNode);
    }
    else {
        this._layoutNodes.splice(index, 0, layoutNode);
        this._children.splice(index, 0, childNode);
    }
    return childNode;
};

RenderNode.prototype.reflowWith = function reflowWith (fn, ctx) {
    var i = 0;
    var len = this._layoutNodes.length;
    for (; i < len ; i++) this.layout(i, fn, ctx);
};

RenderNode.prototype.reflow = function reflow () {
    var renderer = this._localDispatch.getRenderer();
    if (renderer) {
        if (renderer.layout)
            this.reflowWith(renderer.layout, renderer);
        for (var i = 0, len = this._children.length ; i < len ; i++)
            this._children[i].reflow();
    }
};

RenderNode.prototype.layout = function layout (i, fn, ctx) {
    this._layoutNodes[i].halt();
    fn.call(ctx, this._layoutNodes[i], this._layoutNodes[i - 1], i);
};

RenderNode.prototype.removeChild = function removeChild (node) {
    var index = this._children.indexOf(node);
    if (index > -1) {
        var result = this._layoutNodes.splice(index, 1);
        result[0].kill();
        this._layoutNodes.splice(index, 1);
    }
    return this;
};

RenderNode.prototype.removeChildAtIndex = function removeChildAtIndex (index) {
    var result = this._layoutNodes.splice(index, 1);
    result[0].kill();
    this._children.splice(index, 1);
    return this;
};

RenderNode.prototype.removeAllChildren = function removeAllChildren () {
    for (var i = 0, len = this._children.length ; i < len ; i++) {
        this._layoutNodes.splice(i, 1)[0].kill();
        this._children.splice(i, 1);
    }
    return this;
};

RenderNode.prototype.getChildren = function getChildren () {
    return this._layoutNodes;
};

module.exports = RenderNode;

},{"./LayoutNode":75,"./RenderDispatch":78,"famous-core":55}],81:[function(require,module,exports){
'use strict';

module.exports = {
    ArrayObserver: require('./ArrayObserver'),
    Context: require('./Context'),
    LayoutNode: require('./LayoutNode'),
    ModelView: require('./ModelView'),
    ObjectObserver: require('./ObjectObserver'),
    RenderDispatch: require('./RenderDispatch'),
    RenderNode: require('./RenderNode'),
    RenderHandler: require('./RenderHandler')
};

},{"./ArrayObserver":73,"./Context":74,"./LayoutNode":75,"./ModelView":76,"./ObjectObserver":77,"./RenderDispatch":78,"./RenderHandler":79,"./RenderNode":80}],82:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],83:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":86,"dup":2}],84:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":83,"./TweenTransition":85,"dup":3}],85:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":82,"dup":4}],86:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],87:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":82,"./MultipleTransition":83,"./Transitionable":84,"./TweenTransition":85,"./after":86,"dup":6}],88:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"./Position":96,"dup":7}],89:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"dup":8}],90:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],91:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10,"famous-utilities":242}],92:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11,"famous-math":227,"famous-utilities":242}],93:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"./Position":96,"dup":12}],94:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13,"famous-transitions":87}],95:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"./Position":96,"dup":14}],96:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15,"famous-transitions":87}],97:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"./Position":96,"dup":16}],98:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./Position":96,"dup":17}],99:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18,"famous-transitions":87}],100:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19,"famous-utilities":242}],101:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./Align":88,"./Camera":89,"./EventEmitter":90,"./EventHandler":91,"./GestureHandler":92,"./MountPoint":93,"./Opacity":94,"./Origin":95,"./Position":96,"./Rotation":97,"./Scale":98,"./Size":99,"./UIEventHandler":100,"dup":20}],102:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],103:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":106,"dup":2}],104:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":103,"./TweenTransition":105,"dup":3}],105:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":102,"dup":4}],106:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],107:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":102,"./MultipleTransition":103,"./Transitionable":104,"./TweenTransition":105,"./after":106,"dup":6}],108:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],109:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":107}],110:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":109,"dup":29}],111:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],112:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],113:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],114:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],115:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],116:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":108,"./Color":109,"./ColorPalette":110,"./KeyCodes":111,"./MethodStore":112,"./ObjectManager":113,"./clone":114,"./flatClone":115,"./loadURL":117,"./strip":118,"dup":35}],117:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],118:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],119:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"./Transform":135,"dup":38}],120:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],121:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"./Layer":125,"dup":40}],122:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"./Famous":123,"./Node":129,"./RenderProxy":133,"dup":41}],123:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Clock":120,"./GlobalDispatch":124,"./MessageQueue":127,"dup":42}],124:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-utilities":116}],125:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],126:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./ComponentStore":121,"./RenderContext":132,"./RenderProxy":133,"dup":45}],127:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],128:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"./Align":119,"dup":47}],129:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./LocalDispatch":126,"dup":48}],130:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"dup":49}],131:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],132:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"./Align":119,"./MountPoint":128,"./Opacity":130,"./Origin":131,"./Size":134,"./Transform":135,"dup":51,"famous-utilities":116}],133:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],134:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"dup":53}],135:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],136:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"./Align":119,"./Clock":120,"./ComponentStore":121,"./Context":122,"./Famous":123,"./GlobalDispatch":124,"./Layer":125,"./LocalDispatch":126,"./MountPoint":128,"./Node":129,"./Opacity":130,"./Origin":131,"./RenderContext":132,"./RenderProxy":133,"./Size":134,"./Transform":135,"dup":55}],137:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],138:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":141,"dup":2}],139:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":138,"./TweenTransition":140,"dup":3}],140:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":137,"dup":4}],141:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],142:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":137,"./MultipleTransition":138,"./Transitionable":139,"./TweenTransition":140,"./after":141,"dup":6}],143:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],144:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":142}],145:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":144,"dup":29}],146:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],147:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],148:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],149:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],150:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],151:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":143,"./Color":144,"./ColorPalette":145,"./KeyCodes":146,"./MethodStore":147,"./ObjectManager":148,"./clone":149,"./flatClone":150,"./loadURL":152,"./strip":153,"dup":35}],152:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],153:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],154:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

var ELEMENT = 'element';
var ID = 'id';
var OPACITY = 'opacity';
var WITH = 'WITH';
var CHANGE_TRANSFORM = 'CHANGE_TRANSFORM';
var CHANGE_TRANSFORM_ORIGIN = 'CHANGE_TRANSFORM_ORIGIN';
var CHANGE_PROPERTY = 'CHANGE_PROPERTY';
var CHANGE_TAG = 'CHANGE_TAG';
var CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';
var ADD_CLASS = 'ADD_CLASS';
var REMOVE_CLASS = 'REMOVE_CLASS';
var CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';
var CHANGE_CONTENT = 'CHANGE_CONTENT';
var ADD_EVENT_LISTENER = 'ADD_EVENT_LISTENER';
var EVENT_PROPERTIES = 'EVENT_PROPERTIES';
var EVENT_END = 'EVENT_END';
var RECALL = 'RECALL';

/**
 * The Element class is responsible for providing the API for how
 *   a RenderNode will interact with the DOM API's.  The element is
 *   responsible for adding a set of commands to the renderer.
 *
 * @class HTMLElement
 * @constructor
 * @component
 * @param {RenderNode} RenderNode to which the instance of Element will be a component of
 */
function HTMLElement(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addRenderable(this);
    this._trueSized = [false, false];
    this._size = [0, 0, 0];
    this._queue = [];
    this._callbacks = new CallbackStore();
    this._dispatch.onTransformChange(this._receiveTransformChange.bind(this));
    this._dispatch.onSizeChange(this._receiveSizeChange.bind(this));
    this._dispatch.onOpacityChange(this._receiveOpacityChange.bind(this));
    this._dispatch.onOriginChange(this._receiveOriginChange.bind(this));
    this._receiveTransformChange(this._dispatch.getContext()._transform);
    this._receiveSizeChange(this._dispatch.getContext()._size);
    this._receiveOriginChange(this._dispatch.getContext()._origin);
    this._receiveOpacityChange(this._dispatch.getContext()._opacity);
}

// Return the name of the Element Class: 'element'
HTMLElement.toString = function toString() {
    return ELEMENT;
};

HTMLElement.prototype.clean = function clean() {
    var len = this._queue.length;
    if (len) {
    	var path = this._dispatch.getRenderPath();
    	this._dispatch.sendDrawCommand(WITH).sendDrawCommand(path);
    	for (var i = 0 ; i < len ; i++)
    	    this._dispatch.sendDrawCommand(this._queue.shift());
    }
    return true;
};

HTMLElement.prototype._receiveTransformChange = function _receiveTransformChange(transform) {
    this._dispatch.dirtyRenderable(this._id);
    var queue = this._queue;
    queue.push(CHANGE_TRANSFORM);
    queue.push(transform._matrix[0]);
    queue.push(transform._matrix[1]);
    queue.push(transform._matrix[2]);
    queue.push(transform._matrix[3]);
    queue.push(transform._matrix[4]);
    queue.push(transform._matrix[5]);
    queue.push(transform._matrix[6]);
    queue.push(transform._matrix[7]);
    queue.push(transform._matrix[8]);
    queue.push(transform._matrix[9]);
    queue.push(transform._matrix[10]);
    queue.push(transform._matrix[11]);
    queue.push(transform._matrix[12]);
    queue.push(transform._matrix[13]);
    queue.push(transform._matrix[14]);
    queue.push(transform._matrix[15]);
};

HTMLElement.prototype._receiveSizeChange = function _receiveSizeChange(size) {
    this._dispatch.dirtyRenderable(this._id);
    var width = this._trueSized[0] ? this._trueSized[0] : size._size[0];
    var height = this._trueSized[1] ? this._trueSized[1] : size._size[1];
    this._queue.push('CHANGE_SIZE');
    this._queue.push(width);
    this._queue.push(height);
    this._size[0] = width;
    this._size[1] = height;
};

HTMLElement.prototype._receiveOriginChange = function _receiveOriginChange(origin) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_TRANSFORM_ORIGIN);
    this._queue.push(origin.x);
    this._queue.push(origin.y);
};

HTMLElement.prototype._receiveOpacityChange = function _receiveOpacityChange(opacity) {
    this.property(OPACITY, opacity.value);
};

HTMLElement.prototype.getSize = function getSize() {
    return this._size;
};

HTMLElement.prototype.on = function on (ev, methods, properties) {
    this.eventListener(ev, methods, properties);
    return this;
};

HTMLElement.prototype.kill = function kill () {
    this._dispatch.sendDrawCommand(WITH).sendDrawCommand(this._dispatch.getRenderPath()).sendDrawCommand(RECALL);
};

/**
 * Set the value of a CSS property
 *
 * @method property
 * @chainable
 *
 * @param {String} key name of the property to set
 * @param {Any} value associated value for this property
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.property = function property(key, value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_PROPERTY);
    this._queue.push(key);
    this._queue.push(value);
    return this;
};

/**
 * The method by which a user tells the element to ignore the context
 *   size and get size from the content instead.
 *
 * @method trueSize
 * @chainable
 *
 * @param {Boolean} trueWidth
 * @param {Boolean} trueHeight
 * @return {HTMLElement} this
 */
HTMLElement.prototype.trueSize = function trueSize(trueWidth, trueHeight) {
    if (trueWidth === undefined) trueWidth = true;
    if (trueHeight === undefined) trueHeight = true;

    if (this._trueSized[0] !== trueWidth || this._trueSized[1] !== trueHeight) {
        this._dispatch.dirtyRenderable(this._id);
    }
    this._trueSized[0] = trueWidth;
    this._trueSized[1] = trueHeight;
    return this;
};

/**
 * Set the tag name of the element
 *
 * @method tagName
 * @chainable
 *
 * @param {String} value type of HTML tag
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.tagName = function tagName(value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_TAG);
    this._queue.push(value);
    return this;
};

/**
 * Set an attribute on the DOM element
 *
 * @method attribute
 * @chainable
 *
 * @param {String} key name of the attribute to set
 * @param {Any} value associated value for this attribute
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.attribute = function attribute(key, value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_ATTRIBUTE);
    this._queue.push(key);
    this._queue.push(value);
    return this;
};

/**
 * Define a CSS class to be added to the DOM element
 *
 * @method addClass
 * @chainable
 *
 * @param {String} value name of the class
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.addClass = function addClass(value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(ADD_CLASS);
    this._queue.push(value);
    return this;
};
/**
 * Define a CSS class to be removed from the DOM element
 *
 * @method removeClass
 * @chainable
 *
 * @param {String} value name of the class
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.removeClass = function removeClass(value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(REMOVE_CLASS);
    this._queue.push(value);
    return this;
};

/**
 * Define the id of the DOM element
 *
 * @method id
 * @chainable
 *
 * @param {String} value id
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.id = function id(value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_ATTRIBUTE);
    this._queue.push(ID);
    this._queue.push(value);
    return this;
};

/**
 * Define the content of the DOM element
 *
 * @method content
 * @chainable
 *
 * @param {String | DOM element | Document Fragment} value content to be inserted into the DOM element
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.content = function content(value) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_CONTENT);
    this._queue.push(value);
    return this;
};

/**
 * Get a component of the RenderNode that the HTMLElement component is
 *   attached to by name.
 *
 * @method get
 *
 * @param {String} key name of the component to grab from the RenderNode
 * @return {Component} a component that exists on the RenderNode
 */
HTMLElement.prototype.get = function get (key) {
    return this.owner.get(key);
};

/**
 * Adds a command to add an eventListener to the current DOM HTMLElement.
 *   primarily used internally.
 *
 * @method eventListener
 * @chainable
 *
 * @param {String} ev the name of the DOM event to be targeted
 *
 * @return {Component} this
 */
HTMLElement.prototype.eventListener = function eventListener (ev, methods, properties) {
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(ADD_EVENT_LISTENER);
    this._queue.push(ev);
    if (methods != null) this._queue.push(methods);
    this._queue.push(EVENT_PROPERTIES);
    if (properties != null) this._queue.push(properties);
    this._queue.push(EVENT_END);
    return this;
};

/**
 * isRenderable returns whether or not this HTMLElement currently has any Information to render
 *
 * @method isRenderable
 *
 * @return {Bool} whether or not this HTMLElement can be rendered
 */
HTMLElement.prototype.isRenderable = function isRenderable () {
    return !!this._queue.length;
};

/**
 * Clears the state on the HTMLElement so that it can be rendered next frame.
 *
 * @method clear
 * @chainable
 *
 * @return {HTMLElement} this
 */
HTMLElement.prototype.clear = function clear () {
    this._trueSized[0] = false;
    this._trueSized[1] = false;

    for (var i = 0, l = this._queue.length; i < l; i++)
        this._queue.pop();

    return this;
};

module.exports = HTMLElement;

},{"famous-utilities":151}],155:[function(require,module,exports){
'use strict';

module.exports = {
    HTMLElement: require('./HTMLElement')
};

},{"./HTMLElement":154}],156:[function(require,module,exports){
'use strict';

var DEALLOCATION_ERROR = new Error('Can\'t deallocate non-allocated element');

/**
 * Internal helper object to Container that handles the process of
 *   creating and allocating DOM elements within a managed div.
 *   Private.
 *
 * @class ElementAllocator
 * @constructor
 *
 * @param {DOMElement} container document element in which Famo.us content will be inserted
 */
function ElementAllocator(container) {
    if (!container) container = document.createDocumentFragment();
    this._container = container;
    this._nodeCount = 0;

    this._allocatedNodes = {};
    this._deallocatedNodes = {};
}

/**
 * Allocate an element of specified type from the pool.
 *
 * @method allocate
 *
 * @param {String} type type of element, e.g. 'div'
 *
 * @return {DOMElement} allocated document element
 */
ElementAllocator.prototype.allocate = function allocate(type) {
    type = type.toLowerCase();
    var result;
    var nodeStore = this._deallocatedNodes[type];
    if (nodeStore && nodeStore.length > 0) {
        result = nodeStore.pop();
    }
    else {
        result = document.createElement(type);
        this._container.appendChild(result);
        this._allocatedNodes[type] = this._allocatedNodes[type] ? this._allocatedNodes[type] : [];
        this._allocatedNodes[type].push(result);
    }
    this._nodeCount++;
    result.style.display = '';
    return result;
};

/**
 * De-allocate an element of specified type to the pool.
 *
 * @method deallocate
 *
 * @param {DOMElement} element document element to deallocate
 */
ElementAllocator.prototype.deallocate = function deallocate(element) {
    var type = element.nodeName.toLowerCase();
    this._deallocatedNodes[type] = this._deallocatedNodes[type] ? this._deallocatedNodes[type] : [];
    var allocatedNodeStore = this._allocatedNodes[type];
    var deallocatedNodeStore = this._deallocatedNodes[type];
    if (!allocatedNodeStore) throw DEALLOCATION_ERROR;
    var index = allocatedNodeStore.indexOf(element);
    if (index === -1) throw DEALLOCATION_ERROR;
    allocatedNodeStore.splice(index, 1);
    deallocatedNodeStore.push(element);

    this._nodeCount--;
};

ElementAllocator.prototype.setContainer = function setContainer(container) {
    this._container = container;

    var nodeType, i;
    for (nodeType in this._deallocatedNodes) {
        for (i = 0; i < this._deallocatedNodes[nodeType].length; i++) {
            this._container.appendChild(this._deallocatedNodes[nodeType][i]);
        }
        for (i = 0; i < this._allocatedNodes[nodeType].length; i++) {
            this._container.appendChild(this._allocatedNodes[nodeType][i]);
        }
    }
};


ElementAllocator.prototype.getContainer = function getContainer() {
    return this._container;
};

/**
 * Get count of total allocated nodes in the document.
 *
 * @method getNodeCount
 *
 * @return {Number} total node count
 */
ElementAllocator.prototype.getNodeCount = function getNodeCount() {
    return this._nodeCount;
};

module.exports = ElementAllocator;

},{}],157:[function(require,module,exports){
'use strict';

var ElementAllocator = require('./ElementAllocator');

var CHANGE_TRANSFORM = 'CHANGE_TRANSFORM';
var CHANGE_TRANSFORM_ORIGIN = 'CHANGE_TRANSFORM_ORIGIN';
var CHANGE_PROPERTY = 'CHANGE_PROPERTY';
var ADD_CLASS = 'ADD_CLASS';
var REMOVE_CLASS = 'REMOVE_CLASS';
var CHANGE_CONTENT = 'CHANGE_CONTENT';
var ADD_EVENT_LISTENER = 'ADD_EVENT_LISTENER';
var EVENT_PROPERTIES = 'EVENT_PROPERTIES';
var EVENT_END = 'EVENT_END';
var RECALL = 'RECALL';
var CHANGE_SIZE = 'CHANGE_SIZE';
var CHANGE_TAG = 'CHANGE_TAG';
var CHANGE_ATTRIBUTE = 'CHANGE_ATTRIBUTE';

var DIV = 'div';
var TRANSFORM = 'transform';
var TRANSFORM_ORIGIN = 'transform-origin';
var FA_SURFACE = 'fa-surface';
var ZERO_COMMA = '0,';
var MATRIX3D = 'matrix3d(';
var COMMA = ',';
var CLOSE_PAREN = ')';

var PERCENT = '%';
var PERCENT_SPACE = '% ';

var vendorPrefixes = ['', '-ms-', '-webkit-', '-moz-', '-o-'];

function vendorPrefix(property) {
    for (var i = 0; i < vendorPrefixes.length; i++) {
        var prefixed = vendorPrefixes[i] + property;
        if (document.documentElement.style[prefixed] === '') {
            return prefixed;
        }
    }
    return property;
}

var VENDOR_TRANSFORM = vendorPrefix(TRANSFORM);
var VENDOR_TRANSFORM_ORIGIN = vendorPrefix(TRANSFORM_ORIGIN);

function VirtualElement (target, path, renderer, parent, rootElement, root) {
    this._path = path;
    this._target = target;
    this._renderer = renderer;
    this._parent = parent;
    this._receivedMatrix = new Float32Array(16);
    this._finalMatrix = new Float32Array(16);
    this._invertedParent = [];
    target.classList.add(FA_SURFACE);
    this._allocator = new ElementAllocator(target);
    this._properties = {};
    this._attributes = {};
    this._eventListeners = {};
    this._content = '';
    this._children = {};
    this._size = [0, 0, 0];
    this._tagName = DIV;
    this._origin = [0, 0];
    this._rootElement = rootElement || this;
    this._finalTransform = new Float32Array(16);
    this._MV = new Float32Array(16);
    this._perspectiveTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    this._isRoot = root ? root : false;
}

VirtualElement.prototype.getTarget = function getTarget () {
    return this._target;
};

VirtualElement.prototype.changeTag = function changeTag (tagName) {
    this._tagName = tagName;
    var oldTarget = this._target;
    var newTarget = document.createElement(tagName);
    this._allocator.setContainer(newTarget);

    this._target = newTarget;

    this.setMatrix.apply(this, this._finalMatrix);
    newTarget.classList.add(FA_SURFACE);

    var key;
    for (key in this._properties) {
        newTarget.style[key] = this._properties[key];
    }

    for (key in this._attributes) {
        newTarget.setAttribute(key, this._attributes[key]);
    }
    
    var i;
    for (key in this._eventListeners) {
        for (i = 0; i < this._eventListeners[key].length; i++) {
            newTarget.addEventListener(key, this._eventListeners[key]);

            // prevent possible memory leaks in IE
            oldTarget.removeEventListener(key, this._eventListeners[key]);
        }
    }

    this.setContent(this._content);

    for (key in this._children) {
        this._target.appendChild(this._children[key].getTarget());
    }
    
    var parentNode = oldTarget.parentNode;
    parentNode.insertBefore(newTarget, oldTarget);
    parentNode.removeChild(oldTarget);
};

VirtualElement.prototype.getOrSetElement = function getOrSetElement (path, index) {
    if (this._children[index]) return this._children[index];
    var div = this._allocator.allocate(this._tagName);
    var child = new VirtualElement(div, path, this._renderer, this, this._rootElement);
    this._children[index] = child;
    return child;
};

VirtualElement.prototype.receive = function receive (commands) {
    var command = commands.shift();
    switch (command) {
        case CHANGE_TRANSFORM:
            this.setMatrix(
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift(),
                commands.shift()
            );
            break;
        case CHANGE_TRANSFORM_ORIGIN:
            this._origin[0] = commands[0];
            this._origin[1] = commands[1];
            this.setProperty(VENDOR_TRANSFORM_ORIGIN, stringifyTransformOrigin(commands));
            break;
            case CHANGE_SIZE:
                var width = commands.shift();
                var height = commands.shift();
                this._size[0] = width;
                this._size[1] = height;
                if (width !== true) {
                    this.setProperty('width', width + 'px');
                } else {
                    this.setProperty('width', '');
                }
                if (height !== true) {
                    this.setProperty('height', height + 'px');
                } else {
                    this.setProperty('height', '');
                }
                break;
        case CHANGE_PROPERTY:
            this.setProperty(commands.shift(), commands.shift());
            break;
        case CHANGE_TAG:
            this.changeTag(commands.shift());
            break;
        case CHANGE_CONTENT:
            this.setContent(commands.shift());
            break;
        case CHANGE_ATTRIBUTE:
            this.setAttribute(commands.shift(), commands.shift());
            break;
        case ADD_CLASS:
            this.addClass(commands.shift());
            break;
        case REMOVE_CLASS:
            this.removeClass(commands.shift());
            break;
        case ADD_EVENT_LISTENER:
            var ev = commands.shift();
            var methods;
            var properties;
            var c;
            while ((c = commands.shift()) !== EVENT_PROPERTIES) methods = c;
            while ((c = commands.shift()) !== EVENT_END) properties = c;
            methods = methods || [];
            properties = properties || [];
            this.addEventListener(ev, this.dispatchEvent.bind(this, ev, methods, properties));
            break;
        case RECALL:
            this.setProperty('display', 'none');
            this._parent._allocator.deallocate(this._target);
            break;
        default: commands.unshift(command); return;
    }
};

function _mirror(item, target, reference) {
    var i, len;
    var key, keys;
    if (typeof item === 'string' || typeof item === 'number') target[item] = reference[item];
    else if (Array.isArray(item)) {
        for (i = 0, len = item.length; i < len; i++) {
            _mirror(item[i], target, reference);
        }
    }
    else {
        keys = Object.keys(item);
        for (i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            if (reference[key]) {
                target[key] = {};
                _mirror(item[key], target[key], reference[key])
            }
        }
    }
}

function _stripEvent (ev, methods, properties) {
    var result = {};
    var i, len;
    for (i = 0, len = methods.length; i < len; i++) {
        ev[methods[i]]();
    }
    for (i = 0, len = properties.length; i < len; i++) {
        var prop = properties[i];
        _mirror(prop, result, ev);
    }
    switch (ev.type) {
        case 'mousedown':
        case 'mouseup':
        case 'click':
            result.x = ev.x;
            result.y = ev.y;
            result.timeStamp = ev.timeStamp;
            break;
        case 'mousemove':
            result.x = ev.x;
            result.y = ev.y;
            result.movementX = ev.movementX;
            result.movementY = ev.movementY;
            break;
        case 'wheel':
            result.deltaX = ev.deltaX;
            result.deltaY = ev.deltaY;
            break;
    }
    return result;
}

VirtualElement.prototype.dispatchEvent = function (ev, methods, properties, payload) {
    this._renderer.sendEvent(this._path, ev, _stripEvent(payload, methods, properties));
};

VirtualElement.prototype._getSize = function _getSize () {
    this._size[0] = this._target.offsetWidth;
    this._size[1] = this._target.offsetHeight;
    return this._size;
};

VirtualElement.prototype.draw = function draw(renderState) {
    var m = this._finalMatrix;
    var perspectiveTransform = renderState.perspectiveTransform;

    this._perspectiveTransform[8] = perspectiveTransform[11] * ((this._rootElement._size[0] * 0.5) - (this._size[0] * this._origin[0])),
    this._perspectiveTransform[9] = perspectiveTransform[11] * ((this._rootElement._size[1] * 0.5) - (this._size[1] * this._origin[1]));
    this._perspectiveTransform[11] = perspectiveTransform[11];

    if (this._parent) {
        invert(this._invertedParent, this._parent._receivedMatrix);
        multiply(this._finalMatrix, this._invertedParent, this._receivedMatrix);
    }

    if (this._parent._isRoot) {
        multiply(
            this._MV,
            renderState.viewTransform,
            this._finalMatrix
        );

        multiply(
            this._finalTransform,
            this._perspectiveTransform,
            this._MV
        );
    }

    var finalTransform = this._parent._isRoot ? this._finalTransform : this._finalMatrix;

    this._target.style[VENDOR_TRANSFORM] = stringifyMatrix(finalTransform);
};

VirtualElement.prototype.setMatrix = function setMatrix (m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15) {
    this._receivedMatrix[0] = m0;
    this._receivedMatrix[1] = m1;
    this._receivedMatrix[2] = m2;
    this._receivedMatrix[3] = m3;
    this._receivedMatrix[4] = m4;
    this._receivedMatrix[5] = m5;
    this._receivedMatrix[6] = m6;
    this._receivedMatrix[7] = m7;
    this._receivedMatrix[8] = m8;
    this._receivedMatrix[9] = m9;
    this._receivedMatrix[10] = m10;
    this._receivedMatrix[11] = m11;
    this._receivedMatrix[12] = m12;
    this._receivedMatrix[13] = m13;
    this._receivedMatrix[14] = m14;
    this._receivedMatrix[15] = m15;

    this._finalMatrix[0] = m0;
    this._finalMatrix[1] = m1;
    this._finalMatrix[2] = m2;
    this._finalMatrix[3] = m3;
    this._finalMatrix[4] = m4;
    this._finalMatrix[5] = m5;
    this._finalMatrix[6] = m6;
    this._finalMatrix[7] = m7;
    this._finalMatrix[8] = m8;
    this._finalMatrix[9] = m9;
    this._finalMatrix[10] = m10;
    this._finalMatrix[11] = m11;
    this._finalMatrix[12] = m12;
    this._finalMatrix[13] = m13;
    this._finalMatrix[14] = m14;
    this._finalMatrix[15] = m15;
};

VirtualElement.prototype.addClass = function addClass (className) {
    this._target.classList.add(className);
};

VirtualElement.prototype.removeClass = function removeClass (className) {
    this._target.classList.remove(className);
};

VirtualElement.prototype.setProperty = function setProperty (key, value) {
    if (this._properties[key] !== value) {
        this._properties[key] = value;
        this._target.style[key] = value;
    }
};

VirtualElement.prototype.setAttribute = function setAttribute (key, value) {
    if (this._attributes[key] !== value) {
        this._attributes[key] = value;
        this._target.setAttribute(key, value);
    }
};

VirtualElement.prototype.setContent = function setContent (content) {
    if (this._content !== content) {
        this._content = content;
        this._target.innerHTML = content;
    }
};

VirtualElement.prototype.addEventListener = function addEventListener (name, listener) {
    this._eventListeners[name] = this._eventListeners[name] || [];
    if (this._eventListeners[name].indexOf(listener) === -1) {
        this._eventListeners[name].push(listener);
        this._target.addEventListener(name, listener);
    }
};

VirtualElement.prototype.removeEventListener = function removeEventListener (name, listener) {
    if (this._eventListeners[name]) {
        var index = this._eventListeners[name].indexOf(listener);
        if (index !== -1) {
            this._eventListeners[name].splice(index, 1);
            this._target.removeEventListener(name, listener);
        }
    }
};

/**
 * A helper function for serializing a transform its corresponding
 * css string representation.
 *
 * @method stringifyMatrix
 * @private
 *
 * @param {Transform} A sixteen value transform.
 *
 * @return {String} a string of format "matrix3d(m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15)"
 */
function stringifyMatrix(m) {
    var r = MATRIX3D;

    r += (m[0] < 0.000001 && m[0] > -0.000001) ? ZERO_COMMA : m[0] + COMMA;
    r += (m[1] < 0.000001 && m[1] > -0.000001) ? ZERO_COMMA : m[1] + COMMA;
    r += (m[2] < 0.000001 && m[2] > -0.000001) ? ZERO_COMMA : m[2] + COMMA;
    r += (m[3] < 0.000001 && m[3] > -0.000001) ? ZERO_COMMA : m[3] + COMMA;
    r += (m[4] < 0.000001 && m[4] > -0.000001) ? ZERO_COMMA : m[4] + COMMA;
    r += (m[5] < 0.000001 && m[5] > -0.000001) ? ZERO_COMMA : m[5] + COMMA;
    r += (m[6] < 0.000001 && m[6] > -0.000001) ? ZERO_COMMA : m[6] + COMMA;
    r += (m[7] < 0.000001 && m[7] > -0.000001) ? ZERO_COMMA : m[7] + COMMA;
    r += (m[8] < 0.000001 && m[8] > -0.000001) ? ZERO_COMMA : m[8] + COMMA;
    r += (m[9] < 0.000001 && m[9] > -0.000001) ? ZERO_COMMA : m[9] + COMMA;
    r += (m[10] < 0.000001 && m[10] > -0.000001) ? ZERO_COMMA : m[10] + COMMA;
    r += (m[11] < 0.000001 && m[11] > -0.000001) ? ZERO_COMMA : m[11] + COMMA;
    r += (m[12] < 0.000001 && m[12] > -0.000001) ? ZERO_COMMA : m[12] + COMMA;
    r += (m[13] < 0.000001 && m[13] > -0.000001) ? ZERO_COMMA : m[13] + COMMA;
    r += (m[14] < 0.000001 && m[14] > -0.000001) ? ZERO_COMMA : m[14] + COMMA;

    r += m[15] + CLOSE_PAREN;
    return r;
}

function invert (out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) {
        return null;
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
}

function multiply (out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3],
        b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7],
        b8 = b[8], b9 = b[9], b10 = b[10], b11 = b[11],
        b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b4; b1 = b5; b2 = b6; b3 = b7;
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b8; b1 = b9; b2 = b10; b3 = b11;
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b12; b1 = b13; b2 = b14; b3 = b15;
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return out;
}

function stringifyTransformOrigin(commands) {
    return (commands.shift() * 100) + PERCENT_SPACE + (commands.shift() * 100) + PERCENT;
}

module.exports = VirtualElement;

},{"./ElementAllocator":156}],158:[function(require,module,exports){
'use strict';

module.exports = {
    ElementAllocator: require('./ElementAllocator'),
    VirtualElement: require('./VirtualElement')
};

},{"./ElementAllocator":156,"./VirtualElement":157}],159:[function(require,module,exports){
'use strict';

module.exports = {
    requestAnimationFrame: require('./requestAnimationFrame')
};

},{"./requestAnimationFrame":160}],160:[function(require,module,exports){
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
 
// MIT license

'use strict';

var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];

var rAF;

if (typeof window === 'object') {
    rAF = window.requestAnimationFrame;
    for(var x = 0; x < vendors.length && !rAF; ++x) {
        rAF = window[vendors[x]+'RequestAnimationFrame'];
    }
}

rAF = rAF || function(callback) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = setTimeout(function() { callback(currTime + timeToCall); }, 
      timeToCall);
    lastTime = currTime + timeToCall;
    return id;
};

module.exports = rAF;

},{}],161:[function(require,module,exports){
'use strict';

var polyfills = require('famous-polyfills');
var rAF = polyfills.requestAnimationFrame;

var _now;
if (typeof performance !== 'undefined') {
    _now = function() {
        return performance.now();
    };
}
else {
    _now = Date.now;
}

if (typeof document !== 'undefined') {
    var VENDOR_HIDDEN, VENDOR_VISIBILITY_CHANGE;

    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
        VENDOR_HIDDEN = 'hidden';
        VENDOR_VISIBILITY_CHANGE = 'visibilitychange';
    }
    else if (typeof document.mozHidden !== 'undefined') {
        VENDOR_HIDDEN = 'mozHidden';
        VENDOR_VISIBILITY_CHANGE = 'mozvisibilitychange';
    }
    else if (typeof document.msHidden !== 'undefined') {
        VENDOR_HIDDEN = 'msHidden';
        VENDOR_VISIBILITY_CHANGE = 'msvisibilitychange';
    }
    else if (typeof document.webkitHidden !== 'undefined') {
        VENDOR_HIDDEN = 'webkitHidden';
        VENDOR_VISIBILITY_CHANGE = 'webkitvisibilitychange';
    }
}

function Engine() {
    this._updates = [];
    var _this = this;
    this.looper = function(time) {
        _this.loop(time);
    };
    this._stoppedAt = _now();
    this._sleep = 0;
    this._startOnVisibilityChange = true;
    this.start();
    rAF(this.looper);

    if (typeof document !== 'undefined') {
        var _this = this;
        document.addEventListener(VENDOR_VISIBILITY_CHANGE, function() {
            if (document[VENDOR_HIDDEN]) {
                var startOnVisibilityChange = _this._startOnVisibilityChange;
                _this.stop();
                _this._startOnVisibilityChange = startOnVisibilityChange;
            }
            else {
                if (_this._startOnVisibilityChange) {
                    _this.start();
                }
            }
        });
    }
}

Engine.prototype.start = function start() {
    this._startOnVisibilityChange = true;
    this._running = true;
    this._sleep += _now() - this._stoppedAt;
    return this;
};

Engine.prototype.stop = function stop() {
    this._startOnVisibilityChange = false;
    this._running = false;
    this._stoppedAt = _now();
    return this;
};

Engine.prototype.isRunning = function isRunning() {
    return this._running;
};

Engine.prototype.step = function step (time) {
    for (var i = 0, len = this._updates.length ; i < len ; i++) {
        this._updates[i].update(time);
    }
    return this;
};

Engine.prototype.loop = function loop(time) {
    this.step(time - this._sleep);
    if (this._running) {
        rAF(this.looper);
    }
    return this;
};

Engine.prototype.update = function update(item) {
    if (this._updates.indexOf(item) === -1) this._updates.push(item);
    return this;
};

Engine.prototype.noLongerUpdate = function noLongerUpdate(item) {
    var index = this._updates.indexOf(item);
    if (index > -1) {
        this._updates.splice(index, 1);
    }
    return this;
};

module.exports = Engine;

},{"famous-polyfills":159}],162:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],163:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":166,"dup":2}],164:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":163,"./TweenTransition":165,"dup":3}],165:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":162,"dup":4}],166:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],167:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":162,"./MultipleTransition":163,"./Transitionable":164,"./TweenTransition":165,"./after":166,"dup":6}],168:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],169:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":167}],170:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":169,"dup":29}],171:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],172:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],173:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],174:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],175:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],176:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":168,"./Color":169,"./ColorPalette":170,"./KeyCodes":171,"./MethodStore":172,"./ObjectManager":173,"./clone":174,"./flatClone":175,"./loadURL":177,"./strip":178,"dup":35}],177:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],178:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],179:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

function EventHandler (eventList) {
    function GlobalEventHandler (model, dispatch) {
        this._events = new CallbackStore();
        for (var i = 0, len = eventList.length ; i < len ; i++) {
            if (model.constructor.prototype[eventList[i]]) {
                this._events.on(eventList[i], model[eventList[i]].bind(model));
                dispatch.registerGlobalEvent(eventList[i], this.trigger.bind(this, eventList[i]));
            }
        }
    }

    GlobalEventHandler.prototype.trigger = function trigger (ev, payload) {
        this._events.trigger(ev, payload);
    };

    return GlobalEventHandler;
}

module.exports = EventHandler;

},{"famous-utilities":176}],180:[function(require,module,exports){
arguments[4][79][0].apply(exports,arguments)
},{"dup":79,"famous-utilities":176}],181:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

var relaventEvents = ['mousedown', 'mousemove', 'mouseup'];
var modelEvents = ['swipeStart', 'swipe', 'swipeEnd'];

function Swipe (model, dispatch) {
    this._events = new CallbackStore();
    var renderables = dispatch.getRenderables();
    
    for (var i = 0, len = renderables.length ; i < len ; i++)
        for (var j = 0, len2 = relaventEvents.length ; j < len2 ; j++)
            if (renderables[i].on) {
                renderables[i].on(relaventEvents[j]);
                dispatch.registerTargetedEvent(relaventEvents[j], this.trigger.bind(this, relaventEvents[j]));
            }

    for (i = 0, len = modelEvents.length ; i < len ; i++)
        if (model.constructor.prototype[modelEvents[i]])
            this._events.on(relaventEvents[i], model[modelEvents[i]].bind(model));

    this._isSwiping = false
}

Swipe.prototype.trigger = function trigger (event, payload) {
    if (event === 'mousedown') this._isSwiping = true;
    if (event === 'mouseup') {
        this._isSwiping = false;
        this._events.trigger(event, payload);
    }
    if (this._isSwiping) this._events.trigger(event, payload);
}

module.exports = Swipe;

},{"famous-utilities":176}],182:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

function UIEvents (eventList) {
    function DOMEventHandler (model, dispatch) {
        this._events = new CallbackStore();
        var boundEvents = [];
        for (var i = 0, len = eventList.length ; i < len ; i++) {
            var eventName = eventList[i].name || eventList[i];
            if (model.constructor.prototype[eventName]) {
                this._events.on(eventName, model[eventName].bind(model));
                boundEvents.push(eventList[i]);
            }
        }
        var renderables = dispatch.getRenderables();
        for (i = 0, len = renderables.length ; i < len ; i++)
            for (var j = 0, len2 = boundEvents.length ; j < len2 ; j++) {
                var eventName = boundEvents[j].name || boundEvents[j];
                var methods = boundEvents[j].methods || null;
                var properties = boundEvents[j].properties || null;
                if (renderables[i].on) renderables[i].on(eventName, methods, properties);
                dispatch.registerTargetedEvent(eventName, this.trigger.bind(this, eventName));
            }
    }

    DOMEventHandler.prototype.trigger = function trigger (event, payload) {
        this._events.trigger(event, payload);
    };

    return DOMEventHandler;
}

module.exports = UIEvents;

},{"famous-utilities":176}],183:[function(require,module,exports){
'use strict';

module.exports = {
    EventHandler: require('./EventHandler'),
    UIEvents: require('./UIEvents'),
    Swipe: require('./Swipe'),
    RenderHandler: require('./RenderHandler')
};

},{"./EventHandler":179,"./RenderHandler":180,"./Swipe":181,"./UIEvents":182}],184:[function(require,module,exports){
module.exports = {
    'API': require('./api/src'),
    'Components': require('./components/src'),
    'Core': require('./core/src'),
    'DOMRenderables': require('./dom-renderables/src'),
    'DOMRenderers': require('./dom-renderers/src'),
    'Engine': require('./engine/src'),
    'Handlers': require('./handlers/src'),
    'Layouts': require('./layouts/src'),
    'Math': require('./math/src'),
    'Physics': require('./physics/src'),
    'Polyfills': require('./polyfills/src'),
    'Renderers': require('./renderers/src'),
    'Router': require('./router/src'),
    'Stylesheets': require('./stylesheets/src'),
    'Transitions': require('./transitions/src'),
    'Utilities': require('./utilities/src'),
    'WebGLGeometries': require('./webgl-geometries/src'),
    'WebGLMaterials': require('./webgl-materials/src'),
    'WebGLRenderables': require('./webgl-renderables/src'),
    'WebGLRenderers': require('./webgl-renderers/src'),
    'WebGLShaders': require('./webgl-shaders/src')
};

},{"./api/src":81,"./components/src":101,"./core/src":136,"./dom-renderables/src":155,"./dom-renderers/src":158,"./engine/src":161,"./handlers/src":183,"./layouts/src":197,"./math/src":202,"./physics/src":294,"./polyfills/src":295,"./renderers/src":331,"./router/src":334,"./stylesheets/src":337,"./transitions/src":343,"./utilities/src":358,"./webgl-geometries/src":387,"./webgl-materials/src":401,"./webgl-renderables/src":458,"./webgl-renderers/src":488,"./webgl-shaders/src":491}],185:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],186:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":189,"dup":2}],187:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":186,"./TweenTransition":188,"dup":3}],188:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":185,"dup":4}],189:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],190:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":185,"./MultipleTransition":186,"./Transitionable":187,"./TweenTransition":188,"./after":189,"dup":6}],191:[function(require,module,exports){
'use strict';

/**
 * A function returning a function to be set
 *  to a View's layout function. It adds up the sum
 *  of the ratios and sets the size of a context
 *  based the value of each ratio divided by the sum. True
 *  sizing may optionally be set passing in a numeric string or
 *  an object with a size property instead of a ratio value.
 *
 * @param {Object} layout params.
 *
 * @example
 *
 * var layout = Layout.FlexibleLayout({
 *     direction: 1       // <--- optional (0 = horizontal, 1 = vertical)
 *     ratios: [1, '100', 3, {size: 200}]  // <--- An array of ratios/coefficients or true sizes
 * });
 *
 * By default direction is horizontal.
 *
 * Ratio values may also be either a function or a Transitionable.
 * ( ex: ratios: [1, 1, transitionable] ) or
 * ( ex: ratios: [1, 1, function(curr, prev, i) { return 1; }] )
 *
 */
function FlexibleLayout(options) {
    options = options || FlexibleLayout.DEFAULT;
    if (options.direction === undefined)
        options.direction = FlexibleLayout.DEFAULT.direction;
    options.ratios = options.ratios || FlexibleLayout.DEFAULT.ratios;

    return function(curr, prev, i, isTransitioned) {
        var context = this;
        return _layout(options, context, curr, prev, i, isTransitioned);
    };
}

FlexibleLayout.DEFAULT = {
    direction: 0,
    ratios: [1]
};

function _layout(options, context, curr, prev, i, isTransitioned) {
    var contextSize = context.size.get();
    var offsets = [0];
    var sizes = [];
    var size = [0, 0, 0];
    var translation = [0, 0, 0];
    var ratioSum = 0;
    var trueSum = 0;

    for (var j = 0; j < options.ratios.length; j++) {
        if (typeof(options.ratios[j]) === 'function')
            ratioSum += options.ratios[j].call(context, curr, prev, i);
        if (typeof(options.ratios[j]) === 'number')
            ratioSum += options.ratios[j];
        if (typeof(options.ratios[j]) === 'string')
            trueSum += parseInt(options.ratios[j]);
        if (typeof(options.ratios[j]) === 'object') {
            if (typeof(options.ratios[j].get) === 'function') {
                ratioSum += options.ratios[j].get()
            }
            else if (options.ratios[j].size) {
                trueSum += options.ratios[j].size;
            }
        }
    }

    for (j = 0; j < options.ratios.length; j++) {
        if (typeof(options.ratios[j]) === 'function')
            sizes.push((options.ratios[j].call(context, curr, prev, i) / ratioSum) * (contextSize[options.direction] - trueSum));
        if (typeof(options.ratios[j]) === 'number')
            sizes.push((options.ratios[j] / ratioSum) * (contextSize[options.direction] - trueSum));
        if (typeof(options.ratios[j]) === 'string')
            sizes.push(parseInt(options.ratios[j]));
        if (typeof(options.ratios[j]) === 'object') {
            if (typeof(options.ratios[j].get) === 'function') {
                sizes.push((options.ratios[j].get() / ratioSum) * (contextSize[options.direction] - trueSum));
            }
            else if (options.ratios[j].size) {
                sizes.push(options.ratios[j].size);
            }
        }
        offsets.push(sizes[j] + offsets[j]);
    }

    if (i < options.ratios.length - 1) {
        if (options.direction) {
            size = [contextSize[0], Math.ceil(sizes[i]), 0];
        }
        else {
            size = [Math.ceil(sizes[i]), contextSize[1], 0];
        }
    }
    else if (i === options.ratios.length - 1) {
        if (options.direction) {
            size = [contextSize[0], Math.ceil(contextSize[1] - offsets[i]), 0];
        }
        else {
            size = [contextSize[0] - offsets[i], contextSize[1], 0];
        }
    }

    translation = [offsets[i] * !options.direction, offsets[i] * options.direction, 0];

    if (!isTransitioned) {
        curr.setSize(size[0], size[1]);
        curr.setPosition(translation[0], translation[1], translation[2]);
    }

    return {
        size: size,
        translation: translation,
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    };
}

module.exports = FlexibleLayout;

},{}],192:[function(require,module,exports){
'use strict';

/**
 * A function returning a function to be set
 *  to a View's layout function.
 *
 * @param {Object} layout params.
 *
 * @example
 *
 * var layout = Layout.GridLayout({
 *      direction: 1,     // <--- optional (0 = horizontal, 1 = vertical)
 *      dimensions: [2, 2],   // <--- set number of columns and rows
 *      margin: [50, 50], // <--- optional (set margin, default is [0, 0])
 *      offset: [0, 0]    // <--- optional (set View's offset)
 * });
 *
 * By default direction is horizontal.
 *
 * A function may be used for margin values.
 * (ex: margin: [50, function() { return transitionable.get(); })]
 *
 */
function GridLayout(options) {
    options = options || GridLayout.DEFAULT;
    options.dimensions = options.dimensions || GridLayout.DEFAULT.dimensions;
    options.margin = options.margin || GridLayout.DEFAULT.margin;
    options.offset = options.offset || GridLayout.DEFAULT.offset;
    options.direction = options.direction || GridLayout.DEFAULT.direction;
    options.dimensions[0] = options.dimensions[0] || 1;
    options.dimensions[1] = options.dimensions[1] || 1;

    return function(curr, prev, i, isTransitioned) {
        var context = this;
        return _layout(options, context, curr, prev, i, isTransitioned);
    };
}

GridLayout.DEFAULT = {
    direction: 0,
    dimensions: [2, 2],
    margin: [0, 0],
    offset: [0, 0]
};

function _layout (options, context, curr, prev, i, isTransitioned) {
    var contextSize = context.size.get();
    var translation = [0, 0, 0];
    var size = [0, 0, 0];
    var margin = [0, 0];

    for (var j = 0; j < 2; j++) {
        if (typeof(options.margin[j]) === 'function') {
            margin[j] = options.margin[j].call(context, curr, prev, i);
        }
        else if (typeof(options.margin[j]) === 'object') {
            if (typeof(options.margin[j].get) === 'function')
                margin[j] = options.margin[j].get();
        }
        else {
            margin[j] = options.margin[j];
        }
        size[j] = Math.ceil(contextSize[j] / options.dimensions[j]);
        size[j] -= margin[j];
    }

    if (!options.direction) {
        translation[0] = (i % options.dimensions[0]) * (size[0] + margin[0]);
        translation[1] = (size[1] + margin[1]) * ((i / options.dimensions[0])|0);
    }
    else {
        translation[0] = (size[0] + margin[0]) * ((i / options.dimensions[1])|0);
        translation[1] = (i % options.dimensions[1]) * (size[1] + margin[1]);
    }

    translation[0] += (margin[0] * 0.5) + options.offset[0];
    translation[1] += (margin[1] * 0.5) + options.offset[1];

    if (!isTransitioned) {
        curr.setPosition(translation[0], translation[1], translation[2]);
        curr.setSize(size[0], size[1]);
    }

    return {
        size: size,
        translation: translation,
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    };
}

module.exports = GridLayout;

},{}],193:[function(require,module,exports){
'use strict';

/**
 * A function returning a function to be set
 *  to a View's layout function.
 *
 * @param {Object} layout params.
 *
 * @example
 *
 * var layout = Layout.HeaderFooterLayout({
 *      displayHeader: true, // <--- Optional (default: true)
 *      displayFooter: true, // <--- Optional (default: true)
 *      floatHeader: false,  // <--- Optional (default: false)
 *      floatFooter: false,  // <--- Optional (default: false)
 *      headerSize: 100,     // <--- Optional (default: 100)
 *      footerSize: 100      // <--- Optional (default: 100)
 *
 * });
 *
 * HeaderFooterLayout will use the first 3 Views if displayHeader and
 * displayFooter are both true. If either is false it will use the first
 * 2 views. If both are false only the first view is used as the content.
 *
 * A function may be used for headerSize and footerSize values.
 * (ex: footerSize: function() { return transitionable.get(); })
 *
 */

function HeaderFooterLayout(options) {
    options = options || HeaderFooterLayout.DEFAULT;

    if (options.displayHeader === undefined)
        options.displayHeader = HeaderFooterLayout.DEFAULT.displayHeader;

    if (options.displayFooter === undefined)
        options.displayFooter = HeaderFooterLayout.DEFAULT.displayFooter;

    if (options.floatHeader === undefined)
        options.floatHeader = HeaderFooterLayout.DEFAULT.floatHeader;

    if (options.floatFooter === undefined)
        options.floatFooter = HeaderFooterLayout.DEFAULT.floatFooter;

    options.headerSize = options.headerSize || HeaderFooterLayout.DEFAULT.headerSize;
    options.footerSize = options.footerSize || HeaderFooterLayout.DEFAULT.footerSize;

    return function(curr, prev, i, next, isTransitioned) {
        var context = this;
        return _layout(options, context, curr, prev, i, isTransitioned);
    };
}

HeaderFooterLayout.DEFAULT = {
    displayHeader: true,
    displayFooter: true,
    floatHeader: false,
    floatFooter: false,
    headerSize: 100,
    footerSize: 100
};

function _layout(options, context, curr, prev, i, isTransitioned) {
    var contextSize = context.size.get();
    var size = [contextSize[0], 0, 0];
    var translation = [0, 0, 0];
    var headerSize = options.headerSize;
    var footerSize = options.footerSize;

    options.floatHeader = options.displayHeader ? options.floatHeader : false;
    options.floatFooter = options.displayFooter ? options.floatFooter : false;

    if (typeof(headerSize) === 'function') {
        headerSize = headerSize.call(context, curr, prev, i);
    }
    else if (typeof(headerSize) === 'object') {
        if (typeof(headerSize.get) === 'function') headerSize = headerSize.get();
    }

    if (typeof(footerSize) === 'function') {
        footerSize = footerSize.call(context, curr, prev, i);
    }
    else if (typeof(footerSize) === 'object') {
        if (typeof(footerSize.get) === 'function') footerSize = footerSize.get();
    }

    if (i === 0) {
        size = [contextSize[0],
            (headerSize * options.displayHeader) +
            (contextSize[1] - (footerSize * options.displayFooter * !options.floatFooter)) *
            !options.displayHeader, contextSize[2]];
    }
    else if (i === 1) {
        translation = [0, ((contextSize[1] - footerSize) * options.floatFooter
            * !options.displayHeader) || prev.getSize()[1] * !options.floatHeader, 0];

        size = [contextSize[0],
            (options.floatFooter * !options.displayHeader * footerSize) || contextSize[1] -
            ((prev.getSize()[1] * !options.floatHeader) +
            (footerSize * options.displayFooter * options.displayHeader *
            !options.floatFooter)), contextSize[2]];
    }
    else if (i === 2) {
        translation = [0, contextSize[1] - (footerSize * options.displayFooter),  0];
        size = [contextSize[0], footerSize * options.displayFooter * options.displayHeader, contextSize[2]];
    }
    else {
        translation = [0, contextSize[1], 0];
        size = [contextSize[0], footerSize, 0];
    }

    if (!isTransitioned) {
        curr.setSize(size[0], size[1], size[2]);
        curr.setPosition(translation[0], translation[1], translation[2]);
    }

    return {
        size: size,
        translation: translation,
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    };
}

module.exports = HeaderFooterLayout;

},{}],194:[function(require,module,exports){
'use strict';

var TransitionableLayout = require('./TransitionableLayout');
var Transitionable = require('famous-transitions').Transitionable;
/**
 * @class LayoutTransition
 * @constructor
 *
 * @param {Function} layout Function
 *
 * @example
 * var layoutA = Layout.GridLayout({
 *    dimensions: [2, 3],
 *    direction: 0
 * });
 *
 * var layoutB = Layout.GridLayout({
 *    dimensions: [6, 1],
 *    direction: 1
 * });
 *
 * var layoutTransition = Layout.LayoutTransition(layoutA);
 * layoutTransition.transitionTo(layoutB, {curve: 'easeInOut', duration: 500});
 *
 * AppView.prototype.layout = layout.layout;
 *
 */
function LayoutTransition (layout) {
    if (!(this instanceof LayoutTransition)) return new LayoutTransition(layout);

    this.options = {
        start: layout,
        end: null,
        transition:  new Transitionable(0)
    };
    LayoutTransition.transitionableLayout = TransitionableLayout(this.options);
}

/**
 * Set the layout to next transition to. Pass in a layout function, an easing curve,
 * and an optional callback to be called after transition is completed.
 *
 * @method transitionTo
 * @param {Function} layout Function
 * @param {Object} curve Easing Curve
 * @param {Function} callback Function
 *
 */
LayoutTransition.prototype.transitionTo = function (layout, curve, callback) {
    if (this.options.end === null) {
        this.options.end = layout;
        this.options.transition.set(1, curve, function () {
            this.options.start = layout;
            this.options.end = null;
            this.options.transition.set(0, {duration: 0});
            if (callback) callback();
        }.bind(this));
    }
};

/**
 * This is the layout function to bet set to a View's layout parameter.
 *
 * @method layout
 * @param {Object} curr
 * @param {Object} prev
 * @param {Number} i
 *
 */
LayoutTransition.prototype.layout = function(curr, prev, i) {
    var context = this;
    LayoutTransition.transitionableLayout.call(context, curr, prev, i);
};

module.exports = LayoutTransition;



},{"./TransitionableLayout":196,"famous-transitions":190}],195:[function(require,module,exports){
'use strict';

/**
 * A function returning a function to be set
 *  to a View's layout function.
 *
 * @param {Object} layout params.
 *
 * @example
 *
 * var layout = Layout.SequentialLayout({
 *      size: size,           // optional (takes an array or a function)
 *      direction: 1, // <--- optional (0 = horizontal, 1 = vertical)
 *      margin: 0,    // <--- optional (set margin, default is 0)
 *      offsets: {    // <--- optional
 *          translation: [0, 10, 0], // optional (instead of direction)
 *          rotation: [0, 0, 0],     // optional
 *          scale: [1, 1, 1]         // optional
 *      },
 *      origin: {     // <--- optional (define starting position)
 *          translation: [10, 0, 0], // optional
 *          rotation: [0, 0, 0],     // optional
 *          scale: [1, 1, 1]         // optional
 *      }
 * });
 *
 *
 * // Optional function to return array of size values.
 * function size(curr, prev, i) {
 *
 *      var size = [];
 *
 *      size[0] = this.getSize()[0];
 *      size[1] = 100
 *
 *      return size;
 * }
 *
 * // Or optionally define an array
 * var size = [null, 100];
 *
 * A function may also be used for margin, offset, and origin values as well as
 * individual size values.
 * (ex: margin: function() { return transitionable.get(); })
 *
 * If a size value is null or undefined context will default to the parent context's
 * size.
 *
 * By default direction is vertical. Specify either direction or translation offsets.
 *
 */
function SequentialLayout(options) {
    options = options || SequentialLayout.DEFAULT;
    options.size = options.size || SequentialLayout.DEFAULT.size;

    if (options.offsets) {
        if (options.offsets.translation) {
            if (options.direction !== undefined)
                throw new Error('SequentialLayout takes either direction or translation offsets');
            options.direction = null;
        }
        else {
            options.offsets.translation = [0, 0, 0];
        }
        options.offsets.rotation = options.offsets.rotation || SequentialLayout.DEFAULT.offsets.rotation;
        options.offsets.scale = options.offsets.scale || SequentialLayout.DEFAULT.offsets.scale;
    }
    else {
        options.offsets = SequentialLayout.DEFAULT.offsets;
        options.offsets.translation = [0, 0, 0];
    }

    if (options.origin) {
        options.origin.translation  = options.origin.translation || SequentialLayout.DEFAULT.origin.translation;
        options.origin.rotation = options.origin.rotation || SequentialLayout.DEFAULT.origin.rotation;
        options.origin.scale = options.origin.scale || SequentialLayout.DEFAULT.origin.scale;
    }
    else {
        options.origin = SequentialLayout.DEFAULT.origin;
    }

    if (options.direction === undefined)
        options.direction = SequentialLayout.DEFAULT.direction;

    if (options.margin === undefined)
        options.margin = SequentialLayout.DEFAULT.margin;

    return function(curr, prev, i, isTransitioned) {
        var context = this;
        return _layout(options, context, curr, prev, i, isTransitioned);
    };
}

SequentialLayout.DEFAULT = {
    size: [null, null],
    direction: 1,
    margin: 0,
    offsets: {
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    },
    origin: {
        translation: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
    }
};

function _layout(options, context, curr, prev, i, isTransitioned) {
    var translation = _getOffsets(options.offsets.translation, context, curr, prev, i);
    var rotation = _getOffsets(options.offsets.rotation, context, curr, prev, i);
    var scale = _getOffsets(options.offsets.scale, context, curr, prev, i);
    var size = [0, 0, 0];
    var marginX = 0;
    var marginY = 0;
    var margin = options.margin;
    var x, y, z;

    if (typeof(margin) === 'function') {
        margin = margin.call(context, curr, prev, i);
    }
    else if (typeof(margin) === 'object' && margin) {
        if (typeof(margin.get) === 'function')
            margin = margin.get();
    }

    if (typeof options.size === 'function') {
        size = options.size.call(context, curr, prev, i);
    }
    else {
        for (var j = 0; j < 2; j++) {
            if (typeof(options.size[j]) === 'function') {
                size[j] = options.size[j].call(context, curr, prev, i);
            }
            else if (typeof(options.size[j]) === 'object' && options.size[j]) {
                if (typeof(options.size[j].get) === 'function')
                    size[j] = options.size[j].get();
            }
            else {
                size[j] = options.size[j] === null ? context.size.get()[j] : options.size[j];
            }
        }
    }

    if (!prev) {
        translation = _getOffsets(options.origin.translation, context, curr, prev, i);
        rotation = _getOffsets(options.origin.rotation, context, curr, prev, i);
        options._prevRotation = rotation;
        scale = _getOffsets(options.origin.scale, context, curr, prev, i);
        options._translation = translation;
        options._rotation = rotation;
        options._scale = scale;
    }
    else {
        if (!options.offsets.translation) {
            translation = prev.getPosition();
        } else {
            x = translation[0]*Math.cos(options._rotation[2]) - translation[1]*Math.sin(options._rotation[2]);
            y = translation[0]*Math.sin(options._rotation[2]) + translation[1]*Math.cos(options._rotation[2]);
            x = x*Math.cos(options._rotation[1]) - translation[2]*Math.sin(options._rotation[1]);
            z = x*Math.sin(options._rotation[1]) + translation[2]*Math.cos(options._rotation[1]);
            y = y*Math.cos(options._rotation[0]) - z*Math.sin(options._rotation[0]);
            z = y*Math.sin(options._rotation[0]) + z*Math.cos(options._rotation[0]);

            options._translation[0] += x;
            options._translation[1] += y;
            options._translation[2] += z;
            translation = options._translation;
        }
        options._rotation[0] += rotation[0];
        options._rotation[1] += rotation[1];
        options._rotation[2] += rotation[2];
        options._scale[0] *= scale[0];
        options._scale[1] *= scale[1];
        options._scale[2] *= scale[2];
        rotation = options._rotation;
        scale = options._scale;
        if (options.direction === 0) {
            translation[0] = prev.getSize()[0] + margin;

        }
        else if (options.direction === 1) {
            translation[1] += prev.getSize()[1] + margin;
        }
    }

    translation[0] = translation[0] + marginX;
    translation[1] = translation[1] + marginY;

    if (!isTransitioned) {
        curr.setSize(size[0], size[1]);
        curr.setPosition(translation[0], translation[1], translation[2]);
        curr.setRotation(rotation[0], rotation[1], rotation[2]);
        curr.setScale(scale[0], scale[1], scale[2]);
    }

    return {
        size: size,
        translation: translation,
        rotation: rotation,
        scale: scale
    };
}

function _getOffsets(offsets, context, curr, prev, i) {
    var results = [];
    for (var j = 0; j < offsets.length; j++) {
        if (typeof(offsets[j]) === 'function') {
            results.push(offsets[j].call(context, curr, prev, j));
        }
        else if (typeof(offsets[j]) === 'object' && offsets[j]) {
            if (typeof(offsets[j].get) === 'function') {
                results.push(offsets[j].get());
            }
            else {
                results.push(0);
            }
        }
        else {
            results.push(offsets[j]);
        }
    }
    return results;
}

module.exports = SequentialLayout;

},{}],196:[function(require,module,exports){
'use strict';

/**
 * A function returning a function to be set
 *  to a View's layout function. This purpose of
 *  this layout is to transition between two layouts.
 *
 * @param {Object} layout params.
 *
 * @example
 *
 * var layout = Layout.Transitionable({
 *      start: layoutStart,         // <--- First layout Function
 *      end: layoutEnd,             // <--- Second layout Function
 *      transition: transitionable  // <--- A Transitionable or Function that
 *                                  //      returns values between 0 and 1
 * });
 *
 */
function TransitionableLayout(options) {

    if (typeof(options.start) !== 'function') {
        throw new Error('TransitionableLayout takes a start function');
    }

    if (typeof(options.end) !== 'function' && options.end !== null && options.end !== undefined) {
        throw new Error('TransitionableLayout takes an end function');
    }

    if (!options.transition) {
        throw new Error('TransitionableLayout transition must be defined');
    }

    return function(curr, prev, i, isTransitioned) {
        var context = this;
        return _layout(options, context, curr, prev, i, options.transition, isTransitioned);
    };
}

function _layout(options, context, curr, prev, i, transition, isTransitioned) {
    var start = options.start.call(context, curr, prev, i, true);
    var end = start;
    if (typeof (options.end) === 'function') end = options.end.call(context, curr, prev, i, true);
    if (typeof(transition) === 'object') {
        if (typeof(transition.get) === 'function') {
            transition = transition.get();
        }
    } else if (typeof(transition) === 'function') {
        transition = transition();
    }

    if (transition < 0) transition = 0;
    if (transition > 1) transition = 1;

    var size = [
        (start.size[0] * (1 - transition)) + (end.size[0] * transition),
        (start.size[1] * (1 - transition)) + (end.size[1] * transition),
        (start.size[2] * (1 - transition)) + (end.size[2] * transition)];
    var translation = [
        (start.translation[0] * (1 - transition)) + (end.translation[0] * transition),
        (start.translation[1] * (1 - transition)) + (end.translation[1] * transition),
        (start.translation[2] * (1 - transition)) + (end.translation[2] * transition)];
    var rotation = [
        (start.rotation[0] * (1 - transition)) + (end.rotation[0] * transition),
        (start.rotation[1] * (1 - transition)) + (end.rotation[1] * transition),
        (start.rotation[2] * (1 - transition)) + (end.rotation[2] * transition)];
    var scale = [
        (start.scale[0] * (1 - transition)) + (end.scale[0] * transition),
        (start.scale[1] * (1 - transition)) + (end.scale[1] * transition),
        (start.scale[2] * (1 - transition)) + (end.scale[2] * transition)];

    if (!isTransitioned) {
        curr.setSize(size[0], size[1], size[2]);
        curr.setPosition(translation[0], translation[1], translation[2]);
        curr.setRotation(rotation[0], rotation[1], rotation[2]);
        curr.setScale(scale[0], scale[1], [scale[2]]);
    }

    return {
        size: size,
        translation: translation,
        rotation: rotation,
        scale: scale
    };
}

module.exports = TransitionableLayout;


},{}],197:[function(require,module,exports){
'use strict';

module.exports = {
    SequentialLayout: require('./SequentialLayout'),
    GridLayout: require('./GridLayout'),
    HeaderFooterLayout: require('./HeaderFooterLayout'),
    FlexibleLayout: require('./FlexibleLayout'),
    TransitionableLayout: require('./TransitionableLayout'),
    LayoutTransition: require('./LayoutTransition')
};

},{"./FlexibleLayout":191,"./GridLayout":192,"./HeaderFooterLayout":193,"./LayoutTransition":194,"./SequentialLayout":195,"./TransitionableLayout":196}],198:[function(require,module,exports){
'use strict';

/**
 * A 3x3 numerical matrix, represented as an array.
 *
 * @class Mat33
 * @constructor
 *
 * @param {Number[]} values
 */
function Mat33(values) {
    this.values = values || [1,0,0,0,1,0,0,0,1];

    return this;
}

/**
 * Return the values in the Mat33 as an array.
 *
 * @method get
 * @return {Number[]} matrix values as array of rows.
 */
Mat33.prototype.get = function get() {
    return this.values;
};

/**
 * Set the values of the current Mat33.
 *
 * @method set
 * @param {Number[]} values Array of nine numbers to set in the Mat33.
 * @chainable
 */
Mat33.prototype.set = function set(values) {
    this.values = values;
    return this;
};

/**
 * Copy the values of the input Mat33.
 *
 * @method copy
 * @param {Mat33} matrix The Mat33 to copy.
 * @chainable
 */
Mat33.prototype.copy = function copy(matrix) {
    var A = this.values;
    var B = matrix.values;

    A[0] = B[0];
    A[1] = B[1];
    A[2] = B[2];
    A[3] = B[3];
    A[4] = B[4];
    A[5] = B[5];
    A[6] = B[6];
    A[7] = B[7];
    A[8] = B[8];

    return this;
};

/**
 * Take this Mat33 as A, input vector V as a column vector, and return Mat33 product (A)(V).
 *
 * @method vectorMultiply
 * @param {Vec3} v Vector to rotate.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The input vector after multiplication.
 */
Mat33.prototype.vectorMultiply = function vectorMultiply(v, output) {
    var M = this.values;
    var v0 = v.x;
    var v1 = v.y;
    var v2 = v.z;

    output.x = M[0]*v0 + M[1]*v1 + M[2]*v2;
    output.y = M[3]*v0 + M[4]*v1 + M[5]*v2;
    output.z = M[6]*v0 + M[7]*v1 + M[8]*v2;

    return output;
};

/**
 * Multiply the provided Mat33 with the current Mat33.  Result is (this) * (matrix).
 *
 * @method multiply
 * @param {Mat33} matrix Input Mat33 to multiply on the right.
 * @chainable
 */
Mat33.prototype.multiply = function multiply(matrix) {
    var A = this.values;
    var B = matrix.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    A[0] = A0*B0 + A1*B3 + A2*B6;
    A[1] = A0*B1 + A1*B4 + A2*B7;
    A[2] = A0*B2 + A1*B5 + A2*B8;
    A[3] = A3*B0 + A4*B3 + A5*B6;
    A[4] = A3*B1 + A4*B4 + A5*B7;
    A[5] = A3*B2 + A4*B5 + A5*B8;
    A[6] = A6*B0 + A7*B3 + A8*B6;
    A[7] = A6*B1 + A7*B4 + A8*B7;
    A[8] = A6*B2 + A7*B5 + A8*B8;

    return this;
};

/**
 * Transposes the Mat33.
 *
 * @method transpose
 * @chainable
 */
Mat33.prototype.transpose = function transpose() {
    var M = this.values;

    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];

    M[1] = M3;
    M[2] = M6;
    M[3] = M1;
    M[5] = M7;
    M[6] = M2;
    M[7] = M5;

    return this;
};

/**
 * The determinant of the Mat33.
 *
 * @method getDeterminant
 * @return {Number} The determinant.
 */
Mat33.prototype.getDeterminant = function getDeterminant() {
    var M = this.values;

    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M[0]*(M4*M8 - M5*M7)
            - M[1]*(M3*M8 - M5*M6)
            + M[2]*(M3*M7 - M4*M6);

    return det;
};

/**
 * The inverse of the Mat33.
 *
 * @method inverse
 * @chainable
 */
Mat33.prototype.inverse = function inverse() {
    var M = this.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7)
            - M1*(M3*M8 - M5*M6)
            + M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-40) return null;

    det = 1 / det;

    M[0] = (M4*M8 - M5*M7) * det;
    M[3] = (-M3*M8 + M5*M6) * det;
    M[6] = (M3*M7 - M4*M6) * det;
    M[1] = (-M1*M8 + M2*M7) * det;
    M[4] = (M0*M8 - M2*M6) * det;
    M[7] = (-M0*M7 + M1*M6) * det;
    M[2] = (M1*M5 - M2*M4) * det;
    M[5] = (-M0*M5 + M2*M3) * det;
    M[8] = (M0*M4 - M1*M3) * det;

    return this;
};

/**
 * Clones the input Mat33.
 *
 * @method clone
 * @param {Mat33} m Mat33 to clone.
 * @return {Mat33} New copy of the original Mat33.
 */
Mat33.clone = function clone(m) {
    return new Mat33(m.values.slice());
};

/**
 * The inverse of the Mat33.
 *
 * @method inverse
 * @param {Mat33} matrix Mat33 to invert.
 * @param {Mat33} output Mat33 in which to place the result.
 * @return {Mat33} The Mat33 after the invert.
 */
Mat33.inverse = function inverse(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    var det = M0*(M4*M8 - M5*M7)
            - M1*(M3*M8 - M5*M6)
            + M2*(M3*M7 - M4*M6);

    if (Math.abs(det) < 1e-18) return null;

    det = 1 / det;

    result[0] = (M4*M8 - M5*M7) * det;
    result[3] = (-M3*M8 + M5*M6) * det;
    result[6] = (M3*M7 - M4*M6) * det;
    result[1] = (-M1*M8 + M2*M7) * det;
    result[4] = (M0*M8 - M2*M6) * det;
    result[7] = (-M0*M7 + M1*M6) * det;
    result[2] = (M1*M5 - M2*M4) * det;
    result[5] = (-M0*M5 + M2*M3) * det;
    result[8] = (M0*M4 - M1*M3) * det;

    return output;
};

/**
 * Transposes the Mat33.
 *
 * @method transpose
 * @param {Mat33} matrix Mat33 to transpose.
 * @param {Mat33} output Mat33 in which to place the result.
 * @return {Mat33} The Mat33 after the transpose.
 */
Mat33.transpose = function transpose(matrix, output) {
    var M = matrix.values;
    var result = output.values;

    var M0 = M[0];
    var M1 = M[1];
    var M2 = M[2];
    var M3 = M[3];
    var M4 = M[4];
    var M5 = M[5];
    var M6 = M[6];
    var M7 = M[7];
    var M8 = M[8];

    result[0] = M0;
    result[1] = M3;
    result[2] = M6;
    result[3] = M1;
    result[4] = M4;
    result[5] = M7;
    result[6] = M2;
    result[7] = M5;
    result[8] = M8;

    return output;
};

/**
 * Add the provided Mat33's.
 *
 * @method add
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 * @return {Mat33} The result of the addition.
 */
Mat33.add = function add(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 + B0;
    result[1] = A1 + B1;
    result[2] = A2 + B2;
    result[3] = A3 + B3;
    result[4] = A4 + B4;
    result[5] = A5 + B5;
    result[6] = A6 + B6;
    result[7] = A7 + B7;
    result[8] = A8 + B8;

    return output;
};

/**
 * Subtract the provided Mat33's.
 *
 * @method subtract
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 * @return {Mat33} The result of the subtraction.
 */
Mat33.subtract = function subtract(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0 - B0;
    result[1] = A1 - B1;
    result[2] = A2 - B2;
    result[3] = A3 - B3;
    result[4] = A4 - B4;
    result[5] = A5 - B5;
    result[6] = A6 - B6;
    result[7] = A7 - B7;
    result[8] = A8 - B8;

    return output;
};
/**
 * Multiply the provided Mat33 M2 with this Mat33.  Result is (this) * (M2).
 *
 * @method multiply
 * @param {Mat33} matrix1 The left Mat33.
 * @param {Mat33} matrix2 The right Mat33.
 * @param {Mat33} output Mat33 in which to place the result.
 * @return {Mat33} the result of the multiplication.
 */
Mat33.multiply = function multiply(matrix1, matrix2, output) {
    var A = matrix1.values;
    var B = matrix2.values;
    var result = output.values;

    var A0 = A[0];
    var A1 = A[1];
    var A2 = A[2];
    var A3 = A[3];
    var A4 = A[4];
    var A5 = A[5];
    var A6 = A[6];
    var A7 = A[7];
    var A8 = A[8];

    var B0 = B[0];
    var B1 = B[1];
    var B2 = B[2];
    var B3 = B[3];
    var B4 = B[4];
    var B5 = B[5];
    var B6 = B[6];
    var B7 = B[7];
    var B8 = B[8];

    result[0] = A0*B0 + A1*B3 + A2*B6;
    result[1] = A0*B1 + A1*B4 + A2*B7;
    result[2] = A0*B2 + A1*B5 + A2*B8;
    result[3] = A3*B0 + A4*B3 + A5*B6;
    result[4] = A3*B1 + A4*B4 + A5*B7;
    result[5] = A3*B2 + A4*B5 + A5*B8;
    result[6] = A6*B0 + A7*B3 + A8*B6;
    result[7] = A6*B1 + A7*B4 + A8*B7;
    result[8] = A6*B2 + A7*B5 + A8*B8;

    return output;
};

module.exports = Mat33;

},{}],199:[function(require,module,exports){
'use strict';

var Matrix = require('./Mat33');

/** @alias */
var sin = Math.sin;
/** @alias */
var cos = Math.cos;
/** @alias */
var atan2 = Math.atan2;
/** @alias */
var sqrt = Math.sqrt;

/**
 * A vector-like object used to represent rotations. If theta is the angle of
 * rotation, and (x', y', z') is a normalized vector representing the axis of
 * rotation, then w = cos(theta/2), x = -sin(theta/2)*x', y = -sin(theta/2)*y',
 * and z = -sin(theta/2)*z'.
 *
 * @class Quaternion
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
function Quaternion(w,x,y,z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

/**
 * Add the components of input q to the current Quaternion.
 *
 * @method add
 * @param {Quaternion} q The Quaternion to add.
 * @chainable
 */
Quaternion.prototype.add = function add(q) {
    this.w += q.w;
    this.x += q.x;
    this.y += q.y;
    this.z += q.z;
    return this;
};

/**
 * Subtract the components of input q from the current Quaternion.
 *
 * @method subtract
 * @param {Quaternion} q The Quaternion to subtract.
 * @chainable
 */
Quaternion.prototype.subtract = function subtract(q) {
    this.w -= q.w;
    this.x -= q.x;
    this.y -= q.y;
    this.z -= q.z;
    return this;
};

/**
 * Scale the current Quaternion by input scalar s.
 *
 * @method scalarMultiply
 * @param {Number} s The Number by which to scale.
 * @chainable
 */
Quaternion.prototype.scale = function scale(s) {
    this.w *= s;
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
};

/**
 * Multiply the current Quaternion by input Quaternion q.
 * Left-handed coordinate system multiplication.
 *
 * @method multiply
 * @param {Quaternion} q The Quaternion to multiply by on the right.
 */
Quaternion.prototype.multiply = function multiply(q) {
    var x1 = this.x;
    var y1 = this.y;
    var z1 = this.z;
    var w1 = this.w;
    var x2 = q.x;
    var y2 = q.y;
    var z2 = q.z;
    var w2 = q.w || 0;

    this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
    this.x = x1*w2 + x2*w1 + y2*z1 - y1*z2;
    this.y = y1*w2 + y2*w1 + x1*z2 - x2*z1;
    this.z = z1*w2 + z2*w1 + x2*y1 - x1*y2;
    return this;
};

/**
 * Multiply the current Quaternion by input Quaternion q on the left, i.e. q * this.
 * Left-handed coordinate system multiplication.
 *
 * @method leftMultiply
 * @param {Quaternion} q The Quaternion to multiply by on the left.
 */
Quaternion.prototype.leftMultiply = function leftMultiply(q) {
    var x1 = q.x;
    var y1 = q.y;
    var z1 = q.z;
    var w1 = q.w || 0;
    var x2 = this.x;
    var y2 = this.y;
    var z2 = this.z;
    var w2 = this.w;

    this.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
    this.x = x1*w2 + x2*w1 + y2*z1 - y1*z2;
    this.y = y1*w2 + y2*w1 + x1*z2 - x2*z1;
    this.z = z1*w2 + z2*w1 + x2*y1 - x1*y2;
    return this;
};

/**
 * Apply the current Quaternion to input Vec3 v, according to
 * v' = ~q * v * q.
 *
 * @method rotateVector
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The rotated version of the Vec3.
 */
Quaternion.prototype.rotateVector = function rotateVector(v, output) {
    var cw = this.w;
    var cx = -this.x;
    var cy = -this.y;
    var cz = -this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Invert the current Quaternion.
 *
 * @method invert
 * @chainable
 */
Quaternion.prototype.invert = function invert() {
    this.w *= -1;
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
};

/**
 * Conjugate the current Quaternionl
 *
 * @method conjugate
 * @chainable
 */
Quaternion.prototype.conjugate = function conjugate() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
};

/**
 * Compute the length (norm) of the current Quaternion.
 *
 * @method length
 * @return {Number}
 */
Quaternion.prototype.length = function length() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    return sqrt(w * w + x * x + y * y + z * z);
};

/**
 * Alter the current Quaternion to be of unit length;
 *
 * @method normalize
 * @chainable
 */
Quaternion.prototype.normalize = function normalize() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return;
    length = 1 / length;
    this.w *= length;
    this.x *= length;
    this.y *= length;
    this.z *= length;
    return this;
};

/**
 * Alter the current Quaternion to reflect a rotation of input angle about
 * input axis v.
 *
 * @method makeFromAngleAndAxis
 * @param {Number} angle The angle of rotation.
 * @param {Vec3} v The axis of rotation.
 * @chainable
 */
Quaternion.prototype.makeFromAngleAndAxis = function makeFromAngleAndAxis(angle, v) {
    var n  = v.normalize();
    var ha = angle*0.5;
    var s  = -sin(ha);
    this.x = s*n.x;
    this.y = s*n.y;
    this.z = s*n.z;
    this.w = cos(ha);
    return this;
};

/**
 * Set the w, x, y, z components of the current Quaternion.
 *
 * @method set
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 * @chainable
 */
Quaternion.prototype.set = function set(w,x,y,z) {
    if (w != null) this.w = w;
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;
    return this;
};

/**
 * Copy input Quaternion q onto the current Quaternion.
 *
 * @method copy
 * @param {Quaternion} q The reference Quaternion.
 * @chainable
 */
Quaternion.prototype.copy = function copy(q) {
    this.w = q.w;
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    return this;
};

/**
 * Reset the current Quaternion.
 *
 * @method clear
 * @chainable
 */
Quaternion.prototype.clear = function clear() {
    this.w = 1;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * The 4d dot product. Can be used to determine the cosine of the angle between
 * the two rotations, assuming both Quaternions are of unit length.
 *
 * @method dot
 * @param {Quaternion} q The other Quaternion.
 * @return {Number}
 */
Quaternion.prototype.dot = function dot(q) {
    return this.w * q.w + this.x * q.x + this.y * q.y + this.z * q.z;
};

/**
 * Get the Mat33 matrix corresponding to the current Quaternion.
 *
 * @method getMatrix
 * @return {Transform}
 */
Quaternion.prototype.getMatrix = function getMatrix() {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    //LHC system flattened to row major
    return new Matrix([
            1 - 2*y*y - 2*z*z, 2*x*y + 2*z*w, 2*x*z - 2*y*w,
            2*x*y - 2*z*w,1 - 2*x*x - 2*z*z, 2*y*z + 2*x*w,
            2*x*z + 2*y*w, 2*y*z - 2*x*w, 1 - 2*x*x - 2*y*y
    ]);
};

/**
 * Spherical linear interpolation.
 *
 * @method slerp
 * @param {Quaternion} q The final orientation.
 * @param {Number} t The tween parameter.
 * @param {Vec3} output Vec3 in which to put the result.
 * @return {Quaternion}
 */
Quaternion.prototype.slerp = function slerp(q, t, output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var qw = q.w;
    var qw = q.w;
    var qw = q.w;
    var qw = q.w;

    var omega;
    var cosomega;
    var sinomega;
    var scaleFrom;
    var scaleTo;

    cosomega = w * qw + x * qx + y * qy + z * qz;
    if ((1.0 - cosomega) > 1e-5) {
        omega       = Math.acos(cosomega);
        sinomega    = sin(omega);
        scaleFrom   = sin((1.0 - t) * omega) / sinomega;
        scaleTo     = sin(t * omega) / sinomega;
    }
    else {
        scaleFrom   = 1.0 - t;
        scaleTo     = t;
    }

    var ratio = scaleFrom/scaleTo;

    output.w = w * ratio + qw * scaleTo;
    output.x = x * ratio + qx * scaleTo;
    output.y = y * ratio + qy * scaleTo;
    output.z = z * ratio + qz * scaleTo;

    return output;
};

/**
 * Helper function to clamp a value to a given range.
 *
 * @method clamp
 * @private
 * @param {Number} value The value to calmp.
 * @param {Number} lower The lower limit of the range.
 * @param {Number} upper The upper limit of the range.
 * @return {Number} The possibly clamped value.
 */
var clamp = function (value, lower, upper) {
    return value < lower ? lower : value > upper ? upper : value;
}

/**
 * The rotation angles about the x, y, and z axes corresponding to the
 * current Quaternion, when applied in the XYZ order.
 *
 * @method toEulerXYZ
 * @param {Vec3} output Vec3 in which to put the result.
 * @return {Vec3}
 */

Quaternion.prototype.toEulerXYZ = function toEulerXYZ(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var sqx = x * x;
    var sqy = y * y;
    var sqz = z * z;
    var sqw = w * w;

    output.x = atan2(2 * (x * w - y * z), (sqw - sqx - sqy + sqz));
    output.y = Math.asin(clamp(2 * (x * z + y * w), -1, 1));
    output.z = atan2(2 * (z * w - x * y), (sqw + sqx - sqy - sqz));
    return output;
};

/**
 * The Quaternion corresponding to the Euler angles x, y, and z,
 * applied in the XYZ order.
 *
 * @method fromEulerXYZ
 * @param {Number} x The angle of rotation about the x axis.
 * @param {Number} y The angle of rotation about the y axis.
 * @param {Number} z The angle of rotation about the z axis.
 * @param {Quaternion} output Quaternion in which to put the result.
 * @return {Quaternion} The equivalent Quaternion.
 */
Quaternion.fromEulerXYZ = function fromEulerXYZ(x, y, z, output) {
    var sx = sin(x/2);
    var sy = sin(y/2);
    var sz = sin(z/2);
    var cx = cos(x/2);
    var cy = cos(y/2);
    var cz = cos(z/2);

    var qw = cx*cy*cz + sx*sy*sz;
    var qx = sx*cy*cz - cx*sy*sz;
    var qy = cx*sy*cz + sx*cy*sz;
    var qz = cx*cy*sz - sx*sy*cz;

    output.w = qw;
    output.x = qx;
    output.y = qy;
    output.z = qz;
    return output;
};

/**
 * Multiply the input Quaternions.
 * Left-handed coordinate system multiplication.
 *
 * @method multiply
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The product of multiplication.
 */
Quaternion.multiply = function multiply(q1, q2, output) {
    var w1 = q1.w || 0;
    var x1 = q1.x;
    var y1 = q1.y;
    var z1 = q1.z;

    var w2 = q2.w || 0;
    var x2 = q2.x;
    var y2 = q2.y;
    var z2 = q2.z;

    output.w = w1*w2 - x1*x2 - y1*y2 - z1*z2;
    output.x = x1*w2 + x2*w1 + y2*z1 - y1*z2;
    output.y = y1*w2 + y2*w1 + x1*z2 - x2*z1;
    output.z = z1*w2 + z2*w1 + x2*y1 - x1*y2;
    return output;
};

/**
 * The conjugate of the input Quaternion.
 *
 * @method conjugate
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The conjugate Quaternion.
 */
Quaternion.conjugate = function conjugate(q, output) {
    output.w = q.w;
    output.x = -q.x;
    output.y = -q.y;
    output.z = -q.z;
    return output;
};

/**
 *
 *
 * @method normalize
 * @param {Quaternion} q The reference Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The normalized Quaternion.
 */
Quaternion.normalize = function normalize(q, output) {
    var w = q.w;
    var x = q.x;
    var y = q.y;
    var z = q.z;

    var length = sqrt(w * w + x * z + y * y + z * z) || 1;
    length = 1 / length;

    output.w = w * length;
    output.x = x * length;
    output.y = y * length;
    output.z = z * length;
    return output;
};

/**
 * Clone the input Quaternion.
 *
 * @method clone
 * @param {Quaternion} q the reference Quaternion.
 * @return {Quaternion} The cloned Quaternion.
 */
Quaternion.clone = function clone(q) {
    return new Quaternion(q.w, q.x, q.y, q.z);
};

/**
 * Add the inputs Quaternions.
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The sum.
 */
Quaternion.add = function add(q1, q2, output) {
    output.w = q1.w + q2.w;
    output.x = q1.x + q2.x;
    output.y = q1.y + q2.y;
    output.z = q1.z + q2.z;
    return output
};

/**
 * Subtract the inputs Quaternions.
 *
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The difference.
 */
Quaternion.subtract = function subtract(q1, q2, output) {
    output.w = q1.w - q2.w;
    output.x = q1.x - q2.x;
    output.y = q1.y - q2.y;
    output.z = q1.z - q2.z;
    return output
};

/**
 * Scale the input Quaternion by a scalar.
 *
 * @param {Quaternion} q The reference Quaternion.
 * @param {Number} s The Number by which to scale.
 * @param {Quaternion} output Quaternion in which to place the result.
 * @return {Quaternion} The scaled Quaternion.
 */
Quaternion.scale = function scale(q, s, output) {
    output.w = q.w * s;
    output.x = q.x * s;
    output.y = q.y * s;
    output.z = q.z * s;
    return output;
};

/**
 * The dot product of the two input Quaternions.
 *
 * @method dotProduct
 * @param {Quaternion} q1 The left Quaternion.
 * @param {Quaternion} q2 The right Quaternion.
 * @return {Number} The dot product of the two Quaternions.
 */
Quaternion.dot = function dot(q1, q2) {
    return q1.w * q2.w + q1.x * q2.x + q1.y * q2.y + q1.z * q2.z;
};

module.exports = Quaternion;

},{"./Mat33":198}],200:[function(require,module,exports){
'use strict';

/** @alias */
var sin = Math.sin;
/** @alias */
var cos = Math.cos;
/** @alias */
var sqrt = Math.sqrt;

/**
 * A two-dimensional vector.
 *
 * @class Vec2
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 */
var Vec2 = function(x, y){
    if (x instanceof Array || x instanceof Float32Array) {
        this.x = x[0] || 0;
        this.y = x[1] || 0;
    }
    else {
        this.x = x || 0;
        this.y = y || 0;
    }
};

/**
 * Set the components of the current Vec2.
 *
 * @method set
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @chainable
 */
Vec2.prototype.set = function set(x, y) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    return this;
};

/**
 * Add the input v to the current Vec2.
 *
 * @method add
 * @param {Vec2} v The Vec2 to add.
 * @chainable
 */
Vec2.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
};

/**
 * Subtract the input v from the current Vec2.
 *
 * @method subtract
 * @param {Vec2} v The Vec2 to subtract.
 * @chainable
 */
Vec2.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
};

/**
 * Scale the current Vec2 by a scalar or Vec2.
 *
 * @method scale
 * @param {Number|Vec2} s The Number or vec2 by which to scale.
 * @chainable
 */
Vec2.prototype.scale = function scale(s) {
    if (s instanceof Vec2) {
        this.x *= s.x;
        this.y *= s.y;
    } else {
        this.x *= s;
        this.y *= s;
    }
    return this;
};

/**
 * Rotate the Vec2 counter-clockwise by theta about the z-axis.
 *
 * @method rotate
 * @param {Number} theta Angle by which to rotate.
 * @chainable
 */
Vec2.prototype.rotate = function(theta) {
    var x = this.x;
    var y = this.y;

    var cosTheta = cos(theta);
    var sinTheta = sin(theta);

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of of the current Vec2 with the input Vec2.
 *
 * @method dot
 * @param {Number} v The other Vec2.
 * @chainable
 */
Vec2.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
};

/**
 * The cross product of of the current Vec2 with the input Vec2.
 *
 * @method cross
 * @param {Number} v The other Vec2.
 * @chainable
 */
Vec2.prototype.cross = function(v) {
    return this.x * v.y - this.y * v.x;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec2.
 *
 * @method invert
 * @chainable
 */
Vec2.prototype.invert = function invert() {
    this.x *= -1;
    this.y *= -1;
    return this;
};

/**
 * Apply a function component-wise to the current Vec2.
 *
 * @method map
 * @param {Function} fn Function to apply.
 * @chainable
 */
Vec2.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    return this;
};

/**
 * The magnitude of the current Vec2.
 *
 * @method length
 * @return {Number}
 */
Vec2.prototype.length = function length() {
    var x = this.x;
    var y = this.y;

    return sqrt(x * x + y * y);
};

/**
 * Copy the input onto the current Vec2.
 *
 * @method copy
 * @param {Vec2} v Vec2 to copy.
 * @chainable
 */
Vec2.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
};

/**
 * Reset the current Vec2.
 *
 * @method clear
 * @chainable
 */
Vec2.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec2 is exactly 0.
 *
 * @method isZero
 * @return {Boolean}
 */
Vec2.prototype.isZero = function isZero() {
    if (this.x !== 0 || this.y !== 0) return false;
    else return true;
};

/**
 * The array form of the current Vec2.
 *
 * @method toArray
 * @return {Number[]}
 */
Vec2.prototype.toArray = function toArray() {
    return [this.x, this.y];
};

/**
 * Normalize the input Vec2.
 *
 * @method normalize
 * @param {Vec2} v The reference Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 * @return {Vec2} The normalize Vec2.
 */
Vec2.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;

    var length = sqrt(x * x + y * y) || 1;
    length = 1 / length;
    output.x = v.x * length;
    output.y = v.y * length;

    return output;
};

/**
 * Clone the input Vec2.
 *
 * @method clone
 * @param {Vec2} v The Vec2 to clone.
 * @return {Vec2} The cloned Vec2.
 */
Vec2.clone = function clone(v) {
    return new Vec2(v.x, v.y);
};

/**
 * Add the input Vec2's.
 *
 * @method add
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 * @return {Vec2} The result of the addition.
 */
Vec2.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;

    return output;
};

/**
 * Subtract the second Vec2 from the first.
 *
 * @method subtract
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @param {Vec2} output Vec2 in which to place the result.
 * @return {Vec2} The result of the subtraction.
 */
Vec2.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    return output;
};

/**
 * Scale the input Vec2.
 *
 * @method scale
 * @param {Vec2} v The reference Vec2.
 * @param {Number} s Number to scale by.
 * @param {Vec2} output Vec2 in which to place the result.
 * @return {Vec2} The result of the scaling.
 */
Vec2.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    return output;
};

/**
 * The dot product of the input Vec2's.
 *
 * @method dot
 * @param {Vec2} v1 The left Vec2.
 * @param {Vec2} v2 The right Vec2.
 * @return {Number} The dot product.
 */
Vec2.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y;
};

/**
 * The cross product of the input Vec2's.
 *
 * @method cross
 * @param {Number} v The left Vec2.
 * @param {Number} v The right Vec2.
 * @return {Number} The z-component of the cross product.
 */
Vec2.cross = function(v1,v2) {
    return v1.x * v2.y - v1.y * v2.x;
};

module.exports = Vec2;

},{}],201:[function(require,module,exports){
'use strict';

/** @alias */
var sin = Math.sin;
/** @alias */
var cos = Math.cos;
/** @alias */
var sqrt = Math.sqrt;

/**
 * A three-dimensional vector.
 *
 * @class Vec3
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
var Vec3 = function(x,y,z){
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
};

/**
 * Set the components of the current Vec3.
 *
 * @method set
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 * @chainable
 */
Vec3.prototype.set = function set(x,y,z) {
    if (x != null) this.x = x;
    if (y != null) this.y = y;
    if (z != null) this.z = z;

    return this;
};

/**
 * Add the input v to the current Vec3.
 *
 * @method add
 * @param {Vec3} v The Vec3 to add.
 * @chainable
 */
Vec3.prototype.add = function add(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
};

/**
 * Subtract the input v from the current Vec3.
 *
 * @method subtract
 * @param {Vec3} v The Vec3 to subtract.
 * @chainable
 */
Vec3.prototype.subtract = function subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the x axis.
 *
 * @method rotateX
 * @param {Number} theta Angle by which to rotate.
 * @chainable
 */
Vec3.prototype.rotateX = function rotateX(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var cosTheta = cos(theta);
    var sinTheta = sin(theta);

    this.y = y * cosTheta - z * sinTheta;
    this.z = y * sinTheta + z * cosTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the y axis.
 *
 * @method rotateY
 * @param {Number} theta Angle by which to rotate.
 * @chainable
 */
Vec3.prototype.rotateY = function rotateY(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var cosTheta = cos(theta);
    var sinTheta = sin(theta);

    this.x = z * sinTheta + x * cosTheta;
    this.z = z * cosTheta - x * sinTheta;

    return this;
};

/**
 * Rotate the current Vec3 by theta clockwise about the z axis.
 *
 * @method rotateZ
 * @param {Number} theta Angle by which to rotate.
 * @chainable
 */
Vec3.prototype.rotateZ = function rotateZ(theta) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var cosTheta = cos(theta);
    var sinTheta = sin(theta);

    this.x =   x * cosTheta - y * sinTheta;
    this.y =   x * sinTheta + y * cosTheta;

    return this;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 *
 * @method dot
 * @param {Vec3} v The other Vec3.
 * @return {Number}
 */
Vec3.prototype.dot = function dot(v) {
    return this.x*v.x + this.y*v.y + this.z*v.z;
};

/**
 * The dot product of the current Vec3 with input Vec3 v.
 * Stores the result in the current Vec3.
 *
 * @method cross
 * @param {Vec3} v The other Vec3.
 * @chainable
 */
Vec3.prototype.cross = function cross(v) {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    this.x = y * vz - z * vy;
    this.y = z * vx - x * vz;
    this.z = x * vy - y * vx;
    return this;
};

/**
 * Scale the current Vec3 by a scalar.
 *
 * @method scale
 * @param {Number} s The Number by which to scale.
 * @chainable
 */
Vec3.prototype.scale = function scale(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;

    return this;
};

/**
 * Preserve the magnitude but invert the orientation of the current Vec3.
 *
 * @method invert
 * @chainable
 */
Vec3.prototype.invert = function invert() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;

    return this;
};

/**
 * Apply a function component-wise to the current Vec3.
 *
 * @method map
 * @param {Function} fn Function to apply.
 * @chainable
 */
Vec3.prototype.map = function map(fn) {
    this.x = fn(this.x);
    this.y = fn(this.y);
    this.z = fn(this.z);

    return this;
};

/**
 * The magnitude of the current Vec3.
 *
 * @method length
 * @return {Number}
 */
Vec3.prototype.length = function length() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return sqrt(x * x + y * y + z * z);
};

/**
 * The magnitude squared of the current Vec3.
 *
 * @method length
 * @return {Number}
 */
Vec3.prototype.lengthSq = function lengthSq() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    return x * x + y * y + z * z;
};

/**
 * Copy the input onto the current Vec3.
 *
 * @method copy
 * @param {Vec3} v Vec3 to copy.
 * @chainable
 */
Vec3.prototype.copy = function copy(v) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
};

/**
 * Reset the current Vec3.
 *
 * @method clear
 * @chainable
 */
Vec3.prototype.clear = function clear() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    return this;
};

/**
 * Check whether the magnitude of the current Vec3 is exactly 0.
 *
 * @method isZero
 * @return {Boolean}
 */
Vec3.prototype.isZero = function isZero() {
    return !(this.x !== 0 || this.y !== 0 || this.z !== 0);
};

/**
 * The array form of the current Vec3.
 *
 * @method toArray
 * @return {Number[]}
 */
Vec3.prototype.toArray = function toArray() {
    return [this.x, this.y, this.z];
};

/**
 * Preserve the orientation but change the length of the current Vec3 to 1.
 *
 * @method normalize
 * @chainable
 */
Vec3.prototype.normalize = function normalize() {
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var len = sqrt(x * x + y * y + z * z) || 1;
    len = 1 / len;

    this.x *= len;
    this.y *= len;
    this.z *= len;
    return this;
};

/**
 * Apply the rotation corresponding to the input (unit) Quaternion
 * to the current Vec3.
 *
 * @method applyRotation
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply.
 * @chainable
 */
Vec3.prototype.applyRotation = function applyRotation(q) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = this.x;
    var vy = this.y;
    var vz = this.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    this.x = tx * w + x * tw + y * tz - ty * z;
    this.y = ty * w + y * tw + tx * z - x * tz;
    this.z = tz * w + z * tw + x * ty - tx * y;
    return this;
};

/**
 * Apply the input Mat33 the the current Vec3.
 *
 * @method applyMatrix
 * @param {Mat33} matrix Mat33 to apply.
 * @chainable
 */
Vec3.prototype.applyMatrix = function applyMatrix(matrix) {
    var M = matrix.get();

    var x = this.x;
    var y = this.y;
    var z = this.z;

    this.x = M[0]*x + M[1]*y + M[2]*z;
    this.y = M[3]*x + M[4]*y + M[5]*z;
    this.z = M[6]*x + M[7]*y + M[8]*z;
    return this;
};

/**
 * Normalize the input Vec3.
 *
 * @method normalize
 * @param {Vec3} v The reference Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The normalize Vec3.
 */
Vec3.normalize = function normalize(v, output) {
    var x = v.x;
    var y = v.y;
    var z = v.z;

    var length = sqrt(x * x + y * y + z * z) || 1;
    length = 1 / length;

    output.x = x * length;
    output.y = y * length;
    output.z = z * length;
    return output;
};

/**
 * Apply a rotation to the input Vec3.
 *
 * @method applyRotation
 * @param {Vec3} v The reference Vec3.
 * @param {Quaternion} q Unit Quaternion representing the rotation to apply.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The rotated version of the input Vec3.
 */
Vec3.applyRotation = function applyRotation(v, q, output) {
    var cw = q.w;
    var cx = -q.x;
    var cy = -q.y;
    var cz = -q.z;

    var vx = v.x;
    var vy = v.y;
    var vz = v.z;

    var tw = -cx * vx - cy * vy - cz * vz;
    var tx = vx * cw + vy * cz - cy * vz;
    var ty = vy * cw + cx * vz - vx * cz;
    var tz = vz * cw + vx * cy - cx * vy;

    var w = cw;
    var x = -cx;
    var y = -cy;
    var z = -cz;

    output.x = tx * w + x * tw + y * tz - ty * z;
    output.y = ty * w + y * tw + tx * z - x * tz;
    output.z = tz * w + z * tw + x * ty - tx * y;
    return output;
};

/**
 * Clone the input Vec3.
 *
 * @method clone
 * @param {Vec3} v The Vec3 to clone.
 * @return {Vec3} The cloned Vec3.
 */
Vec3.clone = function clone(v) {
    return new Vec3(v.x, v.y, v.z);
};

/**
 * Add the input Vec3's.
 *
 * @method add
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The result of the addition.
 */
Vec3.add = function add(v1, v2, output) {
    output.x = v1.x + v2.x;
    output.y = v1.y + v2.y;
    output.z = v1.z + v2.z;
    return output;
};

/**
 * Subtract the second Vec3 from the first.
 *
 * @method subtract
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The result of the subtraction.
 */
Vec3.subtract = function subtract(v1, v2, output) {
    output.x = v1.x - v2.x;
    output.y = v1.y - v2.y;
    output.z = v1.z - v2.z;
    return output;
};

/**
 * Scale the input Vec3.
 *
 * @method scale
 * @param {Vec3} v The reference Vec3.
 * @param {Number} s Number to scale by.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3} The result of the scaling.
 */
Vec3.scale = function scale(v, s, output) {
    output.x = v.x * s;
    output.y = v.y * s;
    output.z = v.z * s;
    return output;
};

/**
 * The dot product of the input Vec3's.
 *
 * @method dotProduct
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @return {Number} The dot product.
 */
Vec3.dot = function dot(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
};

/**
 * The (right-handed) cross product of the input Vec3's.
 * v1 x v2.
 *
 * @method crossProduct
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3}
 */
Vec3.cross = function cross(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    output.x = y1 * z2 - z1 * y2;
    output.y = z1 * x2 - x1 * z2;
    output.z = x1 * y2 - y1 * x2;
    return output;
};

/**
 * The projection of v1 onto v2.
 *
 * @method project
 * @param {Vec3} v1 The left Vec3.
 * @param {Vec3} v2 The right Vec3.
 * @param {Vec3} output Vec3 in which to place the result.
 * @return {Vec3}
 */
Vec3.project = function project(v1, v2, output) {
    var x1 = v1.x;
    var y1 = v1.y;
    var z1 = v1.z;
    var x2 = v2.x;
    var y2 = v2.y;
    var z2 = v2.z;

    var scale = x1 * x2 + y1 * y2 + z1 * z2;
    scale /= x2 * x2 + y2 * y2 + z2 * z2;

    output.x = x2 * scale;
    output.y = y2 * scale;
    output.z = z2 * scale;

    return output;
};

module.exports = Vec3;

},{}],202:[function(require,module,exports){
module.exports = {
    Mat33: require('./Mat33'),
    Quaternion: require('./Quaternion'),
    Vec2: require('./Vec2'),
    Vec3: require('./Vec3')
};


},{"./Mat33":198,"./Quaternion":199,"./Vec2":200,"./Vec3":201}],203:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],204:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":207,"dup":2}],205:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":204,"./TweenTransition":206,"dup":3}],206:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":203,"dup":4}],207:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],208:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":203,"./MultipleTransition":204,"./Transitionable":205,"./TweenTransition":206,"./after":207,"dup":6}],209:[function(require,module,exports){
'use strict';

var Position = require('./Position');

function Align(dispatch) {
    Position.call(this, dispatch);
}

Align.toString = function toString() {
    return 'Align';
};

Align.prototype = Object.create(Position.prototype);
Align.prototype.constructor = Align;

Align.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setAlign(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Align;

},{"./Position":217}],210:[function(require,module,exports){
'use strict';

/**
 * @class Camera
 * @constructor
 * @component
 * @param {RenderNode} RenderNode to which the instance of Camera will be a component of
 */
function Camera(dispatch) {
    this._dispatch = dispatch;
    this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
    this._focalDepth = 0;
    this._id = dispatch.addComponent(this);

    this.setFlat();
}

Camera.FRUSTUM_PROJECTION = 0;
Camera.PINHOLE_PROJECTION = 1;
Camera.ORTHOGRAPHIC_PROJECTION = 2;

// Return the name of the Element Class: 'Camera'
Camera.toString = function toString() {
    return 'Camera';
};

Camera.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        projectionType: this._projectionType,
        focalDepth: this._focalDepth
    };
};


Camera.prototype.setState = function setState(state) {
    this._dispatch.dirtyComponent(this._id);
    if (state.component === this.constructor.toString()) {
        this.set(state.projectionType, state.focalDepth);
        return true;
    }
    return false;
};

Camera.prototype.set = function set(type, depth) {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = type;
    this._focalDepth = depth;
};

Camera.prototype.setDepth = function setDepth(depth) {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = Camera.PINHOLE_PROJECTION;
    this._focalDepth = depth;

    return this;
};

Camera.prototype.setFlat = function setFlat() {
    this._dispatch.dirtyComponent(this._id);
    this._projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
    this._focalDepth = 0;

    return this;
};

Camera.prototype.clean = function clean() {
    switch (this._projectionType) {
        case Camera.FRUSTUM_PROJECTION:
            this._dispatch.sendDrawCommand('FRUSTUM_PROJECTION');
            break;
        case Camera.PINHOLE_PROJECTION:
            this._dispatch.sendDrawCommand('PINHOLE_PROJECTION');
            this._dispatch.sendDrawCommand(this._focalDepth);
            break;
        case Camera.ORTHOGRAPHIC_PROJECTION:
            this._dispatch.sendDrawCommand('ORTHOGRAPHIC_PROJECTION');
            break;
    }
    return false;
};

module.exports = Camera;

},{}],211:[function(require,module,exports){
'use strict';

function EventEmitter(dispatch) {
    this.dispatch = dispatch;
}

EventEmitter.toString = function toString() {
    return 'EventEmitter';
};

EventEmitter.prototype.emit = function emit(event, payload) {
    this.dispatch.emit(event, payload);
    return this;
};

module.exports = EventEmitter;

},{}],212:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

function EventHandler (dispatch, events) {
    this.dispatch = dispatch;
    this._events = new CallbackStore();

    if (events) {
        for (var i = 0, len = events.length; i < len; i++) {
            var eventName = events[i].event;
            var callback = events[i].callback;
            this._events.on(eventName, callback);
            dispatch.registerGlobalEvent(eventName, this.trigger.bind(this, eventName));
        }
    }
}

EventHandler.toString = function toString() {
    return 'EventHandler';
};

EventHandler.prototype.on = function on (ev, cb) {
    this._events.on(ev, cb);
    this.dispatch.registerGlobalEvent(ev, this.trigger.bind(this, ev));
};

EventHandler.prototype.off = function off (ev, cb) {
    this._events.off(ev, cb);
    this.dispatch.deregisterGlobalEvent(ev, this.trigger.bind(this, ev))
};


EventHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

module.exports = EventHandler;

},{"famous-utilities":242}],213:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;
var Vec2 = require('famous-math').Vec2;

var VEC_REGISTER = new Vec2();

var gestures = {drag: true, tap: true, rotate: true, pinch: true};
var callbacks = [processTouchStart, processTouchMove, processTouchEnd];

var touchEvents = ['touchstart', 'touchmove', 'touchend'];
var methods = ['preventDefault'];
var properties = [{targetTouches: {0: ['pageX', 'pageY', 'identifier'], 1: ['pageX', 'pageY', 'identifier']}}];

function GestureHandler (dispatch, events) {
    this.dispatch = dispatch;

    this.last1 = new Vec2();
    this.last2 = new Vec2();

    this.delta1 = new Vec2();
    this.delta2 = new Vec2();

    this.velocity1 = new Vec2();
    this.velocity2 = new Vec2();

    this.dist = 0;
    this.diff12 = new Vec2();

    this.center = new Vec2();
    this.centerDelta = new Vec2();
    this.centerVelocity = new Vec2();

    this.pointer1 = {
            position: this.last1,
            delta: this.delta1,
            velocity: this.velocity1,
    };

    this.pointer2 = {
            position: this.last2,
            delta: this.delta2,
            velocity: this.velocity2,
    };

    this.event = {
        status: null,
        time: 0,
        pointers: [],
        center: this.center,
        centerDelta: this.centerDelta,
        centerVelocity: this.centerVelocity,
        points: 0,
        current: 0
    };

    this.trackedTouchIDs = [-1, -1];
    this.timeOfPointer = 0;
    this.multiTap = 0;

    this.gestures = [];
    this.options = {};
    this.trackedGestures = {};

    this._events = new CallbackStore();
    for (var i = 0, len = events.length; i < len; i++) {
        var gesture = events[i].event;
        var callback = events[i].callback;
        if (gestures[gesture]) {
            this.trackedGestures[gesture] = true;
            this.gestures.push(gesture);
            if (events[i].event) this.options[gesture] = events[i];
            this._events.on(gesture, callback);
        }
    }

    var renderables = dispatch.getRenderables();
    for (var i = 0, len = renderables.length; i < len; i++) {
        for (var j = 0, lenj = touchEvents.length; j < lenj; j++) {
            var touchEvent = touchEvents[j];
            if (renderables[i].on) renderables[i].on(touchEvent, methods, properties);
            dispatch.registerTargetedEvent(touchEvent, callbacks[j].bind(this));
        }
    }
}

GestureHandler.toString = function toString() {
    return 'GestureHandler';
};

GestureHandler.prototype.triggerGestures = function() {
    var payload = this.event;
    for (var i = 0, len = this.gestures.length; i < len; i++) {
        var gesture = this.gestures[i];
        switch (gesture) {
            case 'rotate':
            case 'pinch':
                if (payload.points === 2) this.trigger(gesture, payload);
                break;
            case 'tap':
                if (payload.status !== 'move') {
                    if (this.options['tap']) {
                        var pts = this.options['tap'].points || 1;
                        if(this.multiTap >= pts && payload.points >= pts) this.trigger(gesture, payload);
                    }
                    else this.trigger(gesture, payload);
                }
                break;
            default:
                this.trigger(gesture, payload);
                break;
        }
    }
};

GestureHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

function processTouchStart(e) {
    var t = e.targetTouches;

    if (t[0] && t[1] && this.trackedTouchIDs[0] === t[0].identifier && this.trackedTouchIDs[1] === t[1].identifier) {
        return;
    }

    this.event.time = Date.now();

    if (this.trackedTouchIDs[0] !== t[0].identifier) {
        if (this.trackedGestures['tap']) {
            var threshold = (this.options['tap'] && this.options['tap'].threshold) || 250;
            if (this.event.time - this.timeOfPointer < threshold) this.event.taps++;
            else this.event.taps = 1;
            this.timeOfPointer = this.event.time;
            this.multiTap = 1;
        }
        this.event.current = 1;
        this.event.points = 1;
        var id = t[0].identifier;
        this.trackedTouchIDs[0] = id;

        this.last1.set(t[0].pageX, t[0].pageY);
        this.velocity1.clear();
        this.delta1.clear();
        this.event.pointers.push(this.pointer1);
    }
    if (t[1] && this.trackedTouchIDs[1] !== t[1].identifier) {
        if (this.trackedGestures['tap']) {
            var threshold = (this.options['tap'] && this.options['tap'].threshold) || 250;
            if (this.event.time - this.timeOfPointer < threshold) this.multiTap = 2;
        }
        this.event.current = 2;
        this.event.points = 2;
        var id = t[1].identifier;
        this.trackedTouchIDs[1] = id;

        this.last2.set(t[1].pageX, t[1].pageY);
        this.velocity2.clear();
        this.delta2.clear();

        Vec2.add(this.last1, this.last2, this.center).scale(0.5);
        this.centerDelta.clear();
        this.centerVelocity.clear();

        Vec2.subtract(this.last2, this.last1, this.diff12);
        this.dist = this.diff12.length();

        if (this.trackedGestures['pinch']) {
            this.event.scale = this.event.scale || 1;
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotation = this.event.rotation || 0;
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
        this.event.pointers.push(this.pointer2);
    }

    this.event.status = 'start';
    if (this.event.points === 1) {
        this.center.copy(this.last1);
        this.centerDelta.clear();
        this.centerVelocity.clear();
        if (this.trackedGestures['pinch']) {
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
    }
    this.triggerGestures();
}

function processTouchMove(e) {
    var t = e.targetTouches;
    var time = Date.now();
    var dt = time - this.event.time;
    if (dt === 0) return;
    var invDt = 1000 / dt;
    this.event.time = time;

    this.event.current = 1;
    this.event.points = 1;
    if (this.trackedTouchIDs[0] === t[0].identifier) {
        VEC_REGISTER.set(t[0].pageX, t[0].pageY);
        Vec2.subtract(VEC_REGISTER, this.last1, this.delta1);
        Vec2.scale(this.delta1, invDt, this.velocity1);
        this.last1.copy(VEC_REGISTER);

    }
    if (t[1]) {
        this.event.current = 2;
        this.event.points = 2;
        VEC_REGISTER.set(t[1].pageX, t[1].pageY);
        Vec2.subtract(VEC_REGISTER, this.last2, this.delta2);
        Vec2.scale(this.delta2, invDt, this.velocity2);
        this.last2.copy(VEC_REGISTER);

        Vec2.add(this.last1, this.last2, VEC_REGISTER).scale(0.5);
        Vec2.subtract(VEC_REGISTER, this.center, this.centerDelta);
        Vec2.add(this.velocity1, this.velocity2, this.centerVelocity).scale(0.5);
        this.center.copy(VEC_REGISTER);

        Vec2.subtract(this.last2, this.last1, VEC_REGISTER);

        if (this.trackedGestures['rotate']) {
            var dot = VEC_REGISTER.dot(this.diff12);
            var cross = VEC_REGISTER.cross(this.diff12);
            var theta = -Math.atan2(cross, dot);
            this.event.rotation += theta;
            this.event.rotationDelta = theta;
            this.event.rotationVelocity = theta * invDt;
        }

        var dist = VEC_REGISTER.length();
        var scale = dist / this.dist;
        this.diff12.copy(VEC_REGISTER);
        this.dist = dist;

        if (this.trackedGestures['pinch']) {
            this.event.scale *= scale;
            scale -= 1.0;
            this.event.scaleDelta = scale;
            this.event.scaleVelocity = scale * invDt;
        }
    }

    this.event.status = 'move';
    if (this.event.points === 1) {
        this.center.copy(this.last1);
        this.centerDelta.copy(this.delta1);
        this.centerVelocity.copy(this.velocity1);
        if (this.trackedGestures['pinch']) {
            this.event.scaleDelta = 0;
            this.event.scaleVelocity = 0;
        }
        if (this.trackedGestures['rotate']) {
            this.event.rotationDelta = 0;
            this.event.rotationVelocity = 0;
        }
    }
    this.triggerGestures();
}

function processTouchEnd(e) {
    var t = e.targetTouches;

    if (t[0] && t[1] && this.trackedTouchIDs[0] === t[0].identifier && this.trackedTouchIDs[1] === t[1].identifier) {
            return;
    }

    this.event.status = 'end';
    if (!t[0]) {
        this.event.current = 0;
        this.trackedTouchIDs[0] = -1;
        this.trackedTouchIDs[1] = -1;
        this.triggerGestures();
        this.event.pointers.pop();
        this.event.pointers.pop();
        return;
    }
    else if(this.trackedTouchIDs[0] !== t[0].identifier) {
        this.trackedTouchIDs[0] = -1;
        var id = t[0].identifier;
        this.trackedTouchIDs[0] = id;

        this.last1.set(t[0].pageX, t[0].pageY);
        this.velocity1.clear();
        this.delta1.clear();
    }
    if (!t[1]) {
        this.event.current = 1;
        this.trackedTouchIDs[1] = -1;
        this.triggerGestures();
        this.event.points = 1;
        this.event.pointers.pop();
    }
    else if (this.trackedTouchIDs[1] !== t[1].identifier) {
        this.trackedTouchIDs[1] = -1;
        this.event.points = 2;
        var id = t[1].identifier;
        this.trackedTouchIDs[1] = id;

        this.last2.set(t[1].pageX, t[1].pageY);
        this.velocity2.clear();
        this.delta2.clear();

        Vec2.add(this.last1, this.last2, this.center).scale(0.5);
        this.centerDelta.clear();
        this.centerVelocity.clear();

        Vec2.subtract(this.last2, this.last1, this.diff12);
        this.dist = this.diff12.length();
    }
}

module.exports = GestureHandler;

},{"famous-math":227,"famous-utilities":242}],214:[function(require,module,exports){
'use strict';

var Position = require('./Position');

function MountPoint(dispatch) {
    Position.call(this, dispatch);
}

MountPoint.toString = function toString() {
    return 'MountPoint';
};

MountPoint.prototype = Object.create(Position.prototype);
MountPoint.prototype.constructor = MountPoint;

MountPoint.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setMountPoint(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = MountPoint;

},{"./Position":217}],215:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

function Opacity(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    this._value = new Transitionable(1);
}

Opacity.toString = function toString() {
    return 'Opacity';
};

Opacity.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        value: this._value.get()
    };
};

Opacity.prototype.setState = function setState(state) {
    if (this.constructor.toString() === state.component) {
        this.set(state.value);
        return true;
    }
    return false;
};

Opacity.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setOpacity(this._value.get());
    return this._value.isActive();
};

Opacity.prototype.set = function set(value, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._value.set(value, options, callback);
    return this;
};

Opacity.prototype.halt = function halt() {
    this._value.halt();
    return this;
};

module.exports = Opacity;

},{"famous-transitions":208}],216:[function(require,module,exports){
'use strict';

var Position = require('./Position');

function Origin(dispatch) {
    Position.call(this, dispatch);
}

Origin.toString = function toString() {
    return 'Origin';
};

Origin.prototype = Object.create(Position.prototype);
Origin.prototype.constructor = Origin;

Origin.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setOrigin(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Origin;

},{"./Position":217}],217:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

function Position(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    this._x = new Transitionable(0);
    this._y = new Transitionable(0);
    this._z = new Transitionable(0);
}

Position.toString = function toString() {
    return 'Position';
};

Position.prototype.getState = function getState() {
    return {
        component: this.constructor.toString(),
        x: this._x.get(),
        y: this._y.get(),
        z: this._z.get()
    };
};

Position.prototype.setState = function setState(state) {
    if (state.component === this.constructor.toString()) {
        this.set(state.x, state.y, state.z);
        return true;
    }
    return false;
};

Position.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setPosition(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

Position.prototype.setX = function setX(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._x.set(val, options, callback);
    return this;
};

Position.prototype.setY = function setY(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._y.set(val, options, callback);
    return this;
};

Position.prototype.setZ = function setZ(val, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._z.set(val, options, callback);
    return this;
};

Position.prototype.set = function set(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._x.set(x, options, callback);
    this._y.set(y, options, callback);
    this._z.set(z, options, callback);
    return this;
};

Position.prototype.halt = function halt() {
    this._x.halt();
    this._y.halt();
    this._z.halt();
    return this;
};

module.exports = Position;

},{"famous-transitions":208}],218:[function(require,module,exports){
'use strict';

var Position = require('./Position');

function Rotation(dispatch) {
    Position.call(this, dispatch);
}

Rotation.toString = function toString() {
    return 'Rotation';
};

Rotation.prototype = Object.create(Position.prototype);
Rotation.prototype.constructor = Rotation;

Rotation.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setRotation(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Rotation;

},{"./Position":217}],219:[function(require,module,exports){
'use strict';

var Position = require('./Position');

function Scale(dispatch) {
    Position.call(this, dispatch);
    this._x.set(1);
    this._y.set(1);
    this._z.set(1);
}

Scale.toString = function toString() {
    return 'Scale';
};

Scale.prototype = Object.create(Position.prototype);
Scale.prototype.constructor = Scale;

Scale.prototype.clean = function clean() {
    var context = this._dispatch._context;
    context.setScale(this._x.get(), this._y.get(), this._z.get());
    return this._x.isActive() || this._y.isActive() || this._z.isActive();
};

module.exports = Scale;

},{"./Position":217}],220:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

function Size(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    dispatch.dirtyComponent(this._id);
    this._absoluteMode = false;
    this._proportional = {
        x: new Transitionable(1),
        y: new Transitionable(1),
        z: new Transitionable(1)
    };
    this._differential = {
        x: new Transitionable(0),
        y: new Transitionable(0),
        z: new Transitionable(0)
    };
    this._absolute = {
        x: new Transitionable(0),
        y: new Transitionable(0),
        z: new Transitionable(0)
    };
}

Size.toString = function toString() {
    return 'Size';
};

Size.prototype.getState = function getState() {
    if (this._absoluteMode) {
        return {
            component: this.constructor.toString(),
            type: 'absolute',
            x: this._absolute.x.get(),
            y: this._absolute.y.get(),
            z: this._absolute.z.get()
        };
    }
    return {
        component: this.constructor.toString(),
        type: 'relative',
        differential: {
            x: this._differential.x.get(),
            y: this._differential.y.get(),
            z: this._differential.z.get()
        },
        proportional: {
            x: this._proportional.x.get(),
            y: this._proportional.y.get(),
            z: this._proportional.z.get()
        }
    };
};

Size.prototype.setState = function setState(state) {
    if (state.component === this.constructor.toString()) {
        this._absoluteMode = state.type === 'absolute';
        if (this._absoluteMode)
            this.setAbsolute(state.x, state.y, state.z);
        else {
            this.setProportional(state.proportional.x, state.proportional.y, state.proportional.z);
            this.setDifferential(state.differential.x, state.differential.y, state.differential.z);
        }
        return true;
    }
    return false;
};

Size.prototype._cleanAbsoluteX = function _cleanAbsoluteX(prop) {
    if (prop.dirtyX) {
        prop.dirtyX = prop.x.isActive();
        return prop.x.get();
    } else return null;
};

Size.prototype._cleanAbsoluteY = function _cleanAbsoluteY(prop) {
    if (prop.dirtyY) {
        prop.dirtyY = prop.y.isActive();
        return prop.y.get();
    } else return null;
};

Size.prototype._cleanAbsoluteZ = function _cleanAbsoluteZ(prop) {
    if (prop.dirtyZ) {
        prop.dirtyZ = prop.z.isActive();
        return prop.z.get();
    } else return null;
};

Size.prototype.clean = function clean () {
    var context = this._dispatch._context;
    if (this._absoluteMode) {
        var abs = this._absolute;
        context.setAbsolute(
            this._cleanAbsoluteX(abs),
            this._cleanAbsoluteY(abs),
            this._cleanAbsoluteZ(abs)
        );
        return abs.x.isActive() ||
            abs.y.isActive() ||
            abs.z.isActive();
    } else {
        var prop = this._proportional;
        var diff = this._differential;
        context.setProportions(
            this._cleanAbsoluteX(prop),
            this._cleanAbsoluteY(prop),
            this._cleanAbsoluteZ(prop)
        );
        context.setDifferential(
            this._cleanAbsoluteX(diff),
            this._cleanAbsoluteY(diff),
            this._cleanAbsoluteZ(diff)
        );
        return prop.x.isActive() ||
            prop.y.isActive() ||
            prop.z.isActive() ||
            diff.x.isActive() ||
            diff.y.isActive() ||
            diff.z.isActive();
    }
};

Size.prototype.setAbsolute = function setAbsolute(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    var abs = this._absolute;
    this._absoluteMode = true;
    if (x != null) {
        abs.x.set(x, options, callback);
        abs.dirtyX = true;
    }
    if (y != null) {
        abs.y.set(y, options, callback);
        abs.dirtyY = true;
    }
    if (z != null) {
        abs.z.set(z, options, callback);
        abs.dirtyZ = true;
    }
    return this;
};

Size.prototype.setProportional = function setProportional(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    this._needsDEBUG = true;
    var prop = this._proportional;
    this._absoluteMode = false;
    if (x != null) {
        prop.x.set(x, options, callback);
        prop.dirtyX = true;
    }
    if (y != null) {
        prop.y.set(y, options, callback);
        prop.dirtyY = true;
    }
    if (z != null) {
        prop.z.set(z, options, callback);
        prop.dirtyZ = true;
    }
    return this;
};

Size.prototype.setDifferential = function setDifferential(x, y, z, options, callback) {
    this._dispatch.dirtyComponent(this._id);
    var prop = this._differential;
    this._absoluteMode = false;
    if (x != null) {
        prop.x.set(x, options, callback);
        prop.dirtyX = true;
    }
    if (y != null) {
        prop.y.set(y, options, callback);
        prop.dirtyY = true;
    }
    if (z != null) {
        prop.z.set(z, options, callback);
        prop.dirtyZ = true;
    }
    return this;
};

Size.prototype.get = function get () {
    return this._dispatch.getContext().getSize();
};

module.exports = Size;

},{"famous-transitions":208}],221:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

function UIEventHandler (dispatch, events) {
    this._events = new CallbackStore();
    var renderables = dispatch.getRenderables();
    for (var i = 0, len = renderables.length; i < len; i++)
        for (var j = 0, len2 = events.length; j < len2; j++) {
            var eventName = events[i].event;
            var methods = events[i].methods;
            var properties = events[i].properties;
            var callback = events[i].callback;
            this._events.on(eventName, callback);
            if (renderables[i].on) renderables[i].on(eventName, methods, properties);
            dispatch.registerTargetedEvent(eventName, this.trigger.bind(this, eventName));
        }
}

UIEventHandler.toString = function toString() {
    return 'UIEventHandler';
};

UIEventHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

module.exports = UIEventHandler;

},{"famous-utilities":242}],222:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"./Align":209,"./Camera":210,"./EventEmitter":211,"./EventHandler":212,"./GestureHandler":213,"./MountPoint":214,"./Opacity":215,"./Origin":216,"./Position":217,"./Rotation":218,"./Scale":219,"./Size":220,"./UIEventHandler":221,"dup":20}],223:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],224:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./Mat33":223,"dup":199}],225:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"dup":200}],226:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"dup":201}],227:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./Mat33":223,"./Quaternion":224,"./Vec2":225,"./Vec3":226,"dup":202}],228:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],229:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":232,"dup":2}],230:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":229,"./TweenTransition":231,"dup":3}],231:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":228,"dup":4}],232:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],233:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":228,"./MultipleTransition":229,"./Transitionable":230,"./TweenTransition":231,"./after":232,"dup":6}],234:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],235:[function(require,module,exports){
'use strict';

/**
 * Module dependencies
 */
var Transitionable = require('famous-transitions').Transitionable;


/**
 * Color
 * Accepts RGB, HSL, HEX and HSV with getters and setters.
 * If no options are provided, RGB is the default setter.
 */
var Color = function Color() {
    this._r = new Transitionable(0);
    this._g = new Transitionable(0);
    this._b = new Transitionable(0);
    var options = Color.flattenArguments(arguments);
    if (options.length) this.set(options);
};

Color.toString = function toString() {
    return 'Color';
};


/**
 * GENERAL
 */
Color.prototype.set = function set() {
    var options = Color.flattenArguments(arguments);
    var type = this.determineType(options[0]);

    switch (type) {
        case 'hsl': this.setHSL(options.slice(1)); break;
        case 'rgb': this.setRGB(options.slice(1)); break;
        case 'hsv': this.setHSV(options.slice(1)); break;
        case 'hex': this.setHex(options); break;
        case 'color': this.setColor(options); break;
        case 'instance': this.copy(options); break;
        default: this.setRGB(options);
    }
    return this;
};

Color.prototype.isActive = function isActive() {
    return this._r.isActive() || this._g.isActive() || this._b.isActive();
};

Color.prototype.changeTo = function changeTo() {
    var options = Color.flattenArguments(arguments);
    if (options.length) this.set(options);
    return this;
};

Color.prototype.copy = function copy() {
    var values = Color.flattenArguments(arguments);
    var color = values[0], options = values[1];
    if (this.isColorInstance(color)) {
        this.setRGB(color.getRGB(), options);
    }
    return this;
};

Color.prototype.clone = function clone() {
    var rgb = this.getRGB();
    return new Color('rgb', rgb[0], rgb[1], rgb[2]);
};

Color.prototype.setColor = function setColor() {
    var values = Color.flattenArguments(arguments);
    var color = values[0], options = values[1];
    this.setHex(colorNames[color], options);
    return this;
};

Color.prototype.getColor = function getColor(option) {
    option = option || 'undefined';
    switch (option.toLowerCase()) {
        case 'undefined': return this.getRGB();
        case 'rgb': return this.getRGB();
        case 'hsl': return this.getHSL();
        case 'hex': return this.getHex();
        case 'hsv': return this.getHSV();
        default: return this.getRGB();;
    }
};

Color.prototype.isColorInstance = function isColorInstance(val) {
    return (val instanceof Color);
};

Color.prototype.determineType = function determineType(val) {
    if (this.isColorInstance(val)) return 'instance';
    if (Color.isHex(val)) return 'hex';
    if (colorNames[val]) return 'color';
    var types = ['rgb', 'hsl', 'hex', 'hsv'];
    for(var i = 0; i < types.length; i++) {
        if (Color.isType(val, types[i])) return types[i];
    }
};


/**
 * RGB
 */
Color.prototype.setR = function setR(r, options) {
    this._r.set(r, options);
    return this;
};

Color.prototype.setG = function setG(g, options) {
    this._g.set(g, options);
    return this;
};

Color.prototype.setB = function setB(b, options) {
    this._b.set(b, options);
    return this;
};

Color.prototype.setRGB = function setRGB() {
    var values = Color.flattenArguments(arguments);
    var options = values[3];
    this.setR(values[0], options);
    this.setG(values[1], options);
    this.setB(values[2], options);
    return this;
};

Color.prototype.getR = function getR() {
    return this._r.get();
};

Color.prototype.getG = function getG() {
    return this._g.get();
};

Color.prototype.getB = function getB() {
    return this._b.get();
};

Color.prototype.getRGB = function getRGB() {
    return [this.getR(), this.getG(), this.getB()];
};

Color.prototype.getNormalizedRGB = function getNormalizedRGB() {
    var r = this.getR() / 255.0;
    var g = this.getG() / 255.0;
    var b = this.getB() / 255.0;
    return [r, g, b];
};

Color.prototype.getRGBString = function toRGBString() {
    var r = this.getR();
    var g = this.getG();
    var b = this.getB();
    return 'rgb('+ r +', '+ g +', '+ b +');';
};

Color.prototype.addRGB = function addRGB(r, g, b) {
    var r = Color.clamp(this.getR() + r);
    var g = Color.clamp(this.getG() + g);
    var b = Color.clamp(this.getB() + b);
    this.setRGB(r, g, b);
    return this;
};

Color.prototype.addScalar = function addScalar(s) {
    var r = Color.clamp(this.getR() + s);
    var g = Color.clamp(this.getG() + s);
    var b = Color.clamp(this.getB() + s);
    this.setRGB(r, g, b);
    return this;
};

Color.prototype.multiplyRGB = function multiplyRGB(r, g, b) {
    var r = Color.clamp(this.getR() * r);
    var g = Color.clamp(this.getG() * g);
    var b = Color.clamp(this.getB() * b);
    this.setRGB(r, g, b);
    return this;
};

Color.prototype.multiplyScalar = function multiplyScalar(s) {
    var r = Color.clamp(this.getR() * s);
    var g = Color.clamp(this.getG() * s);
    var b = Color.clamp(this.getB() * s);
    this.setRGB(r, g, b);
    return this;
};

Color.prototype.equals = function equals(color) {
    if (this.isColorInstance(color)) {
        return  this.getR() === color.getR() &&
                this.getG() === color.getG() &&
                this.getB() === color.getB();
    }
    return false;
};

Color.prototype.copyGammaToLinear = function copyGammaToLinear(color) {
    if (this.isColorInstance(color)) {
        var r = color.getR();
        var g = color.getG();
        var b = color.getB();
        this.setRGB(r*r, g*g, b*b);
    }
    return this;
};

Color.prototype.convertGammaToLinear = function convertGammaToLinear() {
    var r = this.getR();
    var g = this.getG();
    var b = this.getB();
    this.setRGB(r*r, g*g, b*b);
    return this;
};

Color.prototype.addColors = function addColors(color1, color2) {
    var r = color1.getR() + color2.getR();
    var g = color1.getG() + color2.getG();
    var b = color1.getB() + color2.getB();
    return [r, g, b];
};


/**
 * HEX
 */
Color.prototype.toHex = function toHex(num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

Color.prototype.getHex = function getHex() {
    var r = this.toHex(this.getR());
    var g = this.toHex(this.getG());
    var b = this.toHex(this.getB());
    return '#' + r + g + b;
};

Color.prototype.setHex = function setHex() {
    var values = Color.flattenArguments(arguments);
    var hex, options;

    if (Color.isHex(values[0])) {
        hex = values[0];
        options = values[1];
    }
    else {
        hex = values[1]; options = values[2];
    }
    hex = (hex.charAt(0) === '#') ? hex.substring(1, hex.length) : hex;

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    this.setRGB(r, g, b, options);
    return this;
};


/**
 * HSL
 */
Color.prototype.hueToRGB = function hueToRGB(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

Color.prototype.setHSL = function setHSL() {
    var values = Color.flattenArguments(arguments);
    var h = values[0], s = values[1], l = values[2];
    var options = values[3];
    h /= 360.0;
    s /= 100.0;
    l /= 100.0;
    var r, g, b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = this.hueToRGB(p, q, h + 1/3);
        g = this.hueToRGB(p, q, h);
        b = this.hueToRGB(p, q, h - 1/3);
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    this.setRGB(r, g, b, options);
    return this;
};

Color.prototype.getHSL = function getHSL() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }
    return [h, s*100, l*100];
};

Color.prototype.getHue = function getHue() {
    var hsl = this.getHSL();
    return hsl[0];
};

Color.prototype.setHue = function setHue(h, options) {
    var hsl = this.getHSL();
    this.setHSL(h, hsl[1], hsl[2], options);
    return this;
};

Color.prototype.getSaturation = function getSaturation() {
    var hsl = this.getHSL();
    return hsl[1];
};

Color.prototype.setSaturation = function setSaturation(s, options) {
    var hsl = this.getHSL();
    this.setHSL(hsl[0], s, hsl[2], options);
    return this;
};

Color.prototype.getBrightness = function getBrightness() {
    var rgb = this.getNormalizedRGB();
    return Math.max(rgb[0], rgb[1], rgb[2]) * 100.0;
};

Color.prototype.getLightness = function getLightness() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2.0) * 100.0;
};

Color.prototype.getLightness = function getLightness() {
    var hsl = this.getHSL();
    return hsl[2];
};

Color.prototype.setLightness = function setLightness(l, options) {
    var hsl = this.getHSL();
    this.setHSL(hsl[0], hsl[0], l, options);
    return this;
};


/**
 * HSV
 */
Color.prototype.setHSV = function setHSV() {
    var values = Color.flattenArguments(arguments);
    var h = values[0], s = values[1], v = values[2];
    var options = values[3];
    var r, g, b;
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    this.setRGB(r*255, g*255, b*255, options);
    return this;
};

Color.prototype.getHSV = function getHSV() {
    var rgb = this.getNormalizedRGB();
    var r = rgb[0], g = rgb[1], b = rgb[2];
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;
    var d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max == min) {
        h = 0;
    }
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, v];
};


/**
 * Generic color names
 */
var colorNames = {
    aliceblue: '#f0f8ff',
    antiquewhite: '#faebd7',
    aqua: '#00ffff',
    aquamarine: '#7fffd4',
    azure: '#f0ffff',
    beige: '#f5f5dc',
    bisque: '#ffe4c4',
    black: '#000000',
    blanchedalmond: '#ffebcd',
    blue: '#0000ff',
    blueviolet: '#8a2be2',
    brown: '#a52a2a',
    burlywood: '#deb887',
    cadetblue: '#5f9ea0',
    chartreuse: '#7fff00',
    chocolate: '#d2691e',
    coral: '#ff7f50',
    cornflowerblue: '#6495ed',
    cornsilk: '#fff8dc',
    crimson: '#dc143c',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b',
    darkgray: '#a9a9a9',
    darkgreen: '#006400',
    darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b',
    darkslategray: '#2f4f4f',
    darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1',
    darkviolet: '#9400d3',
    deeppink: '#ff1493',
    deepskyblue: '#00bfff',
    dimgray: '#696969',
    dimgrey: '#696969',
    dodgerblue: '#1e90ff',
    firebrick: '#b22222',
    floralwhite: '#fffaf0',
    forestgreen: '#228b22',
    fuchsia: '#ff00ff',
    gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff',
    gold: '#ffd700',
    goldenrod: '#daa520',
    gray: '#808080',
    green: '#008000',
    greenyellow: '#adff2f',
    grey: '#808080',
    honeydew: '#f0fff0',
    hotpink: '#ff69b4',
    indianred: '#cd5c5c',
    indigo: '#4b0082',
    ivory: '#fffff0',
    khaki: '#f0e68c',
    lavender: '#e6e6fa',
    lavenderblush: '#fff0f5',
    lawngreen: '#7cfc00',
    lemonchiffon: '#fffacd',
    lightblue: '#add8e6',
    lightcoral: '#f08080',
    lightcyan: '#e0ffff',
    lightgoldenrodyellow: '#fafad2',
    lightgray: '#d3d3d3',
    lightgreen: '#90ee90',
    lightgrey: '#d3d3d3',
    lightpink: '#ffb6c1',
    lightsalmon: '#ffa07a',
    lightseagreen: '#20b2aa',
    lightskyblue: '#87cefa',
    lightslategray: '#778899',
    lightslategrey: '#778899',
    lightsteelblue: '#b0c4de',
    lightyellow: '#ffffe0',
    lime: '#00ff00',
    limegreen: '#32cd32',
    linen: '#faf0e6',
    magenta: '#ff00ff',
    maroon: '#800000',
    mediumaquamarine: '#66cdaa',
    mediumblue: '#0000cd',
    mediumorchid: '#ba55d3',
    mediumpurple: '#9370db',
    mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee',
    mediumspringgreen: '#00fa9a',
    mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585',
    midnightblue: '#191970',
    mintcream: '#f5fffa',
    mistyrose: '#ffe4e1',
    moccasin: '#ffe4b5',
    navajowhite: '#ffdead',
    navy: '#000080',
    oldlace: '#fdf5e6',
    olive: '#808000',
    olivedrab: '#6b8e23',
    orange: '#ffa500',
    orangered: '#ff4500',
    orchid: '#da70d6',
    palegoldenrod: '#eee8aa',
    palegreen: '#98fb98',
    paleturquoise: '#afeeee',
    palevioletred: '#db7093',
    papayawhip: '#ffefd5',
    peachpuff: '#ffdab9',
    peru: '#cd853f',
    pink: '#ffc0cb',
    plum: '#dda0dd',
    powderblue: '#b0e0e6',
    purple: '#800080',
    rebeccapurple: '#663399',
    red: '#ff0000',
    rosybrown: '#bc8f8f',
    royalblue: '#4169e1',
    saddlebrown: '#8b4513',
    salmon: '#fa8072',
    sandybrown: '#f4a460',
    seagreen: '#2e8b57',
    seashell: '#fff5ee',
    sienna: '#a0522d',
    silver: '#c0c0c0',
    skyblue: '#87ceeb',
    slateblue: '#6a5acd',
    slategray: '#708090',
    slategrey: '#708090',
    snow: '#fffafa',
    springgreen: '#00ff7f',
    steelblue: '#4682b4',
    tan: '#d2b48c',
    teal: '#008080',
    thistle: '#d8bfd8',
    tomato: '#ff6347',
    turquoise: '#40e0d0',
    violet: '#ee82ee',
    wheat: '#f5deb3',
    white: '#ffffff',
    whitesmoke: '#f5f5f5',
    yellow: '#ffff00',
    yellowgreen: '#9acd32'
};



/**
 * Helper functions
 */
Color.flattenArguments = function flattenArguments(options) {
    return Array.prototype.concat.apply([], options);
};

Color.argsToArray = function argsToArray(val) {
    return Array.prototype.slice.call(val);
};

Color.isString = function isString(val) {
    return (typeof val === 'string');
};

Color.isInt = function isInt(val) {
    return parseInt(val) === val;
};

Color.isFloat = function isFloat(val) {
    return !Color.isInt(val);
};

Color.allFloats = function allFloats() {
    var val = Color.argsToArray(arguments);
    for(var i = 0; i < val.length; i++) {
        if (!Color.isFloat(val[i])) return false;
    }
    return true;
};

Color.allInts = function allInts(val) {
    return !Color.allFloats(val);
};

Color.allStrings = function allStrings() {
    var values = Color.argsToArray(arguments);
    for(var i = 0; i < values.length; i++) {
        if (!Color.isString(values[i])) return false;
    }
    return true;
};

Color.isPercentage = function isPercentage(val) {
    return /%/.test(val);
};

Color.isHex = function isHex(val) {
    return /#/.test(val);
};

Color.isType = function isType(type, value) {
    return Color.allStrings(type, value) && type.toLowerCase() === value.toLowerCase();
};

Color.clamp = function clamp(val, min, max) {
    min = min || 0;
    max = max || 255;
    return Math.max(Math.min(val, max), min);
};


/**
 * Expose
 */
module.exports = Color;

},{"famous-transitions":233}],236:[function(require,module,exports){
'use strict';

/**
 * Module dependencies
 */
var Color = require('./Color');


/**
 * @class Stores multiple palettes in a collection and provides methods for
 *        accessing, adding, and retrieving a random palette from a pre-set
 *        collection.
 * @description
 * @name ColorPalettes
 * @constructor
 */
var ColorPalette = function ColorPalette() {
    this._palette = [];
    var options = Color.flattenArguments(arguments);
    (options.length) ? this.makePalette(options) : this.setRandomPalette();
};

ColorPalette.prototype.getPalette = function getPalette() {
    return this._palette;
};

ColorPalette.prototype.getColor = function getColor(i) {
    return this._palette[i];
};

ColorPalette.prototype.makeColor = function makeColor() {
    var options = Color.flattenArguments(arguments);
    return new Color(options[0], options[1], options[2]);
};

ColorPalette.prototype.makePalette = function makePalette() {
    var options = Color.flattenArguments(arguments);
    var palette = [];
    for(var i = 0; i < options.length; i++) {
        var color = this.makeColor(options[i]);
        palette.push(color);
    }
    this._palette = palette;
    return this;
};

ColorPalette.prototype.setRandomPalette = function setRandomPalette() {
    var index = Math.floor(Math.random() * rawPalettes.length);
    this.makePalette(rawPalettes[Math.floor(index)]);
    return this;
};

ColorPalette.prototype.getLighestColor = function() {
    var lightestValue = 0, lightestRef;

    for (var i = 0; i < this._palette.length; i++) {
        var light = this._palette[i].getLightness();
        if (light > lightestValue) {
            lightestRef = this._palette[i];
            lightestValue = light;
        }
    }
    return lightestRef;
};

ColorPalette.prototype.getDarkestColor = function() {
    var darkestValue = 100, darkestRef;

    for (var i = 0; i < this._palette.length; i++) {
        var dark = this._palette[i].getLightness();
        if( dark < darkestValue ) {
            darkestRef = this._palette[i];
            darkestValue = dark;
        }
    }
    return darkestRef;
};

ColorPalette.prototype.getPaletteCount = function getPaletteCount() {
    return this._palette.length;
};


/**
 * Palettes
 */
var rawPalettes = [
    [[53,92,125], [108,91,123], [192,108,132], [246,114,128], [248,177,149]],
    [[27,21,33], [181,172,1], [212,30,69], [232,110,28], [236,186,9]],
    [[63,54,42], [231,69,13], [250,157,4], [251,222,3], [254,245,150]],
    [[10,103,137], [10,153,111], [207,6,56], [250,102,50], [254,205,35]],
    [[157,85,105], [192,227,217], [202,55,99], [227,237,195], [235,113,84]],
    [[110,110,110], [145,217,255], [237,255,135], [255,133,167], [255,255,255]],
    [[0,0,0], [25,26,36], [51,44,44], [250,101,87], [255,255,255]],
    [[27,103,107], [81,149,72], [136,196,37], [190,242,2], [234,253,230]],
    [[31,11,12], [48,5,17], [179,84,79], [214,195,150], [231,252,207]],
    [[172,248,248], [223,235,24], [230,95,95], [235,54,24], [235,207,24]],
    [[196,182,109], [213,39,5], [240,211,119], [243,232,228], [247,109,60]],
    [[11,72,107], [59,134,134], [121,189,154], [168,219,168], [207,240,158]],
    [[0,188,209], [118,211,222], [174,232,251], [176,248,255], [254,249,240]],
    [[85,73,57], [112,108,77], [241,230,143], [255,100,100], [255,151,111]],
    [[36,244,161], [178,42,58], [199,244,36], [244,36,182], [249,246,49]],
    [[108,144,134], [169,204,24], [207,73,108], [235,234,188], [252,84,99]],
    [[78,79,75], [130,35,57], [247,62,62], [255,119,61], [255,213,115]],
    [[121,28,49], [145,213,152], [191,178,64], [202,51,68], [237,126,80]],
    [[104,73,83], [127,191,151], [182,219,145], [250,107,41], [253,158,41]],
    [[0,203,231], [0,218,60], [223,21,26], [244,243,40], [253,134,3]],
    [[56,222,231], [232,255,0], [254,62,71], [255,130,0]],
    [[27,32,38], [75,89,107], [153,228,255], [247,79,79], [255,59,59]],
    [[0,0,0], [0,173,239], [236,0,140], [255,242,0]],
    [[47,43,173], [173,43,173], [228,38,146], [247,21,104], [247,219,21]],
    [[101,150,158], [171,20,44], [189,219,222], [205,212,108], [219,217,210]],
    [[97,24,36], [193,47,42], [247,255,238], [254,222,123], [255,101,64]],
    [[118,85,66], [124,231,163], [220,93,110], [255,174,60], [255,229,156]],
    [[63,184,175], [127,199,175], [218,216,167], [255,61,127], [255,158,157]],
    [[217,251,223], [219,255,210], [231,254,235], [234,255,210], [243,255,210]],
    [[0,23,42], [27,139,163], [94,202,214], [178,222,249], [206,254,255]],
    [[225,245,196], [237,229,116], [249,212,35], [252,145,58], [255,78,80]],
    [[7,9,61], [11,16,140], [12,15,102], [14,78,173], [16,127,201]],
    [[5,177,240], [5,232,240], [94,87,230], [230,87,149], [255,5,113]],
    [[48,0,24], [90,61,49], [131,123,71], [173,184,95], [229,237,184]],
    [[111,191,162], [191,184,174], [242,199,119], [242,230,194], [255,255,255]],
    [[22,147,165], [69,181,196], [126,206,202], [160,222,214], [199,237,232]],
    [[8,26,48], [50,64,90], [59,100,128], [155,153,130], [255,134,17]],
    [[74,186,176], [152,33,0], [255,211,0], [255,245,158]],
    [[42,135,50], [49,48,66], [107,85,48], [255,109,36], [255,235,107]],
    [[0,0,0], [25,134,219], [105,172,224], [149,199,24], [184,212,40]],
    [[64,0,20], [127,0,40], [191,0,59], [229,0,71], [255,0,79]],
    [[56,69,59], [78,133,136], [255,70,84], [255,213,106], [255,254,211]],
    [[29,44,143], [57,179,162], [209,146,191], [222,75,107], [252,180,121]],
    [[14,36,48], [232,213,183], [232,213,185], [245,179,73], [252,58,81]],
    [[0,210,255], [222,255,0], [255,0,168], [255,66,0]],
    [[21,99,105], [51,53,84], [169,186,181], [216,69,148], [236,196,89]],
    [[105,210,231], [167,219,216], [224,228,204], [243,134,48], [250,105,0]],
    [[122,106,83], [148,140,117], [153,178,183], [213,222,217], [217,206,178]],
    [[34,104,136], [57,142,182], [255,162,0], [255,214,0], [255,245,0]],
    [[2,100,117], [194,163,79], [251,184,41], [254,251,175], [255,229,69]],
    [[214,37,77], [246,215,107], [253,235,169], [255,84,117], [255,144,54]],
    [[0,0,0], [124,180,144], [211,25,0], [255,102,0], [255,242,175]],
    [[35,116,222], [38,38,38], [87,54,255], [231,255,54], [255,54,111]],
    [[64,18,44], [89,186,169], [101,98,115], [216,241,113], [252,255,217]],
    [[126,148,158], [174,194,171], [235,206,160], [252,119,101], [255,51,95]],
    [[75,73,11], [117,116,73], [226,223,154], [235,229,77], [255,0,81]],
    [[159,112,69], [183,98,5], [208,167,124], [253,169,43], [254,238,171]],
    [[38,37,28], [160,232,183], [235,10,68], [242,100,61], [242,167,61]],
    [[0,0,0], [67,110,217], [120,0,0], [216,216,216], [240,24,0]],
    [[51,51,51], [131,163,0], [158,12,57], [226,27,90], [251,255,227]],
    [[79,156,52], [108,186,85], [125,210,89], [158,228,70], [187,255,133]],
    [[0,44,43], [7,100,97], [10,131,127], [255,61,0], [255,188,17]],
    [[149,207,183], [240,65,85], [242,242,111], [255,130,58], [255,247,189]],
    [[89,168,15], [158,213,76], [196,237,104], [226,255,158], [240,242,221]],
    [[54,42,44], [189,223,38], [237,38,105], [238,189,97], [252,84,99]],
    [[11,246,147], [38,137,233], [233,26,157], [246,182,11], [246,242,11]],
    [[8,0,9], [65,242,221], [207,242,65], [249,44,130], [252,241,30]],
    [[198,164,154], [198,229,217], [214,129,137], [233,78,119], [244,234,213]],
    [[6,71,128], [8,84,199], [160,194,222], [205,239,255], [237,237,244]],
    [[93,66,63], [124,87,83], [238,128,117], [255,177,169], [255,233,231]],
    [[59,129,131], [237,48,60], [245,99,74], [250,208,137], [255,156,91]],
    [[56,166,155], [104,191,101], [204,217,106], [242,88,53], [242,218,94]],
    [[60,197,234], [70,70,70], [233,234,60], [246,246,246]],
    [[97,99,130], [102,36,91], [105,165,164], [168,196,162], [229,234,164]],
    [[10,191,188], [19,116,125], [41,34,31], [252,53,76], [252,247,197]],
    [[7,0,4], [236,67,8], [252,129,10], [255,172,35], [255,251,214]],
    [[0,5,1], [8,138,19], [237,20,9], [240,249,241], [247,249,21]],
    [[64,197,132], [131,218,232], [170,46,154], [251,35,137], [251,132,137]],
    [[64,47,58], [217,119,119], [255,198,158], [255,219,196]],
    [[243,96,49], [249,236,95], [255,102,0], [255,153,0], [255,204,0]],
    [[33,90,109], [45,45,41], [60,162,162], [146,199,163], [223,236,230]],
    [[10,42,63], [101,147,160], [185,204,184], [219,21,34], [255,239,167]],
    [[0,160,176], [106,74,60], [204,51,63], [235,104,65], [237,201,81]],
    [[14,141,148], [67,77,83], [114,173,117], [233,213,88], [255,171,7]],
    [[94,159,163], [176,85,116], [220,209,180], [248,126,123], [250,184,127]],
    [[31,31,31], [122,91,62], [205,189,174], [250,75,0], [250,250,250]],
    [[176,230,41], [180,35,16], [247,207,10], [250,124,7], [252,231,13]],
    [[94,65,47], [120,192,168], [240,120,24], [240,168,48], [252,235,182]],
    [[31,26,28], [98,128,125], [134,158,138], [201,107,30], [209,205,178]],
    [[40,60,0], [100,153,125], [237,143,69], [241,169,48], [254,204,109]],
    [[37,2,15], [143,143,143], [158,30,76], [236,236,236], [255,17,104]],
    [[207,108,116], [244,93,120], [255,112,136], [255,130,153], [255,187,193]],
    [[0,0,0], [12,13,5], [168,171,132], [198,201,157], [231,235,176]],
    [[0,170,255], [170,0,255], [170,255,0], [255,0,170], [255,170,0]],
    [[78,150,137], [126,208,214], [135,214,155], [195,255,104], [244,252,232]],
    [[10,10,10], [227,246,255], [255,20,87], [255,216,125]],
    [[51,51,153], [102,153,204], [153,204,255], [255,0,51], [255,204,0]],
    [[23,22,92], [190,191,158], [216,210,153], [229,228,218], [245,224,56]],
    [[49,99,64], [96,158,77], [159,252,88], [195,252,88], [242,252,88]],
    [[92,88,99], [168,81,99], [180,222,193], [207,255,221], [255,31,76]],
    [[61,67,7], [161,253,17], [225,244,56], [244,251,196], [255,208,79]],
    [[0,205,172], [2,170,176], [22,147,165], [127,255,36], [195,255,104]],
    [[0,203,231], [0,218,60], [223,21,26], [244,243,40], [253,134,3]],
    [[34,104,136], [57,142,182], [255,162,0], [255,214,0], [255,245,0]],
    [[3,13,79], [206,236,239], [231,237,234], [251,12,6], [255,197,44]],
    [[253,255,0], [255,0,0], [255,90,0], [255,114,0], [255,167,0]],
    [[108,66,18], [179,0,176], [183,255,55], [255,124,69], [255,234,155]],
    [[0,4,49], [59,69,58], [90,224,151], [204,46,9], [255,253,202]],
    [[59,45,56], [188,189,172], [207,190,39], [240,36,117], [242,116,53]],
    [[101,145,155], [120,185,168], [168,212,148], [242,177,73], [244,229,97]],
    [[0,193,118], [136,193,0], [250,190,40], [255,0,60], [255,138,0]],
    [[110,37,63], [165,199,185], [199,94,106], [241,245,244], [251,236,236]],
    [[39,112,140], [111,191,162], [190,191,149], [227,208,116], [255,180,115]],
    [[62,72,76], [82,91,96], [105,158,81], [131,178,107], [242,232,97]],
    [[248,135,46], [252,88,12], [252,107,10], [253,202,73], [255,169,39]],
    [[83,119,122], [84,36,55], [192,41,66], [217,91,67], [236,208,120]],
    [[41,136,140], [54,19,0], [162,121,15], [188,53,33], [255,208,130]],
    [[10,186,181], [58,203,199], [106,219,216], [153,236,234], [201,252,251]],
    [[8,158,42], [9,42,100], [90,204,191], [229,4,4], [251,235,175]],
    [[187,187,136], [204,198,141], [238,170,136], [238,194,144], [238,221,153]],
    [[121,219,204], [134,78,65], [234,169,167], [242,199,196], [248,245,226]],
    [[96,136,213], [114,170,222], [157,200,233], [192,222,245], [217,239,244]],
    [[30,30,30], [177,255,0], [209,210,212], [242,240,240]],
    [[255,102,0], [255,153,0], [255,204,0], [255,255,204], [255,255,255]],
    [[35,15,43], [130,179,174], [188,227,197], [235,235,188], [242,29,65]],
    [[212,238,94], [225,237,185], [240,242,235], [244,250,210], [255,66,66]],
    [[20,32,71], [168,95,59], [247,92,92], [255,255,255]],
    [[63,184,240], [80,208,240], [196,251,93], [224,240,240], [236,255,224]],
    [[185,222,81], [209,227,137], [224,72,145], [225,183,237], [245,225,226]],
    [[185,222,81], [209,227,137], [224,72,145], [225,183,237], [245,225,226]],
    [[17,68,34], [51,170,170], [51,221,51], [221,238,68], [221,238,187]],
    [[46,13,35], [245,72,40], [247,128,60], [248,228,193], [255,237,191]],
    [[204,243,144], [224,224,90], [247,196,31], [252,147,10], [255,0,61]],
    [[18,18,18], [255,89,56], [255,255,255]],
    [[53,38,48], [85,72,101], [205,91,81], [233,223,204], [243,163,107]],
    [[236,250,1], [236,250,2], [247,220,2], [248,227,113], [250,173,9]],
    [[77,129,121], [161,129,121], [236,85,101], [249,220,159], [254,157,93]],
    [[4,0,4], [65,61,61], [75,0,15], [200,255,0], [250,2,60]],
    [[66,50,56], [179,112,45], [200,209,151], [235,33,56], [245,222,140]],
    [[143,153,36], [172,201,95], [241,57,109], [243,255,235], [253,96,129]],
    [[18,18,18], [23,122,135], [250,245,240], [255,180,143]],
    [[67,197,210], [182,108,97], [241,155,140], [254,247,237], [255,234,215]],
    [[78,205,196], [85,98,112], [196,77,88], [199,244,100], [255,107,107]],
    [[0,0,0], [137,161,160], [154,227,226], [255,71,103], [255,118,5]],
    [[248,200,221], [253,231,120], [255,61,61], [255,92,143], [255,103,65]],
    [[23,138,132], [145,145,145], [229,255,125], [235,143,172], [255,255,255]],
    [[73,112,138], [136,171,194], [202,255,66], [208,224,235], [235,247,248]],
    [[51,222,245], [122,245,51], [245,51,145], [245,161,52], [248,248,101]],
    [[57,13,45], [172,222,178], [225,234,181], [237,173,158], [254,75,116]],
    [[192,107,129], [233,22,67], [245,175,145], [247,201,182], [249,210,182]],
    [[131,196,192], [156,100,53], [190,215,62], [237,66,98], [240,233,226]],
    [[136,145,136], [191,218,223], [207,246,247], [233,26,82], [237,242,210]],
    [[64,44,56], [209,212,169], [227,164,129], [245,215,165], [255,111,121]],
    [[93,65,87], [131,134,137], [168,202,186], [202,215,178], [235,227,170]],
    [[0,168,198], [64,192,203], [143,190,0], [174,226,57], [249,242,231]],
    [[0,204,190], [9,166,163], [157,191,175], [237,235,201], [252,249,216]],
    [[0,205,172], [2,170,176], [22,147,165], [127,255,36], [195,255,104]],
    [[51,39,23], [107,172,191], [157,188,188], [240,240,175], [255,55,15]],
    [[51,51,53], [101,99,106], [139,135,149], [193,190,200], [233,232,238]],
    [[17,118,109], [65,9,54], [164,11,84], [228,111,10], [240,179,0]],
    [[73,10,61], [138,155,15], [189,21,80], [233,127,2], [248,202,0]],
    [[71,162,145], [144,79,135], [213,28,122], [219,213,139], [244,127,143]],
    [[55,191,230], [169,232,250], [186,255,21], [211,255,106], [247,239,236]],
    [[69,173,168], [84,121,128], [89,79,79], [157,224,173], [229,252,194]],
    [[248,241,224], [249,246,241], [250,244,227], [251,106,79], [255,193,150]],
    [[0,98,125], [1,64,87], [51,50,49], [66,153,15], [255,255,255]],
    [[52,17,57], [53,150,104], [60,50,81], [168,212,111], [255,237,144]],
    [[0,153,137], [163,169,72], [206,24,54], [237,185,46], [248,89,49]],
    [[26,31,30], [108,189,181], [147,204,198], [200,214,191], [227,223,186]],
    [[165,222,190], [183,234,201], [251,178,163], [252,37,55], [255,215,183]],
    [[26,20,14], [90,142,161], [204,65,65], [255,255,255]],
    [[51,51,51], [111,111,111], [204,204,204], [255,100,0], [255,255,255]],
    [[51,145,148], [167,2,103], [241,12,73], [246,216,107], [251,107,65]],
    [[31,3,51], [31,57,77], [39,130,92], [112,179,112], [171,204,120]],
    [[209,242,165], [239,250,180], [245,105,145], [255,159,128], [255,196,140]],
    [[60,54,79], [109,124,157], [124,144,179], [149,181,194], [185,224,220]],
    [[35,179,218], [153,214,241], [168,153,241], [208,89,218], [248,78,150]],
    [[85,66,54], [96,185,154], [211,206,61], [241,239,165], [247,120,37]],
    [[20,20,20], [177,198,204], [255,239,94], [255,255,255]],
    [[136,238,208], [202,224,129], [239,67,53], [242,205,79], [246,139,54]],
    [[53,38,29], [95,79,69], [151,123,105], [206,173,142], [253,115,26]],
    [[68,66,89], [159,189,166], [219,101,68], [240,145,67], [252,177,71]],
    [[191,208,0], [196,60,39], [233,60,31], [242,83,58], [242,240,235]],
    [[43,43,43], [53,54,52], [230,50,75], [242,227,198], [255,198,165]],
    [[23,20,38], [26,15,12], [207,207,207], [240,240,240], [255,77,148]],
    [[28,1,19], [107,1,3], [163,0,6], [194,26,1], [240,60,2]],
    [[10,10,10], [140,97,70], [214,179,156], [242,76,61], [255,255,255]],
    [[46,13,35], [245,72,40], [247,128,60], [248,228,193], [255,237,191]],
    [[0,62,95], [0,67,132], [22,147,165], [150,207,234], [247,249,114]],
    [[66,29,56], [87,0,69], [190,226,232], [205,255,24], [255,8,90]],
    [[47,59,97], [121,128,146], [187,235,185], [233,236,229], [255,103,89]],
    [[58,17,28], [87,73,81], [131,152,142], [188,222,165], [230,249,188]],
    [[147,193,196], [198,182,204], [242,202,174], [250,12,195], [255,123,15]],
    [[255,3,149], [255,9,3], [255,139,3], [255,216,3], [255,251,3]],
    [[4,0,4], [254,26,138], [254,53,26], [254,143,26], [254,240,26]],
    [[125,173,154], [196,199,169], [249,213,177], [254,126,142], [255,62,97]],
    [[69,38,50], [145,32,77], [226,247,206], [228,132,74], [232,191,86]],
    [[0,0,0], [38,173,228], [77,188,233], [209,231,81], [255,255,255]],
    [[44,87,133], [209,19,47], [235,241,247], [237,214,130]],
    [[92,172,196], [140,209,157], [206,232,121], [252,182,83], [255,82,84]],
    [[58,68,8], [74,88,7], [125,146,22], [157,222,13], [199,237,14]],
    [[22,147,167], [200,207,2], [204,12,57], [230,120,30], [248,252,193]],
    [[59,12,44], [210,255,31], [250,244,224], [255,106,0], [255,195,0]],
    [[44,13,26], [52,158,151], [200,206,19], [222,26,114], [248,245,193]],
    [[28,20,13], [203,232,107], [242,233,225], [255,255,255]],
    [[75,88,191], [161,206,247], [247,255,133], [255,54,134]],
    [[74,95,103], [92,55,75], [204,55,71], [209,92,87], [217,212,168]]
];


/**
 * Expose
 */
module.exports = ColorPalette;

},{"./Color":235}],237:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],238:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],239:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],240:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],241:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],242:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":234,"./Color":235,"./ColorPalette":236,"./KeyCodes":237,"./MethodStore":238,"./ObjectManager":239,"./clone":240,"./flatClone":241,"./loadURL":243,"./strip":244,"dup":35}],243:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],244:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],245:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],246:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./Mat33":245,"dup":199}],247:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"dup":200}],248:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"dup":201}],249:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./Mat33":245,"./Quaternion":246,"./Vec2":247,"./Vec3":248,"dup":202}],250:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],251:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":254,"dup":2}],252:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":251,"./TweenTransition":253,"dup":3}],253:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":250,"dup":4}],254:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],255:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":250,"./MultipleTransition":251,"./Transitionable":252,"./TweenTransition":253,"./after":254,"dup":6}],256:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],257:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":255}],258:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":257,"dup":29}],259:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],260:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],261:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],262:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],263:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],264:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":256,"./Color":257,"./ColorPalette":258,"./KeyCodes":259,"./MethodStore":260,"./ObjectManager":261,"./clone":262,"./flatClone":263,"./loadURL":265,"./strip":266,"dup":35}],265:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],266:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],267:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;

var ObjectManager = require('famous-utilities').ObjectManager;
ObjectManager.register('DynamicGeometry', DynamicGeometry);
ObjectManager.register('DynamicGeometryFeature', DynamicGeometryFeature);
var OMRequestDynamicGeometryFeature = ObjectManager.requestDynamicGeometryFeature;
var OMFreeDynamicGeometryFeature = ObjectManager.freeDynamicGeometryFeature;

var TRIPLE_REGISTER = new Vec3();

/**
 * The so called triple product. Used to find a vector perpendicular to (v2 - v1) in the direction of v3.
 * (v1 x v2) x v3.
 *
 * @method tripleProduct
 * @private
 * @param {Vec3} v1 The first Vec3.
 * @param {Vec3} v2 The second Vec3.
 * @param {Vec3} v3 The third Vec3.
 * @return {Vec3} The result of the triple product.
 */
function tripleProduct(v1, v2, v3) {
    var v = TRIPLE_REGISTER;

    Vec3.cross(v1, v2, v);
    Vec3.cross(v, v3, v);

    return v;
}

/**
 * Of a set of vertices, retrieves the vertex furthest in the given direction.
 *
 * @method _hullSupport
 * @private
 * @param {Vec3[]} vertices The reference set of Vec3's.
 * @param {Vec3} direction The direction to compare against.
 * @return {Object} The vertex and its index in the vertex array.
 */
function _hullSupport(vertices, direction) {
    var furthest;
    var max = -Infinity;
    var dot;
    var vertex;
    var index;
    for (var i = 0; i < vertices.length; i++) {
        vertex = vertices[i];
        dot = Vec3.dot(vertex, direction);
        if (dot > max) {
            furthest = vertex;
            max = dot;
            index = i;
        }
    }

    return {
        vertex: furthest,
        index: index
    };
}

var VEC_REGISTER = new Vec3();
var POINTCHECK_REGISTER = new Vec3();
var AO_REGISTER = new Vec3();
var AB_REGISTER = new Vec3();
var AC_REGISTER = new Vec3();
var AD_REGISTER = new Vec3();
var BC_REGISTER = new Vec3();
var BD_REGISTER = new Vec3();

/**
 * Used internally to represent polyhedral facet information.
 *
 * @class DynamicGeometryFeature
 * @param {Number} distance The distance of the feature from the origin.
 * @param {Vec3} normal The Vec3 orthogonal to the feature, pointing out of the geometry.
 * @param {Number[]} vertexIndices The indices of the vertices which compose the feature.
 */
function DynamicGeometryFeature(distance, normal, vertexIndices) {
    this.distance = distance;
    this.normal = normal;
    this.vertexIndices = vertexIndices;
}

/**
 * Used by ObjectManager to reset objects.
 *
 * @method reset
 * @param {Array} args Argument array analogous to that used in instantiation.
 * @chainable
 */
DynamicGeometryFeature.prototype.reset = function(distance, normal, vertexIndices) {
    this.distance = distance;
    this.normal = normal;
    this.vertexIndices = vertexIndices;

    return this;
};

/**
 * Abstract object representing a growing polyhedron. Used in ConvexHull and in GJK+EPA collision detection.
 *
 * @class DynamicGeometry
 */
function DynamicGeometry() {
    this.vertices = [];
    this.numVertices = 0;
    this.features = [];
    this.numFeatures = 0;
    this.lastVertexIndex = 0;

    this._IDPool = {
        vertices: [],
        features: []
    };
}

/**
 * Used by ObjectManager to reset objects.
 *
 * @method reset
 * @param {Array} args Argument array analogous to that used in instantiation.
 * @chainable
 */
DynamicGeometry.prototype.reset = function reset() {
    this.vertices = [];
    this.numVertices = 0;
    this.features = [];
    this.numFeatures = 0;
    this.lastVertexIndex = 0;

    this._IDPool = {
        vertices: [],
        features: []
    };

    return this;
}

/**
 * Add a vertex to the polyhedron.
 *
 * @method addVertex
 * @param {Object} vertexObj Object returned by the support function.
 */
DynamicGeometry.prototype.addVertex = function(vertexObj) {
    var index = this._IDPool.vertices.length ? this._IDPool.vertices.pop() : this.vertices.length;
    this.vertices[index] = vertexObj;
    this.lastVertexIndex = index;
    this.numVertices++;
};

/**
 * Remove a vertex and push its location in the vertex array to the IDPool for later use.
 *
 * @method removeVertex
 * @param {Number} index Index of the vertex to remove.
 */
DynamicGeometry.prototype.removeVertex = function(index) {
    var vertex = this.vertices[index];
    this.vertices[index] = null;
    this._IDPool.vertices.push(index);
    this.numVertices--;

    return vertex;
};

/**
 * Add a feature (facet) to the polyhedron. Used internally in the reshaping process.
 *
 * @method addFeature
 * @param {Number} distance The distance of the feature from the origin.
 * @param {Vec3} normal The facet normal.
 * @param {Number[]} vertexIndices The indices of the vertices which compose the feature.
 */
DynamicGeometry.prototype.addFeature = function(distance, normal, vertexIndices) {
    var index = this._IDPool.features.length ? this._IDPool.features.pop() : this.features.length;
    this.features[index] = OMRequestDynamicGeometryFeature().reset(distance, normal, vertexIndices);
    this.numFeatures++;
};

/**
 * Remove a feature and push its location in the feature array to the IDPool for later use.
 *
 * @method removeFeature
 * @param {Number} index Index of the feature to remove.
 */
DynamicGeometry.prototype.removeFeature = function(index) {
    var feature = this.features[index];
    this.features[index] = null;
    this._IDPool.features.push(index);
    this.numFeatures--;

    OMFreeDynamicGeometryFeature(feature);
};

/**
 * Retrieve the last vertex object added to the geometry.
 *
 * @method getLastVertex
 * @return {Object}
 */
DynamicGeometry.prototype.getLastVertex = function() {
    return this.vertices[this.lastVertexIndex];
};

/**
 * Of the closest face to the origin, returns the normal vector pointed away from the origin.
 *
 * @method getFeatureClosestToOrigin
 * @return {Object}
 */
DynamicGeometry.prototype.getFeatureClosestToOrigin = function() {
    var min = Infinity;
    var closest = null;
    var features = this.features;
    for (var i = 0, len = features.length; i < len; i++) {
        var feature = features[i];
        if (!feature) continue;
        if (feature.distance < min) {
            min = feature.distance;
            closest = feature
        }
    }
    return closest;
};

/**
 * Adds edge if not already on the frontier, removes if the edge or its reverse are on the frontier.
 * Used when reshaping DynamicGeometry's.
 *
 * @method _validateEdge
 * @private
 * @param {Object[]} vertices Vec3 reference array.
 * @param {Number[][]} frontier Current edges potentially separating the features to remove from the persistant shape.
 * @param {Number} start The index of the starting Vec3 on the edge.
 * @param {Number} end The index of the culminating Vec3.
 */
function _validateEdge(vertices, frontier, start, end) {
    var e0 = vertices[start].vertex;
    var e1 = vertices[end].vertex;
    for (var i = 0, len = frontier.length; i < len; i++) {
        var edge = frontier[i];
        if (!edge) continue;
        var v0 = vertices[edge[0]].vertex;
        var v1 = vertices[edge[1]].vertex;
        if ((e0 === v0 && (e1 === v1)) || (e0 === v1 && (e1 === v0))) {
            frontier[i] = null;
            return;
        }
    }
    frontier.push([start, end]);
}

/**
 * Based on the last (exterior) point added to the polyhedron, removes features as necessary and redetermines
 * its (convex) shape to include the new point by adding triangle features. Uses referencePoint, a point on the shape's
 * interior, to ensure feature normals point outward, else takes referencePoint to be the origin.
 *
 * @method reshape
 * @param {Vec3} referencePoint Point known to be in the interior, used to orient feature normals.
 */
DynamicGeometry.prototype.reshape = function(referencePoint) {
    var vertices = this.vertices;
    var point = this.getLastVertex().vertex;
    var features = this.features;
    var vertexOnFeature;
    var featureVertices;

    // The removal of features creates a hole in the polyhedron -- frontierEdges maintains the edges
    // of this hole, each of which will form one edge of a new feature to be created
    var frontierEdges = [];

    for (var i = 0, len = features.length; i < len; i++) {
        if (!features[i]) continue;
        featureVertices = features[i].vertexIndices;
        vertexOnFeature = vertices[featureVertices[0]].vertex;
        // If point is 'above' the feature, remove that feature, and check to add its edges to the frontier.
        if (Vec3.dot(features[i].normal, Vec3.subtract(point, vertexOnFeature, POINTCHECK_REGISTER)) > -0.001) {
            _validateEdge(vertices, frontierEdges, featureVertices[0], featureVertices[1]);
            _validateEdge(vertices, frontierEdges, featureVertices[1], featureVertices[2]);
            _validateEdge(vertices, frontierEdges, featureVertices[2], featureVertices[0]);
            this.removeFeature(i);
        }
    }

    var A = point;
    var a = this.lastVertexIndex;
    for (var j = 0, len = frontierEdges.length; j < len; j++) {
        if (!frontierEdges[j]) continue;
        var b = frontierEdges[j][0];
        var c = frontierEdges[j][1];
        var B = vertices[b].vertex;
        var C = vertices[c].vertex;

        var AB = Vec3.subtract(B, A, AB_REGISTER);
        var AC = Vec3.subtract(C, A, AC_REGISTER);
        var ABC = Vec3.cross(AB, AC, new Vec3())
        ABC.normalize();

        if (!referencePoint) {
            var distance = Vec3.dot(ABC, A);
            if (distance < 0) {
                ABC.invert();
                distance *= -1;
            }
            this.addFeature(distance, ABC, [a, b, c]);
        }
        else {
            var reference = Vec3.subtract(referencePoint, A, VEC_REGISTER);
            if (Vec3.dot(ABC, reference) > -0.001) ABC.invert();
            this.addFeature(null, ABC, [a, b, c]);
        }
    }
};

/**
 * Checks if the Simplex instance contains the origin, returns true or false.
 * If false, removes a point and, as a side effect, changes input direction to be both
 * orthogonal to the current working simplex and point toward the origin.
 * Calls callback on the removed point.
 *
 * @method simplexContainsOrigin
 * @param {Vec3} direction Vector used to store the new search direction.
 * @param {Function} callback Function invoked with the removed vertex, used e.g. to free the vertex object
 * in the object manager.
 * @return {Boolean} The result of the containment check.
 */
DynamicGeometry.prototype.simplexContainsOrigin = function(direction, callback) {
    var numVertices = this.vertices.length

    var a = this.lastVertexIndex;
    var b = a - 1;
    var c = a - 2;
    var d = a - 3;

    b = b < 0 ? b + numVertices : b;
    c = c < 0 ? c + numVertices : c;
    d = d < 0 ? d + numVertices : d;

    var A = this.vertices[a].vertex;
    var B = this.vertices[b].vertex;
    var C = this.vertices[c].vertex;
    var D = this.vertices[d].vertex;

    var AO = Vec3.scale(A, -1, AO_REGISTER);
    var AB = Vec3.subtract(B, A, AB_REGISTER);

    var vertexToRemove;

    if (numVertices === 4) {
        // Tetrahedron
        var AC = Vec3.subtract(C, A, AC_REGISTER);
        var AD = Vec3.subtract(D, A, AD_REGISTER);

        var ABC = Vec3.cross(AB, AC, new Vec3());
        var ACD = Vec3.cross(AC, AD, new Vec3());
        var ABD = Vec3.cross(AB, AD, new Vec3());
        ABC.normalize();
        ACD.normalize();
        ABD.normalize();
        if (Vec3.dot(ABC, AD) > 0) ABC.invert();
        if (Vec3.dot(ACD, AB) > 0) ACD.invert();
        if (Vec3.dot(ABD, AC) > 0) ABD.invert();
        // Don't need to check BCD because we would have just checked that in the previous iteration
        // -- we added A to the BCD triangle because A was in the direction of the origin.

        var distanceABC = Vec3.dot(ABC, AO);
        var distanceACD = Vec3.dot(ACD, AO);
        var distanceABD = Vec3.dot(ABD, AO);

        var EPSILON = 0.001;

        // Norms point away from origin -> origin is inside tetrahedron
        if (distanceABC < EPSILON && distanceABD < EPSILON && distanceACD < EPSILON) {
            var BC = Vec3.subtract(C, B, BC_REGISTER);
            var BD = Vec3.subtract(D, B, BD_REGISTER);
            var BCD = Vec3.cross(BC, BD, new Vec3());
            BCD.normalize();
            if (Vec3.dot(BCD, AB) <= 0) BCD.invert();
            var distanceBCD = -1 * Vec3.dot(BCD,B)
            // Prep features for EPA
            this.addFeature(-distanceABC, ABC, [a,b,c]);
            this.addFeature(-distanceACD, ACD, [a,c,d]);
            this.addFeature(-distanceABD, ABD, [a,d,b]);
            this.addFeature(-distanceBCD, BCD, [b,c,d]);
            return true;
        }
        else if (distanceABC >= 0.001) {
            vertexToRemove = this.removeVertex(d);
            direction.copy(ABC);
        }
        else if (distanceACD >= 0.001) {
            vertexToRemove = this.removeVertex(b);
            direction.copy(ACD);
        }
        else {
            vertexToRemove = this.removeVertex(c);
            direction.copy(ABD);
        }
    }
    else if (numVertices === 3) {
        // Triangle
        var AC = Vec3.subtract(C, A, AC_REGISTER);
        Vec3.cross(AB, AC, direction);
        if (Vec3.dot(direction, AO) <= 0) direction.invert();
    }
    else {
        // Line
        direction.copy(tripleProduct(AB, AO, AB));
    }
    if (vertexToRemove && callback) callback(vertexToRemove);
    return false;
};

/**
 * Given an array of Vec3's, computes the convex hull. Used in constructing bodies in the physics system and to
 * create custom GL meshes.
 *
 * @class ConvexHull
 * @constructor
 * @param {Vec3[]} vertices Cloud of vertices of which the enclosing convex hull is desired.
 * @param {Number} [iterations = 1e3] Maximum number of vertices to compose the convex hull.
 */
function ConvexHull(vertices, iterations) {
    iterations = iterations || 1e3;
    var hull = _computeConvexHull(vertices, iterations);

    var indices = [];
    for (var i = 0, len = hull.features.length; i < len; i++) {
        var f = hull.features[i];
        if (f) indices.push(f.vertexIndices);
    }

    var polyhedralProperties = _computePolyhedralProperties(hull.vertices, indices);
    var centroid = polyhedralProperties.centroid;

    var worldVertices = [];
    for (var i = 0, len = hull.vertices.length; i < len; i++) {
        worldVertices.push(Vec3.subtract(hull.vertices[i].vertex, centroid, new Vec3()));
    }

    var normals = [];
    for (var i = 0, len = worldVertices.length; i < len; i++) {
        normals.push(Vec3.normalize(worldVertices[i], new Vec3()));
    }

    var graph = {};
    var _neighborMatrix = {};
    for (var i = 0; i < indices.length; i++) {
        var a = indices[i][0];
        var b = indices[i][1];
        var c = indices[i][2];

        _neighborMatrix[a] = _neighborMatrix[a] || {};
        _neighborMatrix[b] = _neighborMatrix[b] || {};
        _neighborMatrix[c] = _neighborMatrix[c] || {};

        graph[a] = graph[a] || [];
        graph[b] = graph[b] || [];
        graph[c] = graph[c] || [];

        if (!_neighborMatrix[a][b]) {
            _neighborMatrix[a][b] = 1;
            graph[a].push(b);
        }
        if (!_neighborMatrix[a][c]) {
            _neighborMatrix[a][c] = 1;
            graph[a].push(c);
        }
        if (!_neighborMatrix[b][a]) {
            _neighborMatrix[b][a] = 1;
            graph[b].push(a);
        }
        if (!_neighborMatrix[b][c]) {
            _neighborMatrix[b][c] = 1;
            graph[b].push(c);
        }
        if (!_neighborMatrix[c][a]) {
            _neighborMatrix[c][a] = 1;
            graph[c].push(a);
        }
        if (!_neighborMatrix[c][b]) {
            _neighborMatrix[c][b] = 1;
            graph[c].push(b);
        }
    }

    this.indices = indices;
    this.vertices = worldVertices;
    this.normals = normals;
    this.polyhedralProperties = polyhedralProperties;
    this.graph = graph;
};

/**
 * Performs the actual computation of the convex hull.
 *
 * @method _computeConvexHull
 * @private
 * @param {Vec3[]} vertices Cloud of vertices of which the enclosing convex hull is desired.
 * @param {Number} maxIterations Maximum number of vertices to compose the convex hull.
 * @return {DynamicGeometry} The computed hull.
 */
function _computeConvexHull(vertices, maxIterations) {
    var hull = new DynamicGeometry();

    hull.addVertex(_hullSupport(vertices, new Vec3(1, 0, 0)));
    hull.addVertex(_hullSupport(vertices, new Vec3(-1, 0, 0)));
    var A = hull.vertices[0].vertex;
    var B = hull.vertices[1].vertex;
    var AB = Vec3.subtract(B, A, AB_REGISTER);

    var dot;
    var vertex;
    var furthest;
    var index;
    var max = -Infinity;
    for (var i = 0; i < vertices.length; i++) {
        vertex = vertices[i];
        if (vertex === A || vertex === B) continue;
        var AV = Vec3.subtract(vertex, A, VEC_REGISTER);
        dot = Vec3.dot(AV, tripleProduct(AB, AV, AB));
        dot = dot < 0 ? dot * -1 : dot;
        if (dot > max) {
            max = dot;
            furthest = vertex;
            index = i;
        }
    }
    hull.addVertex({
        vertex: furthest,
        index: index
    });

    var C = furthest;
    var AC = Vec3.subtract(C, A, AC_REGISTER);
    var ABC = Vec3.cross(AB, AC, new Vec3());
    ABC.normalize();

    var dot;
    var vertex;
    var furthest;
    var index;
    var max = -Infinity;
    for (var i = 0; i < vertices.length; i++) {
        vertex = vertices[i];
        if (vertex === A || vertex === B || vertex === C) continue;
        dot = Vec3.dot(Vec3.subtract(vertex, A, VEC_REGISTER), ABC);
        dot = dot < 0 ? dot * -1 : dot;
        if (dot > max) {
            max = dot;
            furthest = vertex;
            index = i;
        }
    }
    hull.addVertex({
        vertex: furthest,
        index: index
    });

    var D = furthest;
    var AD = Vec3.subtract(D, A, AD_REGISTER);
    var BC = Vec3.subtract(C, B, BC_REGISTER);
    var BD = Vec3.subtract(D, B, BD_REGISTER);

    var ACD = Vec3.cross(AC, AD, new Vec3());
    var ABD = Vec3.cross(AB, AD, new Vec3());
    var BCD = Vec3.cross(BC, BD, new Vec3());
    ACD.normalize();
    ABD.normalize();
    BCD.normalize();
    if (Vec3.dot(ABC, AD) > 0) ABC.invert();
    if (Vec3.dot(ACD, AB) > 0) ACD.invert();
    if (Vec3.dot(ABD, AC) > 0) ABD.invert();
    if (Vec3.dot(BCD, AB) < 0) BCD.invert();

    var a = 0;
    var b = 1;
    var c = 2;
    var d = 3;

    hull.addFeature(null, ABC, [a, b, c]);
    hull.addFeature(null, ACD, [a, c, d]);
    hull.addFeature(null, ABD, [a, b, d]);
    hull.addFeature(null, BCD, [b, c, d]);

    var assigned = {};
    for (var i = 0, len = hull.vertices.length; i < len; i++) {
       assigned[hull.vertices[i].index] = true;
    }


    var cx = A.x + B.x + C.x + D.x;
    var cy = A.y + B.y + C.y + D.y;
    var cz = A.z + B.z + C.z + D.z;
    var referencePoint = new Vec3(cx, cy, cz);
    referencePoint.scale(0.25);

    var features = hull.features;
    var iteration = 0;
    while (iteration++ < maxIterations) {
        var currentFeature = null;
        for (var i = 0; i < features.length; i++) {
            if (!features[i] || features[i].done) continue;
            currentFeature = features[i];
            var furthest = null;
            var index = null;
            var A = hull.vertices[currentFeature.vertexIndices[0]].vertex;
            var s = _hullSupport(vertices, currentFeature.normal);
            furthest = s.vertex;
            index = s.index;
            var dist = Vec3.dot(Vec3.subtract(furthest, A, VEC_REGISTER), currentFeature.normal);

            if (dist < 0.001 || assigned[index]) {
                currentFeature.done = true;
                continue;
            }

            assigned[index] = true;
            hull.addVertex(s);
            hull.reshape(referencePoint);
        }
            // No feature has points 'above' it -> finished
        if (currentFeature === null) break;
    }

    return hull;
}

/**
 * Helper function used in _computePolyhedralProperties.
 * Sets f0 - f2 and g0 - g2 depending on w0 - w2.
 *
 * @method _subexpressions
 * @private
 * @param {Number} w0 Reference x coordinate.
 * @param {Number} w1 Reference y coordinate.
 * @param {Number} w2 Reference z coordinate.
 * @param {Number[]} f One of two output registers to contain the result of the calculation.
 * @param {Number[]} g One of two output registers to contain the result of the calculation.
 */
function _subexpressions(w0, w1, w2, f, g) {
    var t0 = w0 + w1;
    f[0] = t0 + w2;
    var t1 = w0 * w0;
    var t2 = t1 + w1 * t0;
    f[1] = t2 + w2 * f[0];
    f[2] = w0 * t1 + w1 * t2 + w2 * f[1];
    g[0] = f[1] + w0 * (f[0] + w0);
    g[1] = f[1] + w1 * (f[0] + w1);
    g[2] = f[1] + w2 * (f[0] + w2);
}

/**
 * Determines various properties of the volume.
 *
 * @method _computePolyhedralProperties
 * @private
 * @param {Vec3[]} vertices The vertices of the polyhedron.
 * @param {Number[][]} indices Array of arrays of indices of vertices composing the triangular features of the polyhedron,
 * one array for each feature.
 * @return {Object} Object holding the calculated span, volume, center, and euler tensor.
 */
function _computePolyhedralProperties(vertices, indices) {
    // Order: 1, x, y, z, x^2, y^2, z^2, xy, yz, zx
    var integrals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var fx = [];
    var fy = [];
    var fz = [];
    var gx = [];
    var gy = [];
    var gz = [];

    for (var i = 0, len = indices.length; i < len; i++) {
        var A = vertices[indices[i][0]].vertex;
        var B = vertices[indices[i][1]].vertex;
        var C = vertices[indices[i][2]].vertex;
        var AB = Vec3.subtract(B, A, AB_REGISTER);
        var AC = Vec3.subtract(C, A, AC_REGISTER);
        var ABC = AB.cross(AC);
        if (Vec3.dot(A, ABC) < 0) ABC.invert();

        var d0 = ABC.x;
        var d1 = ABC.y;
        var d2 = ABC.z;

        var x0 = A.x;
        var y0 = A.y;
        var z0 = A.z;
        var x1 = B.x;
        var y1 = B.y;
        var z1 = B.z;
        var x2 = C.x;
        var y2 = C.y;
        var z2 = C.z;

        _subexpressions(x0, x1, x2, fx, gx);
        _subexpressions(y0, y1, y2, fy, gy);
        _subexpressions(z0, z1, z2, fz, gz);

        integrals[0] += d0 * fx[0];
        integrals[1] += d0 * fx[1];
        integrals[2] += d1 * fy[1];
        integrals[3] += d2 * fz[1];
        integrals[4] += d0 * fx[2];
        integrals[5] += d1 * fy[2];
        integrals[6] += d2 * fz[2];
        integrals[7] += d0 * (y0 * gx[0] + y1 * gx[1] + y2 * gx[2]);
        integrals[8] += d1 * (z0 * gy[0] + z1 * gy[1] + z2 * gy[2]);
        integrals[9] += d2 * (x0 * gz[0] + x1 * gz[1] + x2 * gz[2]);
    }

    integrals[0] /= 6;
    integrals[1] /= 24;
    integrals[2] /= 24;
    integrals[3] /= 24;
    integrals[4] /= 60;
    integrals[5] /= 60;
    integrals[6] /= 60;
    integrals[7] /= 120;
    integrals[8] /= 120;
    integrals[9] /= 120;

    var minX = Infinity, maxX = -Infinity;
    var minY = Infinity, maxY = -Infinity;
    var minZ = Infinity, maxZ = -Infinity;

    for (var i = 0, len = vertices.length; i < len; i++) {
        var vertex = vertices[i].vertex;
        if (vertex.x < minX) minX = vertex.x;
        if (vertex.x > maxX) maxX = vertex.x;
        if (vertex.y < minY) minY = vertex.y;
        if (vertex.y > maxY) maxY = vertex.y;
        if (vertex.z < minZ) minZ = vertex.z;
        if (vertex.z > maxZ) maxZ = vertex.z;
    }

    var size = [maxX - minX, maxY - minY, maxZ - minZ];
    var volume = integrals[0];
    var centroid = new Vec3(integrals[1], integrals[2], integrals[3]);
    centroid.scale(1 / volume);

    var eulerTensor = new Mat33([
                                  integrals[4], integrals[7], integrals[9],
                                  integrals[7], integrals[5], integrals[8],
                                  integrals[9], integrals[8], integrals[6]
                                 ]);

    return {
        size: size,
        volume: volume,
        centroid: centroid,
        eulerTensor: eulerTensor
    }
}

module.exports = {
    DynamicGeometry: DynamicGeometry,
    ConvexHull: ConvexHull
};

},{"famous-math":249,"famous-utilities":264}],268:[function(require,module,exports){
'use strict';

var Particle = require('./bodies/Particle');
var Constraint = require('./constraints/Constraint');
var Force = require('./forces/Force');

var Vec3 = require('famous-math').Vec3;
var Quaternion = require('famous-math').Quaternion;

var VEC_REGISTER = new Vec3();
var XYZ_REGISTER = new Vec3();
var QUAT_REGISTER = new Quaternion();
var DELTA_REGISTER = new Vec3();

/**
 * Singleton PhysicsEngine object.
 * Manages bodies, forces, constraints.
 *
 * @class PhysicsEngine
 * @param {Object} options A hash of configurable options.
 */
function PhysicsEngine(options) {
    options = options || {};
    /** @prop bodies The bodies currently active in the engine. */
    this.bodies = [];
    /** @prop forces The forces currently active in the engine. */
    this.forces = [];
    /** @prop constraints The constraints currently active in the engine. */
    this.constraints = [];

    /** @prop step The time between frames in the engine. */
    this.step = options.step || 1000/60;
    /** @prop iterations The number of times each constraint is solved per frame. */
    this.iterations = options.iterations || 10;
    /** @prop _indexPool Pools of indicies to track holes in the arrays. */
    this._indexPools = {
        bodies: [],
        forces: [],
        constraints: []
    };

    this._entityMaps = {
        bodies: {},
        forces: {},
        constraints: {}
    };

    this.speed = options.speed || 1.0;
    this.time = 0;
    this.delta = 0;

    this.origin = options.origin || new Vec3();
    this.orientation = options.orientation ? options.orientation.normalize() :  new Quaternion();

    this.prestep = [];
    this.poststep = [];

    this.transformBuffer = {
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    };

    this.frameDependent = options.frameDependent || false;
}

/**
 * Set the origin of the world.
 *
 * @method setOrigin
 * @chainable
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
PhysicsEngine.prototype.setOrigin = function(x, y, z) {
    this.origin.set(x, y, z);
    return this;
};

/**
 * Set the orientation of the world.
 *
 * @method setOrientation
 * @chainable
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
PhysicsEngine.prototype.setOrientation = function(w, x, y, z) {
    this.orientation.set(w, x, y, z).normalize();
    return this;
}

/**
 * Private helper method to store an element in a library array.
 *
 * @method _addElement
 * @private
 * @param {Object} element The body, force, or constraint to add.
 * @param {String} key Where to store the element.
 */
function _addElement(context, element, key) {
    var map = context._entityMaps[key];
    if (map[element._ID] == null) {
        var library = context[key];
        var indexPool = context._indexPools[key];
        if (indexPool.length) map[element._ID] = indexPool.pop();
        else map[element._ID] = library.length;
        library[map[element._ID]] = element;
    }
}

/**
 * Private helper method to remove an element from a library array.
 *
 * @method _removeElement
 * @private
 * @param {Object} element The body, force, or constraint to remove.
 * @param {String} key Where to store the element.
 */
function _removeElement(context, element, key) {
    var map = context._entityMaps[key];
    var index = map[element._ID];
    if (index != null) {
        context._indexPools[key].push(index);
        context[key][index] = null;
        map[element._ID] = null;
    }
}

/**
 * Add a group of bodies, force, or constraints to the engine.
 *
 * @method add
 * @chainable
 */
PhysicsEngine.prototype.add = function add() {
    for (var j = 0, lenj = arguments.length; j < lenj; j++) {
        var entity = arguments[j];
        if (entity instanceof Array) {
            for (var i = 0, len = entity.length; i < len; i++) {
                var e = entity[i];
                this.add(e);
            }
        } else {
            if (entity instanceof Particle) this.addBody(entity);
            else if (entity instanceof Constraint) this.addConstraint(entity);
            else if (entity instanceof Force) this.addForce(entity);
        }
    }
    return this;
};

/**
 * Remove a group of bodies, force, or constraints from the engine.
 *
 * @method remove
 * @chainable
 */
PhysicsEngine.prototype.remove = function remove() {
    for (var j = 0, lenj = arguments.length; j < lenj; j++) {
        var entity = arguments[j];
        if (entity instanceof Array) {
            for (var i = 0, len = entity.length; i < len; i++) {
                var e = entity[i];
                this.add(e);
            }
        } else {
            if (entity instanceof Particle) this.removeBody(entity);
            else if (entity instanceof Constraint) this.removeConstraint(entity);
            else if (entity instanceof Force) this.removeForce(entity);
        }
    }
    return this;
};

/**
 * Begin tracking a body.
 *
 * @method addBody
 * @param {Particle} body The body to track.
 */
PhysicsEngine.prototype.addBody = function addBody(body) {
    _addElement(this, body, 'bodies');
};

/**
 * Begin tracking a force.
 *
 * @method addForce
 * @param {Force} force The force to track.
 */
PhysicsEngine.prototype.addForce = function addForce(force) {
    _addElement(this, force, 'forces');
};

/**
 * Begin tracking a constraint.
 *
 * @method addConstraint
 * @param {Constraint} constraint The constraint to track.
 */
PhysicsEngine.prototype.addConstraint = function addConstraint(constraint) {
    _addElement(this, constraint, 'constraints');
};

/**
 * Stop tracking a body.
 *
 * @method removeBody
 * @param {Particle} body The body to stop tracking.
 */
PhysicsEngine.prototype.removeBody = function removeBody(body) {
    _removeElement(this, body, 'bodies')
};

/**
 * Stop tracking a force.
 *
 * @method removeForce
 * @param {Force} force The force to stop tracking.
 */
PhysicsEngine.prototype.removeForce = function removeForce(force) {
    _removeElement(this, force, 'forces')
};

/**
 * Stop tracking a constraint.
 *
 * @method removeConstraint
 * @param {Constraint} constraint The constraint to stop tracking.
 */
PhysicsEngine.prototype.removeConstraint = function removeConstraint(constraint) {
    _removeElement(this, constraint, 'constraints')
};

/**
 * Update the physics system to reflect the changes since the last frame. Steps forward in increments of
 * PhysicsEngine.step.
 *
 * @method update
 * @param {Number} time
 */
PhysicsEngine.prototype.update = function update(time) {
    if (this.time === 0) this.time = time;

    var bodies = this.bodies;
    var forces = this.forces;
    var constraints = this.constraints;

    var frameDependent = this.frameDependent;
    var step = this.step;
    var dt = step * 0.001;
    var speed = this.speed;

    var delta = this.delta;
    delta += (time - this.time) * speed;
    this.time = time;

    while(delta > step) {
        for (var i = 0, len = this.prestep.length; i < len; i++) {
            this.prestep[i](time, dt);
        }

        // Update Forces on particles
        for (var i = 0, numForces = forces.length; i < numForces; i++) {
            var force = forces[i];
            if (force === null) continue;
            force.update(time, dt);
        }

        // Tentatively update velocities
        for (var i = 0, numBodies = bodies.length; i < numBodies; i++) {
            var body = bodies[i];
            if (body === null) continue;
            _integrateVelocity(body, dt);
        }

        // Prep constraints for solver
        for (var i = 0, numConstraints = constraints.length; i < numConstraints; i++) {
            var constraint = constraints[i];
            if (constraint === null) continue;
            constraint.update(time, dt);
        }

        // Iteratively resolve constraints
        for (var j = 0, numIterations = this.iterations; j < numIterations; j++) {
            for (var i = 0; i < numConstraints; i++) {
                var constraint = constraints[i];
                if (constraint === null) continue;
                constraint.resolve(time, dt);
            }
        }

        // Increment positions and orientations
        for (var i = 0; i < numBodies; i++) {
            var body = bodies[i];
            if (body === null) continue;
            _integratePose(body, dt);
        }

        for (var i = 0, len = this.poststep.length; i < len; i++) {
            this.poststep[i](time, dt);
        }

        if (frameDependent) delta = 0;
        else delta -= step;
    }

    this.delta = delta;
};

/**
 * Get the transform equivalent to the Particle's position and orientation.
 *
 * @method getTransform
 * @return {Transform}
 */
PhysicsEngine.prototype.getTransform = function getTransform(body) {
    var o = this.origin;
    var oq = this.orientation;
    var p = body.position;
    var q = body.orientation;
    var rot = q;
    var loc = p;
    var XYZ;

    if (oq.w !== 1) {
        rot = Quaternion.multiply(q, oq, QUAT_REGISTER)
        loc = oq.rotateVector(p, VEC_REGISTER);
    }
    
    XYZ = rot.toEulerXYZ(XYZ_REGISTER);

    this.transformBuffer.position[0] = o.x+loc.x;
    this.transformBuffer.position[1] = o.y+loc.y;
    this.transformBuffer.position[2] = o.z+loc.z;

    this.transformBuffer.rotation[0] = XYZ.x;
    this.transformBuffer.rotation[1] = XYZ.y;
    this.transformBuffer.rotation[2] = XYZ.z;

    return this.transformBuffer;
};

/**
 * Update the Particle momenta based off of current incident force and torque.
 *
 * @method _integrateVelocity
 * @private
 * @param {Particle} body
 * @param {Number} dt delta time
 */
function _integrateVelocity(body, dt) {
    body.momentum.add(Vec3.scale(body.force, dt, DELTA_REGISTER));
    body.angularMomentum.add(Vec3.scale(body.torque, dt, DELTA_REGISTER));
    Vec3.scale(body.momentum, body.inverseMass, body.velocity);
    body.inverseInertia.vectorMultiply(body.angularMomentum, body.angularVelocity);
    body.force.clear();
    body.torque.clear();
};

/**
 * Update the Particle position and orientation based off current translational and angular velocities.
 *
 * @method _integratePose
 * @private
 * @param {Particle} body
 * @param dt {Number} delta time
 */
function _integratePose(body, dt) {
    if (body.restrictions !== 0) {
        var restrictions = body.restrictions;
        var x = null;
        var y = null;
        var z = null;
        var ax = null;
        var ay = null;
        var az = null;

        if (restrictions & 32) x = 0;
        if (restrictions & 16) y = 0;
        if (restrictions & 8) z = 0;
        if (restrictions & 4) ax = 0;
        if (restrictions & 2) ay = 0;
        if (restrictions & 1) az = 0;

        body.setVelocity(x,y,z);
        body.setAngularVelocity(ax, ay, az);
    }

    body.position.add(Vec3.scale(body.velocity, dt, DELTA_REGISTER));

    var w = body.angularVelocity;
    var q = body.orientation;
    var wx = w.x;
    var wy = w.y;
    var wz = w.z;

    var qw = q.w;
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;

    var hdt = dt * 0.5;
    q.w += (-wx * qx - wy * qy - wz * qz) * hdt;
    q.x += (wx * qw + wy * qz - wz * qy) * hdt;
    q.y += (wy * qw + wz * qx - wx * qz) * hdt;
    q.z += (wz * qw + wx * qy - wy * qx) * hdt;

    q.normalize();
};

module.exports = PhysicsEngine;

},{"./bodies/Particle":271,"./constraints/Constraint":276,"./forces/Force":288,"famous-math":249}],269:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var ConvexBodyFactory = require('./ConvexBodyFactory');

var _Box = ConvexBodyFactory([
            // Order: back-left,back-right,front-left,front-right
            // Top half
            new Vec3(-100, -100, -100),
            new Vec3(100, -100, -100),
            new Vec3(-100, -100, 100),
            new Vec3(100, -100, 100),
            // Bottom half
            new Vec3(-100, 100, -100),
            new Vec3(100, 100, -100),
            new Vec3(-100, 100, 100),
            new Vec3(100, 100, 100),
        ]);

/**
 * @class Box
 * @extends Particle
 * @param {Object} options
 */
function Box(options) {
    _Box.call(this, options);
    this.normals = [
        // Order: top, right, front
        new Vec3(0, 1, 0),
        new Vec3(1, 0, 0),
        new Vec3(0, 0, 1)
    ];

    this.type = 1 << 1;
}

Box.prototype = Object.create(_Box.prototype);
Box.prototype.constructor = Box;

module.exports = Box;

},{"./ConvexBodyFactory":270,"famous-math":249}],270:[function(require,module,exports){
'use strict';

var Particle = require('../bodies/Particle');
var Mat33 = require('famous-math').Mat33;
var Vec3 = require('famous-math').Vec3;
var Geometry = require('../Geometry');
var ConvexHull = Geometry.ConvexHull;

var TEMP_REGISTER = new Vec3();

/**
 * Returns a constructor for a physical body reflecting the shape defined by input ConvexHull or Vec3 array.
 *
 * @method ConvexBodyFactory
 * @param {ConvexHull | Vec3[]} hull
 * @return {Function}
 */
function ConvexBodyFactory(hull) {
    if (!(hull instanceof ConvexHull)) {
        if (!(hull instanceof Array)) throw new Error('ConvexBodyFactory requires a ConvexHull object or an array of Vec3\'s as input.');
        else hull = new ConvexHull(hull);
    }

    function ConvexBody(options) {
        Particle.call(this, options);

        var originalSize = hull.polyhedralProperties.size;
        var size = options.size || originalSize;

        var scaleX = size[0] / originalSize[0];
        var scaleY = size[1] / originalSize[1];
        var scaleZ = size[2] / originalSize[2];

        this._scale = [scaleX, scaleY, scaleZ];

        var T = new Mat33([scaleX, 0, 0, 0, scaleY, 0, 0, 0, scaleZ]);

        this.hull = hull;

        this.vertices = [];
        for (var i = 0, len = hull.vertices.length; i < len; i++) {
            this.vertices.push(T.vectorMultiply(hull.vertices[i], new Vec3()));
        }

        _computeInertiaProperties.call(this, T);
    }

    ConvexBody.prototype = Object.create(Particle.prototype);
    ConvexBody.prototype.constructor = ConvexBody;

    ConvexBody.prototype.setSize = function setSize(x,y,z) {
        var originalSize = hull.polyhedralProperties.size;

        this.size[0] = x;
        this.size[1] = y;
        this.size[2] = z;

        var scaleX = x / originalSize[0];
        var scaleY = y / originalSize[1];
        var scaleZ = z / originalSize[2];

        this._scale = [scaleX, scaleY, scaleZ];

        var T = new Mat33([scaleX, 0, 0, 0, scaleY, 0, 0, 0, scaleZ]);

        var vertices = this.vertices;
        for (var i = 0, len = hull.vertices.length; i < len; i++) {
            T.vectorMultiply(hull.vertices[i], vertices[i]);
        }
    };

    ConvexBody.prototype.updateInertia = function updateInertia() {
        var scaleX = this._scale[0];
        var scaleY = this._scale[1];
        var scaleZ = this._scale[2];

        var T = new Mat33([scaleX, 0, 0, 0, scaleY, 0, 0, 0, scaleZ]);

        _computeInertiaProperties.call(this, T);
    };

    ConvexBody.prototype.support = function support(direction) {
        var vertices = this.vertices;
        var max = -Infinity;
        for (var i = 0, len = vertices.length; i < len; i++) {
            var vertex = vertices[i];
            var dot = Vec3.dot(vertex,direction);
            if (dot > max) {
                var furthest = vertex;
                max = dot;
            }
        }
        return furthest;
    };

    ConvexBody.prototype.updateShape = function updateShape() {
        var vertices = this.vertices;
        var q = this.orientation;
        var modelVertices = this.hull.vertices;

        var scaleX = this._scale[0];
        var scaleY = this._scale[1];
        var scaleZ = this._scale[2];

        var t = TEMP_REGISTER;
        for (var i = 0, len = vertices.length; i < len; i++) {
            t.copy(modelVertices[i]);
            t.x *= scaleX;
            t.y *= scaleY;
            t.z *= scaleZ;
            Vec3.applyRotation(t, q, vertices[i]);
        }
    };

    return ConvexBody;
}

/**
 * Determines mass and inertia tensor based off the density, size, and facet information of the polyhedron.
 *
 * @method _computeInertiaProperties
 * @private
 * @param {Object} polyhedralProperties
 * @param {Object} options
 * @param {Mat33} T
 * @return {Object}
 */
function _computeInertiaProperties(T) {
    var polyhedralProperties = this.hull.polyhedralProperties;
    var T_values = T.get();
    var detT = T_values[0] * T_values[4] * T_values[8];

    var E_o = polyhedralProperties.eulerTensor;

    var E = new Mat33();
    Mat33.multiply(T, E_o, E);
    Mat33.multiply(E, T, E);
    var E_values = E.get();

    var Exx = E_values[0];
    var Eyy = E_values[4];
    var Ezz = E_values[8];
    var Exy = E_values[1];
    var Eyz = E_values[7];
    var Exz = E_values[2];

    var newVolume = polyhedralProperties.volume * detT;
    var mass = this.mass;
    var density = mass / newVolume;

    var Ixx = Eyy + Ezz;
    var Iyy = Exx + Ezz;
    var Izz = Exx + Eyy;
    var Ixy = -Exy;
    var Iyz = -Eyz;
    var Ixz = -Exz;

    var centroid = polyhedralProperties.centroid;

    Ixx -= newVolume * (centroid.y * centroid.y + centroid.z * centroid.z);
    Iyy -= newVolume * (centroid.z * centroid.z + centroid.x * centroid.x);
    Izz -= newVolume * (centroid.x * centroid.x + centroid.y * centroid.y);
    Ixy += newVolume * centroid.x * centroid.y;
    Iyz += newVolume * centroid.y * centroid.z;
    Ixz += newVolume * centroid.z * centroid.x;

    Ixx *= density * detT;
    Iyy *= density * detT;
    Izz *= density * detT;
    Ixy *= density * detT;
    Iyz *= density * detT;
    Ixz *= density * detT;

    var inertia = [
        Ixx, Ixy, Ixz,
        Ixy, Iyy, Iyz,
        Ixz, Iyz, Izz
    ];

    this.inertia.set(inertia);
    Mat33.inverse(this.inertia, this.inverseInertia);
}

module.exports = ConvexBodyFactory;

},{"../Geometry":267,"../bodies/Particle":271,"famous-math":249}],271:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Quaternion = require('famous-math').Quaternion;
var Mat33 = require('famous-math').Mat33;

var ZERO_VECTOR = new Vec3();

var _ID = 0;
/**
 * Fundamental physical body. Maintains translational and angular momentum, position and orientation, and other properties
 * such as size and coefficients of restitution and friction used in collision response.
 *
 * @class Particle
 * @extends Particle
 * @param {Object} options sets the initial state of the Particle
 * @constructor
 */
function Particle(options) {
    options = options || {};

    this.position = options.position || new Vec3();
    this.orientation = options.orientation || new Quaternion();

    this.velocity = new Vec3();
    this.momentum = new Vec3();
    this.angularVelocity = new Vec3();
    this.angularMomentum = new Vec3();

    this.mass = options.mass || 1;
    this.inverseMass = 1 / this.mass;

    this.force = new Vec3();
    this.torque = new Vec3();

    this.restitution = options.restitution != null ? options.restitution : 0.4;
    this.friction = options.friction != null ? options.friction : 0.2;

    this.inertia = new Mat33([0,0,0,0,0,0,0,0,0]);
    this.inverseInertia = new Mat33([0,0,0,0,0,0,0,0,0]);

    this.size = options.size || [0, 0, 0];

    var v = options.velocity;
    var w = options.angularVelocity;
    if (v) this.setVelocity(v.x, v.y, v.z);
    if (w) this.setAngularVelocity(w.x, w.y, w.z);

    this.restrictions = 0;
    this.setRestrictions.apply(this, options.restrictions || []);

    this.collisionMask = options.collisionMask || 1;
    this.collisionGroup = options.collisionGroup || 1;

    this.type = 1 << 0;

    this._ID = _ID++;
}

/**
 * Getter for the restriction bitmask. Converts the restrictions to their string representation.
 *
 * @method getRestrictions
 * @return {String[]} restrictions
 */
Particle.prototype.getRestrictions = function getRestrictions() {
    var linear = '';
    var angular = '';
    var restrictions = this.restrictions;
    if (restrictions & 32) linear += 'x';
    if (restrictions & 16) linear += 'y';
    if (restrictions & 8) linear += 'z';
    if (restrictions & 4) angular += 'x';
    if (restrictions & 2) angular += 'y';
    if (restrictions & 1) angular += 'z';

    return [linear, angular];
};

/**
 * Setter for the particle restriction bitmask.
 *
 * @method setRestrictions
 * @param {String} transRestrictions
 * @param {String} rotRestrictions
 * @chainable
 */
Particle.prototype.setRestrictions = function setRestrictions(transRestrictions, rotRestrictions) {
    transRestrictions = transRestrictions || '';
    rotRestrictions = rotRestrictions || '';
    this.restrictions = 0;
    if (transRestrictions.indexOf('x') > -1) this.restrictions |= 32;
    if (transRestrictions.indexOf('y') > -1) this.restrictions |= 16;
    if (transRestrictions.indexOf('z') > -1) this.restrictions |= 8;
    if (rotRestrictions.indexOf('x') > -1) this.restrictions |= 4;
    if (rotRestrictions.indexOf('y') > -1) this.restrictions |= 2;
    if (rotRestrictions.indexOf('z') > -1) this.restrictions |= 1;
    return this;
};

/**
 * Getter for mass
 *
 * @method getMass
 * @return {Number} mass
 */
Particle.prototype.getMass = function getMass() {
    return this.mass;
};

/**
 * Set the mass of the Particle.  Can be used to change the mass several times
 *
 * @method setMass
 * @param {Number} mass
 * @chainable
 */
Particle.prototype.setMass = function setMass(mass) {
    this.mass = mass;
    this.inverseMass = 1 / mass;
    return this;
};

/**
 * Getter for inverse mass
 *
 * @method getInverseMass
 * @return {Number} inverse mass
 */
Particle.prototype.getInverseMass = function() {
    return this.inverseMass;
};

/**
 * Infers the inertia tensor. Will also compute and set the inverse inertia.
 *
 * @method updateInertia
 * @param {Mat33} Mat33
 */
Particle.prototype.updateInertia = function updateInertia() {
    this.inertia = new Mat33([0,0,0,0,0,0,0,0,0]);
    this.inverseInertia = new Mat33([0,0,0,0,0,0,0,0,0]);
};

/**
 * Getter for position
 *
 * @method getPosition
 * @return {Vec3} position
 */
Particle.prototype.getPosition = function getPosition() {
    return this.position;
};

/**
 * Setter for position
 *
 * @method setPosition
 * @param {Number} x the x coordinate for position
 * @param {Number} y the y coordinate for position
 * @param {Number} z the z coordinate for position
 * @return {Particle} this
 * @chainable
 */
Particle.prototype.setPosition = function setPosition(x, y, z) {
    this.position.set(x, y, z);
    return this;
};

/**
 * Getter for velocity
 *
 * @method getVelocity
 * @return {Vec3} velocity
 */
Particle.prototype.getVelocity = function getVelocity() {
    return this.velocity;
};

/**
 * Setter for velocity
 *
 * @method setvelocity
 * @param {Number} x the x coordinate for velocity
 * @param {Number} y the y coordinate for velocity
 * @param {Number} z the z coordinate for velocity
 * @chainable
 */
Particle.prototype.setVelocity = function setVelocity(x, y, z) {
    this.velocity.set(x, y, z);
    Vec3.scale(this.velocity, this.mass, this.momentum);
    return this;
};

/**
 * Getter for momenutm
 *
 * @method getMomentum
 * @return {Vec3} momentum
 */
Particle.prototype.getMomentum = function getMomentum() {
    return this.momentum;
};

/**
 * Setter for momentum
 *
 * @method setMomentum
 * @param {Number} x the x coordinate for momentum
 * @param {Number} y the y coordinate for momentum
 * @param {Number} z the z coordinate for momentum
 * @chainable
 */
Particle.prototype.setMomentum = function setMomentum(x, y, z) {
    this.momentum.set(x, y, z);
    Vec3.scale(this.momentum, this.inverseMass, this.velocity);
    return this;
};

/**
 * Getter for orientation
 *
 * @method getOrientation
 * @return {Quaternion} orientation
 */
Particle.prototype.getOrientation = function getOrientation() {
    return this.orientation;
};

/**
 * Setter for orientation
 *
 * @method setOrientation
 * @param {Number} w
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 * @chainable
 */
Particle.prototype.setOrientation = function setOrientation(w,x,y,z) {
    this.orientation.set(w,x,y,z).normalize();
    return this;
};

/**
 * Getter for angular velocity
 *
 * @method getAngularVelocity
 * @return {Vec3} angularVelocity
 */
Particle.prototype.getAngularVelocity = function getAngularVelocity() {
    return this.angularVelocity;
};

/**
 * Setter for angular velocity
 *
 * @method setAngularVelocity
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Particle.prototype.setAngularVelocity = function setAngularVelocity(x,y,z) {
    this.angularVelocity.set(x,y,z);
    this.inertia.vectorMultiply(this.angularVelocity, this.angularMomentum);
    return this;
};

/**
 * Getter for angular momentum
 *
 * @method getAngularMomentum
 * @return {Vec3} angular momentum
 */
Particle.prototype.getAngularMomentum = function getAngularMomentum() {
    return this.angularMomentum;
};

/**
 * Setter for angular momentum
 *
 * @method setAngularMomentum
 * @param {Number} x
 * @param {Number} y
 * @param {Number} z
 */
Particle.prototype.setAngularMomentum = function setAngularMomentum(x,y,z) {
    this.angularMomentum.set(x,y,z);
    this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity);
    return this;
};

/**
 * Getter for the force on the Particle
 *
 * @method getForce
 * @return {Vec3} force
 */
Particle.prototype.getForce = function getForce() {
    return this.force;
};

/**
 * Setter for the force on the Particle
 *
 * @method setForce
 * @param {Vec3} v the new Force
 * @chainable
 */
Particle.prototype.setForce = function setForce(x, y, z) {
    this.force.set(x, y, z);
    return this;
};

/**
 * Getter for torque.
 *
 * @method getTorque
 */
Particle.prototype.getTorque = function getTorque() {
    return this.torque;
};

/**
 * Setter for torque.
 *
 * @method setTorque
 * @param {Vec3} v
 * @chainable
 */
Particle.prototype.setTorque = function setTorque(x, y, z) {
    this.torque.set(x, y, z);
    return this;
};

/**
 * Extends Particle.applyForce with an optional argument
 * to apply the force at an off-centered location, resulting in a torque.
 *
 * @method applyForce
 * @param force {Vec3} force
 * @param {Vec3} location off-center location on the Particle (optional)
 */
Particle.prototype.applyForce = function applyForce(force) {
    this.force.add(force);
    return this;
};

/**
 * Applied a torque force to a Particle, inducing a rotation.
 *
 * @method applyTorque
 * @param torque {Vec3} torque
 */
Particle.prototype.applyTorque = function applyTorque(torque) {
    this.torque.add(torque);
    return this;
};

/**
 * Applies an impulse to momentum and updates velocity.
 *
 * @method applyImpulse
 * @param {Vec3} impulse
 */
Particle.prototype.applyImpulse = function applyImpulse(impulse) {
    this.momentum.add(impulse)
    Vec3.scale(this.momentum, this.inverseMass, this.velocity);
    return this;
};

/**
 * Applies an angular impulse to angular momentum and updates angular velocity.
 *
 * @method applyAngularImpulse
 * @param {Vec3} angularImpulse
 */
Particle.prototype.applyAngularImpulse = function applyAngularImpulse(angularImpulse) {
    this.angularMomentum.add(angularImpulse);
    this.inverseInertia.vectorMultiply(this.angularMomentum, this.angularVelocity);
    return this;
};

/**
 * Used in collision detection. The support function should take in a Vec3 direction
 * and return the point on the body's shape furthest in that direction.
 *
 * @method support
 * @param {Vec3} direction
 * @return {Vec3}
 */
Particle.prototype.support = function support(direction) {
    return ZERO_VECTOR;
};

/**
 * Update the body's shape to reflect current orientation. Called in _integratePose.
 * Noop for point particles.
 *
 * @method updateShape
 */
Particle.prototype.updateShape = function updateShape() {};

module.exports = Particle;

},{"famous-math":249}],272:[function(require,module,exports){
'use strict';

var Particle = require('./Particle');
var Mat33 = require('famous-math').Mat33;
var Vec3 = require('famous-math').Vec3;

var SUPPORT_REGISTER = new Vec3();

/**
 * Spherical Rigid body
 *
 * @class Sphere
 * @extends Particle
 * @param {Object} options
 */
function Sphere(options) {
    Particle.call(this, options);
    var r  = options.radius || 1;
    this.radius = r;
    this.size = [2*r, 2*r, 2*r];
    this.updateInertia();

    this.type = 1 << 2;
}

Sphere.prototype = Object.create(Particle.prototype);
Sphere.prototype.constructor = Sphere;

/**
 * Getter for radius.
 *
 * @method getRadius
 * @return {Number} radius
 */
Sphere.prototype.getRadius = function getRadius() {
    return this.radius;
};

/**
 * Setter for radius.
 *
 * @method setRadius
 * @param {Number} radius The intended radius of the sphere.
 * @chainable
 */
Sphere.prototype.setRadius = function setRadius(radius) {
    this.radius = radius;
    this.size = [2*this.radius, 2*this.radius, 2*this.radius];
    return this;
};

/**
 * Infers the inertia tensor.
 *
 * @override
 * @method updateInertia
 */
Sphere.prototype.updateInertia = function updateInertia() {
    var m = this.mass;
    var r = this.radius;

    var mrr = m * r * r;

    this.inertia.set([
        0.4 * mrr, 0, 0,
        0, 0.4 * mrr, 0,
        0, 0, 0.4 * mrr
    ]);

    this.inverseInertia.set([
        2.5 / mrr, 0, 0,
        0, 2.5 / mrr, 0,
        0, 0, 2.5 / mrr
    ]);
};

/**
 * Returns the point on the sphere furthest in a given direction.
 *
 * @method support
 * @param {Vec3} direction
 * @param {Vec3}
 */
Sphere.prototype.support = function support(direction) {
    return Vec3.scale(direction, this.radius, SUPPORT_REGISTER);
};

/**
 * @exports Sphere
 * @module Sphere
 */
module.exports = Sphere;

},{"./Particle":271,"famous-math":249}],273:[function(require,module,exports){
'use strict';

var Particle = require('./Particle');
var Mat33 = require('famous-math').Mat33;
var Vec3 = require('famous-math').Vec3;

/**
 * @enum directions
 */
Wall.DOWN = 0;
Wall.UP = 1;
Wall.LEFT = 2;
Wall.RIGHT = 3;
Wall.FORWARD = 4;
Wall.BACKWARD = 5;

/**
 * An axis-aligned boundary. Will not respond to forces or impulses.
 *
 * @class Wall
 * @extends Particle
 * @param {Object} options
 */
function Wall(options) {
    Particle.call(this, options);

    var n = this.normal = new Vec3();

    var d = this.direction = options.direction;
    switch (d) {
        case Wall.DOWN:
            n.set(0, 1, 0);
            break;
        case Wall.UP:
            n.set(0, -1, 0);
            break;
        case Wall.LEFT:
            n.set(-1, 0, 0);
            break;
        case Wall.RIGHT:
            n.set(1, 0, 0);
            break;
        case Wall.FORWARD:
            n.set(0, 0, -1);
            break;
        case Wall.BACKWARD:
            n.set(0, 0, 1);
            break;
        default:
            break;
    }

    this.invNormal = Vec3.clone(n, new Vec3()).invert();

    this.mass = Infinity;
    this.inverseMass = 0;

    this.type = 1 << 3;
}

Wall.prototype = Object.create(Particle.prototype);
Wall.prototype.constructor = Wall;

module.exports = Wall;

},{"./Particle":271,"famous-math":249}],274:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;

var DELTA_REGISTER = new Vec3();

/** @const */
var PI = Math.PI;

/**
 *  A constraint that keeps a physics body a given direction away from a given
 *  anchor, or another attached body.
 *
 *  @class Angle
 *  @extends Constraint
 *  @param {Particle} a One of the bodies.
 *  @param {Particle} b The other body.
 *  @param {Object} options An object of configurable options.
 */
function Angle(a, b, options) {
    this.a = a;
    this.b = b;

    Constraint.call(this, options);

    this.effectiveInertia = new Mat33();
    this.angularImpulse = new Vec3();
    this.error = 0;
}

Angle.prototype = Object.create(Constraint.prototype);
Angle.prototype.constructor = Angle;

/**
 * Initialize the Angle. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Angle.prototype.init = function(options) {
    this.cosAngle = this.cosAngle || this.a.orientation.dot(this.b.orientation);
};

/**
 * Warmstart the constraint and prepare calculations used in .resolve.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Angle.prototype.update = function update(time, dt) {
    var a = this.a;
    var b = this.b;

    var q1 = a.orientation;
    var q2 = b.orientation;

    var cosTheta = q1.dot(q2);
    var diff = 2*(cosTheta - this.cosAngle);

    this.error = diff;

    var angularImpulse = this.angularImpulse;
    b.applyAngularImpulse(angularImpulse);
    a.applyAngularImpulse(angularImpulse.invert());

    Mat33.add(a.inverseInertia, b.inverseInertia, this.effectiveInertia);
    this.effectiveInertia.inverse();

    angularImpulse.clear();
};

/**
 * Adds an angular impulse to a physics body's angular velocity.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt
 */
Angle.prototype.resolve = function update(time, dt) {
    var a = this.a;
    var b = this.b;

    var diffW = DELTA_REGISTER;

    var w1 = a.angularVelocity;
    var w2 = b.angularVelocity;

    Vec3.subtract(w1, w2, diffW);
    diffW.scale(1 + this.error);

    var angularImpulse = diffW.applyMatrix(this.effectiveInertia);

    b.applyAngularImpulse(angularImpulse);
    a.applyAngularImpulse(angularImpulse.invert());
    angularImpulse.invert();
    this.angularImpulse.add(angularImpulse);
};

module.exports = Angle;

},{"./Constraint":276,"famous-math":249}],275:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Quaternion = require('famous-math').Quaternion;
var Constraint = require('./Constraint');

var SweepAndPrune = require('./collision/SweepAndPrune');
var BruteForce = require('./collision/BruteForce');
var ConvexCollision = require('./collision/ConvexCollisionDetection');
var GJK = ConvexCollision.GJK;
var EPA = ConvexCollision.EPA;
var ContactManifoldTable = require('./collision/ContactManifold');

var ObjectManager = require('famous-utilities').ObjectManager;
ObjectManager.register('CollisionData', CollisionData);
var OMRequestCollisionData = ObjectManager.requestCollisionData;

var VEC_REGISTER = new Vec3();

/**
 * Helper function to clamp a value to a given range.
 *
 * @method clamp
 * @private
 * @param {Number} value
 * @param {Number} lower
 * @param {Number} upper
 * @return {Number}
 */
function clamp(value, lower, upper) {
    return value < lower ? lower : value > upper ? upper : value;
}

/**
 * Object maintaining various figures of a collision. Registered in ObjectManager.
 *
 * @class CollisionData
 * @param {Number} penetration
 * @param {Vec3} normal
 * @param {Vec3} worldContactA
 * @param {Vec3} worldContactB
 * @param {Vec3} localContactA
 * @param {Vec3} localContactB
 */
function CollisionData(penetration, normal, worldContactA, worldContactB, localContactA, localContactB) {
    this.penetration = penetration;
    this.normal = normal;
    this.worldContactA = worldContactA;
    this.worldContactB = worldContactB;
    this.localContactA = localContactA;
    this.localContactB = localContactB;
};

/**
 * Used by ObjectManager to reset the object with different data.
 *
 * @method reset
 * @param {Object[]} args
 * @chainable
 */
CollisionData.prototype.reset = function reset(penetration, normal, worldContactA, worldContactB, localContactA, localContactB) {
    this.penetration = penetration;
    this.normal = normal;
    this.worldContactA = worldContactA;
    this.worldContactB = worldContactB;
    this.localContactA = localContactA;
    this.localContactB = localContactB;

    return this;
};

/**
 * Ridid body Elastic Collision
 *
 * @class Collision
 * @extends Constraint
 * @param {Object} options
 */
function Collision(targets, options) {
    this.targets = targets || [];

    Constraint.call(this, options);
}

Collision.prototype = Object.create(Constraint.prototype);
Collision.prototype.constructor = Collision;

/**
 * Initialize the Collision tracker. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Collision.prototype.init = function(options) {
    if (this.broadPhase) {
        if (this.broadPhase instanceof Function) this.broadPhase = new this.broadPhase(this.targets);
    }
    else this.broadPhase = new SweepAndPrune(this.targets);
    this.contactManifoldTable = this.contactManifoldTable || new ContactManifoldTable();
};

/**
 * Collison detection. Updates the existing contact manifolds, runs the broadphase, and performs narrowphase
 * collision detection. Warm starts the contacts based on the results of the previous physics frame
 * and prepares necesssary calculations for the resolution.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
 Collision.prototype.update = function update(time, dt) {
    this.contactManifoldTable.update(dt);
    if (this.targets.length === 0) return;
    for (var i = 0, len = this.targets.length; i < len; i++) {
        this.targets[i].updateShape();
    }
    var potentialCollisions = this.broadPhase.update();
    var pair;
    for (var i = 0, len = potentialCollisions.length; i < len; i++) {
        (pair = potentialCollisions[i]) && this.applyNarrowPhase(pair);
    }
    this.contactManifoldTable.prepContacts(dt);
};

/**
 * Apply impulses to resolve all Contact constraints.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt
 */
Collision.prototype.resolve = function resolve(time, dt) {
    this.contactManifoldTable.resolveManifolds(dt);
};

/**
 * Add a target or targets to the collision system.
 *
 * @method addTarget
 * @param {Object | Object[]}
 */
Collision.prototype.addTarget = function addTarget(target) {
    this.targets.push(target);
    this.broadPhase.add(target);
};

/**
 * Remove a target or targets from the collision system.
 *
 * @method addTarget
 * @param {Object | Object[]}
 */
Collision.prototype.removeTarget = function removeTarget(target) {
    var index = this.targets.indexOf(target);
    if (index < 0) return;
    this.targets.splice(index, 1);
    this.broadPhase.remove(target);
};


var CONVEX = 1 << 0;
var BOX = 1 << 1;
var SPHERE = 1 << 2;
var WALL = 1 << 3;

var CONVEX_CONVEX = CONVEX | CONVEX;
var BOX_BOX = BOX | BOX;
var BOX_CONVEX = BOX | CONVEX;
var SPHERE_SPHERE = SPHERE | SPHERE;
var BOX_SPHERE = BOX | SPHERE;
var CONVEX_SPHERE = CONVEX | SPHERE;
var CONVEX_WALL = CONVEX | WALL;
var BOX_WALL = BOX | WALL;
var SPHERE_WALL = SPHERE | WALL;

var dispatch = {};
dispatch[CONVEX_CONVEX] = convexIntersectConvex;
dispatch[BOX_BOX] = convexIntersectConvex;
dispatch[BOX_CONVEX] = convexIntersectConvex;
dispatch[CONVEX_SPHERE] = convexIntersectConvex;
dispatch[SPHERE_SPHERE] = sphereIntersectSphere;
dispatch[BOX_SPHERE] = boxIntersectSphere;
dispatch[CONVEX_WALL] = convexIntersectWall;
dispatch[BOX_WALL] = convexIntersectWall;
dispatch[SPHERE_WALL] = convexIntersectWall;

/**
 * Narrowphase collision detection,
 * registers the Contact constraints for colliding bodies.
 *
 * Will detect the type of bodies in the collision.
 *
 * @method applyNarrowPhase
 * @param {Particle[]} targets
 */
Collision.prototype.applyNarrowPhase = function applyNarrowPhase(targets) {
    for (var i = 0, len = targets.length; i < len; i++) {
        for (var j = i + 1; j < len; j++) {
            var  a = targets[i];
            var b = targets[j];

            if ((a.collisionMask & b.collisionGroup && a.collisionGroup & b.collisionMask) === 0) continue;

            var collisionType = a.type | b.type;

            dispatch[collisionType] && dispatch[collisionType](this, a, b);
        }
    }
};

/**
 * Detects sphere-sphere collisions and registers the Contact.
 *
 * @private
 * @method sphereIntersectSphere
 * @param {Object} context
 * @param {Sphere} sphere1
 * @param {Sphere} sphere2
 */
function sphereIntersectSphere(context, sphere1, sphere2) {
    var options = context.options;
    var p1 = sphere1.position;
    var p2 = sphere2.position;
    var relativePosition = Vec3.subtract(p2, p1, new Vec3());
    var distance = relativePosition.length();
    var sumRadii = sphere1.radius + sphere2.radius;
    var n = relativePosition.scale(1/distance);

    var overlap = sumRadii - distance;

    // Distance check
    if (overlap < 0) return;

    var rSphere1 = Vec3.scale(n, sphere1.radius, new Vec3());
    var rSphere2 = Vec3.scale(n, -sphere2.radius, new Vec3());

    var wSphere1 = Vec3.add(p1, rSphere1, new Vec3());
    var wSphere2 = Vec3.add(p2, rSphere2, new Vec3());

    var collisionData = OMRequestCollisionData().reset(overlap, n, wSphere1, wSphere2, rSphere1, rSphere2);

    context.contactManifoldTable.registerContact(sphere1, sphere2, collisionData);
}

/**
* Detects box-sphere collisions and registers the Contact.
*
* @param {Object} context
* @param {Box} box
* @param {Sphere} sphere
*/
function boxIntersectSphere(context, box, sphere) {
    if (box.type === SPHERE) {
        var temp = sphere;
        sphere = box;
        box = temp;
    }

    var pb = box.position;
    var ps = sphere.position;
    var relativePosition = Vec3.subtract(ps, pb, VEC_REGISTER);

    var q = box.orientation;

    var r = sphere.radius;

    var bsize = box.size;
    var halfWidth = bsize[0]*0.5;
    var halfHeight = bsize[1]*0.5;
    var halfDepth = bsize[2]*0.5;

    // x, y, z
    var bnormals = box.normals;
    var n1 = q.rotateVector(bnormals[1], new Vec3());
    var n2 = q.rotateVector(bnormals[0], new Vec3());
    var n3 = q.rotateVector(bnormals[2], new Vec3());

    // Find the point on the cube closest to the center of the sphere
    var closestPoint = new Vec3();
    closestPoint.x = clamp(Vec3.dot(relativePosition,n1), -halfWidth, halfWidth);
    closestPoint.y = clamp(Vec3.dot(relativePosition,n2), -halfHeight, halfHeight);
    closestPoint.z = clamp(Vec3.dot(relativePosition,n3), -halfDepth, halfDepth);
    // The vector found is relative to the center of the unrotated box -- rotate it
    // to find the point w.r.t. to current orientation
    closestPoint.applyRotation(q);

    // The impact point in world space
    var impactPoint = Vec3.add(pb, closestPoint, new Vec3());
    var sphereToImpact = Vec3.subtract(impactPoint, ps, impactPoint);
    var distanceToSphere = sphereToImpact.length();

    // If impact point is not closer to the sphere's center than its radius -> no collision
    var overlap = r - distanceToSphere;
    if (overlap < 0) return;

    var n = Vec3.scale(sphereToImpact, -1 / distanceToSphere, new Vec3());
    var rBox = closestPoint;
    var rSphere = sphereToImpact;

    var wBox = Vec3.add(pb, rBox, new Vec3());
    var wSphere = Vec3.add(ps, rSphere, new Vec3());

    var collisionData = OMRequestCollisionData().reset(overlap, n, wBox, wSphere, rBox, rSphere);

    context.contactManifoldTable.registerContact(box, sphere, collisionData);
}

/**
* Detects convex-convex collisions and registers the Contact. Uses GJK to determine overlap and then
* EPA to determine the actual collision data.
*
* @param {Object} context
* @param {ConvexBody} convex1
* @param {ConvexBody} convex2
*/
function convexIntersectConvex(context, convex1, convex2) {
    var glkSimplex = GJK(convex1, convex2);

    // No simplex -> no collision
    if (!glkSimplex) return;

    var collisionData = EPA(convex1, convex2, glkSimplex);
    if (collisionData !== null) context.contactManifoldTable.registerContact(convex1, convex2, collisionData);
}

/**
* Detects convex-wall collisions and registers the Contact.
*
* @param {Object} context
* @param {ConvexBody} convex
* @param {ConvexBody} wall
*/
function convexIntersectWall(context, convex, wall) {
    if (convex.type === WALL) {
        var temp = wall;
        wall = convex;
        convex = temp;
    }

    var convexPos = convex.position;
    var wallPos = wall.position;

    var n = wall.normal;
    var invN = wall.invNormal;

    var rConvex = convex.support(invN);
    var wConvex = Vec3.add(convexPos, rConvex, new Vec3());

    var diff = Vec3.subtract(wConvex, wallPos, VEC_REGISTER);

    var penetration = Vec3.dot(diff, invN);

    if (penetration < 0) return;

    var wWall = Vec3.scale(n, penetration, new Vec3()).add(wConvex);
    var rWall = Vec3.subtract(wWall, wall.position, new Vec3());

    var collisionData = OMRequestCollisionData().reset(penetration, invN, wConvex, wWall, rConvex, rWall);

    context.contactManifoldTable.registerContact(convex, wall, collisionData);
}

Collision.SweepAndPrune = SweepAndPrune;
Collision.BruteForce = BruteForce.BruteForce;
Collision.BruteForceAABB = BruteForce.BruteForceAABB;

module.exports = Collision;

},{"./Constraint":276,"./collision/BruteForce":283,"./collision/ContactManifold":284,"./collision/ConvexCollisionDetection":285,"./collision/SweepAndPrune":286,"famous-math":249,"famous-utilities":264}],276:[function(require,module,exports){
'use strict';

var _ID = 0;
/**
 * Base Constraint class to be used in the Physics
 * Subclass this class to implement a constraint
 *
 * @virtual
 * @class Constraint
 */
function Constraint(options) {
    options = options || {};
    this.setOptions(options);

    this._ID = _ID++;
};

/**
 * Decorates the Constraint with the options object. Sets source and targets if applicable.
 *
 * @method setOptions
 * @param {Object} Options
 */
Constraint.prototype.setOptions = function setOptions(options) {
    for (var key in options) this[key] = options[key];
    this.init(options);
};

/**
 * Method invoked upon instantiation and the setting of options.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Constraint.prototype.init = function init(options) {};

/**
 * Detect violations of the constraint. Warm start the constraint, if possible.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt delta time
 */
Constraint.prototype.update = function update(time, dt) {}

/**
 * Apply impulses to resolve the constraint.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt delta time
 */
Constraint.prototype.resolve = function resolve(time, dt) {}

module.exports = Constraint;

},{}],277:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;

var IMPULSE_REGISTER = new Vec3();
var NORMAL_REGISTER = new Vec3();

/** @const */
var EPSILSON = 1e-7;
/** @const */
var PI = Math.PI;


/**
 *  A constraint that keeps a physics body on a given implicit curve.
 *
 *  @class Curve
 *  @constructor
 *  @extends Constraint
 */
function Curve(targets, options) {
    if (targets) {
        if (targets instanceof Array) this.targets = targets;
        else this.targets = [targets];
    }
    else this.targets = [];

    Constraint.call(this, options);

    this.impulses = {};
    this.normals = {};
    this.velocityBiases = {};
    this.divisors = {};
}

Curve.prototype = Object.create(Constraint.prototype);
Curve.prototype.constructor = Curve;

/**
 * Initialize the Curve. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Curve.prototype.init = function(options) {
    this.equation1 = this.equation1 || function(x, y, z) {
        return 0;
    };
    this.equation2 = this.equation2 || function(x, y, z) {
        return z;
    };
    this.period = this.period || 1;
    this.dampingRatio = this.dampingRatio || 0.5;

    this.stiffness = 4 * PI * PI / (this.period * this.period);
    this.damping = 4 * PI * this.dampingRatio / this.period;
};

/**
 * Warmstart the constraint and prepare calculations used in the .resolve step.
 *
 * @method update
 * @param dt {Number} time
 * @param dt {Number} dt
 */
Curve.prototype.update = function update(time, dt) {
    var targets = this.targets;

    var normals = this.normals;
    var velocityBiases = this.velocityBiases;
    var divisors = this.divisors;
    var impulses = this.impulses;

    var impulse = IMPULSE_REGISTER;
    var n = NORMAL_REGISTER;

    var f = this.equation1;
    var g = this.equation2;
    var dampingRatio = this.dampingRatio;
    var period = this.period;

    var _c = this.damping;
    var _k = this.stiffness;

    for (var i = 0, len = targets.length; i < len; i++) {
        var body = targets[i];
        var ID = body._ID;
        if (body.immune) continue;

        var v = body.velocity;
        var p = body.position;
        var m = body.mass;

        var gamma;
        var beta;

        if (period === 0) {
            gamma = 0;
            beta = 1;
        } else {
            var c = _c * m;
            var k = _k * m;

            gamma = 1 / (dt*(c + dt*k));
            beta  = dt*k / (c + dt*k);
        }

        var x = p.x;
        var y = p.y;
        var z = p.z;

        var f0 = f(x, y, z);
        var dfx = (f(x + EPSILSON, y, z) - f0) / EPSILSON;
        var dfy = (f(x, y + EPSILSON, z) - f0) / EPSILSON;
        var dfz = (f(x, y, z + EPSILSON) - f0) / EPSILSON;

        var g0 = g(x, y, z);
        var dgx = (g(x + EPSILSON, y, z) - g0) / EPSILSON;
        var dgy = (g(x, y + EPSILSON, z) - g0) / EPSILSON;
        var dgz = (g(x, y, z + EPSILSON) - g0) / EPSILSON;

        n.set(dfx + dgx, dfy + dgy, dfz + dgz);
        n.normalize();

        var baumgarte = beta * (f0 + g0) / dt;
        var divisor = gamma + 1 / m;

        var lambda = impulses[ID] || 0;
        Vec3.scale(n, lambda, impulse);
        body.applyImpulse(impulse);

        normals[ID] = normals[ID] || new Vec3();
        normals[ID].copy(n);
        velocityBiases[ID] = baumgarte;
        divisors[ID] = divisor;
        impulses[ID] = 0;
    }
};

/**
 * Adds a curve impulse to a physics body.
 *
 * @method resolve
 * @param dt {Number} time
 * @param dt {Number} dt
 */
Curve.prototype.resolve = function resolve(time, dt) {
    var targets = this.targets;

    var normals = this.normals;
    var velocityBiases = this.velocityBiases;
    var divisors = this.divisors;
    var impulses = this.impulses;

    var impulse = IMPULSE_REGISTER;

    for (var i = 0, len = targets.length; i < len; i++) {
        var body = targets[i];
        var ID = body._ID;
        if (body.immune) continue;

        var v = body.velocity;
        var n = normals[ID];

        var lambda = -(Vec3.dot(n, v) + velocityBiases[ID]) / divisors[ID];

        Vec3.scale(n, lambda, impulse);
        body.applyImpulse(impulse);


        impulses[ID] += lambda;
    }
};

module.exports = Curve;
},{"./Constraint":276,"famous-math":249}],278:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;

var NORMAL_REGISTER = new Vec3();
var IMPULSE_REGISTER = new Vec3();
var V_REGISTER = new Vec3();
var P_REGISTER = new Vec3();
var DIRECTION_REGISTER = new Vec3();

/** @const */
var PI = Math.PI;

/**
 *  A constraint that maintains the direction of one body from another.
 *
 *  @class Direction
 *  @extends Constraint
 *  @param {Particle} a One of the bodies.
 *  @param {Particle} b The other body.
 *  @param {Object} options An object of configurable options.
 */
function Direction(a, b, options) {
    this.a = a;
    this.b = b;

    Constraint.call(this, options);

    this.impulse = 0;
    this.distance = 0;
    this.normal = new Vec3();
    this.velocityBias = 0;
    this.divisor = 0;
}

Direction.prototype = Object.create(Constraint.prototype);
Direction.prototype.constructor = Direction;

/**
 * Initialize the Direction. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Direction.prototype.init = function(options) {
    this.direction = this.direction || Vec3.subtract(this.b.position, this.a.position, new Vec3());
    this.direction.normalize();
    this.minLength = this.minLength || 0;
    this.period = this.period || .2;
    this.dampingRatio = this.dampingRatio || 0.5;

    this.stiffness = 4 * PI * PI / (this.period * this.period);
    this.damping = 4 * PI * this.dampingRatio / this.period;
};

/**
 * Warmstart the constraint and prepare calculations used in .resolve.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Direction.prototype.update = function update(time, dt) {
    var a = this.a;
    var b = this.b;

    var n = NORMAL_REGISTER;
    var diffP = P_REGISTER;
    var impulse = IMPULSE_REGISTER;
    var directionVector = DIRECTION_REGISTER;

    var dampingRatio = this.dampingRatio;
    var period = this.period;

    var p1 = a.position;
    var w1 = a.inverseMass;

    var p2 = b.position;
    var w2 = b.inverseMass;

    var direction = this.direction;

    Vec3.subtract(p2, p1, diffP);
    Vec3.scale(direction, Vec3.dot(direction, diffP), directionVector);
    var goal = directionVector.add(p1);

    Vec3.subtract(p2, goal, n);
    var dist = n.length();
    n.normalize();

    var invEffectiveMass = w1 + w2;
    var effectiveMass = 1 / invEffectiveMass;
    var gamma;
    var beta;

    if (period === 0) {
        gamma = 0;
        beta  = 1;
    }
    else {
        var c = this.damping * effectiveMass;
        var k = this.stiffness * effectiveMass;

        gamma = 1 / (dt*(c + dt*k));
        beta  = dt*k / (c + dt*k);
    }

    var baumgarte = beta * dist / dt;
    var divisor = gamma + invEffectiveMass;

    var lambda = this.impulse;
    Vec3.scale(n, lambda, impulse);
    b.applyImpulse(impulse);
    a.applyImpulse(impulse.invert());

    this.normal.copy(n);
    this.distance = dist;
    this.velocityBias = baumgarte;
    this.divisor = divisor;
    this.impulse = 0;
};

/**
 * Adds an impulse to a physics body's velocity due to the constraint
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt
 */
Direction.prototype.resolve = function update(time, dt) {
    var a = this.a;
    var b = this.b;

    var impulse  = IMPULSE_REGISTER;
    var diffV = V_REGISTER;

    var minLength = this.minLength;

    var dist = this.distance;
    if (Math.abs(dist) < minLength) return;

    var v1 = a.velocity;
    var v2 = b.velocity;
    var n = this.normal;

    Vec3.subtract(v2, v1, diffV);

    var lambda = -(Vec3.dot(n, diffV) + this.velocityBias) / this.divisor;
    Vec3.scale(n, lambda, impulse);
    b.applyImpulse(impulse);
    a.applyImpulse(impulse.invert());

    this.impulse += lambda;
};

module.exports = Direction;

},{"./Constraint":276,"famous-math":249}],279:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;

var NORMAL_REGISTER = new Vec3();
var IMPULSE_REGISTER = new Vec3();
var V_REGISTER = new Vec3();
var P_REGISTER = new Vec3();

/** @const */
var PI = Math.PI;

/**
 *  A constraint that keeps two bodies within a certain distance.
 *
 *  @class Distance
 *  @extends Constraint
 *  @param {Particle} a One of the bodies.
 *  @param {Particle} b The other body.
 *  @param {Object} options An object of configurable options.
 */
function Distance(a, b, options) {
    this.a = a;
    this.b = b;

    Constraint.call(this, options);

    this.impulse = 0;
    this.distance = 0;
    this.normal = new Vec3();
    this.velocityBias = 0;
    this.divisor = 0;
}

Distance.prototype = Object.create(Constraint.prototype);
Distance.prototype.constructor = Distance;

/**
 * Initialize the Distance. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Distance.prototype.init = function(options) {
    this.length = this.length || Vec3.subtract(this.b.position, this.a.position, P_REGISTER).length();
    this.minLength = this.minLength || 0;
    this.period = this.period || 0.2;
    this.dampingRatio = this.dampingRatio || 0.5;

    this.stiffness = 4 * PI * PI / (this.period * this.period);
    this.damping = 4 * PI * this.dampingRatio / this.period;
};

/**
 * Detect violations of the constraint. Warm start the constraint, if possible.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt delta time
 */
Distance.prototype.update = function(time, dt) {
    var a = this.a;
    var b = this.b;

    var n = NORMAL_REGISTER;
    var diffP = P_REGISTER;
    var impulse = IMPULSE_REGISTER;

    var period = this.period;
    var dampingRatio = this.dampingRatio;

    var minLength = this.minLength;

    var length = this.length;

    var p1 = a.position;
    var w1 = a.inverseMass;

    var p2 = b.position;
    var w2 = b.inverseMass;

    Vec3.subtract(p2, p1, diffP);

    var separation = diffP.length();

    Vec3.scale(diffP, 1 / separation, n);

    var dist = separation - length;

    var invEffectiveMass = w1 + w2;
    var effectiveMass = 1 / invEffectiveMass;
    var gamma;
    var beta;

    if (period === 0) {
        gamma = 0;
        beta  = 1;
    }
    else {
        var c = this.damping * effectiveMass;
        var k = this.stiffness * effectiveMass;

        gamma = 1 / (dt*(c + dt*k));
        beta  = dt*k / (c + dt*k);
    }

    var baumgarte = beta * dist / dt;
    var divisor = gamma + invEffectiveMass;

    var lambda = this.impulse;
    Vec3.scale(n, lambda, impulse);
    b.applyImpulse(impulse);
    a.applyImpulse(impulse.invert());

    this.normal.copy(n);
    this.distance = dist;
    this.velocityBias = baumgarte;
    this.divisor = divisor;
    this.impulse = 0;
};

/**
 * Apply impulses to resolve the constraint.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt delta time
 */
Distance.prototype.resolve = function resolve(time, dt) {
    var a = this.a;
    var b = this.b;

    var impulse = IMPULSE_REGISTER;
    var diffV = V_REGISTER;

    var dampingRatio = this.dampingRatio;
    var period = this.period;
    var minLength = this.minLength;

    var dist = this.distance;
    if (Math.abs(dist) < minLength) return;

    var v1 = a.getVelocity();
    var v2 = b.getVelocity();

    var n = this.normal;

    Vec3.subtract(v2, v1, diffV);
    var lambda = -(Vec3.dot(n, diffV) + this.velocityBias) / this.divisor;
    Vec3.scale(n, lambda, impulse);
    b.applyImpulse(impulse);
    a.applyImpulse(impulse.invert());

    this.impulse += lambda;
};

module.exports = Distance;

},{"./Constraint":276,"famous-math":249}],280:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;
var Quaternion = require('famous-math').Quaternion;

var VEC1_REGISTER = new Vec3();
var VEC2_REGISTER = new Vec3();
var VEC3_REGISTER = new Vec3();
var VEC4_REGISTER = new Vec3();
var VB1_REGISTER = new Vec3();
var VB2_REGISTER = new Vec3();
var WxR_REGISTER = new Vec3();
var DELTA_REGISTER = new Vec3();

/** @const */
var PI = Math.PI;

/**
 *  A constraint that confines two bodies to the plane defined by the axis of the hinge.
 *
 *  @class Hinge
 *  @extends Constraint
 *  @param {Options} [options] An object of configurable options.
 *
 */
function Hinge(a, b, options) {
    this.a = a;
    this.b = b;

    Constraint.call(this, options);

    this.impulse = new Vec3();
    this.angImpulseA = new Vec3();
    this.angImpulseB = new Vec3();
    this.error = new Vec3();
    this.errorRot = [0,0];
    this.effMassMatrix = new Mat33();
    this.effMassMatrixRot = [];
}

Hinge.prototype = Object.create(Constraint.prototype);
Hinge.prototype.constructor = Hinge;

/**
 * Initialize the Hinge. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Hinge.prototype.init = function(options) {
    var w = this.anchor;

    var u = this.axis.normalize();

    var a = this.a;
    var b = this.b;

    var q1t = Quaternion.conjugate(a.orientation, new Quaternion());
    var q2t = Quaternion.conjugate(b.orientation, new Quaternion());

    this.rA = Vec3.subtract(w, a.position, new Vec3());
    this.rB = Vec3.subtract(w, b.position, new Vec3());

    this.bodyRA = q1t.rotateVector(this.rA, new Vec3());
    this.bodyRB = q2t.rotateVector(this.rB, new Vec3());

    this.axisA = Vec3.clone(u);
    this.axisB = Vec3.clone(u);

    this.axisBTangent1 = new Vec3();
    this.axisBTangent2 = new Vec3();

    this.t1xA = new Vec3();
    this.t2xA = new Vec3();

    this.bodyAxisA = q1t.rotateVector(u, new Vec3());
    this.bodyAxisB = q2t.rotateVector(u, new Vec3());
};

/**
 * Detect violations of the constraint. Warm start the constraint, if possible.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt delta time
 */
Hinge.prototype.update = function(time, dt) {
    var a = this.a;
    var b = this.b;

    var period = this.period;
    var dampingRatio = this.dampingRatio;

    var axisA = a.orientation.rotateVector(this.bodyAxisA, this.axisA);
    var axisB = b.orientation.rotateVector(this.bodyAxisB, this.axisB);
    this.axis.copy(axisB);

    var n = axisB;
    var t1 = this.axisBTangent1;
    var t2 = this.axisBTangent2;

    if (n.x >= 0.57735) {
        t1.set(n.y, -n.x, 0);
    }
    else {
        t1.set(0, n.z, -n.y);
    }
    t1.normalize();
    Vec3.cross(n, t1, t2);

    var t1xA = Vec3.cross(t1, axisA, this.t1xA);
    var t2xA = Vec3.cross(t2, axisA, this.t2xA);

    var rA = a.orientation.rotateVector(this.bodyRA, this.rA);
    var rB = b.orientation.rotateVector(this.bodyRB, this.rB);

    var xRA = new Mat33([0,rA.z,-rA.y,-rA.z,0,rA.x,rA.y,-rA.x,0]);
    var xRB = new Mat33([0,rB.z,-rB.y,-rB.z,0,rB.x,rB.y,-rB.x,0]);

    var RIaRt = Mat33.multiply(xRA, a.inverseInertia, new Mat33()).multiply(xRA.transpose());
    var RIbRt = Mat33.multiply(xRB, b.inverseInertia, new Mat33()).multiply(xRB.transpose());

    var invEffInertia = Mat33.add(RIaRt, RIbRt, RIaRt);

    var worldA = Vec3.add(a.position, this.rA, this.anchor);
    var worldB = Vec3.add(b.position, this.rB, VEC1_REGISTER);

    var invDt = 1/dt;
    Vec3.subtract(worldB, worldA, this.error);
    this.error.scale(0.2*invDt);

    var imA = a.inverseMass;
    var imB = b.inverseMass;

    var invEffMass = new Mat33([imA + imB,0,0,0,imA + imB,0,0,0,imA + imB]);

    Mat33.add(invEffInertia, invEffMass, this.effMassMatrix)
    this.effMassMatrix.inverse();

    var invIAt1xA = a.inverseInertia.vectorMultiply(t1xA, VEC1_REGISTER);
    var invIAt2xA = a.inverseInertia.vectorMultiply(t2xA, VEC2_REGISTER);
    var invIBt1xA = b.inverseInertia.vectorMultiply(t1xA, VEC3_REGISTER);
    var invIBt2xA = b.inverseInertia.vectorMultiply(t2xA, VEC4_REGISTER);

    var a11 = Vec3.dot(t1xA, invIAt1xA) + Vec3.dot(t1xA, invIBt1xA);
    var a12 = Vec3.dot(t1xA, invIAt2xA) + Vec3.dot(t1xA, invIBt2xA);
    var a21 = Vec3.dot(t2xA, invIAt1xA) + Vec3.dot(t2xA, invIBt1xA);
    var a22 = Vec3.dot(t2xA, invIAt2xA) + Vec3.dot(t2xA, invIBt2xA);

    var det = 1 / (a11*a22 - a12*a21);

    this.effMassMatrixRot[0] = a22 * det;
    this.effMassMatrixRot[1] = -a21 * det;
    this.effMassMatrixRot[2] = -a12 * det;
    this.effMassMatrixRot[3] = a11 * det;

    this.errorRot[0] = Vec3.dot(axisA, t1) * 0.2*invDt;
    this.errorRot[1] = Vec3.dot(axisA, t2) * 0.2*invDt;

    var impulse = this.impulse.scale(0.5);
    var angImpulseA = this.angImpulseA.scale(0.5);
    var angImpulseB = this.angImpulseB.scale(0.5);

    b.applyImpulse(impulse);
    b.applyAngularImpulse(angImpulseB);
    impulse.invert();
    a.applyImpulse(impulse);
    a.applyAngularImpulse(angImpulseA);

    impulse.clear();
    angImpulseA.clear();
    angImpulseB.clear();
};

/**
 * Apply impulses to resolve the constraint.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt delta time
 */
Hinge.prototype.resolve = function resolve(time, dt) {
    var a = this.a;
    var b = this.b;

    var rA = this.rA;
    var rB = this.rB;

    var t1xA = this.t1xA;
    var t2xA = this.t2xA;

    var w1 = a.angularVelocity;
    var w2 = b.angularVelocity;

    var v1 = Vec3.add(a.velocity, Vec3.cross(w1, rA, WxR_REGISTER), VB1_REGISTER);
    var v2 = Vec3.add(b.velocity, Vec3.cross(w2, rB, WxR_REGISTER), VB2_REGISTER);

    var impulse = v1.subtract(v2).subtract(this.error).applyMatrix(this.effMassMatrix);

    var diffW = Vec3.subtract(w2, w1, DELTA_REGISTER);

    var errorRot = this.errorRot;
    var jv1 = Vec3.dot(t1xA, diffW) + errorRot[0];
    var jv2 = Vec3.dot(t2xA, diffW) + errorRot[1];

    var K = this.effMassMatrixRot;

    var l1 = -(K[0]*jv1 + K[1]*jv2);
    var l2 = -(K[2]*jv1 + K[3]*jv2);

    var angImpulse = Vec3.scale(t1xA, l1, VEC2_REGISTER).add(Vec3.scale(t2xA, l2, VEC3_REGISTER));

    var angImpulseB = Vec3.cross(rB, impulse, VEC1_REGISTER).add(angImpulse);
    var angImpulseA = Vec3.cross(rA, impulse, VEC4_REGISTER).invert().subtract(angImpulse);

    b.applyImpulse(impulse);
    b.applyAngularImpulse(angImpulseB);
    impulse.invert();
    a.applyImpulse(impulse);
    a.applyAngularImpulse(angImpulseA);
    impulse.invert();

    this.impulse.add(impulse);
    this.angImpulseA.add(angImpulseA);
    this.angImpulseB.add(angImpulseB);
};

module.exports = Hinge;

},{"./Constraint":276,"famous-math":249}],281:[function(require,module,exports){
'use strict';

var Constraint = require('./Constraint');
var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;
var Quaternion = require('famous-math').Quaternion;

var VEC1_REGISTER = new Vec3();
var VEC2_REGISTER = new Vec3();
var NORMAL_REGISTER = new Vec3();
var IMPULSE_REGISTER = new Vec3();
var VB1_REGISTER = new Vec3();
var VB2_REGISTER = new Vec3();
var WxR_REGISTER = new Vec3();

/** @const */
var PI = Math.PI;

/**
 *  A constraint that maintains positions and orientations with respect to a specific anchor point.
 *
 *  @class Point2Point
 *  @extends Constraint
 *  @param {Particle} a One of the bodies.
 *  @param {Particle} b The other body.
 *  @param {Options} options An object of configurable options.
 */
function Point2Point(a, b, options) {
    this.a = a;
    this.b = b;

    Constraint.call(this, options);

    this.impulse = new Vec3();
    this.angImpulseA = new Vec3();
    this.angImpulseB = new Vec3();
    this.error = new Vec3();
    this.effMassMatrix = new Mat33();
}

Point2Point.prototype = Object.create(Constraint.prototype);
Point2Point.prototype.constructor = Point2Point;

/**
 * Initialize the Point2Point. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Point2Point.prototype.init = function(options) {
    var w = this.anchor;

    var a = this.a;
    var b = this.b;

    var q1t = Quaternion.conjugate(a.orientation, new Quaternion());
    var q2t = Quaternion.conjugate(b.orientation, new Quaternion());

    this.rA = Vec3.subtract(w, a.position, new Vec3());
    this.rB = Vec3.subtract(w, b.position, new Vec3());

    this.bodyRA = q1t.rotateVector(this.rA, new Vec3());
    this.bodyRB = q2t.rotateVector(this.rB, new Vec3());
};

/**
 * Detect violations of the constraint. Warm start the constraint, if possible.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt delta time
 */
Point2Point.prototype.update = function(time, dt) {
    var a = this.a;
    var b = this.b;

    var period = this.period;
    var dampingRatio = this.dampingRatio;

    var rA = a.orientation.rotateVector(this.bodyRA, this.rA);
    var rB = b.orientation.rotateVector(this.bodyRB, this.rB);

    var xRA = new Mat33([0,rA.z,-rA.y,-rA.z,0,rA.x,rA.y,-rA.x,0]);
    var xRB = new Mat33([0,rB.z,-rB.y,-rB.z,0,rB.x,rB.y,-rB.x,0]);

    var RIaRt = Mat33.multiply(xRA, a.inverseInertia, new Mat33()).multiply(xRA.transpose());
    var RIbRt = Mat33.multiply(xRB, b.inverseInertia, new Mat33()).multiply(xRB.transpose());

    var invEffInertia = Mat33.add(RIaRt, RIbRt, RIaRt);

    var worldA = Vec3.add(a.position, this.rA, this.anchor);
    var worldB = Vec3.add(b.position, this.rB, VEC2_REGISTER);

    Vec3.subtract(worldB, worldA, this.error);
    this.error.scale(0.2/dt);

    var imA = a.inverseMass;
    var imB = b.inverseMass;

    var invEffMass = new Mat33([imA + imB,0,0,0,imA + imB,0,0,0,imA + imB]);

    Mat33.add(invEffInertia, invEffMass, this.effMassMatrix)
    this.effMassMatrix.inverse();

    var impulse = this.impulse;
    var angImpulseA = this.angImpulseA;
    var angImpulseB = this.angImpulseB;

    b.applyImpulse(impulse);
    b.applyAngularImpulse(angImpulseB);
    impulse.invert();
    a.applyImpulse(impulse);
    a.applyAngularImpulse(angImpulseA);

    impulse.clear();
    angImpulseA.clear();
    angImpulseB.clear();
};

/**
 * Apply impulses to resolve the constraint.
 *
 * @method resolve
 * @param {Number} time
 * @param {Number} dt delta time
 */
Point2Point.prototype.resolve = function resolve(time, dt) {
    var a = this.a;
    var b = this.b;

    var rA = this.rA;
    var rB = this.rB;

    var v1 = Vec3.add(a.velocity, Vec3.cross(a.angularVelocity, rA, WxR_REGISTER), VB1_REGISTER);
    var v2 = Vec3.add(b.velocity, Vec3.cross(b.angularVelocity, rB, WxR_REGISTER), VB2_REGISTER);

    var impulse = v1.subtract(v2).subtract(this.error).applyMatrix(this.effMassMatrix);
    var angImpulseB = Vec3.cross(rB, impulse, VEC1_REGISTER);
    var angImpulseA = Vec3.cross(rA, impulse, VEC2_REGISTER).invert();

    b.applyImpulse(impulse);
    b.applyAngularImpulse(angImpulseB);
    impulse.invert();
    a.applyImpulse(impulse);
    a.applyAngularImpulse(angImpulseA);
    impulse.invert();

    this.impulse.add(impulse);
    this.angImpulseA.add(angImpulseA);
    this.angImpulseB.add(angImpulseB);
};

module.exports = Point2Point;

},{"./Constraint":276,"famous-math":249}],282:[function(require,module,exports){
'use strict';

/**
 * Axis-aligned bounding box. Used in collision broadphases.
 *
 * @class AABB
 */
function AABB(body) {
    this._body = body;
    this._ID = body._ID;
    this.position = null;
    this.vertices = {
        x: [],
        y: [],
        z: []
    };
    this.update();
};


var CONVEX = 1 << 0;
var BOX = 1 << 1;
var SPHERE = 1 << 2;
var WALL = 1 << 3;

var DOWN = 0;
var UP = 1;
var LEFT = 2;
var RIGHT = 3;
var FORWARD = 4;
var BACKWARD = 5;

/**
 * Update the bounds to reflect the current orientation and position of the parent Body.
 *
 * @method update
 */
AABB.prototype.update = function() {
    var body = this._body;
    var pos = this.position = body.position;

    var minX = Infinity, maxX = -Infinity;
    var minY = Infinity, maxY = -Infinity;
    var minZ = Infinity, maxZ = -Infinity;

    var type = body.type;
    if (type === SPHERE) {
        maxX = maxY = maxZ = body.radius;
        minX = minY = minZ = -body.radius;
    }
    else if (type === WALL) {
        var d = body.direction;
        maxX = maxY = maxZ = 1e6;
        minX = minY = minZ = -1e6;
        switch (d) {
            case DOWN:
                maxY = 25;
                minY = -1e3;
                break;
            case UP:
                maxY = 1e3;
                minY = -25;
                break;
            case LEFT:
                maxX = 25;
                minX = -1e3;
                break;
            case RIGHT:
                maxX = 1e3;
                minX = -25;
                break;
            case FORWARD:
                maxZ = 25;
                minZ = -1e3;
                break;
            case BACKWARD:
                maxZ = 1e3;
                minZ = -25;
                break;
            default:
                break;
       }
    }
    else if (body.vertices) {
        // ConvexBody
        var bodyVertices = body.vertices;
        for (var i = 0, len = bodyVertices.length; i < len; i++) {
            var vertex = bodyVertices[i];
            if (vertex.x < minX) minX = vertex.x;
            if (vertex.x > maxX) maxX = vertex.x;
            if (vertex.y < minY) minY = vertex.y;
            if (vertex.y > maxY) maxY = vertex.y;
            if (vertex.z < minZ) minZ = vertex.z;
            if (vertex.z > maxZ) maxZ = vertex.z;
        }
    } else {
        // Particle
        maxX = maxY = maxZ = 25;
        minX = minY = minZ = -25;
    }
    var vertices = this.vertices;
    vertices.x[0] = minX + pos.x;
    vertices.x[1] = maxX + pos.x;
    vertices.y[0] = minY + pos.y;
    vertices.y[1] = maxY + pos.y;
    vertices.z[0] = minZ + pos.z;
    vertices.z[1] = maxZ + pos.z;
};

/**
 * Check for overlap between two AABB's.
 *
 * @method checkOverlap
 * @param {AABB} aabb1
 * @param {AABB} aabb2
 */
AABB.checkOverlap = function(aabb1, aabb2) {
    var pos1 = aabb1.position;
    var pos2 = aabb2.position;

    var vertices1 = aabb1.vertices;
    var vertices2 = aabb2.vertices;

    var x10 = vertices1.x[0];
    var x11 = vertices1.x[1];
    var x20 = vertices2.x[0];
    var x21 = vertices2.x[1];
    if ((x20 <= x10 && x10 <= x21) || (x10 <= x20 && x20 <= x11)) {
        var y10 = vertices1.y[0];
        var y11 = vertices1.y[1];
        var y20 = vertices2.y[0];
        var y21 = vertices2.y[1];
        if ((y20 <= y10 && y10 <= y21) || (y10 <= y20 && y20 <= y11)) {
            var z10 = vertices1.z[0];
            var z11 = vertices1.z[1];
            var z20 = vertices2.z[0];
            var z21 = vertices2.z[1];
            if ((z20 <= z10 && z10 <= z21) || (z10 <= z20 && z20 <= z11)) {
                return true;
            }
        }
    }
    return false;
};

AABB.vertexThreshold = 100;

module.exports = AABB;

},{}],283:[function(require,module,exports){
'use strict';

var AABB = require('./AABB');

/**
 * O(n^2) comparisons with an AABB check for a midphase. Likely to be more performant
 * that the BruteForce when the bodies have many vertices. Only feasible for a small number of bodies.
 *
 * @class BruteForAABB
 * @param {Particles[]} targets
 * @param {Object} options
 */
function BruteForceAABB(targets, options) {
    this._volumes = [];
    this._entityRegistry = {};
    for (var i = 0; i < targets.length; i++) {
        this.add(targets[i]);
    }
};

/**
 * Start tracking a Particle.
 *
 * @method add
 * @param {Particle} body
 */
BruteForceAABB.prototype.add = function(body) {
    var boundingVolume = new AABB(body);

    this._entityRegistry[body._ID] = body;
    this._volumes.push(boundingVolume);
};

/**
 * Return an array of possible collision pairs, culled by an AABB intersection test.
 *
 * @method update
 * @return {Particle[][]}
 */
BruteForceAABB.prototype.update = function() {
    var _volumes = this._volumes;
    var _entityRegistry = this._entityRegistry;

    for (var k = 0, len = _volumes.length; k < len; k++) {
        _volumes[k].update();
    }

    var result = [];
    for (var i = 0, numTargets = _volumes.length; i < numTargets; i++) {
        for (var j = i + 1; j < numTargets; j++) {
            if (AABB.checkOverlap(_volumes[i], _volumes[j])) {
                result.push([_entityRegistry[i], _entityRegistry[j]]);
            }
        }
    }
    return result;
}

/**
 * The most simple yet computationally intensive broad-phase. Immediately passes its targets to the narrow-phase,
 * resulting in an O(n^2) process. Only feasible for a relatively small number of bodies.
 *
 * @class BruteForce
 * @param {Particle[]} targets
 * @param {Object} options
 */
function BruteForce(targets, options) {
    this.targets = targets;
}

/**
 * Start tracking a Particle.
 *
 * @method add
 * @param {Particle} body
 */
BruteForce.prototype.add = function(body) {
    this.targets.push(body);
};

/**
 * Immediately returns an array of possible collisions.
 *
 * @method update
 * @return {Particle[][]}
 */
BruteForce.prototype.update = function() {
    return [this.targets];
};

module.exports.BruteForceAABB = BruteForceAABB;
module.exports.BruteForce = BruteForce;

},{"./AABB":282}],284:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var ObjectManager = require('famous-utilities').ObjectManager;

var MANIFOLD = 'Manifold';
var CONTACT = 'Contact';
var COLLISIONDATA = 'CollisionData';

ObjectManager.register('Manifold', Manifold);
ObjectManager.register('Contact', Contact);
var OMRequestManifold = ObjectManager.requestManifold;
var OMRequestContact = ObjectManager.requestContact;
var OMFreeManifold = ObjectManager.freeManifold;
var OMFreeContact = ObjectManager.freeContact;

/**
 * Helper function to clamp a value to a given range.
 *
 * @method clamp
 * @param {Number} value
 * @param {Number} lower
 * @param {Number} upper
 * @return {Number}
 * @private
 */
function clamp(value, lower, upper) {
    return value < lower ? lower : value > upper ? upper : value;
}

var VEC1_REGISTER = new Vec3();
var VEC2_REGISTER = new Vec3();
var VB1_REGISTER = new Vec3();
var VB2_REGISTER = new Vec3();
var WxR_REGISTER = new Vec3();
var R1_REGISTER = new Vec3();
var R2_REGISTER = new Vec3();
var NORMALIMPULSE_REGISTER = new Vec3();
var TANGENTIMPULSE1_REGISTER = new Vec3();
var TANGENTIMPULSE2_REGISTER = new Vec3();
var WA_REGISTER = new Vec3();
var WB_REGISTER = new Vec3();
var PENETRATING_REGISTER = new Vec3();
var DRIFTA_REGISTER = new Vec3();
var DRIFTB_REGISTER = new Vec3();

/**
 * Table maintaining and managing current contact manifolds.
 *
 * @class ContactManifoldTable
 */
function ContactManifoldTable() {
    this.manifolds = [];
    this.collisionMatrix = {};
    this._IDPool = [];
};

/**
 * Create a new contact manifold. Tracked by the collisionMatrix according to
 * its low-high ordered ID pair.
 *
 * @method addManifold
 * @param {Number} lowId
 * @param {Number} highID
 * @param {Particle} bodyA
 * @param {Particle} bodyB
 * @return {ContactManifold}
 */
ContactManifoldTable.prototype.addManifold = function addManifold(lowID, highID, bodyA, bodyB) {
    var collisionMatrix = this.collisionMatrix
    collisionMatrix[lowID] = collisionMatrix[lowID] || {};

    var index = this._IDPool.length ? this._IDPool.pop() : this.manifolds.length;
    this.collisionMatrix[lowID][highID] = index;
    return this.manifolds[index] = OMRequestManifold().reset(lowID, highID, bodyA, bodyB);
};

/**
 * Remove a manifold and free it for later reuse.
 *
 * @method removeManifold
 * @param {ContactManifold} manifold
 * @param {Number} index
 */
ContactManifoldTable.prototype.removeManifold = function removeManifold(manifold, index) {
    var collisionMatrix = this.collisionMatrix;

    this.manifolds[index] = null;
    collisionMatrix[manifold.lowID][manifold.highID] = null;
    this._IDPool.push(index);

    OMFreeManifold(manifold);
};

/**
 * Update each of the manifolds, removing those which no longer contain contact points.
 *
 * @method update
 * @param {Number} dt
 */
ContactManifoldTable.prototype.update = function update(dt) {
    var manifolds = this.manifolds;
    for (var i = 0, len = manifolds.length; i < len; i++) {
        var manifold = manifolds[i];
        if (!manifold) continue;
        var persists = manifold.update(dt);
        if (!persists) this.removeManifold(manifold, i);
    }
};

/**
 * Warm start all Contacts, and perform precalculations needed in the iterative solver.
 *
 * @method prepContacts
 * @param {Number} dt
 */
ContactManifoldTable.prototype.prepContacts = function prepContacts(dt) {
    var manifolds = this.manifolds;
    for (var i = 0, len = manifolds.length; i < len; i++) {
        var manifold = manifolds[i];
        if (!manifold) continue;
        var contacts = manifold.contacts;
        for (var j = 0, lenj = contacts.length; j < lenj; j++) {
            var contact = contacts[j];
            if (!contact) continue;
            contact.update(dt);
        }
    }
};

/**
 * Resolve all contact manifolds.
 *
 * @method resolveManifolds
 * @param {Number} dt
 */
ContactManifoldTable.prototype.resolveManifolds = function resolveManifolds(dt) {
    var manifolds = this.manifolds;
    for (var i = 0, len = manifolds.length; i < len; i++) {
        var manifold = manifolds[i];
        if (!manifold) continue;
        manifold.resolveContacts(dt);
    }
};

/**
 * Create a new Contact, also creating a new Manifold if one does not already exist for that pair.
 *
 * @method registerContact
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {CollisionData} collisionData
 */
ContactManifoldTable.prototype.registerContact = function registerContact(bodyA, bodyB, collisionData) {
    var lowID;
    var highID;

    if (bodyA._ID < bodyB._ID) {
        lowID = bodyA._ID;
        highID = bodyB._ID;
    } else {
        lowID = bodyB._ID;
        highID = bodyA._ID;
    }

    var manifolds = this.manifolds;
    var collisionMatrix = this.collisionMatrix;
    var manifold;
    if (!collisionMatrix[lowID] || collisionMatrix[lowID][highID] == null) {
        manifold = this.addManifold(lowID, highID, bodyA, bodyB);
        manifold.addContact(bodyA, bodyB, collisionData);
    } else {
        manifold = manifolds[ collisionMatrix[lowID][highID] ];
        manifold.contains(collisionData)
        manifold.addContact(bodyA, bodyB, collisionData);
    }
};

var THRESHOLD = 10;

/**
 * Class to keep track of Contact points.
 * @class manifold
 * @param {Number} lowId
 * @param {Number} highId
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function Manifold(lowID, highID, bodyA, bodyB) {
    this.lowID = lowID;
    this.highID = highID;

    this.contacts = [];
    this.numContacts = 0;

    this.bodyA = bodyA;
    this.bodyB = bodyB;

    this.lru = 0;
};

/**
 * Used by ObjectManager to reset the object with different data.
 *
 * @method reset
 * @param {Object[]} args
 * @chainable
 */
Manifold.prototype.reset = function reset(lowID, highID, bodyA, bodyB) {
    this.lowID = lowID;
    this.highID = highID;

    this.contacts = [];
    this.numContacts = 0;

    this.bodyA = bodyA;
    this.bodyB = bodyB;

    this.lru = 0;

    return this;
};

/**
 * Create a new Contact point and add it to the Manifold.
 *
 * @method addContact
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {CollisionData} collisionData
 */
Manifold.prototype.addContact = function addContact(bodyA, bodyB, collisionData) {
    var index = this.lru;
    if (this.contacts[index]) this.removeContact(this.contacts[index], index);
    this.contacts[index] = OMRequestContact().reset(bodyA, bodyB, collisionData);
    this.lru = (this.lru + 1) % 4;
    this.numContacts++;
};

/**
 * Remove and free a Contact for later reuse.
 *
 * @method removeContact
 * @param {Contact} contact
 * @param {Number} index
 */
Manifold.prototype.removeContact = function removeContact(contact, index) {
    this.contacts[index] = null;
    this.numContacts--;

    ObjectManager.freeCollisionData(contact.data);
    contact.data = null;
    OMFreeContact(contact);
};

/**
 * Check if a Contact already exists for the collision data within a certain tolerance.
 * If found, remove the Contact.
 *
 * @method contains
 * @param {CollisionData} collisionData
 * @return {Boolean}
 */
Manifold.prototype.contains = function contains(collisionData) {
    var wA = collisionData.worldContactA;
    var wB = collisionData.worldContactB;

    var contacts = this.contacts;
    for (var i = 0, len = contacts.length; i < len; i++) {
        var contact = contacts[i];
        if (!contact) continue;
        var data = contact.data;
        var distA = Vec3.subtract(data.worldContactA, wA, DRIFTA_REGISTER).length();
        var distB = Vec3.subtract(data.worldContactB, wB, DRIFTB_REGISTER).length();

        if (distA < THRESHOLD || distB < THRESHOLD) {
            this.removeContact(contact, i);
            return true;
        }
    }

    return false;
};

/**
 * Remove Contacts the local points of which have drifted above a certain tolerance.
 * Return true or false to indicate that the Manifold still contains at least one Contact.
 *
 * @method update
 * @param {Number} dt
 * @return {Boolean} whether or not the manifold persists
 */
Manifold.prototype.update = function update(dt) {
    var contacts = this.contacts;
    var bodyA = this.bodyA;
    var bodyB = this.bodyB;

    var posA = bodyA.position;
    var posB = bodyB.position;

    for (var i = 0, len = contacts.length; i < len; i++) {
        var contact = contacts[i];
        if (!contact) continue;
        var data = contact.data;
        var n = data.normal;
        var rA = data.localContactA;
        var rB = data.localContactB;

        var cached_wA = data.worldContactA
        var cached_wB = data.worldContactB

        var wA = Vec3.add(posA, rA, WA_REGISTER);
        var wB = Vec3.add(posB, rB, WB_REGISTER);

        var notPenetrating = Vec3.dot(Vec3.subtract(wB, wA, PENETRATING_REGISTER), n) > 0;

        var driftA = Vec3.subtract(cached_wA, wA, DRIFTA_REGISTER);
        var driftB = Vec3.subtract(cached_wB, wB, DRIFTB_REGISTER);


        if (driftA.length() >= THRESHOLD || driftB.length() >= THRESHOLD || notPenetrating) {
            this.removeContact(contact, i);
        }
    }

    if (this.numContacts) return true;
    else return false;
};

/**
 * Resolve all contacts.
 *
 * @method resolveContacts
 * @param {Number} dt
 */
Manifold.prototype.resolveContacts = function resolveContacts(dt) {
    var contacts = this.contacts;
    for (var i = 0, len = contacts.length; i < len; i++) {
        if (!contacts[i]) continue;
        contacts[i].resolve(dt);
    }
};

/**
 * Class to maintain collision data between two bodies.
 * The end of the resolve chain, and where the actual impulses are applied.
 *
 * @class Contact
 * @param {Body} bodyA
 * @param {Body} bodyB
 * @param {CollisionData} collisionData
 */
function Contact(bodyA, bodyB, collisionData) {
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.data = collisionData;

    this.normalImpulse = 0;
    this.tangentImpulse1 = 0;
    this.tangentImpulse2 = 0;

    this.impulse = new Vec3();
    this.angImpulseA = new Vec3();
    this.angImpulseB = new Vec3();

    if (collisionData) this.init();
};

/**
 * Used by ObjectManager to reset the object with different data.
 *
 * @method reset
 * @param {Object[]} args
 * @chainable
 */
Contact.prototype.reset = function reset(bodyA, bodyB, collisionData) {
    this.bodyA = bodyA;
    this.bodyB = bodyB;
    this.data = collisionData;

    this.normalImpulse = 0;
    this.tangentImpulse1 = 0;
    this.tangentImpulse2 = 0;

    this.impulse.clear();
    this.angImpulseA.clear();
    this.angImpulseB.clear();

    this.init();

    return this;
};

/**
 * Initialization method called on instantiantion or reset of the Contact. Performs
 * precalculations that will not change over the life of the Contact.
 *
 * @method init
 */
Contact.prototype.init = function init() {
    var data = this.data;
    var n = data.normal;
    var t1 = new Vec3();
    if (n.x >= 0.57735) {
        t1.set(n.y, -n.x, 0);
    } else {
        t1.set(0, n.z, -n.y);
    }
    t1.normalize();
    var t2 = Vec3.cross(n, t1, new Vec3());

    this.tangent1 = t1;
    this.tangent2 = t2;

    var bodyA = this.bodyA;
    var bodyB = this.bodyB;

    var rBodyA = data.localContactA;
    var rBodyB = data.localContactB;

    var invEffectiveMass = bodyA.inverseMass + bodyB.inverseMass;

    var r1n = Vec3.cross(rBodyA, n, R1_REGISTER);
    var r2n = Vec3.cross(rBodyB, n, R2_REGISTER);
    this.effNormalMass = 1 / (invEffectiveMass +
        Vec3.dot(r1n, bodyA.inverseInertia.vectorMultiply(r1n, VEC1_REGISTER)) +
        Vec3.dot(r2n, bodyB.inverseInertia.vectorMultiply(r2n, VEC1_REGISTER)));

    var r1t1 = Vec3.cross(rBodyA, t1, R1_REGISTER);
    var r2t1 = Vec3.cross(rBodyB, t1, R2_REGISTER);
    this.effTangentialMass1 = 1 / (invEffectiveMass +
        Vec3.dot(r1t1, bodyA.inverseInertia.vectorMultiply(r1t1, VEC1_REGISTER)) +
         Vec3.dot(r2t1, bodyB.inverseInertia.vectorMultiply(r2t1, VEC1_REGISTER)));

    var r1t2 = Vec3.cross(rBodyA, t2, R1_REGISTER);
    var r2t2 = Vec3.cross(rBodyB, t2, R2_REGISTER);
    this.effTangentialMass2 = 1 / (invEffectiveMass +
        Vec3.dot(r1t2, bodyA.inverseInertia.vectorMultiply(r1t2, VEC1_REGISTER)) +
         Vec3.dot(r2t2, bodyB.inverseInertia.vectorMultiply(r2t2, VEC1_REGISTER)));

    this.restitution = Math.min(bodyA.restitution, bodyB.restitution);
    this.friction = bodyA.friction * bodyB.friction;
}

/**
 * Warm start the Contact, prepare for the iterative solver, and reset impulses.
 *
 * @method update
 * @param {Number} dt
 */
Contact.prototype.update = function update(dt) {
    var data = this.data;
    var bodyA = this.bodyA;
    var bodyB = this.bodyB;

    var rBodyA = data.localContactA;
    var rBodyB = data.localContactB;

    var n = data.normal;
    var t1 = this.tangent1;
    var t2 = this.tangent2;

    var vb1 = Vec3.add(bodyA.velocity, Vec3.cross(bodyA.angularVelocity, rBodyA, WxR_REGISTER), VB1_REGISTER);
    var vb2 = Vec3.add(bodyB.velocity, Vec3.cross(bodyB.angularVelocity, rBodyB, WxR_REGISTER), VB2_REGISTER);
    var relativeVelocity = vb2.subtract(vb1);
    var contactSpeed = Vec3.dot(relativeVelocity, n);

    var beta = 0.15;
    var slop = 1.5;
    var velocityTolerance = 20.0;

    var restitution = Math.abs(contactSpeed) < velocityTolerance ? 0.0 : this.restitution;
    this.velocityBias = -beta * Math.max(data.penetration - slop, 0.0) / dt;
    this.velocityBias += restitution * contactSpeed;

    var impulse = this.impulse.scale(0.25);
    var angImpulseA = this.angImpulseA.scale(0.25);
    var angImpulseB = this.angImpulseB.scale(0.25);

    bodyB.applyImpulse(impulse);
    bodyB.applyAngularImpulse(angImpulseB);
    impulse.invert();
    bodyA.applyImpulse(impulse);
    bodyA.applyAngularImpulse(angImpulseA);

    this.normalImpulse = 0;
    this.tangentImpulse1 = 0;
    this.tangentImpulse2 = 0;

    impulse.clear();
    angImpulseA.clear();
    angImpulseB.clear();
};

/**
 * Apply impulses to resolve the contact and simulate friction.
 *
 * @method resolve
 * @param {Number} dt
 */
Contact.prototype.resolve = function resolve(dt) {
    var data = this.data;
    var bodyA = this.bodyA;
    var bodyB = this.bodyB;

    var rBodyA = data.localContactA;
    var rBodyB = data.localContactB;

    var n = data.normal;
    var t1 = this.tangent1;
    var t2 = this.tangent2;

    var vb1 = Vec3.add(bodyA.velocity, Vec3.cross(bodyA.angularVelocity, rBodyA, WxR_REGISTER), VB1_REGISTER);
    var vb2 = Vec3.add(bodyB.velocity, Vec3.cross(bodyB.angularVelocity, rBodyB, WxR_REGISTER), VB2_REGISTER);
    var relativeVelocity = vb2.subtract(vb1);

    var normalLambda = -(Vec3.dot(relativeVelocity, n) + this.velocityBias) * this.effNormalMass;
    var newNormalImpulse = Math.max(this.normalImpulse + normalLambda, 0);
    normalLambda = newNormalImpulse - this.normalImpulse;

    var maxFriction = this.friction * newNormalImpulse;

    var tangentLambda1 = -Vec3.dot(relativeVelocity, t1) * this.effTangentialMass1;
    var newTangentImpulse1 = clamp(this.tangentImpulse1 + tangentLambda1, -maxFriction, maxFriction);
    tangentLambda1 = newTangentImpulse1 - this.tangentImpulse1;

    var tangentLambda2 = -Vec3.dot(relativeVelocity, t2) * this.effTangentialMass2;
    var newTangentImpulse2 = clamp(this.tangentImpulse2 + tangentLambda2, -maxFriction, maxFriction);
    tangentLambda2 = newTangentImpulse2 - this.tangentImpulse2;

    var impulse = Vec3.scale(n, normalLambda, NORMALIMPULSE_REGISTER);
    var tangentImpulse1 = Vec3.scale(t1, tangentLambda1, TANGENTIMPULSE1_REGISTER);
    var tangentImpulse2 = Vec3.scale(t2, tangentLambda2, TANGENTIMPULSE2_REGISTER);

    impulse.add(tangentImpulse1).add(tangentImpulse2);

    var angImpulseB = Vec3.cross(rBodyB, impulse, VEC1_REGISTER);
    var angImpulseA = Vec3.cross(rBodyA, impulse, VEC2_REGISTER).invert();

    bodyB.applyImpulse(impulse);
    bodyB.applyAngularImpulse(angImpulseB);
    impulse.invert();
    bodyA.applyImpulse(impulse);
    bodyA.applyAngularImpulse(angImpulseA);

    this.normalImpulse = newNormalImpulse;
    this.tangentImpulse1 = newTangentImpulse1;
    this.tangentImpulse2 = newTangentImpulse2;

    this.impulse.add(impulse);
    this.angImpulseA.add(angImpulseA);
    this.angImpulseB.add(angImpulseB);
};

module.exports = ContactManifoldTable;

},{"famous-math":249,"famous-utilities":264}],285:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Geometry = require('../../Geometry');
var ObjectManager = require('famous-utilities').ObjectManager;

ObjectManager.register('GJK_EPASupportPoint', GJK_EPASupportPoint);
var OMRequestGJK_EPASupportPoint = ObjectManager.requestGJK_EPASupportPoint;
var OMRequestDynamicGeometry = ObjectManager.requestDynamicGeometry;
var OMFreeGJK_EPASupportPoint = ObjectManager.freeGJK_EPASupportPoint;
var OMFreeDynamicGeometry = ObjectManager.freeDynamicGeometry;
var OMFreeDynamicGeometryFeature = ObjectManager.freeDynamicGeometryFeature;

var P_REGISTER = new Vec3();
var V0_REGISTER = new Vec3();
var V1_REGISTER = new Vec3();
var V2_REGISTER = new Vec3();

var DIRECTION_REGISTER = new Vec3();
var INVDIRECTION_REGISTER = new Vec3();

/**
 * Support point to be added to the DynamicGeometry. The point in Minkowski space as well as the
 * original pair.
 *
 * @class GJK_EPASupportPoint
 * @param {Vec3} vertex
 * @param {Vec3} worldVertexA
 * @param {Vec3} worldVertexAB
 */
function GJK_EPASupportPoint(vertex, worldVertexA, worldVertexB) {
    this.vertex = vertex;
    this.worldVertexA = worldVertexA;
    this.worldVertexB = worldVertexB;
}

/**
 * Used by ObjectManager to reset the object with different data.
 *
 * @method reset
 * @param {Object[]} args
 * @chainable
 */
GJK_EPASupportPoint.prototype.reset = function reset(vertex, worldVertexA, worldVertexB) {
    this.vertex = vertex;
    this.worldVertexA = worldVertexA;
    this.worldVertexB = worldVertexB;

    return this;
};

/**
 * Free the DynamicGeomtetry and associate vertices and features for later reuse.
 *
 * @method freeGJK_EPADynamicGeometry
 * @param {DynamicGeometry} geometry
 */
function freeGJK_EPADynamicGeometry(geometry) {
    var vertices = geometry.vertices;
    var i = vertices.length;
    while (i--) {
        var v = vertices[i];
        if (v !== null) OMFreeGJK_EPASupportPoint(v);
    }
    geometry.vertices = [];
    var features = geometry.features;
    var i = features.length
    while (i--) {
        var f = features[i];
        if (f !== null) OMFreeDynamicGeometryFeature(f);
    }
    geometry.features = [];
    OMFreeDynamicGeometry(geometry);
}

/**
 * Find the point in Minkowski space furthest in a given direction for two convex Bodies.
 *
 * @method minkowskiSupport
 * @param {Body} body1
 * @param {Body} body2
 * @param {Vec3} direction
 * @return {GJK_EPASupportPoint}
 */
function minkowskiSupport(body1, body2, direction) {
    var inverseDirection = Vec3.scale(direction, -1, INVDIRECTION_REGISTER);

    var furthest1 = body1.support(direction);
    var furthest2 = body2.support(inverseDirection);

    var w1 = Vec3.add(furthest1, body1.position, new Vec3());
    var w2 = Vec3.add(furthest2, body2.position, new Vec3());

    // The vertex in Minkowski space as well as the original pair in world space
    return OMRequestGJK_EPASupportPoint().reset(Vec3.subtract(w1, w2, new Vec3()), w1, w2);
}

/**
 * Gilbert-Johnson-Keerthi collision detection. Returns a DynamicGeometry simplex if the bodies are found
 * to have collided or false for no collsion.
 *
 * @method GJK
 * param {Body} body1
 * param {Body} body2
 * @return {DynamicGeometry | Boolean}
 */
function GJK(body1, body2) {
    var support = minkowskiSupport;
    // Use p2 - p1 to seed the initial choice of direction
    var direction = Vec3.subtract(body2.position, body1.position, DIRECTION_REGISTER).normalize();
    var simplex = OMRequestDynamicGeometry();
    simplex.addVertex(support(body1, body2, direction));
    direction.invert();

    var i = 0;
    var maxIterations = 1e3;
    while(i++ < maxIterations) {
        if (direction.x === 0 && direction.y === 0 && direction.z === 0) break;
        simplex.addVertex(support(body1, body2, direction));
        if (Vec3.dot(simplex.getLastVertex().vertex, direction) < 0) break;
        // If simplex contains origin, return for use in EPA
        if (simplex.simplexContainsOrigin(direction, OMFreeGJK_EPASupportPoint)) return simplex;
    }
    freeGJK_EPADynamicGeometry(simplex);
    return false;
}

/**
 * Expanding Polytope Algorithm--penetration depth, collision normal, and contact points.
 * Returns a CollisonData object.
 *
 * @method EPA
 * @param {Body} body1
 * @param {Body} body2
 * @param {DynamicGeometry} polytope
 * @return {CollisionData}
 */
function EPA(body1, body2, polytope) {
    var support = minkowskiSupport;
    var depthEstimate = Infinity;

    var i = 0;
    var maxIterations = 1e3;
    while(i++ < maxIterations) {
        var closest = polytope.getFeatureClosestToOrigin();
        if (closest === null) return null;
        var direction = closest.normal;
        var point = support(body1, body2, direction);
        depthEstimate = Math.min(depthEstimate, Vec3.dot(point.vertex, direction));
        if (depthEstimate - closest.distance <= 0.01) {
            var supportA = polytope.vertices[closest.vertexIndices[0]];
            var supportB = polytope.vertices[closest.vertexIndices[1]];
            var supportC = polytope.vertices[closest.vertexIndices[2]];

            var A = supportA.vertex;
            var B = supportB.vertex;
            var C = supportC.vertex;
            var P = Vec3.scale(direction, closest.distance, P_REGISTER);

            var V0 = Vec3.subtract(B, A, V0_REGISTER);
            var V1 = Vec3.subtract(C, A, V1_REGISTER);
            var V2 = Vec3.subtract(P, A, V2_REGISTER);

            var d00 = Vec3.dot(V0, V0);
            var d01 = Vec3.dot(V0, V1);
            var d11 = Vec3.dot(V1, V1);
            var d20 = Vec3.dot(V2, V0);
            var d21 = Vec3.dot(V2, V1);
            var denom = d00*d11 - d01*d01;

            var v = (d11*d20 - d01*d21) / denom;
            var w = (d00*d21 - d01*d20) / denom;
            var u = 1.0 - v - w;

            var body1Contact =      supportA.worldVertexA.scale(u)
                               .add(supportB.worldVertexA.scale(v))
                               .add(supportC.worldVertexA.scale(w));

            var body2Contact =      supportA.worldVertexB.scale(u)
                               .add(supportB.worldVertexB.scale(v))
                               .add(supportC.worldVertexB.scale(w));

            var localBody1Contact = Vec3.subtract(body1Contact, body1.position, new Vec3());
            var localBody2Contact = Vec3.subtract(body2Contact, body2.position, new Vec3());

            freeGJK_EPADynamicGeometry(polytope);
            OMFreeGJK_EPASupportPoint(point);

            return ObjectManager.requestCollisionData().reset(closest.distance, direction, body1Contact, body2Contact, localBody1Contact, localBody2Contact);
        } else {
            polytope.addVertex(point);
            polytope.reshape();
        }
    }
    throw new Error('EPA failed to terminate in allotted iterations.');
}

module.exports.GJK = GJK;
module.exports.EPA = EPA;

},{"../../Geometry":267,"famous-math":249,"famous-utilities":264}],286:[function(require,module,exports){
'use strict';

var AABB = require('./AABB');

/**
 * @const {String[]} AXES x, y, and z axes
 */
var AXES = ['x', 'y', 'z'];

/**
 * Persistant object maintaining sorted lists of AABB endpoints used in a sweep-and-prune broadphase.
 * Used to accelerate collision detection.
 * http://en.wikipedia.org/wiki/Sweep_and_prune
 *
 * @class SweepAndPrune
 * @param {Body[]} targets
 * @param {Object} options
 */
function SweepAndPrune(targets, options) {
    this._sweepVolumes = [];
    this._entityRegistry = {};
    this._boundingVolumeRegistry = {};
    this.endpoints = {x: [], y: [], z: []};

    this.overlaps = [];
    this.overlapsMatrix = {};
    this._IDPool = [];
    targets = targets || [];
    for (var i = 0; i < targets.length; i++) {
        this.add(targets[i]);
    }
};

/**
 * Start tracking a body in the broad-phase.
 *
 * @method add
 * @param {Body} body
 */
SweepAndPrune.prototype.add = function(body) {
    var boundingVolume = new AABB(body);
    var sweepVolume = new SweepVolume(boundingVolume);

    this._entityRegistry[body._ID] = body;
    this._boundingVolumeRegistry[body._ID] = boundingVolume;
    this._sweepVolumes.push(sweepVolume);
    for (var i = 0; i < 3; i++) {
        var axis = AXES[i];
        this.endpoints[axis].push(sweepVolume.points[axis][0]);
        this.endpoints[axis].push(sweepVolume.points[axis][1]);
    }
};

/**
 * Stop tracking a body in the broad-phase.
 *
 * @method add
 * @param {Body} body
 */
SweepAndPrune.prototype.remove = function remove(body) {
    this._entityRegistry[body._ID] = null;
    this._boundingVolumeRegistry[body._ID] = null;
    var index;
    for (var i = 0, len = this._sweepVolumes.length; i < len; i++) {
        if (this._sweepVolumes[i]._ID === body._ID) {
            index = i;
            break;
        }
    }
    this._sweepVolumes.splice(index, 1);
    var endpoints = this.endpoints;

    var xs = [];
    for (var i = 0, len = endpoints.x.length; i < len; i++) {
        var point = endpoints.x[i];
        if (point._ID !== body._ID) xs.push(point)
    }
    var ys = [];
    for (var i = 0, len = endpoints.y.length; i < len; i++) {
        var point = endpoints.y[i];
        if (point._ID !== body._ID) ys.push(point)
    }
    var zs = [];
    for (var i = 0, len = endpoints.z.length; i < len; i++) {
        var point = endpoints.z[i];
        if (point._ID !== body._ID) zs.push(point)
    }
    endpoints.x = xs;
    endpoints.y = yz;
    endpoints.z = zs;
};

/**
 * Update the endpoints of the tracked AABB's and resort the endpoint lists accordingly. Uses an insertion sort,
 * where swaps during the sort are taken to signify a potential change in overlap status for the two
 * relevant AABB's. Returns pairs of overlapping AABB's.
 *
 * @param update
 * @return {Particle[][]}
 */
SweepAndPrune.prototype.update = function() {
    var _sweepVolumes = this._sweepVolumes;
    var _entityRegistry = this._entityRegistry;
    var _boundingVolumeRegistry = this._boundingVolumeRegistry;

    for (var j = 0, len = _sweepVolumes.length; j < len; j++) {
        _sweepVolumes[j].update();
    }

    var endpoints = this.endpoints;
    var overlaps = this.overlaps;
    var overlapsMatrix = this.overlapsMatrix;
    var _IDPool = this._IDPool;

    for (var k = 0; k < 3; k++) {
        var axis = AXES[k];
        // Insertion sort:
        var endpointAxis = endpoints[axis];
        for (var j = 1, len = endpointAxis.length; j < len; j++) {
            var current = endpointAxis[j];
            var val = current.value;
            var i = j - 1;
            var swap;
            var row;
            var index;
            var lowID;
            var highID;
            var cID;
            var sID;
            while (i >= 0 && (swap = endpointAxis[i]).value > val) {
                // A swap occurence indicates that current and swap either just started or just stopped overlapping

                cID = current._ID;
                sID = swap._ID;

                if (cID < sID) {
                    lowID = cID;
                    highID = sID;
                } else {
                    lowID = sID;
                    highID = cID;
                }

                // If, for this axis, min point of current and max point of swap
                if (~current.side & swap.side) {
                    // Now overlapping on this axis -> possible overlap, do full AABB check
                    if (AABB.checkOverlap(_boundingVolumeRegistry[cID], _boundingVolumeRegistry[sID])) {
                        row = overlapsMatrix[lowID] = overlapsMatrix[lowID] || {};
                        index = row[highID] = _IDPool.length ? _IDPool.pop() : overlaps.length;
                        overlaps[index] = [_entityRegistry[lowID], _entityRegistry[highID]];
                    }
                // // Else if, for this axis, max point of current and min point of swap
                } else if (current.side & ~swap.side) {
                    // Now not overlapping on this axis -> definitely not overlapping
                    if ((row = overlapsMatrix[lowID]) && row[highID] != null) {
                        index = row[highID];
                        overlaps[index] = null;
                        row[highID] = null;
                        _IDPool.push(index);
                    }
                }
                // Else if max of both or min of both, still overlapping

                endpointAxis[i + 1] = swap;
                i--;
            }
            endpointAxis[i + 1] = current;
        }
    }

    return overlaps;
};

/**
 * Object used to associate an AABB with its endpoints in the sorted lists.
 *
 * @class SweepVolume
 * @constructor
 * @param {AABB} boundingVolume
 */
function SweepVolume(boundingVolume) {
    this._boundingVolume = boundingVolume;
    this._ID = boundingVolume._ID;
    this.points = {
        x: [{_ID: boundingVolume._ID, side: 0, value: null}, {_ID: boundingVolume._ID, side: 1, value: null}],
        y: [{_ID: boundingVolume._ID, side: 0, value: null}, {_ID: boundingVolume._ID, side: 1, value: null}],
        z: [{_ID: boundingVolume._ID, side: 0, value: null}, {_ID: boundingVolume._ID, side: 1, value: null}]
    }
    this.update();
};

/**
 * Update the endpoints to reflect the current location of the AABB.
 *
 * @method update
 */
SweepVolume.prototype.update = function() {
    var boundingVolume = this._boundingVolume;
    boundingVolume.update();

    var pos = boundingVolume.position;
    var points = this.points;

    for (var i = 0; i < 3; i++) {
        var axis = AXES[i];
        points[axis][0].value = boundingVolume.vertices[axis][0];
        points[axis][1].value = boundingVolume.vertices[axis][1];
    }
};

module.exports = SweepAndPrune;

},{"./AABB":282}],287:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Particle = require('../bodies/Particle');
var Vec3 = require('famous-math').Vec3;

var FORCE_REGISTER = new Vec3();

/**
 * Use drag to oppose momentum of a moving object
 *
 * @class Drag
 * @extends Force
 * @param {Object} options
 */
function Drag(targets, options) {
    Force.call(this, targets, options);
}

Drag.prototype = Object.create(Force.prototype);
Drag.prototype.constructor = Drag;

/**
 * Used to scale velocity in the computation of the drag force.
 *
 * @attribute QUADRATIC
 * @type Function
 * @param {Number} v
 * @return {Number} used to square the magnitude of the velocity
 */
Drag.QUADRATIC = function QUADRATIC(v) {
    return v*v;
};

/**
 * Used to scale velocity in the computation of the drag force.
 *
 * @attribute LINEAR
 * @type Function
 * @param {Number} v
 * @return {Number} strength 1, will not scale the velocity
 */
Drag.LINEAR = function LINEAR(v) {
    return v;
};

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Drag.prototype.init = function(options) {
    this.max = this.max || Infinity;
    this.strength = this.strength || 1;
    this.type = this.type || Drag.LINEAR;
};

/**
 * Apply the force.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Drag.prototype.update = function update(time, dt) {
    var targets = this.targets;
    var type = this.type;

    var force = FORCE_REGISTER;

    var max = this.max;
    var strength = this.strength;
    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        var velocity = target.velocity;
        var v = velocity.length();
        var invV = v ? 1 / v : 0;
        var magnitude = -strength * type(v);
        Vec3.scale(velocity, (magnitude < -max ? -max : magnitude) * invV, force);
        target.applyForce(force);
    }
};

module.exports = Drag;

},{"../bodies/Particle":271,"./Force":288,"famous-math":249}],288:[function(require,module,exports){
'use strict';

var _ID = 0;
/**
 * Abstract force manager to apply forces to targets.
 *
 * @virtual
 * @class Force
 */
function Force(targets, options) {
    this.targets = [].concat(targets);
    options = options || {};
    this.setOptions(options);

    this._ID = _ID++;
}

Force.prototype.setOptions = function setOptions(options) {
    for (var key in options) this[key] = options[key];
    this.init(options);
};

/**
 * Method invoked upon instantiation and the setting of options.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Force.prototype.init = function init(options) {};

/**
 * Apply forces on each target.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Force.prototype.update = function update(time, dt) {};

module.exports = Force;

},{}],289:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Vec3 = require('famous-math').Vec3;
var Particle = require('./../bodies/Particle');

var FORCE_REGISTER = new Vec3();

/**
 * Force that pulls all objects in a direction with constant acceleration
 *
 * @class Gravity1D
 * @extends Force
 * @param {Object} options
 */
function Gravity1D(targets, options) {
    Force.call(this, targets, options);
}

Gravity1D.prototype = Object.create(Force.prototype);
Gravity1D.prototype.constructor = Gravity1D;

/**
 * @enum directions
 */
Gravity1D.DOWN     = 0;
Gravity1D.UP       = 1;
Gravity1D.LEFT     = 2;
Gravity1D.RIGHT    = 3;
Gravity1D.FORWARD  = 4;
Gravity1D.BACKWARD = 5;

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Gravity1D.prototype.init = function(options) {
    this.max = this.max || Infinity;
    if (this.acceleration) {
        this.strength = this.acceleration.length();
        this.direction = -1;
        return;
    }
    var acceleration = this.acceleration = new Vec3();
    var direction = this.direction = this.direction || Gravity1D.DOWN;
    var magnitude = this.strength = this.strength || 200;
    switch (direction) {
        case Gravity1D.DOWN:
            acceleration.set(0, magnitude, 0);
            break;
        case Gravity1D.UP:
            acceleration.set(0, -1 * magnitude, 0);
            break;
        case Gravity1D.LEFT:
            acceleration.set(-1 * magnitude, 0, 0);
            break;
        case Gravity1D.RIGHT:
            acceleration.set(magnitude, 0, 0);
            break;
        case Gravity1D.FORWARD:
            acceleration.set(0, 0, -1 * magnitude);
            break;
        case Gravity1D.BACKWARD:
            acceleration.set(0, 0, magnitude);
            break;
        default:
            break;
    }
};

/**
 * Apply the force.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Gravity1D.prototype.update = function(time, dt) {
    var targets = this.targets;

    var force = FORCE_REGISTER;

    var max = this.max;
    var acceleration = this.acceleration;
    var a = acceleration.length();
    var invA = a ? 1 / a : 0;
    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        var magnitude = a * target.mass;
        Vec3.scale(acceleration, (magnitude > max ? max : magnitude) * invA, force)
        target.applyForce(force);
    }
};

module.exports = Gravity1D;

},{"./../bodies/Particle":271,"./Force":288,"famous-math":249}],290:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Vec3 = require('famous-math').Vec3;

var FORCE_REGISTER = new Vec3();

/**
 * An inverse square force dependent on the masses of the source and targets.
 *
 * @class Gravity3D
 * @extends Force
 * @param {Object} options
 */
function Gravity3D(source, targets, options) {
    this.source = source || null;
    Force.call(this, targets, options);
}

Gravity3D.prototype = Object.create(Force.prototype);
Gravity3D.prototype.constructor = Gravity3D;

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Gravity3D.prototype.init = function(options) {
    this.max = this.max || Infinity;
    this.strength = this.strength || 200;
};

/**
 * Apply the force.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Gravity3D.prototype.update = function(time, dt) {
    var source = this.source;
    var targets = this.targets;

    var force = FORCE_REGISTER;

    var strength = this.strength;
    var max = this.max;
    var anchor = this.anchor || source.position;
    var sourceMass = this.anchor ? 1 : source.mass;
    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        Vec3.subtract(anchor, target.position, force);
        var dist = force.length();
        var invDistance = dist ? 1 / dist : 0;
        var magnitude = strength * sourceMass * target.mass * invDistance * invDistance;
        if (magnitude < 0) {
            magnitude = magnitude < -max ? -max : magnitude;
        } else {
            magnitude = magnitude > max ? max : magnitude;
        }
        force.scale(magnitude * invDistance);
        target.applyForce(force);
        if (source) source.applyForce(force.invert());
    }
};

module.exports = Gravity3D;

},{"./Force":288,"famous-math":249}],291:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Vec3 = require('famous-math').Vec3;

var TORQUE_REGISTER = new Vec3();

/**
 * A behavior that slows angular velocity by applying torque.
 *
 * @class RotationalDrag
 * @extends Force
 * @param {Object} options options to set on drag
 */
function RotationalDrag(targets, options) {
    Force.call(this, targets, options);
}

RotationalDrag.prototype = Object.create(Force.prototype);
RotationalDrag.prototype.constructor = RotationalDrag;

/**
 * Used to scale angular velocity in the computation of the drag torque.
 *
 * @attribute QUADRATIC
 * @type Function
 * @param {Vec3} omega
 * @return {Number}
 */
RotationalDrag.QUADRATIC = function QUADRATIC(omega) {
    return omega.length();
};

/**
 * Used to scale angular velocity in the computation of the drag torque.
 *
 * @attribute LINEAR
 * @type Function
 * @param {Vec3} omega
 * @return {Number}
 */
RotationalDrag.LINEAR = function LINEAR(omega) {
    return 1;
};

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
RotationalDrag.prototype.init = function init(options) {
    this.max = this.max || Infinity;
    this.strength = this.strength || 1;
    this.type = this.type || RotationalDrag.LINEAR;
};

/**
 * Adds a rotational drag force to a physics body's torque accumulator.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
RotationalDrag.prototype.update = function update(time, dt) {
    var targets = this.targets;
    var type = this.type;

    var torque = TORQUE_REGISTER;

    var max = this.max;
    var strength = this.strength;
    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        var omega = target.angularVelocity;
        var magnitude = -strength * type(omega);
        Vec3.scale(omega, magnitude < -max ? -max : magnitude, torque);
        torque.applyMatrix(target.inertia);
        target.applyTorque(torque);
    }
};

function clamp(value, lower, upper) {
    return value < lower ? lower : value > upper ? upper : value;
}

module.exports = RotationalDrag;

},{"./Force":288,"famous-math":249}],292:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Quaternion = require('famous-math').Quaternion;
var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;

var Q_REGISTER = new Quaternion();
var DAMPING_REGISTER = new Vec3();
var XYZ_REGISTER = new Vec3();
var MAT_REGISTER = new Mat33();

/** @const ZERO_MAT */
var ZERO_MAT = new Mat33([0,0,0,0,0,0,0,0,0]);
/** @const PI */
var PI = Math.PI;

/**
 * A spring-like behavior that attempts to enforce a specfic orientation by applying torque.
 *
 * @class RotationalSpring
 * @extends Force
 * @param {Object} options
 */
function RotationalSpring(source, targets, options) {
    this.source = source || null;
    Force.call(this, targets, options);
}

RotationalSpring.prototype = Object.create(Force.prototype);
RotationalSpring.prototype.constructor = RotationalSpring;

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
RotationalSpring.prototype.init = function init(options) {
    if (!this.source) this.anchor = this.anchor ? this.anchor.normalize() : new Quaternion(1,0,0,0);
    if (options.stiffness) {
        this.damping = this.damping || 0;
        this.period = null;
        this.dampingRatio = null;
    }
    else if (options.period || options.dampingRatio) {
        this.stiffness = 2 * PI / this.period;
        this.stiffness *= this.stiffness;

        this.dampingRatio = this.dampingRatio || 0;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
    else {
        this.period = 1;
        this.dampingRatio = 0;

        this.stiffness = 2 * PI / this.period, 2;
        this.stiffness *= this.stiffness;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
};

/**
 * Adds a torque force to a physics body's torque accumulator.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
RotationalSpring.prototype.update = function update(time, dt) {
    var source = this.source;
    var targets = this.targets;

    var deltaQ = Q_REGISTER;
    var dampingTorque = DAMPING_REGISTER;
    var XYZ = XYZ_REGISTER;
    var effInertia = MAT_REGISTER;

    var max = this.max;
    var stiffness = this.stiffness;
    var damping = this.damping;
    var anchor = this.anchor || source.orientation;
    var invSourceInertia = this.anchor ? ZERO_MAT : source.inverseInertia;
    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        var q = target.orientation;
        Quaternion.conjugate(q, deltaQ);
        deltaQ.multiply(anchor);

        if (deltaQ.w >= 1) continue;
        var halftheta = Math.acos(deltaQ.w);
        var length = Math.sqrt(1 - deltaQ.w * deltaQ.w);

        var deltaOmega = XYZ.copy(deltaQ).scale(2 * halftheta / length);

        deltaOmega.scale(stiffness);

        Mat33.add(invSourceInertia, target.inverseInertia, effInertia).inverse();

        if (damping) {
            if (source) {
                deltaOmega.add(Vec3.subtract(target.angularVelocity, source.angularVelocity, dampingTorque).scale(-damping));
            }
            else {
                deltaOmega.add(Vec3.scale(target.angularVelocity, -damping, dampingTorque));
            }
        }

        var torque = deltaOmega.applyMatrix(effInertia);
        var magnitude = torque.length();

        if (magnitude > max) torque.scale(max/magnitude);

        target.applyTorque(torque);
        if (source) source.applyTorque(torque.invert());
    }
};

module.exports = RotationalSpring;

},{"./Force":288,"famous-math":249}],293:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Vec3 = require('famous-math').Vec3;

var FORCE_REGISTER = new Vec3();
var DAMPING_REGISTER = new Vec3();

/**
 * A force that accelerates a Particle towards a specific anchor point. Can be anchored to
 * a Vec3 or another source Particle.
 *
 *  @class Spring
 *  @extends Force
 *  @param {Object} options options to set on drag
 */
function Spring(source, targets, options) {
    this.source = source || null;
    Force.call(this, targets, options);
}

Spring.prototype = Object.create(Force.prototype);
Spring.prototype.constructor = Spring;

/** @const */
var PI = Math.PI;

/**
 * A FENE (Finitely Extensible Nonlinear Elastic) spring force
 *      see: http://en.wikipedia.org/wiki/FENE
 * @attribute FENE
 * @type Function
 * @param {Number} dist current distance target is from source body
 * @param {Number} rMax maximum range of influence
 * @return {Number} unscaled force
 */
Spring.FENE = function(dist, rMax) {
    var rMaxSmall = rMax * .99;
    var r = Math.max(Math.min(dist, rMaxSmall), -rMaxSmall);
    return r / (1 - r * r/(rMax * rMax));
},

/**
 * A Hookean spring force, linear in the displacement
 *      see: http://en.wikipedia.org/wiki/Hooke's_law
 * @attribute HOOKE
 * @type Function
 * @param {Number} dist current distance target is from source body
 * @return {Number} unscaled force
 */
Spring.HOOKE = function(dist, rMax) {
    return dist;
}

/**
 * Initialize the Force. Sets defaults if a property was not already set.
 *
 * @method init
 * @param {Object} options The options hash.
 */
Spring.prototype.init = function(options) {
    this.max = this.max || Infinity;
    this.length = this.length || 0;
    this.type = this.type || Spring.HOOKE;
    this.maxLength = this.maxLength || Infinity;

    if (options.stiffness) {
        this.damping = this.damping || 0;
        this.period = null;
        this.dampingRatio = null;
    }
    else if (options.period || options.dampingRatio) {
        this.dampingRatio = this.dampingRatio || 0;

        this.stiffness = 2 * PI / this.period;
        this.stiffness *= this.stiffness;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
    else {
        this.period = 1;
        this.dampingRatio = 0;

        this.stiffness = 2 * PI / this.period;
        this.stiffness *= this.stiffness;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
};

/**
 * Apply the force.
 *
 * @method update
 * @param {Number} time
 * @param {Number} dt
 */
Spring.prototype.update = function(time, dt) {
    var source = this.source;
    var targets = this.targets;

    var force = FORCE_REGISTER;
    var dampingForce = DAMPING_REGISTER;

    var max = this.max;
    var stiffness = this.stiffness;
    var damping = this.damping;
    var restLength = this.length;
    var maxLength = this.maxLength;
    var anchor = this.anchor || source.position;
    var invSourceMass = this.anchor ? 0 : source.inverseMass;
    var type = this.type;

    for (var i = 0, len = targets.length; i < len; i++) {
        var target = targets[i];
        Vec3.subtract(anchor, target.position, force);
        var dist = force.length();
        var stretch = dist - restLength;

        if (Math.abs(stretch) < 1e-6) continue;

        var effMass = 1 / (target.inverseMass + invSourceMass);
        if (this.period) {
            stiffness *= effMass;
            damping *= effMass;
        }

        force.scale(stiffness * type(stretch, maxLength) / stretch);

        if (damping) {
            if (source) {
                force.add(Vec3.subtract(target.velocity, source.velocity, dampingForce).scale(-damping));
            }
            else {
                force.add(Vec3.scale(target.velocity, -damping, dampingForce));
            }
        }

        var magnitude = force.length();
        var invMag = magnitude ? 1 / magnitude : 0;

        Vec3.scale(force, (magnitude > max ? max : magnitude) * invMag, force);

        target.applyForce(force);
        if (source) source.applyForce(force.invert());
    }
};

module.exports = Spring;

},{"./Force":288,"famous-math":249}],294:[function(require,module,exports){
'use strict';

module.exports = {
    Particle: require('./bodies/Particle'),
    ConvexBodyFactory: require('./bodies/ConvexBodyFactory'),
    Box: require('./bodies/Box'),
    Sphere: require('./bodies/Sphere'),
    Wall: require('./bodies/Wall'),

    Constraint: require('./constraints/Constraint'),
    Angle: require('./constraints/Angle'),
    Collision: require('./constraints/Collision'),
    Direction: require('./constraints/Direction'),
    Distance: require('./constraints/Distance'),
    Curve: require('./constraints/Curve'),
    Hinge: require('./constraints/Hinge'),
    Point2Point: require('./constraints/Point2Point'),

    Force: require('./forces/Force'),
    Drag: require('./forces/Drag'),
    RotationalDrag: require('./forces/RotationalDrag'),
    Gravity1D: require('./forces/Gravity1D'),
    Gravity3D: require('./forces/Gravity3D'),
    Spring: require('./forces/Spring'),
    RotationalSpring: require('./forces/RotationalSpring'),

    PhysicsEngine: require('./PhysicsEngine'),
    Geometry: require('./Geometry')
};

},{"./Geometry":267,"./PhysicsEngine":268,"./bodies/Box":269,"./bodies/ConvexBodyFactory":270,"./bodies/Particle":271,"./bodies/Sphere":272,"./bodies/Wall":273,"./constraints/Angle":274,"./constraints/Collision":275,"./constraints/Constraint":276,"./constraints/Curve":277,"./constraints/Direction":278,"./constraints/Distance":279,"./constraints/Hinge":280,"./constraints/Point2Point":281,"./forces/Drag":287,"./forces/Force":288,"./forces/Gravity1D":289,"./forces/Gravity3D":290,"./forces/RotationalDrag":291,"./forces/RotationalSpring":292,"./forces/Spring":293}],295:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"./requestAnimationFrame":296,"dup":159}],296:[function(require,module,exports){
arguments[4][160][0].apply(exports,arguments)
},{"dup":160}],297:[function(require,module,exports){
arguments[4][156][0].apply(exports,arguments)
},{"dup":156}],298:[function(require,module,exports){
arguments[4][157][0].apply(exports,arguments)
},{"./ElementAllocator":297,"dup":157}],299:[function(require,module,exports){
arguments[4][158][0].apply(exports,arguments)
},{"./ElementAllocator":297,"./VirtualElement":298,"dup":158}],300:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],301:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":304,"dup":2}],302:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":301,"./TweenTransition":303,"dup":3}],303:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":300,"dup":4}],304:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],305:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":300,"./MultipleTransition":301,"./Transitionable":302,"./TweenTransition":303,"./after":304,"dup":6}],306:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],307:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":305}],308:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":307,"dup":29}],309:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],310:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],311:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],312:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],313:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],314:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":306,"./Color":307,"./ColorPalette":308,"./KeyCodes":309,"./MethodStore":310,"./ObjectManager":311,"./clone":312,"./flatClone":313,"./loadURL":315,"./strip":316,"dup":35}],315:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],316:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],317:[function(require,module,exports){
module.exports = noop

function noop() {
  throw new Error(
      'You should bundle your code ' +
      'using `glslify` as a transform.'
  )
}

},{}],318:[function(require,module,exports){
module.exports = programify

function programify(vertex, fragment, uniforms, attributes) {
  return {
    vertex: vertex, 
    fragment: fragment,
    uniforms: uniforms, 
    attributes: attributes
  };
}

},{}],319:[function(require,module,exports){
"use strict";
var glslify = require("glslify");
var shaders = require("glslify/simple-adapter.js")("\n#define GLSLIFY 1\n\nvec4 a_x_convertToClipSpace(vec4 pos) {\n  float zTranslationScale = (resolution.x > resolution.y) ? 1.0 / resolution.x : 1.0 / resolution.y;\n  return vec4(((2.0 * pos.x) - resolution.x + size.x) / resolution.x, ((2.0 * pos.y) + resolution.y - size.y) / resolution.y, -pos.z * zTranslationScale, 0.0);\n}\nmat3 b_x_getNormalMatrix(in mat4 t) {\n  mat3 matNorm;\n  mat4 a = t;\n  float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3], a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3], a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3], a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n  det = 1.0 / det;\n  matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\n  matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\n  matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\n  matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\n  matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\n  matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\n  matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\n  matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\n  matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\n  return matNorm;\n}\nmat4 c_x_inverseYMatrix = mat4(1.0, 0.0, 0.0, 0.0, 0.0, -1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0);\nmat4 c_x_invertYAxis(mat4 transform) {\n  return c_x_inverseYMatrix * transform;\n}\nfloat d_x_inverse(float m) {\n  return 1.0 / m;\n}\nmat2 d_x_inverse(mat2 m) {\n  return mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);\n}\nmat3 d_x_inverse(mat3 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n  float b01 = a22 * a11 - a12 * a21;\n  float b11 = -a22 * a10 + a12 * a20;\n  float b21 = a21 * a10 - a11 * a20;\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11), b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10), b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\nmat4 d_x_inverse(mat4 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3], a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3], a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3], a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n  return mat4(a11 * b11 - a12 * b10 + a13 * b09, a02 * b10 - a01 * b11 - a03 * b09, a31 * b05 - a32 * b04 + a33 * b03, a22 * b04 - a21 * b05 - a23 * b03, a12 * b08 - a10 * b11 - a13 * b07, a00 * b11 - a02 * b08 + a03 * b07, a32 * b02 - a30 * b05 - a33 * b01, a20 * b05 - a22 * b02 + a23 * b01, a10 * b10 - a11 * b08 + a13 * b06, a01 * b08 - a00 * b10 - a03 * b06, a30 * b04 - a31 * b02 + a33 * b00, a21 * b02 - a20 * b04 - a23 * b00, a11 * b07 - a10 * b09 - a12 * b06, a00 * b09 - a01 * b07 + a02 * b06, a31 * b01 - a30 * b03 - a32 * b00, a20 * b03 - a21 * b01 + a22 * b00) / det;\n}\nfloat e_x_transpose(float m) {\n  return m;\n}\nmat2 e_x_transpose(mat2 m) {\n  return mat2(m[0][0], m[1][0], m[0][1], m[1][1]);\n}\nmat3 e_x_transpose(mat3 m) {\n  return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);\n}\nmat4 e_x_transpose(mat4 m) {\n  return mat4(m[0][0], m[1][0], m[2][0], m[3][0], m[0][1], m[1][1], m[2][1], m[3][1], m[0][2], m[1][2], m[2][2], m[3][2], m[0][3], m[1][3], m[2][3], m[3][3]);\n}\nvec4 applyTransform(vec4 pos) {\n  float xOrigin = (origin.x - 0.5) * size.x;\n  float yOrigin = (origin.y - 0.5) * size.y;\n  float zOrigin = (origin.z - 0.5) * size.z;\n  mat4 forwardOrigin = mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, xOrigin, yOrigin, zOrigin, 1.0);\n  mat4 negatedOrigin = mat4(1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, -xOrigin, -yOrigin, -zOrigin, 1.0);\n  mat4 MVMatrix = view * transform;\n  mat4 originMVMatrix = forwardOrigin * MVMatrix;\n  originMVMatrix = originMVMatrix * negatedOrigin;\n  mat4 projection = perspective;\n  mat4 invertedYMatrix = c_x_invertYAxis(originMVMatrix);\n  invertedYMatrix[3][2] *= 2.0;\n  vec4 translation = invertedYMatrix[3];\n  pos.xyz *= size;\n  pos.y *= -1.0;\n  vec4 pixelPosition = vec4(pos.x * 0.5, pos.y * 0.5, pos.z * 0.5, 1.0);\n  mat4 pixelTransform = originMVMatrix;\n  pixelTransform[3][0] += size.x * 0.5;\n  pixelTransform[3][1] += size.y * 0.5;\n  projection[0][0] = 1.0 / resolution.x;\n  projection[1][1] = 1.0 / resolution.y;\n  projection[2][2] = (resolution.y > resolution.x) ? -1.0 / resolution.y : -1.0 / resolution.x;\n  projection[2][3] *= 0.5;\n  v_Position = (pixelTransform * pixelPosition).xyz;\n  mat4 MVPMatrix = projection * invertedYMatrix;\n  MVPMatrix[3] = vec4(0.0, 0.0, 0.0, MVPMatrix[3][3]);\n  pos = MVPMatrix * pos;\n  pos += a_x_convertToClipSpace(translation);\n  return pos;\n}\n#vert_definitions\n\nvec3 calculateOffset(vec3 ID) {\n  \n  #vert_applications\n  return vec3(0.0);\n}\nvoid main() {\n  gl_PointSize = 10.0;\n  vec3 invertedNormals = normals;\n  invertedNormals.y *= -1.0;\n  v_Normal = e_x_transpose(mat3(d_x_inverse(transform))) * invertedNormals;\n  v_TextureCoordinate = texCoord;\n  vec3 offsetPos = pos + calculateOffset(positionOffset);\n  gl_Position = applyTransform(vec4(offsetPos, 1.0));\n}", "\n#define GLSLIFY 1\n\n#float_definitions\n\nfloat a_x_applyMaterial(float ID) {\n  \n  #float_applications\n  return 1.;\n}\n#vec_definitions\n\nvec3 a_x_applyMaterial(vec3 ID) {\n  \n  #vec_applications\n  return vec3(.5);\n}\nvec3 b_x_applyLight(in vec3 material) {\n  int numLights = int(u_NumLights);\n  float lambertianTerm;\n  vec3 finalColor = vec3(0.0);\n  vec3 normal = normalize(v_Normal);\n  vec3 ambientLight = u_AmbientLight * material;\n  vec3 eyeVector = -normalize(vec3(v_Position));\n  vec3 diffuse, specular, lightDirection;\n  for(int i = 0; i < 4; i++) {\n    if(i >= numLights)\n      break;\n    diffuse = vec3(0.0, 0.0, 0.0);\n    specular = vec3(0.0, 0.0, 0.0);\n    lightDirection = normalize(u_LightPosition[i].xyz - v_Position);\n    lambertianTerm = dot(lightDirection, normal);\n    if(lambertianTerm > 0.0 && glossiness > 0.0) {\n      diffuse = material * lambertianTerm;\n      vec3 E = normalize(eyeVector);\n      vec3 R = reflect(lightDirection, normal);\n      float specularWeight = pow(max(dot(R, E), 0.0), glossiness);\n      specular = u_LightColor[i].rgb * specularWeight;\n      finalColor += diffuse + specular;\n    } else {\n      lambertianTerm = max(lambertianTerm, 0.0);\n      finalColor += u_LightColor[i].rgb * material * lambertianTerm;\n    }\n  }\n  return ambientLight + finalColor;\n}\nvoid main() {\n  vec3 material = baseColor.r >= 0.0 ? baseColor : a_x_applyMaterial(baseColor);\n  bool lightsEnabled = (u_FlatShading == 0.0) && (u_NumLights > 0.0);\n  vec3 color = lightsEnabled ? b_x_applyLight(material) : material;\n  gl_FragColor = vec4(color, opacity);\n}", [], []);
module.exports = shaders;
},{"glslify":317,"glslify/simple-adapter.js":318}],320:[function(require,module,exports){
'use strict';

/**
 * Buffer is a private class that wraps the vertex data that defines
 * the the points of the triangles that webgl draws. Each buffer 
 * maps to one attribute of a mesh.
 * 
 * @class Buffer
 * @constructor
 * 
 * @param {Number} target The bind target of the buffer to update: ARRAY_BUFFER or ELEMENT_ARRAY_BUFFER
 * @param {Object} type Array type to be used in calls to gl.bufferData.
 * @param {WebGLContext} gl The WebGL context that the buffer is hosted by.
 * 
 */
function Buffer(target, type, gl) {
    this.buffer = null;
    this.target = target;
    this.type = type;
    this.data = [];
    this.gl = gl;
}

/**
 * Creates a WebGL buffer if one does not yet exist and binds the buffer to
 * to the context.  Runs bufferData with appropriate data.
 * 
 * @method subData
 * 
 */
Buffer.prototype.subData = function subData() {
    var gl = this.gl;
    var data = [];

    // to prevent against maximum call-stack issue.
    for (var i = 0, chunk = 10000; i < this.data.length; i += chunk)
        data = Array.prototype.concat.apply(data, this.data.slice(i, i + chunk));

    this.buffer = this.buffer || gl.createBuffer();
    gl.bindBuffer(this.target, this.buffer);
    gl.bufferData(this.target, new this.type(data), gl.STATIC_DRAW);
};

module.exports = Buffer;

},{}],321:[function(require,module,exports){
'use strict';

var INDICES = 'indices';

var Buffer = require('./Buffer');

/**
 * BufferRegistry is a class that manages allocation of buffers to
 * input geometries.
 * 
 * @class BufferRegistry
 * @constructor
 * 
 * @param {WebGLContext} context WebGL drawing context to be passed to buffers.
 */
function BufferRegistry(context) {
    this.gl = context;

    this.registry = {};
    this._dynamicBuffers = [];
    this._staticBuffers = [];
    
    this._arrayBufferMax = 30000;
    this._elementBufferMax = 30000;
}

/**
 * Binds and fills all the vertex data into webgl buffers.  Will reuse buffers if
 * possible.  Populates registry with the name of the buffer, the WebGL buffer
 * object, spacing of the attribute, the attribute's offset within the buffer, 
 * and finally the length of the buffer.  This information is later accessed by
 * the root to draw the buffers.
 *
 * @method allocate
 *
 * @param {Number} geometryId Id of the geometry instance that holds the buffers.
 * @param {String} name Key of the input buffer in the geometry.
 * @param {Array} value Flat array containing input data for buffer.
 * @param {Number} spacing The spacing, or itemSize, of the input buffer.
 * @param {Boolean} dynamic Boolean denoting whether a geometry is dynamic or static.
 */
BufferRegistry.prototype.allocate = function allocate(geometryId, name, value, spacing, dynamic) {
    var vertexBuffers = this.registry[geometryId] || (this.registry[geometryId] = { keys: [], values: [], spacing: [], offset: [], length: [] });

    var j = vertexBuffers.keys.indexOf(name);
    var isIndex = name === INDICES;
    var bufferFound = false;
    var newOffset;
    var offset = 0;
    var length;
    var buffer;
    var k;

    if (j === -1) {
        j = vertexBuffers.keys.length;
        length = isIndex ? value.length : Math.floor(value.length / spacing);

        if (dynamic) {

            // Use a previously created buffer if available.

            for (k = 0; k < this._staticBuffers.length; k++) {
                
                if (isIndex === this._staticBuffers[k].isIndex) {
                    newOffset = this._staticBuffers[k].offset + value.length;
                    if ((!isIndex && newOffset < this._arrayBufferMax) || (isIndex && newOffset < this._elementBufferMax)) {
                        buffer = this._staticBuffers[k].buffer;
                        offset = this._staticBuffers[k].offset;
                        this._staticBuffers[k].offset += value.length;
                        bufferFound = true;
                        break;
                    }
                }
            }

            // Create a new static buffer in none were found.

            if (!bufferFound) {
                buffer = new Buffer(
                    isIndex ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER,
                    isIndex ? Uint16Array : Float32Array,
                    this.gl
                );

                this._staticBuffers.push({ buffer: buffer, offset: value.length, isIndex: isIndex });
            }
        }
        else {

            // For dynamic geometries, always create new buffer.

            buffer = new Buffer(
                isIndex ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER,
                isIndex ? Uint16Array : Float32Array,
                this.gl
            );

            this._dynamicBuffers.push({ buffer: buffer, offset: value.length });
        }

        // Update the registry for the spec with buffer information.

        vertexBuffers.keys.push(name);
        vertexBuffers.values.push(buffer);
        vertexBuffers.spacing.push(spacing);
        vertexBuffers.offset.push(offset);
        vertexBuffers.length.push(length);
    }
    
    var len = value.length;
    for (var k = 0; k < len; k++) {
        vertexBuffers.values[j].data[offset + k] = value[k];
    }
    vertexBuffers.values[j].subData();
};

module.exports = BufferRegistry;

},{"./Buffer":320}],322:[function(require,module,exports){
// Generates a checkerboard pattern to be used as a placeholder texture
// while an image loads over the network.

module.exports = (function() {
    var context = document.createElement('canvas').getContext('2d');
    context.canvas.width = context.canvas.height = 128;
    for (var y = 0; y < context.canvas.height; y += 16) {
        for (var x = 0; x < context.canvas.width; x += 16) {
            context.fillStyle = (x ^ y) & 16 ? '#FFF' : '#DDD';
            context.fillRect(x, y, 16, 16);
        }
    }
    
    return context.canvas;
})();

},{}],323:[function(require,module,exports){
'use strict';

var Utility = require('famous-utilities');

var vertexWrapper = require('famous-webgl-shaders').vertex;
var fragmentWrapper = require('famous-webgl-shaders').fragment;

var VERTEX_SHADER = 35633;
var FRAGMENT_SHADER = 35632;

var identityMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

var TYPES = {
    undefined: 'float ',
    1: 'float ',
    2: 'vec2 ',
    3: 'vec3 ',
    4: 'vec4 ',
    16: 'mat4 '
};

var inputTypes = {
    baseColor: 'vec3',
    normal: 'vec3',
    glossiness: 'float',
    metalness: 'float',
    positionOffset: 'vert'
};

var masks =  {
    vert: 1,
    vec3: 2,
    float: 4
};

var uniformNames = [
    'perspective',
    'view',
    'resolution',
    'transform',
    'origin',
    'size',
    'time',
    'opacity',
    'metalness',
    'glossiness',
    'baseColor',
    'normal',
    'positionOffset',
    'u_LightPosition',
    'u_LightColor',
    'u_AmbientLight',
    'u_FlatShading',
    'u_NumLights'
];

var uniformValues = [
    identityMatrix,
    identityMatrix,
    [0, 0, 0],
    identityMatrix,
    [0.5, 0.5, 0.5],
    [1, 1, 1],
    0,
    1,
    0,
    0,
    [1, 1, 1],
    [1, 1, 1],
    [0, 0, 0],
    identityMatrix,
    identityMatrix,
    [0, 0, 0],
    0,
    0
];

var attributeNames = ['pos', 'texCoord', 'normals'];
var attributeValues = [3, 2, 3, 1];

var varyingNames = ['v_TextureCoordinate', 'v_Normal', 'v_Position'];
var varyingValues = [2, 3, 3];

var header = 'precision mediump float;\n';

/**
 * A class that handles interactions with the WebGL shader program
 * used by a specific context.  It manages creation of the shader program
 * and the attached vertex and fragment shaders.  It is also in charge of
 * passing all uniforms to the WebGLContext.
 *
 * @class Program
 * @constructor
 *
 * @param {WebGL Context} gl Context to be used to create the shader program.
 */

function Program(gl) {
    this.gl = gl;
    this.textureSlots = 1;

    this.registeredMaterials = {};
    this.flaggedUniforms = [];
    this.cachedUniforms  = {};

    this.definitionVec = [];
    this.definitionFloat = [];
    this.applicationVec = [];
    this.applicationFloat = [];
    this.applicationVert = [];
    this.definitionVert = [];

    this.resetProgram();
}

/**
 * Determines whether a material has already been registered to
 * the shader program.
 *
 * @method registerMaterial
 *
 * @param {String} name Name of target input of material.
 * @param {Object} material Compiled material object being verified.
 *
 * @return {Object} Current program.
 */

Program.prototype.registerMaterial = function registerMaterial(name, material) {
    var compiled = material;
    var type = inputTypes[name];
    var mask = masks[type];

    if ((this.registeredMaterials[material._id] & mask) === mask) return;

    for (var k in compiled.uniforms) {
        if (uniformNames.indexOf(k) === -1) {
            uniformNames.push(k);
            uniformValues.push(compiled.uniforms[k]);
        }
    }

    for (var k in compiled.varyings) {
        if (varyingNames.indexOf(k) === -1) {
            varyingNames.push(k);
            varyingValues.push(compiled.varyings[k].length);
        }
    }

    for (var k in compiled.attributes) {
        if (attributeNames.indexOf(k) === -1) {
            attributeNames.push(k);
            attributeValues.push(compiled.attributes[k].length);
        }
    }

    this.registeredMaterials[material._id] |= mask;

    if (type == 'float') {
        this.definitionFloat.push(material.defines);
        this.definitionFloat.push('float fa_' + material._id + '() {\n '  + compiled.glsl + ' \n}');
        this.applicationFloat.push('if (int(abs(ID)) == ' + material._id + ') return fa_' + material._id  + '();');
    }

    if (type == 'vec3') {
        this.definitionVec.push(material.defines);
        this.definitionVec.push('vec3 fa_' + material._id + '() {\n '  + compiled.glsl + ' \n}');
        this.applicationVec.push('if (int(abs(ID.x)) == ' + material._id + ') return fa_' + material._id + '();');
    }

    if (type == 'vert') {
        this.definitionVert.push(material.defines);
        this.definitionVert.push('vec3 fa_' + material._id + '() {\n '  + compiled.glsl + ' \n}');
        this.applicationVert.push('if (int(abs(ID.x)) == ' + material._id + ') return fa_' + material._id + '();');
    }

    return this.resetProgram();
};

/**
 * Clears all cached uniforms and attribute locations.  Assembles
 * new fragment and vertex shaders and based on material from
 * currently registered materials.  Attaches said shaders to new
 * shader program and upon success links program to the WebGL
 * context.
 *
 * @method resetProgram
 *
 * @return {Program} Current program.
 */
Program.prototype.resetProgram = function resetProgram() {
    var vsChunkDefines = [];
    var vsChunkApplies = [];
    var fsChunkDefines = [];
    var fsChunkApplies = [];

    var vertexHeader = [header];
    var fragmentHeader = [header];

    var fragmentSource;
    var vertexSource;
    var material;
    var program;
    var chunk;
    var name;
    var value;
    var i;

    this.uniformLocations   = [];
    this.attributeLocations = {};

    this.attributeNames = Utility.clone(attributeNames);
    this.attributeValues = Utility.clone(attributeValues);

    this.varyingNames = Utility.clone(varyingNames);
    this.varyingValues = Utility.clone(varyingValues);

    this.uniformNames = Utility.clone(uniformNames);
    this.uniformValues = Utility.clone(uniformValues);

    this.flaggedUniforms = [];
    this.cachedUniforms = {};

    fragmentHeader.push('uniform sampler2D image;\n');
    vertexHeader.push('uniform sampler2D image;\n');

    for(i = 0; i < this.uniformNames.length; i++) {
        name = this.uniformNames[i], value = this.uniformValues[i];
        vertexHeader.push('uniform ' + TYPES[value.length] + name + ';\n');
        fragmentHeader.push('uniform ' + TYPES[value.length] + name + ';\n');
    }

    for(i = 0; i < this.attributeNames.length; i++) {
        name = this.attributeNames[i], value = this.attributeValues[i];
        vertexHeader.push('attribute ' + TYPES[value] + name + ';\n');
    }

    for(i = 0; i < this.varyingNames.length; i++) {
        name = this.varyingNames[i], value = this.varyingValues[i];
        vertexHeader.push('varying ' + TYPES[value]  + name + ';\n');
        fragmentHeader.push('varying ' + TYPES[value] + name + ';\n');
    }

    vertexSource = vertexHeader.join('') + vertexWrapper
        .replace('#vert_definitions', this.definitionVert.join('\n'))
        .replace('#vert_applications', this.applicationVert.join('\n'));

    fragmentSource = fragmentHeader.join('') + fragmentWrapper
        .replace('#vec_definitions', this.definitionVec.join('\n'))
        .replace('#vec_applications', this.applicationVec.join('\n'))
        .replace('#float_definitions', this.definitionFloat.join('\n'))
        .replace('#float_applications', this.applicationFloat.join('\n'));

    program = this.gl.createProgram();

    this.gl.attachShader(
        program,
        this.compileShader(this.gl.createShader(VERTEX_SHADER), vertexSource)
    );

    this.gl.attachShader(
        program,
        this.compileShader(this.gl.createShader(FRAGMENT_SHADER), fragmentSource)
    );

    this.gl.linkProgram(program);

    if (! this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
        console.error('link error: ' + this.gl.getProgramInfoLog(program));
        this.program = null;
    }
    else {
        this.program = program;
        this.gl.useProgram(this.program);
    }

    this.setUniforms(this.uniformNames, this.uniformValues);

    return this;
};

/**
 * Compares the value of the input uniform value against
 * the cached value stored on the Program class.  Updates and
 * creates new entries in the cache when necessary.
 *
 * @method uniformIsCached
 *
 * @param {String} targetName Key of uniform spec being evaluated.
 * @param {Number | Array} value Value of uniform spec being evaluated.
 * @return {Boolean} Value indicating whether the uniform being set
 * is cached.
 */
Program.prototype.uniformIsCached = function (targetName, value) {
    if(this.cachedUniforms[targetName] == null) {
        if (value.length) {
            this.cachedUniforms[targetName] = new Float32Array(value);
        }
        else {
            this.cachedUniforms[targetName] = value;
        }
        return false;
    }
    else if (value.length) {
        var i = value.length;
        while (i--) {
            if(value[i] !== this.cachedUniforms[targetName][i]) {
                i = value.length;
                while(i--) this.cachedUniforms[targetName][i] = value[i];
                return false;
            }
        }
    }

    else if (this.cachedUniforms[targetName] !== value) {
        this.cachedUniforms[targetName] = value;
        return false;
    }

    return true;
};

/**
 * Handles all passing of uniforms to WebGL drawing context.  This
 * function will find the uniform location and then, based on
 * a type inferred from the javascript value of the uniform, it will call
 * the appropriate function to pass the uniform to WebGL.  Finally,
 * setUniforms will iterate through the passed in shaderChunks (if any)
 * and set the appropriate uniforms to specify which chunks to use.
 *
 * @method setUniforms
 *
 * @param {Array} uniformNames Array containing the keys of all uniforms to be set.
 * @param {Array} uniformValue Array containing the values of all uniforms to be set.
 *
 * @return {Program} Current program.
 */
Program.prototype.setUniforms = function (uniformNames, uniformValue) {
    var gl = this.gl;
    var location;
    var value;
    var name;
    var flag;
    var len;
    var i;

    if (!this.program) return;

    len = uniformNames.length;
    for (i = 0; i < len; i++) {
        name = uniformNames[i];
        value = uniformValue[i];

        // Retreive the cached location of the uniform,
        // requesting a new location from the WebGL context
        // if it does not yet exist.

        location = this.uniformLocations[name] || gl.getUniformLocation(this.program, name);
        if (!location) continue;

        this.uniformLocations[name] = location;

        // Check if the value is already set for the
        // given uniform.

        if (this.uniformIsCached(name, value)) continue;

        // Determine the correct function and pass the uniform
        // value to WebGL.

        if (Array.isArray(value) || value instanceof Float32Array) {
            switch (value.length) {
                case 4:  gl.uniform4fv(location, value); break;
                case 3:  gl.uniform3fv(location, value); break;
                case 2:  gl.uniform2fv(location, value); break;
                case 16: gl.uniformMatrix4fv(location, false, value); break;
                case 1:  gl.uniform1fv(location, value); break;
                case 9:  gl.uniformMatrix3fv(location, false, value); break;
                default: throw 'cant load uniform "' + name + '" with value:' + JSON.stringify(value);
            }
        }
        else if (! isNaN(parseFloat(value)) && isFinite(value)) {
            gl.uniform1f(location, value);
        }
        else {
            throw 'set uniform "' + name + '" to invalid type :' + value;
        }
    }
    return this;
};

/**
 * Adds shader source to shader and compiles the input shader.  Checks
 * compile status and logs error if necessary.
 *
 * @method compileShader
 *
 * @param {Object} shader Program to be compiled.
 * @param {String} source Source to be used in the shader.
 *
 * @return {Object} Compiled shader.
 */
Program.prototype.compileShader = function compileShader(shader, source) {
    var i = 1;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        console.error('compile error: ' + this.gl.getShaderInfoLog(shader));
        console.error('1: ' + source.replace(/\n/g, function () { return '\n' + (i+=1) + ': '; }));
    }

    return shader;
};

module.exports = Program;

},{"famous-utilities":314,"famous-webgl-shaders":319}],324:[function(require,module,exports){
'use strict';

/**
 * Texture is a private class that stores image data
 * to be accessed from a shader or used as a render target.
 *
 * @class Texture
 * @constructor
 */
function Texture(gl, options) {
    options = options || {};
    this.id = gl.createTexture();
    this.width = options.width || 0;
    this.height = options.height || 0;
    this.format = options.format || gl.RGBA;
    this.type = options.type || gl.UNSIGNED_BYTE;
    this.gl = gl;

    this.bind();

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl[options.magFilter] || gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl[options.minFilter] || gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[options.wrapS] || gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[options.wrapS] || gl.CLAMP_TO_EDGE);

    gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.width, this.height, 0, this.format, this.type, null);

    if (options.mipmap !== false && isPowerOfTwo(this.width, this.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
    }

    this.unbind();
}

/**
 * Binds this texture as the selected target.
 *
 * @method bind
 * @chainable
 *
 * @param {Number} unit The texture slot in which to upload the data.
 *
 * @return {Object} Current texture instance.
 */
Texture.prototype.bind = function bind(unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + (unit || 0));
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    return this;
};

/**
 * Erases the texture data in the given texture slot.
 *
 * @method unbind
 * @chainable
 *
 * @param {Number} unit The texture slot in which to clean the data.
 * 
 * @return {Object} Current texture instance.
 */
Texture.prototype.unbind = function unbind(unit) {
    this.gl.activeTexture(this.gl.TEXTURE0 + (unit || 0));
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    return this;
};

/**
 * Replaces the image data in the texture with the given image.
 *
 * @method setImage
 * @chainable
 *
 * @param {Image} img The image object to upload pixel data from.
 *
 * @return {Object} Current texture instance.
 */
Texture.prototype.setImage = function setImage(img) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, this.format, this.type, img);
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    return this;
};

/**
 * Replaces the image data in the texture with an array of arbitrary data.
 *
 * @method setArray
 * @chainable
 *
 * @param {Array} input Array to be set as data to texture. 
 *
 * @return {Object} Current texture instance.
 */
Texture.prototype.setArray = function setArray(input) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.format, 1, 1, 0, this.format, this.type, new Uint8Array(input));
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    return this;
};

/**
 * Dumps the rgb-pixel contents of a texture into an array for debugging purposes
 *
 * @method readBack
 * @chainable
 *
 * @param {Number} x-offset between texture coordinates and snapshot
 * @param {Number} y-offset between texture coordinates and snapshot
 * @param {Number} x-depth of the snapshot
 * @param {Number} y-depth of the snapshot
 * 
 * @return {Array} An array of the pixels contained in the snapshot.
 */
Texture.prototype.readBack = function readBack(x, y, width, height) {
    var gl = this.gl;
    var pixels;
    x = x || 0;
    y = y || 0;
    width = width || this.width;
    height = height || this.height;
    var fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) == gl.FRAMEBUFFER_COMPLETE) {
        pixels = new Uint8Array(width * height * 4);
        gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    return pixels;
};

/*
 * Determines whether both input values are power-of-two numbers.
 *
 * @method isPowerOfTwo
 * @private
 *
 * @param {Number} width Number representing texture width.
 * @param {Number} height Number representing texture height.
 *
 * @return {Boolean} Boolean denoting whether the input dimensions
 * are both power-of-two values.
 */
function isPowerOfTwo(width, height) {
    return (width & width - 1) === 0 
        && (height & height - 1) === 0;
};

module.exports = Texture;

},{}],325:[function(require,module,exports){
'use strict';

var Texture = require('./Texture');
var Program = require('./Program');
var Buffer = require('./Buffer');
var BufferRegistry = require('./BufferRegistry');
var checkers = require('./Checkerboard');

var identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

/**
 * WebGLRenderer is a private class that manages all interactions with the WebGL
 * API.  Each frame it receives commands from the compositor and updates its registries
 * accordingly.  Subsequently, the draw function is called and the WebGLRenderer
 * issues draw calls for all meshes in its registry.
 *
 * @class WebGLRenderer
 * @constructor
 *
 * @param {DOMElement} canvas The dom element that GL will paint itself onto.
 *
 */
function WebGLRenderer(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');

    if (this.container.getTarget() === document.body) {
        window.addEventListener('resize', this.updateSize.bind(this));
    }

    this.container.getTarget().appendChild(this.canvas);
    this.canvas.className = 'famous-webgl GL';

    var gl = this.gl = this.getWebGLContext(this.canvas);
    var containerSize = this.container._getSize();

    gl.polygonOffset(0.1, 0.1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.enable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);

    this.meshRegistry = {};
    this.meshRegistryKeys = [];

    /**
     * Lights
     */
    this.numLights = 0;
    this.ambientLight = [0, 0, 0];
    this.lightRegistry = {};
    this.lightRegistryKeys = [];
    this.lightPositions = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.lightColors = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    this.textureRegistry = [];
    this.texCache = {};
    this.bufferRegistry = new BufferRegistry(gl);
    this.program = new Program(gl);

    this.state = {
        boundArrayBuffer: null,
        boundElementBuffer: null,
        lastDrawn: null,
        enabledAttributes: {},
        enabledAttributesKeys: []
    };

    this.resolutionName = ['resolution'];
    this.resolutionValues = [];

    this.cachedSize = [];
    this.updateSize();

    this.projectionTransform = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
}

/**
 * Attempts to retreive the WebGLRenderer context using several
 * accessors.  For browser compatability.  Throws on error.
 *
 * @method getWebGLContext
 *
 * @param {Object} canvas Canvas element from which the context is retreived.
 *
 * @return {Object} WebGLContext of canvas element.
 */
WebGLRenderer.prototype.getWebGLContext = function getWebGLContext(canvas) {
    var names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    var context = null;
    for (var i = 0; i < names.length; i++) {
        try {
            context = canvas.getContext(names[i]);
        }
        catch (error) {
            var msg = 'Error creating WebGL context: ' + error.toString();
            console.error(msg);
        }
        if (context) {
            break;
        }
    }
    return context ? context : false;
};

/**
 * Adds a new base spec to the light registry at a given path.
 *
 * @method createLight
 *
 * @param {String} path Path used as id of new light in lightRegistry.
 *
 * @return {Object} Newly create light spec.
 */
WebGLRenderer.prototype.createLight = function createLight(path) {
    this.numLights++;
    this.lightRegistryKeys.push(path);
    return this.lightRegistry[path] = {
        color: [0, 0, 0],
        position: [0, 0, 0]
    };
};

/**
 * Adds a new base spec to the mesh registry at a given path.
 *
 * @method createMesh
 *
 * @param {String} path Path used as id of new mesh in meshRegistry.
 *
 * @return {Object} Newly create mesh spec.
 */
WebGLRenderer.prototype.createMesh = function createMesh(path) {
    this.meshRegistryKeys.push(path);
    return this.meshRegistry[path] = {
        uniformKeys: ['opacity', 'transform', 'size', 'origin', 'baseColor', 'positionOffset', 'u_FlatShading'],
        uniformValues: [1, identity, [0, 0, 0], [0, 0, 0], [0.5, 0.5, 0.5], [0, 0, 0], 0],
        buffers: {},
        geometry: null,
        drawType: null,
        texture: null
    };
};


/**
 * Receives updates to meshes and other famous renderables, and updates
 * registries accordingly.
 *
 * @method receive
 *
 * @param {String} path Path to given famous renderable used as key in registry.
 * @param {Array} commands Array of commands used to update a renderable.
 */
WebGLRenderer.prototype.receive = function receive(path, commands) {
    var bufferName, bufferValue, bufferSpacing, uniformName, uniformValue, geometryId;
    var mesh = this.meshRegistry[path];
    var light = this.lightRegistry[path];

    var command = commands.shift();
    switch (command) {

        case 'GL_SET_DRAW_OPTIONS':
            if (!mesh) mesh = this.createMesh(path);
            mesh.options = commands.shift();
            break;

        case 'GL_AMBIENT_LIGHT':
            this.ambientLight[0] = commands.shift();
            this.ambientLight[1] = commands.shift();
            this.ambientLight[2] = commands.shift();
            break;

        case 'GL_LIGHT_POSITION':
            if (!light) light = this.createLight(path);
            light.position[0] = commands.shift();
            light.position[1] = commands.shift();
            light.position[2] = commands.shift();
            break;

        case 'GL_LIGHT_COLOR':
            if (!light) light = this.createLight(path);
            light.color[0] = commands.shift();
            light.color[1] = commands.shift();
            light.color[2] = commands.shift();
            break;

        case 'MATERIAL_INPUT':
            if (!mesh) mesh = this.createMesh(path);
            var name = commands.shift();
            var mat = commands.shift();
            mesh.uniformValues[name === 'baseColor' ? 4 : 5][0] = -mat._id;
            if (mat.texture) mesh.texture = handleTexture.call(this, mat.texture);
            this.program.registerMaterial(name, mat);
            this.updateSize();
            break;

        case 'GL_SET_GEOMETRY':
            if (!mesh) mesh = this.createMesh(path);
            mesh.geometry = commands.shift();
            mesh.drawType = commands.shift();
            mesh.dynamic = commands.shift();
            break;

        case 'GL_UNIFORMS':
            if (!mesh) mesh = this.createMesh(path);
            uniformName = commands.shift();
            uniformValue = commands.shift();
            var index = mesh.uniformKeys.indexOf(uniformName);
            if (index === -1) {
                mesh.uniformKeys.push(uniformName);
                mesh.uniformValues.push(uniformValue);
            }
            else {
                mesh.uniformValues[index] = uniformValue;
            }
            break;

        case 'GL_BUFFER_DATA':
            geometryId = commands.shift();
            bufferName = commands.shift();
            bufferValue = commands.shift();
            bufferSpacing = commands.shift();
            this.bufferRegistry.allocate(geometryId, bufferName, bufferValue, bufferSpacing);
            break;

        case 'WITH': commands.unshift(command); return;
    }
};

/**
 * Triggers the 'draw' phase of the WebGLRenderer.  Iterates through registries
 * to set uniforms, set attributes and issue draw commands for renderables.
 *
 * @method draw
 *
 * @param {Object} renderState Parameters provided by the compositor, that
 * affect the rendering of all renderables.
 */
WebGLRenderer.prototype.draw = function draw(renderState) {
    var mesh;
    var buffers;
    var size;
    var light;
    var stride;

    /**
     * Update lights
     */
    for(var i = 0; i < this.lightRegistryKeys.length; i++) {
        light = this.lightRegistry[this.lightRegistryKeys[i]];
        stride = i * 4;
        // Build the light positions' 4x4 matrix
        this.lightPositions[0 + stride] = light.position[0];
        this.lightPositions[1 + stride] = light.position[1];
        this.lightPositions[2 + stride] = light.position[2];
        // Build the light colors' 4x4 matrix
        this.lightColors[0 + stride] = light.color[0];
        this.lightColors[1 + stride] = light.color[1];
        this.lightColors[2 + stride] = light.color[2];
    }
    this.program.setUniforms(['u_NumLights'], [this.numLights]);
    this.program.setUniforms(['u_AmbientLight'], [this.ambientLight]);
    this.program.setUniforms(['u_LightPosition'], [this.lightPositions]);
    this.program.setUniforms(['u_LightColor'], [this.lightColors]);

    this.projectionTransform[11] = renderState.perspectiveTransform[11];

    this.program.setUniforms(['perspective', 'time', 'view'], [this.projectionTransform, Date.now()  % 100000 / 1000, renderState.viewTransform]);

    for(var i = 0; i < this.meshRegistryKeys.length; i++) {
        mesh = this.meshRegistry[this.meshRegistryKeys[i]];
        buffers = this.bufferRegistry.registry[mesh.geometry];

        if (!buffers) continue;

        if (mesh.options) this.handleOptions(mesh.options);
        if (mesh.texture) mesh.texture.bind();

        this.program.setUniforms(mesh.uniformKeys, mesh.uniformValues);
        this.drawBuffers(buffers, mesh.drawType, mesh.geometry);

        if (mesh.texture) mesh.texture.unbind();
        if (mesh.options) this.resetOptions(mesh.options);
    }
};


/**
 * Loads the buffers and issues the draw command for a geometry.
 *
 * @method drawBuffers
 *
 * @param {Object} vertexBuffers All buffers used to draw the geometry.
 * @param {Number} mode Enumerator defining what primitive to draw
 * @param {Number} id ID of geometry being drawn.
 */
WebGLRenderer.prototype.drawBuffers = function drawBuffers(vertexBuffers, mode, id) {
    var gl = this.gl;
    var length = 0;
    var attribute;
    var location;
    var spacing;
    var offset;
    var buffer;
    var iter;
    var j;

    iter = vertexBuffers.keys.length;
    for (var i = 0; i < iter; i++) {
        attribute = vertexBuffers.keys[i];

        // Do not set vertexAttribPointer if index buffer.

        if (attribute === 'indices') {
            j = i; continue;
        }

        // Retreive the attribute location and make sure it is enabled.

        location = this.program.attributeLocations[attribute];

        if (location === -1) continue;
        if (location === undefined) {
            location = gl.getAttribLocation(this.program.program, attribute);
            this.program.attributeLocations[attribute] = location;
            if (location === -1) continue;
        }

        if (!this.state.enabledAttributes[attribute]) {
            gl.enableVertexAttribArray(location);
            this.state.enabledAttributes[attribute] = true;
            this.state.enabledAttributesKeys.push(attribute);
        }

        // Retreive buffer information used to set attribute pointer.

        buffer = vertexBuffers.values[i];
        spacing = vertexBuffers.spacing[i];
        offset = vertexBuffers.offset[i];
        length = vertexBuffers.length[i];

        // Skip bindBuffer if buffer is currently bound.

        if (this.state.boundArrayBuffer !== buffer) {
            gl.bindBuffer(buffer.target, buffer.buffer);
            this.state.boundArrayBuffer = buffer;
        }

        if (this.state.lastDrawn !== id) {
            gl.vertexAttribPointer(location, spacing, gl.FLOAT, gl.FALSE, 0, 4 * offset);
        }
    }

    // Disable any attributes that not currently being used.

    for(var i = 0, len = this.state.enabledAttributesKeys.length; i < len; i++) {
        var key = this.state.enabledAttributes[this.state.enabledAttributesKeys[i]];
        if (this.state.enabledAttributes[key] && vertexBuffers.keys.indexOf(key) === -1) {
            gl.disableVertexAttribArray(this.program.attributeLocations[key]);
            this.state.enabledAttributes[key] = false;
        }
    }

    if (length) {

        // If index buffer, use drawElements.

        if (j !== undefined) {
            buffer = vertexBuffers.values[j];
            offset = vertexBuffers.offset[j];
            spacing = vertexBuffers.spacing[j];
            length = vertexBuffers.length[j];

            // Skip bindBuffer if buffer is currently bound.

            if (this.state.boundElementBuffer !== buffer) {
                gl.bindBuffer(buffer.target, buffer.buffer);
                this.state.boundElementBuffer = buffer;
            }

            gl.drawElements(mode, length, gl.UNSIGNED_SHORT, 2 * offset);
        }
        else {
            gl.drawArrays(mode, 0, length);
        }
    }

    this.state.lastDrawn = id;
};

/**
 * Allocates an array buffer where vertex data is sent to via compile.
 *
 * @method renderOffscreen
 *
 * @param {Function} callback The render function to be called after setup and before cleanup.
 * @param {Array} size Size of framebuffer being drawn to.
 * @param {Object} texture Location where the render data is stored.
 */
function renderOffscreen(callback, size, texture) {
    var gl = this.gl;

    var framebuffer  = this.framebuffer ? this.framebuffer : this.framebuffer = gl.createFramebuffer();
    var renderbuffer = this.renderbuffer ? this.renderbuffer : this.renderbuffer = gl.createRenderbuffer();

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    if (size[0] != renderbuffer.width || size[1] != renderbuffer.height) {
        renderbuffer.width = size[0];
        renderbuffer.height = size[1];
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, size[0], size[1]);
    }

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture.id, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

    if (this.debug) checkFrameBufferStatus(gl);

    callback.call(this);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
};

/**
 * Diagnoses the failed intialization of an FBO.
 *
 * @method checkFrameBufferStatus
 *
 * @param {Object} the WebGLContext that owns this FBO.
 */
function checkFrameBufferStatus(gl) {
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

    switch (status) {
        case gl.FRAMEBUFFER_COMPLETE:
            break;
        case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_ATTACHMENT"); break;
        case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT"); break;
        case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
            throw("Incomplete framebuffer: FRAMEBUFFER_INCOMPLETE_DIMENSIONS"); break;
        case gl.FRAMEBUFFER_UNSUPPORTED:
            throw("Incomplete framebuffer: FRAMEBUFFER_UNSUPPORTED"); break;
        default:
            throw("Incomplete framebuffer: " + status);
    }
};

/**
 * Updates the width and height of parent canvas, sets the viewport size on
 * the WebGL context and updates the resolution uniform for the shader program.
 * Size is retreived from the container object of the renderer.
 *
 * @method updateSize
 */
WebGLRenderer.prototype.updateSize = function updateSize() {
    var newSize = this.container._getSize();

    var width = newSize[0];
    var height = newSize[1];

    this.cachedSize[0] = width;
    this.cachedSize[1] = height;
    this.cachedSize[2] = (width > height) ? width : height;

    this.canvas.width  = width;
    this.canvas.height = height;

    this.gl.viewport(0, 0, this.cachedSize[0], this.cachedSize[1]);

    this.resolutionValues[0] = this.cachedSize;
    this.program.setUniforms(this.resolutionName, this.resolutionValues);
};

/**
 * Updates the state of the WebGL drawing context based on custom parameters
 * defined on a mesh.
 *
 * @method handleOptions
 *
 * @param {Object} options Draw state options to be set to the context.
 */
WebGLRenderer.prototype.handleOptions = function handleOptions(options) {
    var gl = this.gl;
    if (!options) return;
    if (options.blending) gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
};

/**
 * Resets the state of the WebGL drawing context to default values.
 *
 * @method resetOptions
 *
 * @param {Object} options Draw state options to be set to the context.
 */
WebGLRenderer.prototype.resetOptions = function resetOptions(options) {
    var gl = this.gl;
    if (!options) return;
    if (options.blending) gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

/**
 * Loads an image from a string or Image object and executes a callback function.
 *
 * @method loadImage
 * @private
 *
 * @param {Object | String} img The input image data to load as an asset.
 * @param {Function} callback The callback function to be fired when
 * the image has finished loading.
 *
 * @return {Object} Image object being loaded.
 */
function loadImage (img, callback) {
    var obj = (typeof img === 'string' ? new Image() : img) || {};
    obj.crossOrigin = 'anonymous';
    if (! obj.src) obj.src = img;
    if (! obj.complete) obj.onload = function () { callback(obj); };
    else callback(obj);
    return obj;
}

/**
 * Handles loading of texture objects.
 *
 * @method handleTexture
 * @private
 *
 * @param {Object} input The input texture object collected from mesh.
 *
 * @return {Object} Texture instance linked to input data.
 */
function handleTexture(input) {
    var source = input.data;
    var textureId = input.id;
    var options = input.options;
    var texture = this.textureRegistry[textureId];

    if (!texture) {
        if (Array.isArray(source)) {
            texture = new Texture(this.gl, options);
            texture.setArray(source);
        }

        else if (window && source instanceof window.HTMLVideoElement) {
            texture = new Texture(this.gl, options);
            texture.src = texture;
            texture.setImage(checkers);
            source.addEventListener('loadeddata', function(x) {
                texture.setImage(source);
                setInterval(function () { texture.setImage(source); }, 16);
            });
        }

        else if ('string' === typeof source) {
            texture = new Texture(this.gl, options);
            texture.setImage(checkers);
            loadImage(source, function (img) {
                texture.setImage(img);
            });
        }

        this.textureRegistry[textureId] = texture;
    }

    return texture;
}

module.exports = WebGLRenderer;

},{"./Buffer":320,"./BufferRegistry":321,"./Checkerboard":322,"./Program":323,"./Texture":324}],326:[function(require,module,exports){
module.exports = {
    Buffer: require('./Buffer'),
    BufferRegistry: require('./BufferRegistry'),
    Checkerboard: require('./Checkerboard'),
    Program: require('./Program'),
    WebGLRenderer: require('./WebGLRenderer'),
    Texture: require('./Texture')
};

},{"./Buffer":320,"./BufferRegistry":321,"./Checkerboard":322,"./Program":323,"./Texture":324,"./WebGLRenderer":325}],327:[function(require,module,exports){
'use strict';

var VirtualElement = require('famous-dom-renderers').VirtualElement;
var WebGLRenderer = require('famous-webgl-renderers').WebGLRenderer;
var Camera = require('famous-components').Camera;
var VirtualWindow = require('./VirtualWindow');

/**
 * Instantiates a new Compositor, used for routing commands received from the
 * WebWorker to the WebGL and DOM renderer.
 * 
 * @class Compositor
 * @constructor
 */
function Compositor() {
    this._contexts = {};
    this._outCommands = [];
    this._inCommands = [];

    this._renderers = [];
    this._renderState = {
        projectionType: Camera.ORTHOGRAPHIC_PROJECTION,
        perspectiveTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        viewTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    };

    this._virtualWindow = new VirtualWindow(this);
}

/**
 * Exposes a key-value-mapping of commands to the renderer they should be
 * routed to.
 * 
 * @type {Object}
 */
Compositor.CommandsToOutput = {
    CHANGE_TRANSFORM_ORIGIN: 'DOM',
    CHANGE_TRANSFORM: 'DOM',
    CHANGE_PROPERTY: 'DOM',
    CHANGE_CONTENT: 'DOM',
    CHANGE_SIZE: 'DOM',
    ADD_EVENT_LISTENER: 'DOM',
    ADD_CLASS:'DOM',
    REMOVE_CLASS:'DOM',
    EVENT_PROPERTIES:'DOM',
    EVENT_END:'DOM',
    CHANGE_ATTRIBUTE:'DOM',
    CHANGE_TAG:'DOM',
    RECALL: 'DOM',
    GL_UNIFORMS: 'GL',
    GL_BUFFER_DATA: 'GL',
    GL_SET_GEOMETRY: 'GL',
    GL_AMBIENT_LIGHT: 'GL',
    GL_LIGHT_POSITION: 'GL',
    GL_LIGHT_COLOR: 'GL',
    GL_SET_DRAW_OPTIONS: 'GL',
    MATERIAL_INPUT: 'GL'
};

/**
 * Schedules an event to be sent to the WebWorker the next time the out command
 * queue is being flushed.
 *
 * @method sendEvent
 * @private
 * 
 * @param  {String} path    render path to the node the event should be
 *                          triggered on (*targeted event*)
 * @param  {String} ev      event type
 * @param  {Object} payload event object (serializable using structured
 *                          cloning algorithm)
 */
Compositor.prototype.sendEvent = function sendEvent(path, ev, payload) {
    this._outCommands.push('WITH', path, 'TRIGGER', ev, payload);
};

/**
 * Internal helper method used by `drawCommands`.
 * 
 * @method handleWith
 * @private
 * 
 * @param  {Array} commands     remaining message queue received from the
 *                              WebWorker, used to shift single messages from
 */
Compositor.prototype.handleWith = function handleWith (commands) {
    var path = commands.shift();
    var pathArr = path.split('/');
    var context = this.getOrSetContext(pathArr.shift());
    var pointer = context;
    var index = pathArr.shift();
    var parent = context.DOM;
    while (pathArr.length) {
        if (!pointer[index]) pointer[index] = {};
        pointer = pointer[index];
        if (pointer.DOM) parent = pointer.DOM;
        index = pathArr.shift();
    }
    if (!pointer[index]) pointer[index] = {};
    pointer = pointer[index];
    while (commands.length) {
        var commandOutput = Compositor.CommandsToOutput[commands[0]];
        switch (commandOutput) {
            case 'DOM':
                var element = parent.getOrSetElement(path, index, context.DOM);
                element.receive(commands);
                if (!pointer.DOM) {
                    pointer.DOM = element;
                    this._renderers.push(element);
                }
                break;

            case 'GL':
                if (!context.GL) {
                    var webglrenderer = new WebGLRenderer(context.DOM);
                    context.GL = webglrenderer;
                    this._renderers.push(webglrenderer);
                }
                context.GL.receive(path, commands);
                break;
            default: return;
        }
    }
};

/**
 * Retrieves the top-level VirtualElement attached to the passed in document
 * selector.
 * If no such element exists, one will be instantiated, therefore representing
 * the equivalent of a Context in the Main Thread.
 *
 * @method getOrSetContext
 * @private
 * 
 * @param  {String} selector            document query selector used for
 *                                      retrieving the DOM node the
 *                                      VirtualElement should be attached to
 * @return {Object} result              
 * @return {VirtualElement} result.DOM  final VirtualElement
 */
Compositor.prototype.getOrSetContext = function getOrSetContext(selector) {
    if (this._contexts[selector]) return this._contexts[selector];
    var result = {
        DOM: new VirtualElement(document.querySelector(selector), selector, this)
    };
    result.DOM.setMatrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    this._contexts[selector] = result;
    return result;
};

/**
 * Internal helper method used by `drawCommands`.
 *
 * @method giveSizeFor
 * @private
 * 
 * @param  {Array} commands     remaining message queue received from the
 *                              WebWorker, used to shift single messages from
 */
Compositor.prototype.giveSizeFor = function giveSizeFor(commands) {
    var selector = commands.shift();
    var size = this.getOrSetContext(selector).DOM._getSize();
    this.sendResize(selector, size);
    var _this = this;
    if (selector === 'body')
        window.addEventListener('resize', function() {
            if (!_this._sentResize) {
                _this.sendResize(selector, _this.getOrSetContext(selector).DOM._getSize());
            }
        });
};

/**
 * Internal helper method used for notifying the WebWorker about externally
 * resized contexts (e.g. by resizing the browser window).
 *
 * @method sendResize
 * @private
 *
 * @param  {String} selector    render path to the node (context) that should
 *                              be resized
 * @param  {Array} size         new context size
 */
Compositor.prototype.sendResize = function sendResize (selector, size) {
    this._outCommands.push('WITH', selector, 'TRIGGER', 'resize', size);
    this._sentResize = true;
};

/**
 * Processes the previously via `receiveCommands` updated incoming "in"
 * command queue.
 * Called by ThreadManager.
 *
 * @method drawCommands
 *
 * @return {Array} outCommands  set of commands to be sent back to the
 *                              WebWorker
 */
Compositor.prototype.drawCommands = function drawCommands() {
    var commands = this._inCommands;
    var command;
    while (commands.length) {
        command = commands.shift();
        switch (command) {
            case 'WITH':
                this.handleWith(commands);
                break;
            case 'PROXY':
                this._virtualWindow.listen(commands.shift(), commands.shift());
                break;
            case 'NEED_SIZE_FOR':
                this.giveSizeFor(commands);
                break;
            case 'PINHOLE_PROJECTION':
                this._renderState.projectionType = Camera.PINHOLE_PROJECTION;
                this._renderState.perspectiveTransform[11] = -1/commands.shift();
                break;
            case 'ORTHOGRAPHIC_PROJECTION':
                this._renderState.projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
                this._renderState.perspectiveTransform[11] = 0;
                break;
            case 'CHANGE_VIEW_TRANSFORM':
                this._renderState.viewTransform[0] = commands.shift();
                this._renderState.viewTransform[1] = commands.shift();
                this._renderState.viewTransform[2] = commands.shift();
                this._renderState.viewTransform[3] = commands.shift();

                this._renderState.viewTransform[4] = commands.shift();
                this._renderState.viewTransform[5] = commands.shift();
                this._renderState.viewTransform[6] = commands.shift();
                this._renderState.viewTransform[7] = commands.shift();

                this._renderState.viewTransform[8] = commands.shift();
                this._renderState.viewTransform[9] = commands.shift();
                this._renderState.viewTransform[10] = commands.shift();
                this._renderState.viewTransform[11] = commands.shift();

                this._renderState.viewTransform[12] = commands.shift();
                this._renderState.viewTransform[13] = commands.shift();
                this._renderState.viewTransform[14] = commands.shift();
                this._renderState.viewTransform[15] = commands.shift();
                break;
        }
    }

    for (var i = 0; i < this._renderers.length; i++) {
        this._renderers[i].draw(this._renderState);
    }

    return this._outCommands;
};

/**
 * Used by ThreadManager to update the interal queue of incoming commands.
 * Receiving commands does not immediately start the rederning process.
 * 
 * @param  {Array} commands     command queue to be processed by the
 *                              compositor's `drawCommands` method
 */
Compositor.prototype.receiveCommands = function receiveCommands(commands) {
    var len = commands.length;
    for (var i = 0; i < len; i++) {
        this._inCommands.push(commands[i]);
    }
};

/**
 * Flushes the queue of outgoing "out" commands.
 * Called by ThreadManager.
 *
 * @method clearCommands
 */
Compositor.prototype.clearCommands = function clearCommands() {
    this._outCommands.length = 0;
    this._sentResize = false;
};

module.exports = Compositor;

},{"./VirtualWindow":330,"famous-components":222,"famous-dom-renderers":299,"famous-webgl-renderers":326}],328:[function(require,module,exports){
'use strict';

/**
 * The ThreadManager is being updated by an Engine by consecutively calling its
 * `update` method. It can either manage a real Web-Worker or the global
 * Famous core singleton.
 *
 * @example
 * var compositor = new Compositor();
 * 
 * // Using a Web Worker
 * var worker = new Worker('worker.bundle.js');
 * var threadmanger = new ThreadManager(worker, compositor);
 * 
 * // Without using a Web Worker
 * var threadmanger = new ThreadManager(Famous, compositor);
 * 
 * @class  ThreadManager
 * @constructor
 * 
 * @param {Famous|Worker} thread        The thread being used to receive
 *                                      messages from and post messages to.
 *                                      Expected to expose a WebWorker-like
 *                                      API, which means providing a way to
 *                                      listen for updates by setting its
 *                                      `onmessage` property and sending
 *                                      updates using `postMessage`.
 * @param {Compositor} compositor       an instance of Compositor used to
 *                                      extract enqueued draw commands from to
 *                                      be sent to the thread
 */
function ThreadManager (thread, compositor) {
	this._thread = thread;
	this._compositor = compositor;

    var _this = this;
	this._thread.onmessage = function (ev) {
        _this._compositor.receiveCommands(ev.data ? ev.data : ev);
    };
    this._thread.onerror = function (error) {
        console.error(error);
    };
}

/**
 * Update method being invoked by the Engine on every `requestAnimationFrame`.
 * Used for updating the notion of time within the managed thread by sending
 * a FRAME command and sending messages to 
 * 
 * @method update
 * 
 * @param  {Number} time unix timestamp to be passed down to the worker as a
 *                       FRAME command
 */
ThreadManager.prototype.update = function update (time) {
    this._thread.postMessage(['FRAME', time]);
    var threadMessages = this._compositor.drawCommands();
    this._thread.postMessage(threadMessages);
    this._compositor.clearCommands();
};

module.exports = ThreadManager;

},{}],329:[function(require,module,exports){
'use strict';

function VirtualObservable(target, compositor) {
    this._compositor = compositor;
    this._listeners = Object.create(null);
    this._target = target;
}

VirtualObservable.prototype.listen = function listen(type) {
    if (!this._listeners[type]) {
        var _this = this;
        var listener = function(ev) {
            ev = _this._serializeEvent(ev);
            _this._compositor.sendEvent(_this._target, type, ev);
        };
        window[this._target].addEventListener(type, listener);
        this._listeners[type] = listener;
    }

    return this;
};

VirtualObservable.prototype._serializeEvent = function _serializeEvent(ev) {
    var serializeableEvent = {};
    for (var key in ev) {
        switch (typeof ev[key]) {
            case 'object':
            case 'function':
                break;
            default:
                serializeableEvent[key] = ev[key];
                break;
        }
    }
    return serializeableEvent;
};

module.exports = VirtualObservable;

},{}],330:[function(require,module,exports){
'use strict';

var VirtualObservable = require('./VirtualObservable');

function VirtualWindow(compositor) {
    this._compositor = compositor;
    this._virtualObservables = Object.create(null);
}

VirtualWindow.prototype.listen = function listen(target, type) {
    if (!this._virtualObservables[target]) {
        this._virtualObservables[target] = new VirtualObservable(target, this._compositor);
    }
    this._virtualObservables[target].listen(type);
    return this;
};

module.exports = VirtualWindow;

},{"./VirtualObservable":329}],331:[function(require,module,exports){
'use strict';

module.exports = {
    Compositor: require('./Compositor'),
    ThreadManager: require('./ThreadManager')
};

},{"./Compositor":327,"./ThreadManager":328}],332:[function(require,module,exports){
'use strict';

/**
 * A stateless shim for hash routing. Used by router.
 *   Supports hash bang routing and HTML5 pushState.
 *   Falls back to hash bang urls when pushState is not supported.
 *   Implements subset of W3C spec in respect to
 *   http://www.w3.org/TR/2011/WD-html5-20110113/history.html#history-0
 *
 * @History
 * @class
 * @constructor
 * @private
 *
 * @example
 * var history = History();
 * console.log(history.hashBangUrls);
 * history.pushState({}, document.title, '/route');
 *
 * @param {Object} options
 * @param {Boolean} options.hashBangUrls force history to use URLs
 *   in the form of /#!/route
 * @param {String} root
 */
function History(options) {
    if (!(this instanceof History)) return new History(options);

    options = options || {};
    this._root = options.root || '';
    this._sessionHistorySupport = sessionHistorySupport;
    this.hashBangUrls = options.hashBangUrls || !this._sessionHistorySupport;
    this._location = window.location;
}

/**
 * @property {Boolean} hashBangUrls
 * @readonly
 */
History.prototype.hashBangUrls = false;

/**
 * Register a function to be invoked on every state change.
 *
 * @method onStateChange
 * @chainable
 *
 * @param {Function} handler callback to invoke on state change
 *
 * @return {History} this
 */
History.prototype.onStateChange = function onStateChange(handler) {
    // prefer HTML5 history API over hashchange when possible
    if (this._sessionHistorySupport) {
        window.addEventListener('popstate', handler);
        window.addEventListener('pushstate', handler);
    }
    else if (this.hashBangUrls && 'onhashchange' in window) {
        window.addEventListener('hashchange', handler);
    }
    else {
        // only possible solution at this point is to use an ugly combination
        // of setInterval and window.location.pathname
    }
    return this;
};

/**
 * Deregister a state change handler that has been previously registered
 *   through onStateChange.
 *
 * @method offStateChange
 * @chainable
 *
 * @param {Function} handler handler previously registered through onStateChange
 *
 * @return {History} this
 */
History.prototype.offStateChange = function offStateChange(handler) {
    window.removeEventListener('popstate', handler);
    window.removeEventListener('pushstate', handler);
    window.removeEventListener('hashchange', handler);
    return this;
};

/**
 * Shim for window.history.pushState
 * 
 * @method pushState
 * @chainable
 *
 * @params {Object} data state object passed through session API if possible,
 *   not accessable later on, used to make arguments list complaint with W3C
 *   spec
 * @params {String=document.title} title new document title, not associated with
 *   new state
 * @params {String} url
 *
 * @return {History} this
 */
History.prototype.pushState = function pushState(data, title, url) {
    document.title = title || document.title;
    if (this.hashBangUrls) {
        if (this._sessionHistorySupport) {
            window.history.pushState(data, title, '#!' + url);
        }
        else {
            window.location.hash = url;
        }
    }
    else {
        window.history.pushState(data, title, url);
    }
    return this;
};

/**
 * Shim for window.history.replaceState
 * 
 * @method replaceState
 * @chainable
 *
 * @params {Object} data state object passed through session API if possible,
 *   not accessable later on, used to make arguments list complaint with W3C
 *   spec
 * @params {String=document.title} title new document title, not associated with
 *   new state
 * @params {String} url
 *
 * @return {History} this
 */
History.prototype.replaceState = function replaceState(data, title, url) {
    document.title = title || document.title;
    if (this.hashBangUrls) {
        if (this._sessionHistorySupport) {
            window.history.replaceState(data, title, '#!' + url);
        }
        else {
            url = ('' + window.location).split('#')[0] + '#!' + url;
            window.location.replace(url);
        }
    }
    else {
        window.history.replaceState(data, title, url);
    }
    return this;
};

/**
 * Return current normalized state (routed pathname).
 * Not compliant with [W3C spec 5.4 Session history and
 * navigation](http://www.w3.org/TR/2011/WD-html5-20110113/history.html)
 *
 * @method getState
 *
 * @return {String|null} state as normalized pathname
 */
History.prototype.getState = function getState() {
    if (!this._location.pathname.match('^' + this._root)) {
        return null;
    }
    if (this.hashBangUrls) {
        return this._location.hash.substring(2);
    }
    else {
        return decodeURI(this._location.pathname).substring(this._root.length);
    }
};

var sessionHistorySupport = window.history && window.history.pushState && window.history.replaceState;

module.exports = History;

},{}],333:[function(require,module,exports){
'use strict';

var _History = require('./History');

/**
 * A simple router supporting HTML5 pushState and hashbang  routing ("#!/").
 * 
 * @example
 * var router = Router({
 *     '/example-route-0': function() {
 *         console.log('/example-route-0');
 *     },
 *     '/example-route-1': function() {
 *         console.log('/example-route-1');
 *     },
 *     '/example-route-2': function() {
 *         console.log('/example-route-2');
 *     },
 *     '/example-route-3': function() {
 *         console.log('/example-route-3');
 *     }
 * });
 *
 * var currentState = 0;
 * var interval = setInterval(function() {
 *     if (currentState === 4) return clearTimeout(interval);
 *     router.navigate('/example-route-' + currentState, { invoke: true });
 *     currentState++;
 * }, 1000);
 * 
 * @class Router
 * @constructor
 *
 * @param {Object} routes
 * @param {Object} options
 * @param {Boolean} options.silent
 * @param {Boolean} options.hashBangUrls
 * @param {Object} options.proxy
 * @param {String} options.root
 * @param {Boolean} options.validate check for unknown routes
 */
function Router(routes, options) {
    if (!(this instanceof Router)) return new Router(routes, options);
    
    routes = routes || {};
    options = options || {};

    this._root = options.root || '';

    this._routes = [];
    this.proxy = options.proxy || {};
    if (options.validate) this.validate = true;

    // Avoids cylic routing by storing the last routed state
    // Seems like W3C spec doesn't mention if pushState event should be
    // dispatched on page load.
    this._lastState = null;

    _addInitialRoutes.call(this, routes);

    this._history = _History({
        hashBangUrls: options.hashBangUrls,
        root: this._root
    }).onStateChange(_onStateChange.bind(this));

    if (!options.silent) this.start();
}

/**
 * Starts the router by invoking the route handler bound to the current
 *   pathname. Will be called by constructor, unless silent option is
 *   in use.
 *
 * @method start
 * @chainable
 *
 * @return {Router} this
 */
Router.prototype.start = function start() {
    this.invoke();
    return this;
};

/**
 * Navigates to the given route. If no route is give, navigate to the current
 *   pathname (used during initialization).
 *
 * @method navigate
 * @chainable
 *
 * @param {String} [state=current pathname]
 * @param {Object} options
 * @param {Boolean} options.replace
 * @param {Boolean} options.invoke
 *
 * @return {Router} this
 */
Router.prototype.navigate = function navigate(state, options) {
    options = options || {};
    state = state || this._history.getState();
    if (this._lastState === state) return this;

    var method = options.replace ? 'replaceState' : 'pushState';
    this._history[method](null, null, state);

    if (options.invoke) this.invoke();
    return this;
};

/**
 * Dynamically adds a route to the register.
 *
 * @method addRoute
 * @chainable
 *
 * @param {String|RegExp} route
 * @param {Function} handler
 *
 * @return {Router} this
 */
Router.prototype.addRoute = function addRoute(route, handler) {
    if (typeof route === 'string') route = _createRegExpRoute(route);
    this._routes.push({ regExp: route, handler: handler });
    return this;
};

/**
 * Invokes the handler bound to the given state.
 *
 * @method invoke
 * @chainable
 *
 * @param {String} [state=current pathname] route
 *
 * @return {Router} this
 */
Router.prototype.invoke = function invoke(state) {
    if (this._lastState === state) return this;
    state = state || this._history.getState();
    if (state === null) return;
    var unknown = this._routes.every(function (route) {
        var result = _checkRoute.call(this, route, state);
        if (result) {
            if (typeof route.handler === 'string' && this.proxy[route.handler]) {
                this.proxy[route.handler].apply(null, result);
            }
            else {
                route.handler.apply(null, result);
            }
        }
        return !result;
    }.bind(this));
    if (unknown && this.validate) throw new Error('Unknown route');
    return this;
};

function _checkRoute(route, state) {
    var result = state.match(route.regExp);
    if (!result) return false;

    // no support for nested capturing groups
    result = result.slice(1);
    return result;
}

function _createRegExpRoute(route) {
    // TODO could be extended to splats etc.
    route = route.replace(/\:\w+/, function (param) {
        param = param.substring(1);
        return '(' + param + ')';
    });
    return new RegExp('^' + route + '$');
}

function _onStateChange() {
    /* jshint validthis: true */
    this.invoke();
}

function _addInitialRoutes(routes, scope) {
    /* jshint validthis: true */
    scope = scope || '';
    if (Array.isArray(routes)) {
        // composing nested sets of regular expressions of regular expressions
        // including lookarounds might lead to unexpected behavior. For now,
        // those can't be traversed.
        routes.forEach(function(routeSpec) {
            this.addRoute(routeSpec.route, routeSpec.handler);
        }.bind(this));
    } else {
        for (var route in routes) {
            var handler = routes[route];
            if (handler instanceof Function || typeof handler === 'string') {
                this.addRoute(scope + route, routes[route]);
            }
            else {
                _addInitialRoutes.call(this, routes[route], scope + route);
            }
        }
    }
}

module.exports = Router;

},{"./History":332}],334:[function(require,module,exports){
'use strict';

module.exports = {
    History: require('./History'),
    Router: require('./Router')
};

},{"./History":332,"./Router":333}],335:[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet()
    sheet.cssText = css;
    return sheet.ownerNode;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }

    head.appendChild(style);
    return style;
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    return document.createStyleSheet(url).ownerNode;
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    head.appendChild(link);
    return link;
  }
};

},{}],336:[function(require,module,exports){
var css = "html {\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    overflow: hidden;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\nbody {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-font-smoothing: antialiased;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-perspective: 0;\n    perspective: none;\n    overflow: hidden;\n}\n\n.famous-container, .famous-group {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    right: 0px;\n    overflow: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    pointer-events: none;\n}\n\n.famous-group {\n    width: 0px;\n    height: 0px;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\n.fa-surface {\n    position: absolute;\n    -webkit-transform-origin: 0% 0%;\n    transform-origin: 0% 0%;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    -webkit-transform-style: flat;\n    transform-style: preserve-3d; /* performance */\n    -webkit-tap-highlight-color: transparent;\n    pointer-events: auto;\n    z-index: 1; /* HACK to account for browser issues with eventing on the same z-plane*/\n}\n\n.fa-content {\n    position: absolute;\n}\n\n.famous-container-group {\n    position: relative;\n    width: 100%;\n    height: 100%;\n}\n\n.fa-container {\n    position: absolute;\n    -webkit-transform-origin: center center;\n    transform-origin: center center;\n    overflow: hidden;\n}\n\ncanvas.famous-webgl {\n    pointer-events: none;\n    position: absolute;\n    z-index: 9999;\n    top: 0px;\n    left: 0px;\n}"; (require("/Users/matthew/Code/github.famo.us/platform/stylesheets/node_modules/cssify"))(css); module.exports = css;
},{"/Users/matthew/Code/github.famo.us/platform/stylesheets/node_modules/cssify":335}],337:[function(require,module,exports){
'use strict';

require('./famous.css');

},{"./famous.css":336}],338:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],339:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":342,"dup":2}],340:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":339,"./TweenTransition":341,"dup":3}],341:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":338,"dup":4}],342:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],343:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":338,"./MultipleTransition":339,"./Transitionable":340,"./TweenTransition":341,"./after":342,"dup":6}],344:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],345:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":348,"dup":2}],346:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":345,"./TweenTransition":347,"dup":3}],347:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":344,"dup":4}],348:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],349:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":344,"./MultipleTransition":345,"./Transitionable":346,"./TweenTransition":347,"./after":348,"dup":6}],350:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],351:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":349}],352:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":351,"dup":29}],353:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],354:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],355:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],356:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],357:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],358:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":350,"./Color":351,"./ColorPalette":352,"./KeyCodes":353,"./MethodStore":354,"./ObjectManager":355,"./clone":356,"./flatClone":357,"./loadURL":359,"./strip":360,"dup":35}],359:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],360:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],361:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],362:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./Mat33":361,"dup":199}],363:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"dup":200}],364:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"dup":201}],365:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./Mat33":361,"./Quaternion":362,"./Vec2":363,"./Vec3":364,"dup":202}],366:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],367:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":370,"dup":2}],368:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":367,"./TweenTransition":369,"dup":3}],369:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":366,"dup":4}],370:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],371:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":366,"./MultipleTransition":367,"./Transitionable":368,"./TweenTransition":369,"./after":370,"dup":6}],372:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],373:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":371}],374:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":373,"dup":29}],375:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],376:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],377:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],378:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],379:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],380:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":372,"./Color":373,"./ColorPalette":374,"./KeyCodes":375,"./MethodStore":376,"./ObjectManager":377,"./clone":378,"./flatClone":379,"./loadURL":381,"./strip":382,"dup":35}],381:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],382:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],383:[function(require,module,exports){
'use strict';

var Geometry = require('./Geometry');

/**
 * DynamicGeometry is a component that defines the data that should
 *   be drawn to the webGL canvas. Manages vertex data and attributes.
 *
 * @class DynamicGeometry
 * @constructor
 * 
 * @param {Object} options instantiation options
 */
function DynamicGeometry(options) {
    Geometry.call(this, options);

    this.spec.dynamic = true;
}

/**
 * Returns the number of attribute values used to draw the DynamicGeometry.
 *
 * @class DynamicGeometry
 * @constructor
 * 
 * @return {Object} flattened length of the vertex positions attribute
 * in the geometry.
 */
DynamicGeometry.prototype.getLength = function getLength() {
    return this.getVertexPositions().length;
};

/**
 * Gets the buffer object based on buffer name. Throws error
 * if bufferName is not provided.
 *
 * @method getVertexBuffer
 *
 * @param {String} bufferName Name of vertexBuffer to be retrieved.
 * @return {Object} value of buffer with corresponding bufferName.
 */
DynamicGeometry.prototype.getVertexBuffer = function getVertexBuffer(bufferName) {
    if (! bufferName) throw 'getVertexBuffer requires a name';

    var idx = this.spec.bufferNames.indexOf(bufferName);
    if (idx === -1) throw 'buffer does not exist';
    else {
        return this.spec.bufferValues[idx];
    }
};

/**
 * Sets a vertex buffer with given name to input value. Registers a new 
 * buffer if one does not exist with given name.
 * 
 * @method setVertexBuffer
 * @param {String} bufferName Name of vertexBuffer to be set.
 * @param {Array} value Input data to fill target buffer.
 * @param {Number} size Vector size of input buffer data.
 * @return {Object} current geometry.
 */
DynamicGeometry.prototype.setVertexBuffer = function setVertexBuffer(bufferName, value, size) {
    var idx = this.spec.bufferNames.indexOf(bufferName);

    if (idx === -1) {
        idx = this.spec.bufferNames.push(bufferName) - 1;
    }

    this.spec.bufferValues[idx] = value || [];
    this.spec.bufferSpacings[idx] = size || this.DEFAULT_BUFFER_SIZE;

    if (this.spec.invalidations.indexOf(idx) === -1) {
        this.spec.invalidations.push(idx);
    }

    return this;
};

/**
 * Copies and sets all buffers from another geometry instance.
 *
 * @method fromGeometry
 *
 * @param {Object} geometry Geometry instance to copy buffers from.
 * @return {Object} current geometry.
 */
DynamicGeometry.prototype.fromGeometry = function fromGeometry(geometry) {
    var len = geometry.spec.bufferNames.length;
    for (var i = 0; i < len; i++) {
        this.setVertexBuffer(
            geometry.spec.bufferNames[i],
            geometry.spec.bufferValues[i],
            geometry.spec.bufferSpacings[i]
        );
    }
    return this;
};

/**
 *  Set the positions of the vertices in this geometry.
 * 
 *  @method setVertexPositions
 *  @param {Array} value New value for vertex position buffer
 *  @return {Object} current geometry.
 */
DynamicGeometry.prototype.setVertexPositions = function (value) {
    return this.setVertexBuffer('pos', value, 3);
};

/**
 *  Set the normals on this geometry.
 * 
 *  @method setNormals
 *  @param {Array} value Value to set normal buffer to.
 *  @return {Object} current geometry.
 */
DynamicGeometry.prototype.setNormals = function (value) {
    return this.setVertexBuffer('normals', value, 3);
};

/**
 *  Set the texture coordinates on this geometry.
 * 
 *  @method setTextureCoords
 *  @param {Array} value New value for texture coordinates buffer.
 *  @return {Object} current geometry.
 */
DynamicGeometry.prototype.setTextureCoords = function (value) {
    return this.setVertexBuffer('texCoord', value, 2);
};

/**
 *  Set the texture coordinates on this geometry.
 *  @method setTextureCoords
 *  @param {Array} value New value for index buffer
 *  @return {Object} current geometry.
 */
DynamicGeometry.prototype.setIndices = function (value) {
    return this.setVertexBuffer('indices', value, 1);
};

/**
 *  Set the WebGL drawing primitive for this geometry.
 *  @method setDrawType
 *  @param {String} type New drawing primitive for geometry
 *  @return {Object} current geometry.
 */
DynamicGeometry.prototype.setDrawType = function (value) {
    this.spec.type = value.toUpperCase();
    return this;
};

/**
 * Returns the 'pos' vertex buffer of the geometry.
 * @method getVertexPositions
 * @return {Array} Vertex buffer.
 */
DynamicGeometry.prototype.getVertexPositions = function () {
    return this.getVertexBuffer('pos');
};

/**
 * Returns the 'normal' vertex buffer of the geometry.
 * @method getNormals
 * @return {Array} Vertex Buffer.
 */
DynamicGeometry.prototype.getNormals = function () {
    return this.getVertexBuffer('normals');
};

/**
 * Returns the 'textureCoord' vertex buffer of the geometry.
 * @method getTextureCoords
 * @return {Array} Vertex Buffer.
 */
DynamicGeometry.prototype.getTextureCoords = function () {
    return this.getVertexBuffer('texCoord');
};

module.exports = DynamicGeometry;

},{"./Geometry":384}],384:[function(require,module,exports){
'use strict';

var GeometryIds = 0;

// WebGL drawing primitives map. This is generated in geometry to 
// avoid chrome deoptimizations in WebGLRenderer draw function.
// TODO: return draw type data retreival to WebGLRenderer.

var DRAW_TYPES = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6
};

/**
 * Geometry is a component that defines the data that should
 * be drawn to the webGL canvas. Manages vertex data and attributes.
 *
 * @class Geometry
 * @constructor
 * 
 * @param {Object} options Instantiation options.
 */
function Geometry(options) {
    this.id = GeometryIds++;
    this.options = options || {};
    this.DEFAULT_BUFFER_SIZE = 3;

    this.spec = {
        id: this.id,
        dynamic: false,
        type: DRAW_TYPES[(this.options.type ? this.options.type.toUpperCase() : 'TRIANGLES')],
        bufferNames: [],
        bufferValues: [],
        bufferSpacings: [],
        invalidations: []
    };

    if (this.options.buffers) {
        var len = this.options.buffers.length;
        for (var i = 0; i < len;) {
            this.spec.bufferNames.push(this.options.buffers[i].name);
            this.spec.bufferValues.push(this.options.buffers[i].data);
            this.spec.bufferSpacings.push(this.options.buffers[i].size || this.DEFAULT_BUFFER_SIZE);
            this.spec.invalidations.push(i++);
        }
    }
}

module.exports = Geometry;

},{}],385:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Vec2 = require('famous-math').Vec2;

var outputs = [
    new Vec3(),
    new Vec3(),
    new Vec3(),
    new Vec2(),
    new Vec2()
];

/**
 * A helper object used to calculate buffers for complicated geometries.
 * Tailored for the WebGLRenderer, used by most primitives.
 *
 * @static
 * @class GeometryHelper
 */
var GeometryHelper = {};

/**
 * A function that iterates through vertical and horizontal slices
 * based on input detail, and generates vertices and indices for each
 * subdivision.
 *
 * @static
 * @method generateParametric
 *
 * @param {Number} detailX Amount of slices to iterate through.
 * @param {Number} detailY Amount of stacks to iterate through.
 * @param {Function} func Function used to generate vertex positions at each point.
 * 
 * @return {Object} Object containing generated vertices and indices.
 */
GeometryHelper.generateParametric = function generateParametric(detailX, detailY, func) {
    var vertices = [],
        i, theta, phi, result, j;

    // We must wrap around slightly more than once for uv coordinates to look correct.

    // var Xrange = Math.PI + (Math.PI / detailX);
    var Xrange = Math.PI;
    var out = [];

    for (i = 0; i < detailX + 1; i++) {
        theta = i * Xrange / detailX;
        for (j = 0; j < detailY; j++) {
            phi = j * 2.0 * Xrange / detailY;
            func(theta, phi, out);
            vertices.push(out[0], out[1], out[2]);
        }
    }

    var indices = [],
        v = 0,
        next;
    for (i = 0; i < detailX; i++) {
        for (j = 0; j < detailY; j++) {
            next = (j + 1) % detailY;
            indices.push(v + j, v + j + detailY, v + next);
            indices.push(v + next, v + j + detailY, v + next + detailY);
        }
        v += detailY;
    }

    return {
        vertices: vertices,
        indices: indices
    };
}

/**
 * Calculates normals belonging to each face of a geometry.  
 * Assumes clockwise declaration of vertices.
 *
 * @static
 * @method computeNormals
 *
 * @param {Array} vertices Vertices of all points on the geometry.
 * @param {Array} indices Indices declaring faces of geometry.
 * @param {Array} out Array to be filled and returned.
 * 
 * @return {Array} Calculated face normals.
 */
GeometryHelper.computeNormals = function computeNormals(vertices, indices, out) {
    var normals = out || [];
    var vertexThree;
    var vertexTwo;
    var vertexOne;
    var indexOne;
    var indexTwo;
    var indexThree;
    var start;
    var end;
    var normal;
    var j;
    var len = indices.length / 3;

    for (var i = 0; i < len; i++) {
        j = i * 3;
        indexTwo = indices[j + 0] * 3;
        indexOne = indices[j + 1] * 3;
        indexThree = indices[j + 2] * 3;

        outputs[0].set(vertices[indexOne], vertices[indexOne + 1], vertices[indexOne + 2]);
        outputs[1].set(vertices[indexTwo], vertices[indexTwo + 1], vertices[indexTwo + 2]);
        outputs[2].set(vertices[indexThree], vertices[indexThree + 1], vertices[indexThree + 2]);

        normal = outputs[2].subtract(outputs[0]).cross(outputs[1].subtract(outputs[0]));
        normal = normal.normalize().toArray();

        normals[indexOne + 0] = normal[0];
        normals[indexOne + 1] = normal[1];
        normals[indexOne + 2] = normal[2];

        normals[indexTwo + 0] = normal[0];
        normals[indexTwo + 1] = normal[1];
        normals[indexTwo + 2] = normal[2];

        normals[indexThree + 0] = normal[0];
        normals[indexThree + 1] = normal[1];
        normals[indexThree + 2] = normal[2];
    }

    return normals;
};

/**
 * Divides all inserted triangles into four sub-triangles. Alters the
 * passed in arrays.
 *
 * @static
 * @method subdivide
 *
 * @param {Array} indices Indices declaring faces of geometry
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} texutureCoords Texture coordinates of all points on the geometry
 * 
 */
GeometryHelper.subdivide = function subdivide(indices, vertices, textureCoords) {
    var triangleIndex = indices.length / 3,
        abc,
        face,
        i, j, k, pos, tex;

    while (triangleIndex--) {
        face = indices.slice(triangleIndex * 3, triangleIndex * 3 + 3);

        pos = face.map(function(vertIndex) {
            return new Vec3(vertices[vertIndex * 3], vertices[vertIndex * 3 + 1], vertices[vertIndex * 3 + 2]);
        });
        vertices.push.apply(vertices, Vec3.scale(Vec3.add(pos[0], pos[1], outputs[0]), 0.5, outputs[1]).toArray());
        vertices.push.apply(vertices, Vec3.scale(Vec3.add(pos[1], pos[2], outputs[0]), 0.5, outputs[1]).toArray());
        vertices.push.apply(vertices, Vec3.scale(Vec3.add(pos[0], pos[2], outputs[0]), 0.5, outputs[1]).toArray());

        if (textureCoords) {
            tex = face.map(function(vertIndex) {
                return new Vec2(textureCoords[vertIndex * 2], textureCoords[vertIndex * 2 + 1]);
            });
            textureCoords.push.apply(textureCoords, Vec2.scale(Vec2.add(tex[0], tex[1], outputs[3]), 0.5, outputs[4]).toArray());
            textureCoords.push.apply(textureCoords, Vec2.scale(Vec2.add(tex[1], tex[2], outputs[3]), 0.5, outputs[4]).toArray());
            textureCoords.push.apply(textureCoords, Vec2.scale(Vec2.add(tex[0], tex[2], outputs[3]), 0.5, outputs[4]).toArray());
        }

        i = vertices.length - 3, j = i + 1, k = i + 2;
        indices.push(i, j, k);
        indices.push(face[0], i, k);
        indices.push(i, face[1], j);
        indices[triangleIndex] = k;
        indices[triangleIndex + 1] = j;
        indices[triangleIndex + 2] = face[2];
    }
};

/**
 * Creates duplicate of vertices that are shared between faces.
 * Alters the input vertex and index arrays.
 *
 * @static
 * @method getUniqueFaces
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} indices Indices declaring faces of geometry
 * 
 */
GeometryHelper.getUniqueFaces = function getUniqueFaces(vertices, indices) {
    var triangleIndex = indices.length / 3,
        registered = [],
        index;

    while (triangleIndex--) {
        for (var i = 0; i < 3; i++) {

            index = indices[triangleIndex * 3 + i];

            if (registered[index]) {
                vertices.push(vertices[index * 3], vertices[index * 3 + 1], vertices[index * 3 + 2]);
                indices[triangleIndex * 3 + i] = vertices.length / 3 - 1;
            } else {
                registered[index] = true;
            }
        }
    }
};

/**
 * Divides all inserted triangles into four sub-triangles while maintaining
 * a radius of one. Alters the passed in arrays.
 *
 * @static
 * @method subdivide
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} indices Indices declaring faces of geometry
 * 
 */
GeometryHelper.subdivideSpheroid = function subdivideSpheroid(vertices, indices) {
    var triangleIndex = indices.length / 3,
        abc,
        face,
        i, j, k;

    while (triangleIndex--) {
        face = indices.slice(triangleIndex * 3, triangleIndex * 3 + 3);
        abc = face.map(function(vertIndex) {
            return new Vec3(vertices[vertIndex * 3], vertices[vertIndex * 3 + 1], vertices[vertIndex * 3 + 2]);
        });

        vertices.push.apply(vertices, Vec3.normalize(Vec3.add(abc[0], abc[1], outputs[0]), outputs[1]).toArray());
        vertices.push.apply(vertices, Vec3.normalize(Vec3.add(abc[1], abc[2], outputs[0]), outputs[1]).toArray());
        vertices.push.apply(vertices, Vec3.normalize(Vec3.add(abc[0], abc[2], outputs[0]), outputs[1]).toArray());

        i = vertices.length / 3 - 3, j = i + 1, k = i + 2;

        indices.push(i, j, k);
        indices.push(face[0], i, k);
        indices.push(i, face[1], j);
        indices[triangleIndex * 3] = k;
        indices[triangleIndex * 3 + 1] = j;
        indices[triangleIndex * 3 + 2] = face[2];
    }
};

/**
 * Divides all inserted triangles into four sub-triangles while maintaining
 * a radius of one. Alters the passed in arrays.
 *
 * @static
 * @method getSpheroidNormals
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting normals.
 * 
 * @return {Array} new list of calculated normals.
 */
GeometryHelper.getSpheroidNormals = function getSpheroidNormals(vertices, out) {
    var out = out || [];
    var length = vertices.length / 3;
    var normalized;

    for(var i = 0; i < length; i++) {
        normalized = new Vec3(
            vertices[i * 3 + 0],
            vertices[i * 3 + 1],
            vertices[i * 3 + 2]
        ).normalize().toArray();

        out[i * 3 + 0] = normalized[0];
        out[i * 3 + 1] = normalized[1];
        out[i * 3 + 2] = normalized[2];
    }

    return out;
};

/**
 * Calculates texture coordinates for spheroid primitives based on
 * input vertices.
 *
 * @static
 * @method getSpheroidUV
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting texture coordinates.
 * 
 * @return {Array} new list of calculated texture coordinates
 */
GeometryHelper.getSpheroidUV = function getSpheroidUV(vertices, out) {
    var out = out || [];
    var length = vertices.length / 3;
    var vertex;

    for(var i = 0; i < length; i++) {
        vertex = vertices.slice(i * 3, i * 3 + 3);
        out.push(
            this.getAzimuth(vertex) * 0.5 / Math.PI + 0.5,
            this.getAltitude(vertex) / Math.PI + 0.5
        );
    }

    return out;
};

/**
 * Iterates through and normalizes a list of vertices.
 *
 * @static
 * @method normalizeAll
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with resulting normalized vectors.
 * 
 * @return {Array} new list of normalized vertices
 */
GeometryHelper.normalizeAll = function normalizeAll(vertices, out) {
    var out = out || [];
    var vertex;
    var len = vertices.length / 3;

    for (var i = 0; i < len; i++) {
        Array.prototype.push.apply(out, new Vec3(vertices[i * 3], vertices[i * 3 + 1], vertices[i * 3 + 2]).normalize().toArray());
    }

    return out;
};

/**
 * Normalizes a set of vertices to model space.
 *
 * @static
 * @method normalizeVertices
 *
 * @param {Array} vertices Vertices of all points on the geometry
 * @param {Array} out Optional array to be filled with model space position vectors.
 * 
 * @return {Array} Output vertices.
 */
GeometryHelper.normalizeVertices = function normalizeVertices(vertices, out) {
    var out = out || [];
    var len = vertices.length / 3;
    var vectors = [];
    var minX;
    var maxX;
    var minY;
    var maxY;
    var minZ;
    var maxZ;
    var v;

    for (var i = 0; i < len; i++) {
        v = vectors[i] = new Vec3(
            vertices[i * 3],
            vertices[i * 3 + 1],
            vertices[i * 3 + 2]
        );

        if (minX == null || v.x < minX) minX = v.x;
        if (maxX == null || v.x > maxX) maxX = v.x;

        if (minY == null || v.y < minY) minY = v.y;
        if (maxY == null || v.y > maxY) maxY = v.y;

        if (minZ == null || v.z < minZ) minZ = v.z;
        if (maxZ == null || v.z > maxZ) maxZ = v.z;
    };

    var translation = new Vec3(
        getTranslationFactor(maxX, minX),
        getTranslationFactor(maxY, minY),
        getTranslationFactor(maxZ, minZ)
    );

    var scale = Math.min(
        getScaleFactor(maxX + translation.x, minX + translation.x),
        getScaleFactor(maxY + translation.y, minY + translation.y),
        getScaleFactor(maxZ + translation.z, minZ + translation.z)
    );

    for (var i = 0; i < vectors.length; i++) {
        out.push.apply(out, vectors[i].add(translation).scale(scale).toArray());
    }

    return out;
};

/**
 * Determines translation amount for a given axis to normalize model coordinates.
 *
 * @method getTranslationFactor
 * @private
 *
 * @param {Number} max Maximum position value of given axis on the model.
 * @param {Number} min Minimum position value of given axis on the model.
 *
 * @return {Number} Number by which the given axis should be translated for all vertices.
 */
function getTranslationFactor(max, min) {
    return -(min + (max - min) / 2);
}

/**
 * Determines scale amount for a given axis to normalize model coordinates.
 *
 * @method getScaleFactor
 * @private
 *
 * @param {Number} max Maximum scale value of given axis on the model.
 * @param {Number} min Minimum scale value of given axis on the model.
 *
 * @return {Number} Number by which the given axis should be scaled for all vertices.
 */
function getScaleFactor(max, min) {
    return 1 / ((max - min) / 2);
}

/**
 * Finds the azimuth, or angle above the XY plane, of a given vector.
 *
 * @static
 * @method getAzimuth
 *
 * @param {Array} v Vertex to retreive azimuth from.
 * 
 * @return {Number} Azimuth value in radians. 
 */
GeometryHelper.getAzimuth = function azimuth(v) {
    return Math.atan2(v[2], -v[0]);
};

/**
 * Finds the altitude, or angle above the XZ plane, of a given vector.
 *
 * @static
 * @method getAltitude
 *
 * @param {Array} v Vertex to retreive altitude from.
 * 
 * @return {Number} Altitude value in radians. 
 */
GeometryHelper.getAltitude = function altitude(v) {
    return Math.atan2(-v[1], Math.sqrt((v[0] * v[0]) + (v[2] * v[2])));
};

/**
 * Converts a list of indices from 'triangle' to 'line' format.
 *
 * @static
 * @method trianglesToLines
 *
 * @param {Array} indices Indices of all faces on the geometry
 * 
 * @return {Array} new list of line-formatted indices
 */
GeometryHelper.trianglesToLines = function triangleToLines(indices, out) {
    var out = [];
    var face;
    var j;
    var i;

    for (i = 0; i < indices.length; i++) {
        out.push(indices[i][0], indices[i][1]);
        out.push(indices[i][1], indices[i][2]);
        out.push(indices[i][2], indices[i][0]);
    }

    return out;
};

module.exports = GeometryHelper;

},{"famous-math":365}],386:[function(require,module,exports){
var loadURL        = require('famous-utilities').loadURL;
var GeometryHelper = require('./GeometryHelper');

/*
 * A singleton object that takes that makes requests
 * for OBJ files and returns the formatted data as
 * an argument to a callback function.
 *
 * @static
 * @class OBJLoader
 */

var OBJLoader = {
    cached: {},
    requests: {}
};

/*
 * Takes a path to desired obj file and makes an XMLHttp request
 * if the resource is not cached. Sets up the 'onresponse' function
 * as a callback for formatting and callback invocation.
 *
 * @method load
 *
 * @param {String} url URL of desired obj
 * @param {Function} cb Function to be fired upon successful formatting of obj
 * @param {Object} options Options hash to that can affect the output of the OBJ
 * vertices.
 */
OBJLoader.load = function load(url, cb, options) {
    if (! this.cached[url]) {
        if(! this.requests[url]) {
            this.requests[url] = [cb];
            loadURL(
                url,
                _onsuccess.bind(
                    this,
                    url,
                    options
                )
            );
        } else {
            this.requests[url].push(cb);
        }
    } else {
        cb(this.cached[url]);
    }
};

/*
 * Fired on response from server for OBJ asset.  Formats the
 * returned string and stores the buffer data in cache.
 * Invokes all queued callbacks before clearing them.
 *
 * @method _onsuccess
 * @private
 *
 * @param {String} URL of requested obj
 * @param {Boolean} value determining whether or not to manually calculate normals
 * @param {String} content of the server response
 */
function _onsuccess(url, options, text) {
    var buffers = format.call(this, text, options || {});
    this.cached[url] = buffers;

    for (var i = 0; i < this.requests[url].length; i++) {
        this.requests[url][i](buffers);
    }

    this.requests[url] = null;
};

/*
 * Takes raw string format of obj and converts it to a javascript
 * object representing the buffers needed to draw the geometry.
 *
 * @method format
 * @private
 *
 * @param {String} raw obj data in text format
 * @param {Boolean} value determining whether or not to manually calculate normals
 *
 * @return {Object} vertex buffer data
 */
function format(text, options) {
    var text = sanitize(text);

    var lines = text.split('\n');

    var faceTexCoords = [];
    var faceVertices = [];
    var faceNormals = [];

    var normals = [];
    var texCoords = [];
    var vertices = [];

    var i1, i2, i3, i4;
    var split;
    var line;

    var length = lines.length;

    for (var i = 0; i < length; i++) {
        line = lines[i];
        split = lines[i].split(' ');

        // Handle vertex positions

        if (line.indexOf('v ') !== -1) {
            vertices.push([
                parseFloat(split[1]),
                parseFloat(split[2]),
                parseFloat(split[3])
            ]);
        }

        // Handle texture coordinates

        else if(line.indexOf('vt ') !== -1) {
            texCoords.push([
                parseFloat(split[1]),
                parseFloat(split[2])
            ]);
        }

        // Handle vertex normals

        else if (line.indexOf('vn ') !== -1) {
            normals.push([
                parseFloat(split[1]),
                parseFloat(split[2]),
                parseFloat(split[3])
            ]);
        }

        // Handle face

        else if (line.indexOf('f ') !== -1) {

            // Vertex, Normal

            if (split[1].indexOf('//') !== -1) {
                i1 = split[1].split('//');
                i2 = split[2].split('//');
                i3 = split[3].split('//');

                faceVertices.push([
                    parseFloat(i1[0]) - 1,
                    parseFloat(i2[0]) - 1,
                    parseFloat(i3[0]) - 1
                ]);
                faceNormals.push([
                    parseFloat(i1[1]) - 1,
                    parseFloat(i2[1]) - 1,
                    parseFloat(i3[1]) - 1
                ]);

                // Handle quad

                if (split[4]) {
                    i4 = split[4].split('//');
                    faceVertices.push([
                        parseFloat(i1[0]) - 1,
                        parseFloat(i3[0]) - 1,
                        parseFloat(i4[0]) - 1
                    ]);
                    faceNormals.push([
                        parseFloat(i1[2]) - 1,
                        parseFloat(i3[2]) - 1,
                        parseFloat(i4[2]) - 1
                    ]);
                }
            }

            // Vertex, TexCoord, Normal

            else if (split[1].indexOf('/') !== -1) {
                i1 = split[1].split('/');
                i2 = split[2].split('/');
                i3 = split[3].split('/');

                faceVertices.push([
                    parseFloat(i1[0]) - 1,
                    parseFloat(i2[0]) - 1,
                    parseFloat(i3[0]) - 1
                ]);
                faceTexCoords.push([
                    parseFloat(i1[1]) - 1,
                    parseFloat(i2[1]) - 1,
                    parseFloat(i3[1]) - 1
                ]);
                faceNormals.push([
                    parseFloat(i1[2]) - 1,
                    parseFloat(i2[2]) - 1,
                    parseFloat(i3[2]) - 1
                ]);

                // Handle Quad

                if (split[4]) {
                    i4 = split[4].split('/');

                    faceVertices.push([
                        parseFloat(i1[0]) - 1,
                        parseFloat(i3[0]) - 1,
                        parseFloat(i4[0]) - 1
                    ]);
                    faceTexCoords.push([
                        parseFloat(i1[1]) - 1,
                        parseFloat(i3[1]) - 1,
                        parseFloat(i4[1]) - 1
                    ]);
                    faceNormals.push([
                        parseFloat(i1[2]) - 1,
                        parseFloat(i3[2]) - 1,
                        parseFloat(i4[2]) - 1
                    ]);
                }
            }

            // Vertex

            else {
                faceVertices.push([
                    parseFloat(split[1]) - 1,
                    parseFloat(split[2]) - 1,
                    parseFloat(split[3]) - 1
                ]);
                faceTexCoords.push([
                    parseFloat(split[1]) - 1,
                    parseFloat(split[2]) - 1,
                    parseFloat(split[3]) - 1
                ]);
                faceNormals.push([
                    parseFloat(split[1]) - 1,
                    parseFloat(split[2]) - 1,
                    parseFloat(split[3]) - 1
                ]);

                // Handle Quad

                if (split[4]) {
                    faceVertices.push([
                        parseFloat(split[1]) - 1,
                        parseFloat(split[3]) - 1,
                        parseFloat(split[4]) - 1
                    ]);
                    faceTexCoords.push([
                        parseFloat(split[1]) - 1,
                        parseFloat(split[3]) - 1,
                        parseFloat(split[4]) - 1
                    ]);
                    faceNormals.push([
                        parseFloat(split[1]) - 1,
                        parseFloat(split[3]) - 1,
                        parseFloat(split[4]) - 1
                    ]);
                }
            }
        }
    }

    var cached = cacheVertices(
        vertices,
        normals,
        texCoords,
        faceVertices,
        faceNormals,
        faceTexCoords
    );

    cached.vertices = flatten(cached.vertices);
    cached.normals = flatten(cached.normals);
    cached.texCoords = flatten(cached.texCoords);
    cached.indices = flatten(cached.indices);

    if (options.normalize) {
        cached.vertices = GeometryHelper.normalizeVertices(
            cached.vertices
        );
    }

    if (options.computeNormals) {
        cached.normals = GeometryHelper.computeNormals(
            cached.indices,
            cached.vertices
        );
    }

    return {
        vertices: cached.vertices,
        normals: cached.normals,
        textureCoords: cached.texCoords,
        indices: cached.indices
    };
};

/*
 * Replaces all double spaces with single spaces and removes
 * all trailing spaces from lines of a given string.
 *
 * @method sanitize
 * @private
 *
 * @param {String} text String to be sanitized.
 *
 * @return {String} sanitized string.
 */
function sanitize(text) {
    return text.replace(/ +(?= )/g,'').replace(/\s+$/g, '');
}

/*
 * Takes a given pool of attributes and face definitions
 * and removes all duplicate vertices.
 *
 * @method cacheVertices
 * @private
 *
 * @param {Array} v Pool of vertices used in face declarations.
 * @param {Array} n Pool of normals used in face declarations.
 * @param {Array} t Pool of textureCoords used in face declarations.
 * @param {Array} fv Vertex positions at each face in the OBJ.
 * @param {Array} fn Normals at each face in the OBJ.
 * @param {Array} ft Texture coordinates at each face in the OBJ.
 *
 * @return {Object} Object containing the vertices, textureCoordinates and
 * normals of the OBJ.
 */
function cacheVertices(v, n, t, fv, fn, ft) {
    var outNormals = [];
    var outPos = [];
    var outTexCoord = [];
    var outIndices = [];

    var vertexCache = {};

    var positionIndex;
    var normalIndex;
    var texCoordIndex;

    var currentIndex = 0;
    var fvLength = fv.length;
    var fnLength = fn.length;
    var ftLength = ft.length;
    var faceLength;
    var index;

    for (var i = 0; i < fvLength; i++) {
        outIndices[i] = [];
        faceLength = fv[i].length;

        for (var j = 0; j < faceLength; j++) {
            if (ftLength) texCoordIndex = ft[i][j];
            if (fnLength) normalIndex   = fn[i][j];
                          positionIndex = fv[i][j];

            index = vertexCache[positionIndex + ',' + normalIndex + ',' + texCoordIndex];

            if(index === undefined) {
                index = currentIndex++;

                              outPos.push(v[positionIndex]);
                if (fnLength) outNormals.push(n[normalIndex]);
                if (ftLength) outTexCoord.push(t[texCoordIndex]);

                vertexCache[positionIndex + ',' + normalIndex + ',' + texCoordIndex] = index;
            }

            outIndices[i].push(index);
        }
    }

    return {
        vertices: outPos,
        normals: outNormals,
        texCoords: outTexCoord,
        indices: outIndices
    }
}

/*
 * Flattens an array of arrays. Not recursive. Assumes
 * all children are arrays.
 *
 * @method flatten
 * @private
 *
 * @param {Array} arr Input array to be flattened.
 *
 * @return {Array} Flattened version of input array.
 */
function flatten(arr) {
    var len = arr.length;
    var out = [];

    for (var i = 0; i < len; i++) {
        out.push.apply(out, arr[i]);
    }

    return out;
}

module.exports = OBJLoader;

},{"./GeometryHelper":385,"famous-utilities":380}],387:[function(require,module,exports){
'use strict';

module.exports = {
    Box: require('./primitives/Box'),
    Circle: require('./primitives/Circle'),
    Cylinder: require('./primitives/Cylinder'),
    GeodesicSphere: require('./primitives/GeodesicSphere'),
    Icosahedron: require('./primitives/Icosahedron'),
    ParametricCone: require('./primitives/ParametricCone'),
    Plane: require('./primitives/Plane'),
    Sphere: require('./primitives/Sphere'),
    Tetrahedron: require('./primitives/Tetrahedron'),
    Torus: require('./primitives/Torus'),
    Triangle: require('./primitives/Triangle'),
    GeometryHelper: require('./GeometryHelper'),
    DynamicGeometry: require('./DynamicGeometry'),
    Geometry: require('./Geometry'),
    OBJLoader: require('./OBJLoader'),
};
},{"./DynamicGeometry":383,"./Geometry":384,"./GeometryHelper":385,"./OBJLoader":386,"./primitives/Box":388,"./primitives/Circle":389,"./primitives/Cylinder":390,"./primitives/GeodesicSphere":391,"./primitives/Icosahedron":392,"./primitives/ParametricCone":393,"./primitives/Plane":394,"./primitives/Sphere":395,"./primitives/Tetrahedron":396,"./primitives/Torus":397,"./primitives/Triangle":398}],388:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');

function pickOctant(i) {
    return [(i & 1) * 2 - 1, (i & 2) - 1, (i & 4) / 2 - 1];
}

var boxData = [
    [0, 4, 2, 6, -1, 0, 0], 
    [1, 3, 5, 7, +1, 0, 0],
    [0, 1, 4, 5, 0, -1, 0],
    [2, 6, 3, 7, 0, +1, 0],
    [0, 2, 1, 3, 0, 0, -1],
    [4, 5, 6, 7, 0, 0, +1]
];

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class BoxGeometry
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function BoxGeometry(options) {
    var options = options || {};

    var vertices      = [];
    var textureCoords = [];
    var normals       = [];
    var indices       = [];

    var data;
    var d;
    var v;
    var i;
    var j;

    for (i = 0; i < boxData.length; i++) {
        data = boxData[i], v = i * 4;
        for (j = 0; j < 4; j++) {
            d = data[j];
            var octant = pickOctant(d);
            vertices.push(octant[0], octant[1], octant[2]);
            textureCoords.push(j & 1, (j & 2) / 2);
            normals.push(data[4], data[5], data[6]);
        }
        indices.push(v, v + 1, v + 2);
        indices.push(v + 2, v + 1, v + 3);
    }

    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
};

module.exports = BoxGeometry;

},{"../Geometry":384}],389:[function(require,module,exports){
'use strict';

var Geometry       = require('../Geometry');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Circle
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function Circle (options) {
    var options  = options || {};
    var detail   = options.detail || 30;
    var buffers  = getBuffers(detail);

    return new Geometry({
        type: 'TRIANGLE_FAN',
        buffers: [
            { name: 'pos', data: buffers.vertices },
            { name: 'texCoord', data: buffers.textureCoords, size: 2 },
            { name: 'normals', data: buffers.normals }
        ]
    });
}
    
/**
 * Calculates and returns all vertex positions, texture
 * coordinates and normals of the circle primitive.
 *
 * @method getBuffers
 *
 * @param {Number} detail Amount of detail that determines how many
 * vertices are created and where they are placed
 * 
 * @return {Object} constructed geometry
 */
function getBuffers(detail) {
    var theta = 0;
    var x;
    var y;
    var index = detail + 1;
    var nextTheta;
    var vertices      = [0, 0, 0];
    var normals       = [0, 0, 1];
    var textureCoords = [0.5, 0.5];

    while (index--) {
        theta = index / detail * Math.PI * 2;

        x = Math.cos(theta), y = Math.sin(theta);
        vertices.unshift(x, y, 0);
        normals.unshift(0, 0, 1);
        textureCoords.unshift(0.5 + x * 0.5, 0.5 + -y * 0.5);
    }

    return {
        vertices: vertices,
        normals: normals,
        textureCoords: textureCoords
    };
}

module.exports = Circle;

},{"../Geometry":384}],390:[function(require,module,exports){
'use strict';

var Geometry       = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This class creates a new geometry instance and sets
 * its vertex positions, texture coordinates, normals,
 * and indices to based on the primitive.
 *
 * @class Cylinder
 * @constructor
 * 
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 *
 * @return {Object} constructed geometry
 */
function Cylinder (options) {
    var options  = options || {};
    var radius   = options.radius || 1;
    var detail   = options.detail || 15;
    var buffers;

    buffers = GeometryHelper.generateParametric(
        1,
        detail,
        Cylinder.generator.bind(null, radius)
    );

    return new Geometry({
        buffers: [
            { name: 'pos', data: buffers.vertices },
            { name: 'texCoord', data: GeometryHelper.getSpheroidUV(buffers.vertices), size: 2 },
            { name: 'normals', data: GeometryHelper.computeNormals(buffers.vertices, buffers.indices) },
            { name: 'indices', data: buffers.indices, size: 1 }
        ]
    });
}

/**
 * Function used in iterative construction of parametric primitive.
 *
 * @static
 * @method generator
 * @param {Number} r Cylinder radius.
 * @param {Number} u Longitudal progress from 0 to PI.
 * @param {Number} v Latitudal progress from 0 to PI.
 *
 * @return {Array} x, y and z coordinate of geometry.
 */
Cylinder.generator = function generator(r, u, v, pos) {
    pos[0] = r * Math.cos(v);
    pos[1] = r * (-1 + u / Math.PI * 2);
    pos[2] = r * Math.sin(v);
}

module.exports = Cylinder;

},{"../Geometry":384,"../GeometryHelper":385}],391:[function(require,module,exports){
'use strict';

var Geometry       = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class GeodesicSphere
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function GeodesicSphere (options) {
    var t = (1 + Math.sqrt(5)) * 0.5;

    var vertices = [
        - 1,  t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
         0, - 1, -t,    0,  1, -t,    0, - 1,   t,    0,  1,   t,
         t,  0,   1,    t,  0, -1,   - t,  0,   1,   - t,  0, -1
    ];
    var indices = [
        0,  5, 11,    0,  1,  5,    0,  7,  1,    0, 10,  7,    0, 11, 10,
        1,  9,  5,    5,  4, 11,    11, 2, 10,   10,  6,  7,    7,  8,  1,
        3,  4,  9,    3,  2,  4,    3,  6,  2,    3,  8,  6,    3,  9,  8,
        4,  5,  9,    2, 11,  4,    6, 10,  2,    8,  7,  6,    9,  1,  8
    ];

    vertices = GeometryHelper.normalizeAll(vertices);

    var options = options || {};
    var detail  = options.detail || 3;

    while(--detail) GeometryHelper.subdivideSpheroid(vertices, indices);
    GeometryHelper.getUniqueFaces(vertices, indices);

    var normals       = GeometryHelper.computeNormals(vertices, indices);
    var textureCoords = GeometryHelper.getSpheroidUV(vertices);

    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
}

module.exports = GeodesicSphere;

},{"../Geometry":384,"../GeometryHelper":385}],392:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Icosahedron
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function Icosahedron() {
    var t = ( 1 + Math.sqrt( 5 ) ) / 2;

    var geometry;
    var detail;
    var vertices = [
        - 1,   t,  0,    1,  t,  0,   - 1, - t,  0,    1, - t,  0,
          0, - 1, -t,    0,  1, -t,     0, - 1,  t,    0,   1,  t,
          t,   0,  1,    t,  0, -1,   - t,   0,  1,  - t,   0, -1
    ];
    var indices = [
        0,  5, 11,    0,  1,  5,    0,  7,  1,    0, 10,  7,    0, 11, 10,
        1,  9,  5,    5,  4, 11,    11, 2, 10,   10,  6,  7,    7,  8,  1,
        3,  4,  9,    3,  2,  4,    3,  6,  2,    3,  8,  6,    3,  9,  8,
        4,  5,  9,    2, 11,  4,    6, 10,  2,    8,  7,  6,    9,  1,  8
    ];

    GeometryHelper.getUniqueFaces(vertices, indices);

    var normals       = GeometryHelper.computeNormals(vertices, indices);
    var textureCoords = GeometryHelper.getSpheroidUV(vertices);

    vertices      = GeometryHelper.normalizeAll(vertices);

    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
}

module.exports = Icosahedron;

},{"../Geometry":384,"../GeometryHelper":385}],393:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class ParametricCone
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function ParametricCone (options) {
    var options  = options || {};
    var detail   = options.detail || 15;
    var radius   = options.radius || 1 / Math.PI;

    var buffers = GeometryHelper.generateParametric(
        detail,
        detail,
        ParametricCone.generator.bind(null, radius)
    );

    return new Geometry({
        buffers: [
            { name: 'pos', data: buffers.vertices },
            { name: 'texCoord', data: GeometryHelper.getSpheroidUV(buffers.vertices), size: 2 },
            { name: 'normals', data: GeometryHelper.computeNormals(buffers.vertices, buffers.indices) },
            { name: 'indices', data: buffers.indices, size: 1 }
        ]
    });
}

/**
 * function used in iterative construction of parametric primitive.
 *
 * @static
 * @method generator
 * @param {Number} r Cone Radius.
 * @param {Number} u Longitudal progress from 0 to PI.
 * @param {Number} v Latitudal progress from 0 to PI.
 * @return {Array} x, y and z coordinate of geometry.
 */

ParametricCone.generator = function generator(r, u, v, pos) {
    pos[0] = r * u * Math.sin(v);
    pos[1] = -r * u * Math.cos(v);
    pos[2] = -u;
}

module.exports = ParametricCone;

},{"../Geometry":384,"../GeometryHelper":385}],394:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Plane
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function Plane(options) {
    var options = options || {};
    var detailX = options.detailX || options.detail || 1;
    var detailY = options.detailY || options.detail || 1;

    var vertices      = [];
    var textureCoords = [];
    var normals       = [];
    var indices       = [];

    for (var y = 0; y <= detailY; y++) {
        var t = y / detailY;
        for (var x = 0; x <= detailX; x++) {
            var s = x / detailX;
            vertices.push(2. * (s - .5), 2 * (t - .5), 0);
            textureCoords.push(s, 1 - t);
            normals.push(0, 0, 1);
            if (x < detailX && y < detailY) {
                var i = x + y * (detailX + 1);
                indices.push(i, i + 1, i + detailX + 1);
                indices.push(i + detailX + 1, i + 1, i + detailX + 2);
            }
        }
    }
    
    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
};

module.exports = Plane;

},{"../Geometry":384}],395:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class ParametricSphere
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function ParametricSphere (options) {
    options = options || {};
    var detail = options.detail || 10;
    var detailX = options.detailX || detail;    
    var detailY = options.detailY || detail;

    var buffers = GeometryHelper.generateParametric(
          detailX,
          detailY,
          ParametricSphere.generator
    );

    GeometryHelper.getUniqueFaces(buffers.vertices, buffers.indices);

    return new Geometry({
        buffers: [
            { name: 'pos', data: buffers.vertices },
            { name: 'texCoord', data: GeometryHelper.getSpheroidUV(buffers.vertices), size: 2 },
            { name: 'normals', data: GeometryHelper.getSpheroidNormals(buffers.vertices) },
            { name: 'indices', data: buffers.indices, size: 1 }
        ]
    });
}

/**
 * Function used in iterative construction of parametric primitive.
 *
 * @static
 * @method generator
 * @param {Number} u Longitudal progress from 0 to PI.
 * @param {Number} v Latitudal progress from 0 to PI.
 * @return {Array} x, y and z coordinates of geometry
 */
ParametricSphere.generator = function generator(u, v, pos) {
    var x = Math.sin(u) * Math.cos(v);
    var y = Math.cos(u);
    var z = -Math.sin(u) * Math.sin(v);

    pos[0] = x;
    pos[1] = y;
    pos[2] = z;
};

module.exports = ParametricSphere;

},{"../Geometry":384,"../GeometryHelper":385}],396:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function generates custom buffers and passes them to
 * a new static geometry, which is returned to the user.
 *
 * @class Tetrahedron
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function Tetrahedron(options) {
    var textureCoords = [];
    var normals = [];
    var geometry;
    var detail;
    var i;
    
    var vertices = [
        // Back 
        -1,  1, -1,
         1,  1, -1,
         0, -1,  0,
        
        // Right
         0,  1,  1,
         0, -1,  0,
         1,  1, -1,

        // Left
        -1,  1, -1,
         0, -1,  0,
         0,  1,  1,

        // Bottom
        -1,  1, -1,
         0,  1,  1,
         1,  1, -1,
    ];

    var indices = [
        0, 1, 2,
        3, 4, 5,
        6, 7, 8,
        9, 10, 11,
    ];

    for (i = 0; i < 4; i++) {
        textureCoords.push(
            0.0, 0.0,
            0.5, 1.0,
            1.0, 0.0
        );
    }

    options       = options || {};

    while(--detail) GeometryHelper.subdivide(indices, vertices, textureCoords);
    normals       = GeometryHelper.computeNormals(vertices, indices);

    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
}

module.exports = Tetrahedron;

},{"../Geometry":384,"../GeometryHelper":385}],397:[function(require,module,exports){
'use strict';

var Geometry = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Torus
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */

function Torus(options) {
    var options  = options || {};
    var detail   = options.detail || 30;
    var holeRadius = options.holeRadius || 0.80;
    var tubeRadius = options.tubeRadius || 0.20;

    var buffers = GeometryHelper.generateParametric(
        detail,
        detail,
        Torus.generator.bind(null, holeRadius, tubeRadius)
    );

    return new Geometry({
        buffers: [
            { name: 'pos', data: buffers.vertices },
            { name: 'texCoord', data: GeometryHelper.getSpheroidUV(buffers.vertices), size: 2 },
            { name: 'normals', data: GeometryHelper.computeNormals(buffers.vertices, buffers.indices) },
            { name: 'indices', data: buffers.indices, size: 1 }
        ]
    });
}

/**
 * function used in iterative construction of parametric primitive.
 *
 * @static
 * @method generator
 * @param {Number} c Radius of inner hole.
 * @param {Number} a Radius of tube.
 * @param {Number} u Longitudal progress from 0 to PI.
 * @param {Number} v Latitudal progress from 0 to PI.
 * @return {Array} x, y and z coordinate of the vertex.
 */
Torus.generator = function generator(c, a, u, v, pos) {
    pos[0] = (c + a * Math.cos(2 * v)) * Math.sin(2 * u);
    pos[1] = -(c + a * Math.cos(2 * v)) * Math.cos(2 * u);
    pos[2] = a * Math.sin(2 * v);
}

module.exports = Torus;

},{"../Geometry":384,"../GeometryHelper":385}],398:[function(require,module,exports){
'use strict';

var Geometry       = require('../Geometry');
var GeometryHelper = require('../GeometryHelper');

/**
 * This function returns a new static geometry, which is passed
 * custom buffer data.
 *
 * @class Triangle
 * @constructor
 *
 * @param {Object} options Parameters that alter the
 * vertex buffers of the generated geometry.
 * 
 * @return {Object} constructed geometry
 */
function Triangle (options) {
    var options  = options || {};
    var detail   = options.detail || 1;
    var normals  = [];
    var textureCoords = [
        0.0, 0.0,
        0.5, 1.0,
        1.0, 0.0
    ];
    var indices  = [
        0, 1, 2
    ];
    var vertices = [
        -1,  1, 0,
         0, -1, 0,
         1,  1, 0
    ];

    while(--detail) GeometryHelper.subdivide(indices, vertices, textureCoords);
    normals       = GeometryHelper.computeNormals(vertices, indices);

    return new Geometry({
        buffers: [
            { name: 'pos', data: vertices },
            { name: 'texCoord', data: textureCoords, size: 2 },
            { name: 'normals', data: normals },
            { name: 'indices', data: indices, size: 1 }
        ]
    });
}

module.exports = Triangle;

},{"../Geometry":384,"../GeometryHelper":385}],399:[function(require,module,exports){
'use strict';

var TextureRegistry = require('./TextureRegistry');

/** 
 * A list of glsl expressions which can interface with javascript data and
 * connected to each other to build custom shaders. 
 *
 */
var expressions = {};

var snippets = {

    /* Abs - The abs function returns the absolute value of x, i.e. x when x is positive or zero and -x for negative x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise.
     */ 

    abs: {glsl: 'abs(%1);'},
    /* Sign - The sign function returns 1.0 when x is positive, 0.0 when x is zero and -1.0 when x is negative. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise. */


    sign: {glsl: 'sign(%1);'},

    /* Floor - The floor function returns the largest integer number that is smaller or equal to x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise. */

    floor: {glsl: 'floor(%1);'},

    /* Ceiling - The ceiling function returns the smallest number that is larger or equal to x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise. */

    ceiling: {glsl: 'ceil(%1);'},

    /* The mod expression returns the remained of the division operation of the two inputs. */
    mod: {glsl: 'mod(%1, %2);'},

    /* Min - The min function returns the smaller of the two arguments. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */

    min: {glsl: 'min(%1, %2);'},

    /* Max - The max function returns the larger of the two arguments. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */ 

    max: {glsl: 'max(%1, %2);'},
    /* Clamp - The clamp function returns x if it is larger than minVal and smaller than maxVal. In case x is smaller than minVal, minVal is returned. If x is larger than maxVal, maxVal is returned. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */

    clamp: {glsl: 'clamp(%1, %2, %3);'},

    /* Mix - The mix function returns the linear blend of x and y, i.e. the product of x and (1 - a) plus the product of y and a. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */

    mix: {glsl: 'mix(%1, %2, %3);'},

    /* Step - The step function returns 0.0 if x is smaller then edge and otherwise 1.0. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */

    step: {glsl: 'step(%1, %2, %3);'},
    
    /* Smoothstep - The smoothstep function returns 0.0 if x is smaller then edge0 and 1.0 if x is larger than edge1. Otherwise the return value is interpolated between 0.0 and 1.0 using Hermite polynomirals. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */ 

    smoothstep: {glsl: 'smoothstep(%1);'},


    /* fragCoord - The fragCoord function returns the fragment's position in screenspace. */

    fragCoord: {glsl: 'gl_FragColor.xy;'},

    /* Sin - The sin function returns the sine of an angle in radians. The input parameter can be a floating scalar or a float vector. In case of a float vector the sine is calculated separately for every component. */


    sin: {glsl: 'sin(%1);'},

    /* Cos - The cos function returns the cosine of an angle in radians. The input parameter can be a floating scalar or a float vector. */

    cos: {glsl: 'cos(%1);'},

    /* Pow - The power function returns x raised to the power of y. The input parameters can be floating scalars or float vectors. In case of float vectors the operation is done component-wise. */ 

    pow: {glsl: 'pow(%1, %2);'},

    /* Sqrt - The sqrt function returns the square root of x. The input parameter can be a floating scalar or a float vector. In case of a float vector the operation is done component-wise. */ 

    /* fragCoord - The time function returns the elapsed time in the unix epoch in milliseconds.*/

    time: {glsl: 'time;'},

    /* The Add function takes two inputs, adds them together and outputs the result. This addition operation is performed on a per channel basis, meaning that the inputs' R channels get added, G channels get added, B channels get added, etc. Both inputs must have the same number of channels unless one of them is a single Constant value. Constants can be added to a vector with any number of inputs. */
    add: {glsl: '%1 + %2;'},

    /* The Add function takes two inputs, adds them together and outputs the result. This addition operation is performed on a per channel basis, meaning that the inputs' R channels get added, G channels get added, B channels get added, etc. Both inputs must have the same number of channels unless one of them is a single Constant value. Constants can be added to a vector with any number of inputs. */
    multiply: {glsl: '%1 * %2;'},


    /* The normal function returns the 3-dimensional surface normal, which is a vector that is perpendicular to the tangent plane at that point.*/
    normal: {glsl:'(v_Normal + 1.0) * 0.5;'},

    /* The uv function returns the 2-dimensional vector that maps the object's 3-dimensional vertices to a 2D plane. */
    uv: {glsl:'vec3(v_TextureCoordinate, 1);'},

    /* The mesh position function returns the transformed fragment's position in world-space.  */
    meshPosition: {glsl:'(v_Position + 1.0) * 0.5;'},


    /* The image function fetches the model's */
    image: {glsl:'texture2D(image, v_TextureCoordinate).rgb;'},


    /* The constant function returns a static value which is defined at compile-time that cannot be changed dynamically.*/
    constant: {glsl: '%1;'},
    
    /* The Parameter expression has values that can be modified (dynamically during runtime in some cases) in a MaterialInstance of the base material containing the parameter. These expressions should be given unique names, via the Parameter Name property, to be used when identifying the specific parameter in the MaterialInstance. If two parameters of the same type have the same name in the same material, they will be assumed to be the same parameter. Changing the value of the parameter in the MaterialInstance would change the value of both the parameter expressions in the material. A default value for the parameter will also be set in the base material. This will be the value of the parameter in the MaterialInstance unless it is overridden and modified there. */

    parameter: {uniforms: {parameter: 1}, glsl: 'parameter;'}
};

expressions.registerExpression = function registerExpression(name, schema) {
    this[name] = function (inputs, options) {
        return new Material(name, schema, inputs, options);
    };
};

for (var name in snippets) {
    expressions.registerExpression(name, snippets[name]);
}

/**
 * Material is a public class that composes a material-graph out of expressions
 *
 *
 * @class Material
 * @constructor
 *
 * @param {Object} definiton of nascent expression with shader code, inputs and uniforms
 * @param {Array} list of Material expressions, images, or constant
 * @param {Object} map of uniform data of float, vec2, vec3, vec4
 */

function Material(name, chunk, inputs, options) {
    options = options || {};

    this.name = name;
    this.chunk = chunk;
    this.inputs = inputs ? (Array.isArray(inputs) ? inputs : [inputs]): [];
    this.uniforms = options.uniforms || {};
    this.varyings = options.varyings;
    this.attributes = options.attributes;
    if (options.texture) {
        this.texture = options.texture.__isATexture__ ? options.texture : TextureRegistry.register(null, options.texture);
    }

    this._id = Material.id++;

    this.invalidations = [];
}

Material.id = 1;

/**
 * Iterates over material graph
 *
 * @method traverse
 * @chainable
 *
 * @param {Function} invoked upon every expression in the graph
 */

Material.prototype.traverse = function traverse(callback) {
    var len = this.inputs && this.inputs.length, idx = -1;

    while (++idx < len) traverse.call(this.inputs[idx], callback, idx);

    callback(this);

    return this;
};

Material.prototype.setUniform = function setUniform(name, value) {
    this.uniforms[name] = value;

    this.invalidations.push(name);
};

/**
 * Converts material graph into chunk
 *
 * @method _compile
 * @protected
 *
 */

Material.prototype._compile = function _compile() {
    var glsl = '';
    var uniforms = {};
    var varyings = {};
    var attributes = {};
    var defines = [];
    var texture;

    this.traverse(function (node, depth) {
        if (! node.chunk) return;
        glsl += 'vec3 ' + makeLabel(node) + '=' + processGLSL(node.chunk.glsl, node.inputs) + '\n ';
        if (node.uniforms) extend(uniforms, node.uniforms);
        if (node.varyings) extend(varyings, node.varyings);
        if (node.attributes) extend(attributes, node.attributes);
        if (node.chunk.defines) defines.push(node.chunk.defines);
        if (node.texture) texture = node.texture;
    });

    return {
        _id: this._id,
        glsl: glsl + 'return ' + makeLabel(this) + ';',
        defines: defines.join('\n'),
        uniforms: uniforms,
        varyings: varyings,
        attributes: attributes,
        texture: texture
    };
};

function extend (a, b) { for (var k in b) a[k] = b[k]; }

function processGLSL(str, inputs) {
    return str.replace(/%\d/g, function (s) {
        return makeLabel(inputs[s[1]-1]);
    });
}
function makeLabel (n) {
    if (Array.isArray(n)) return arrayToVec(n);
    if (typeof n == 'object') return 'fa_' + (n._id);
    else return JSON.stringify(n);
}

function arrayToVec(array) {
    var len = array.length;
    return 'vec' + len + '(' + array.join(',')  + ')';
}

module.exports = expressions;
expressions.Material = Material;
expressions.Texture = function (source) {
    if (typeof window === 'undefined') return console.error('Texture constructor cannot be run inside of a worker');
    return expressions.image([], { texture: source });
};

},{"./TextureRegistry":400}],400:[function(require,module,exports){
'use strict';

/*
 * A singleton object that holds texture instances in a registry which
 * can be accessed by key.  Allows for texture sharing and easy referencing.
 *
 * @static
 * @class TextureRegistry
 */
var TextureRegistry = {
	registry: {},
	textureIds: 1
};

/*
 * Registers a new Texture object with a unique id and input parameters to be
 * handled by the WebGLRenderer.  If no accessor is input the texture will be 
 * created but not store in the registry.
 *
 * @method register
 *
 * @param {String} accessor Key used to later access the texture object.
 * @param {Object | Array | String} data Data to be used in the WebGLRenderer to
 * generate texture data.
 * @param {Object} options Optional parameters to affect the rendering of the
 * WebGL texture.
 *
 * @return {Object} Newly generated texture object.
 */
TextureRegistry.register = function register(accessor, data, options) {
	if (accessor) return (this.registry[accessor] = { id: this.textureIds++, __isATexture__: true, data: data, options: options });
	else return { id: this.textureIds++, data: data, __isATexture__: true, options: options };
};

/*
 * Retreives the texture object from registry.  Throws if no texture is
 * found at given key.
 *
 * @method get
 *
 * @param {String} accessor Key of a desired texture in the registry.
 *
 * @return {Object} Desired texture object.
 */
TextureRegistry.get = function get(accessor) {
	if (!this.registry[accessor]) {
		throw 'Texture "' + accessor + '" not found!';
	}
	else {
		return this.registry[accessor];
	}
}

module.exports = TextureRegistry;

},{}],401:[function(require,module,exports){
'use strict';

module.exports = {
    Material: require('./Material'),
    TextureRegistry: require('./TextureRegistry')
};
},{"./Material":399,"./TextureRegistry":400}],402:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],403:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":406,"dup":2}],404:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":403,"./TweenTransition":405,"dup":3}],405:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":402,"dup":4}],406:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],407:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":402,"./MultipleTransition":403,"./Transitionable":404,"./TweenTransition":405,"./after":406,"dup":6}],408:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],409:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":407}],410:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":409,"dup":29}],411:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],412:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],413:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],414:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],415:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],416:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":408,"./Color":409,"./ColorPalette":410,"./KeyCodes":411,"./MethodStore":412,"./ObjectManager":413,"./clone":414,"./flatClone":415,"./loadURL":417,"./strip":418,"dup":35}],417:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],418:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],419:[function(require,module,exports){
arguments[4][198][0].apply(exports,arguments)
},{"dup":198}],420:[function(require,module,exports){
arguments[4][199][0].apply(exports,arguments)
},{"./Mat33":419,"dup":199}],421:[function(require,module,exports){
arguments[4][200][0].apply(exports,arguments)
},{"dup":200}],422:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"dup":201}],423:[function(require,module,exports){
arguments[4][202][0].apply(exports,arguments)
},{"./Mat33":419,"./Quaternion":420,"./Vec2":421,"./Vec3":422,"dup":202}],424:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],425:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":428,"dup":2}],426:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":425,"./TweenTransition":427,"dup":3}],427:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":424,"dup":4}],428:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],429:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":424,"./MultipleTransition":425,"./Transitionable":426,"./TweenTransition":427,"./after":428,"dup":6}],430:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],431:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":429}],432:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":431,"dup":29}],433:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],434:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],435:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],436:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],437:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],438:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":430,"./Color":431,"./ColorPalette":432,"./KeyCodes":433,"./MethodStore":434,"./ObjectManager":435,"./clone":436,"./flatClone":437,"./loadURL":439,"./strip":440,"dup":35}],439:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],440:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],441:[function(require,module,exports){
arguments[4][383][0].apply(exports,arguments)
},{"./Geometry":442,"dup":383}],442:[function(require,module,exports){
arguments[4][384][0].apply(exports,arguments)
},{"dup":384}],443:[function(require,module,exports){
arguments[4][385][0].apply(exports,arguments)
},{"dup":385,"famous-math":423}],444:[function(require,module,exports){
arguments[4][386][0].apply(exports,arguments)
},{"./GeometryHelper":443,"dup":386,"famous-utilities":438}],445:[function(require,module,exports){
arguments[4][387][0].apply(exports,arguments)
},{"./DynamicGeometry":441,"./Geometry":442,"./GeometryHelper":443,"./OBJLoader":444,"./primitives/Box":446,"./primitives/Circle":447,"./primitives/Cylinder":448,"./primitives/GeodesicSphere":449,"./primitives/Icosahedron":450,"./primitives/ParametricCone":451,"./primitives/Plane":452,"./primitives/Sphere":453,"./primitives/Tetrahedron":454,"./primitives/Torus":455,"./primitives/Triangle":456,"dup":387}],446:[function(require,module,exports){
arguments[4][388][0].apply(exports,arguments)
},{"../Geometry":442,"dup":388}],447:[function(require,module,exports){
arguments[4][389][0].apply(exports,arguments)
},{"../Geometry":442,"dup":389}],448:[function(require,module,exports){
arguments[4][390][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":390}],449:[function(require,module,exports){
arguments[4][391][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":391}],450:[function(require,module,exports){
arguments[4][392][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":392}],451:[function(require,module,exports){
arguments[4][393][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":393}],452:[function(require,module,exports){
arguments[4][394][0].apply(exports,arguments)
},{"../Geometry":442,"dup":394}],453:[function(require,module,exports){
arguments[4][395][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":395}],454:[function(require,module,exports){
arguments[4][396][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":396}],455:[function(require,module,exports){
arguments[4][397][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":397}],456:[function(require,module,exports){
arguments[4][398][0].apply(exports,arguments)
},{"../Geometry":442,"../GeometryHelper":443,"dup":398}],457:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;
var Color = require('famous-utilities').Color;
var Geometry = require('famous-webgl-geometries');

/**
 * The Mesh class is responsible for providing the API for how
 * a RenderNode will interact with the WebGL API by adding
 * a set of commands to the renderer.
 *
 * @class Mesh
 * @constructor
 * @renderable
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved
 * @param {object} Options Optional params for configuring Mesh
 */
function Mesh (dispatch, options) {
    this.dispatch = dispatch;
    this.queue = [];
    this._id = dispatch.addRenderable(this);

    this._color = new Color();
    this._glossiness = new Transitionable(0);
    this._positionOffset = new Transitionable([0, 0, 0]);
    this._metallness = new Transitionable(0);
    this._normals = new Transitionable([0, 0, 0]);

    this._origin = new Float32Array([0, 0, 0]);
    this._size = [];
    this._expressions = {};
    this._geometry;
    this._flatShading = 0;

    init.call(this);

    if (options) this.setOptions(options);
}

/**
* Returns the definition of the Class: 'Mesh'
*
* @method toString
* @return {string} definition
*/
Mesh.toString = function toString() {
    return 'Mesh';
};

/**
 * Init function for setting up listeners for changes from the scene graph.
 *
 * @private
 */
function init() {
    var dispatch = this.dispatch;
    dispatch.onTransformChange(this._receiveTransformChange.bind(this));
    dispatch.onSizeChange(this._receiveSizeChange.bind(this));
    dispatch.onOpacityChange(this._receiveOpacityChange.bind(this));
    dispatch.onOriginChange(this._receiveOriginChange.bind(this));
    this._receiveTransformChange(dispatch.getContext()._transform);
    this._receiveOriginChange(dispatch.getContext()._origin);
};

/**
 * Receives transform change updates from the scene graph.
 *
 * @private
 */
Mesh.prototype._receiveTransformChange = function _receiveTransformChange(transform) {
    this.dispatch.dirtyRenderable(this._id);
    this.queue.push('GL_UNIFORMS');
    this.queue.push('transform');
    this.queue.push(transform._matrix);
};

/**
 * Receives size change updates from the scene graph.
 *
 * @private
 */
Mesh.prototype._receiveSizeChange = function _receiveSizeChange(size) {
    var size = size.getTopDownSize();
    this.dispatch.dirtyRenderable(this._id);

    this._size[0] = size[0];
    this._size[1] = size[1];
    this._size[2] = size[2];

    this.queue.push('GL_UNIFORMS');
    this.queue.push('size');
    this.queue.push(size);
};

/**
 * Receives origin change updates from the scene graph.
 *
 * @private
 */
Mesh.prototype._receiveOriginChange = function _receiveOriginChange(origin) {
    this.dispatch.dirtyRenderable(this._id);
    this.queue.push('GL_UNIFORMS');
    this.queue.push('origin');
    this._origin[0] = origin.x;
    this._origin[1] = origin.y;
    this._origin[2] = origin.z;
    this.queue.push(this._origin);
};

/**
 * Receives opacity change updates from the scene graph.
 *
 * @private
 */
Mesh.prototype._receiveOpacityChange = function _receiveOpacityChange(opacity) {
    this.dispatch.dirtyRenderable(this._id);
    this.queue.push('GL_UNIFORMS');
    this.queue.push('opacity');
    this.queue.push(opacity.value);
};

/**
 * Returns the size of Mesh.
 *
 * @method getSize
 * @returns {array} Size Returns size
 */
Mesh.prototype.getSize = function getSize() {
    return this._size;
};

/**
 * Set the geometry of a mesh.
 *
 * @method setGeometry
 * @chainable
 *
 * @param {Geometry} geometry instance to be associated with the mesh
 * @param {Object} Options Various configurations for geometries.
 * @chainable
 */
Mesh.prototype.setGeometry = function setGeometry(geometry, options) {
    var i;
    var key;
    var buffers;
    var bufferIndex;

    if (typeof geometry === 'string') {
        if (!Geometry[geometry]) throw 'Invalid geometry: "' + geometry + '".';
        else geometry = new Geometry[geometry](options);
    }

    if (this._geometry !== geometry) {
        this.queue.push('GL_SET_GEOMETRY');
        this.queue.push(geometry.id);
        this.queue.push(geometry.spec.type);
        this.queue.push(geometry.spec.dynamic);

        this._geometry = geometry;
    }

    return this;
};

/**
 * Get the geometry of a mesh.
 *
 * @method getGeometry
 * @returns {Geometry} geometry Geometry of mesh
 */
Mesh.prototype.getGeometry = function getGeometry() {
    return this._geometry;
};

/**
* Returns boolean: if true, renderable is to be updated on next engine tick
*
* @private
* @method clean
* @returns {boolean} Boolean
*/
Mesh.prototype.clean = function clean() {
    var path = this.dispatch.getRenderPath();

    this.dispatch
        .sendDrawCommand('WITH')
        .sendDrawCommand(path);

    var bufferIndex;
    if (this._geometry) {
        i = this._geometry.spec.invalidations.length;
        while (i--) {
            bufferIndex = this._geometry.spec.invalidations.pop();
            this.dispatch.sendDrawCommand('GL_BUFFER_DATA');
            this.dispatch.sendDrawCommand(this._geometry.id);
            this.dispatch.sendDrawCommand(this._geometry.spec.bufferNames[i]);
            this.dispatch.sendDrawCommand(this._geometry.spec.bufferValues[i]);
            this.dispatch.sendDrawCommand(this._geometry.spec.bufferSpacings[i]);
        }
    }

    var baseColor = this._expressions.baseColor;
    var uniformKey;
    if (baseColor) {
        i = baseColor.invalidations.length;
        while (i--) {
            uniformKey = baseColor.invalidations.pop();
            this.dispatch.sendDrawCommand('GL_UNIFORMS');
            this.dispatch.sendDrawCommand(uniformKey);
            this.dispatch.sendDrawCommand(baseColor.uniforms[uniformKey]);
        }
    }

    var positionOffset = this._expressions.positionOffset;
    if (positionOffset) {
        i = positionOffset.invalidations.length;
        while (i--) {
            uniformKey = positionOffset.invalidations.pop();
            this.dispatch.sendDrawCommand('GL_UNIFORMS');
            this.dispatch.sendDrawCommand(uniformKey);
            this.dispatch.sendDrawCommand(positionOffset.uniforms[uniformKey]);
        }
    }

    var i = this.queue.length;
    while (i--) this.dispatch.sendDrawCommand(this.queue.shift());

    if (this._color.isActive()) {
        this.dispatch.sendDrawCommand('GL_UNIFORMS');
        this.dispatch.sendDrawCommand('baseColor');
        this.dispatch.sendDrawCommand(this._color.getNormalizedRGB());
        return true;
    }

    if (this._glossiness.isActive()) {
        this.dispatch.sendDrawCommand('GL_UNIFORMS');
        this.dispatch.sendDrawCommand('glossiness');
        this.dispatch.sendDrawCommand(this._glossiness.get());
        return true;
    }

    return this.queue.length;
};

/**
* Changes the color of Mesh, passing either a material expression or a basic
* color using 'Color' as its helper. If no material expression is passed in,
* then the Color accepts various inputs and an optional options parameter for
* tweening colors. Its default parameters are in RGB, however, you can also
* specify different inputs.
* setBaseColor(r, g, b, option)
* setBaseColor('rgb', 0, 0, 0, option)
* setBaseColor('hsl', 0, 0, 0, option)
* setBaseColor('hsv', 0, 0, 0, option)
* setBaseColor('hex', '#000000', option)
* setBaseColor('#000000', option)
* setBaseColor('black', option)
* setBaseColor(Color)
* @method setBaseColor
* @param {Object, Array} Material, image, or vec3
* @param {number} r Used to set the r value of Color
* @param {number} g Used to set the g value of Color
* @param {number} b Used to set the b value of Color
* @param {object} options Optional options argument for tweening colors
* @chainable
*/
Mesh.prototype.setBaseColor = function setBaseColor() {
    this.dispatch.dirtyRenderable(this._id);
    var materialExpression = Array.prototype.concat.apply([], arguments);

    if (materialExpression[0]._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.baseColor = materialExpression[0];
        materialExpression = materialExpression[0]._compile();
    }
    else {
        this.queue.push('GL_UNIFORMS');
        if (this._expressions.baseColor) this._expressions.baseColor = null;
        if (materialExpression[0] instanceof Color) {
            this._color = materialExpression[0];
        }
        else {
            this._color.set(materialExpression);
        }
        materialExpression = this._color.getNormalizedRGB();
    }
    this.queue.push('baseColor');
    this.queue.push(materialExpression);
    return this;
};


/**
 * Returns either the material expression or the color of Mesh.
 *
 * @method getBaseColor
 * @returns {MaterialExpress|Color}
 */
Mesh.prototype.getBaseColor = function getBaseColor(option) {
    return this._expressions.baseColor || this._color.getColor(option);
};

/**
 * Change whether the Mesh is affected by light. Default is true.
 *
 * @method setFlatShading
 * @param {boolean} Boolean
 * @chainable
 */
Mesh.prototype.setFlatShading = function setFlatShading(bool) {
    this.dispatch.dirtyRenderable(this._id);
    this._flatShading = bool ? 1 : 0;
    this.queue.push('GL_UNIFORMS');
    this.queue.push('u_FlatShading');
    this.queue.push(this._flatShading);
    return this;
};

/**
 * Returns a boolean for whether Mesh is affected by light.
 *
 * @method getFlatShading
 * @returns {boolean} Boolean
 */
Mesh.prototype.getFlatShading = function getFlatShading() {
    return this._flatShading ? true : false;
};


/**
 * Defines a 3-element map which is used to provide significant physical
 * detail to the surface by perturbing the facing direction of each individual
 * pixel.
 *
 * @method normal
 * @chainable
 *
 * @param {Object, Array} Material, Image or vec3
 * @return {Element} current Mesh
 */
Mesh.prototype.setNormals = function setNormals(materialExpression) {
    this.dispatch.dirtyRenderable(this._id);
    if (materialExpression._compile) materialExpression = materialExpression._compile();
    this.queue.push(typeof materialExpression === 'number' ? 'UNIFORM_INPUT' : 'MATERIAL_INPUT');
    this.queue.push('normal');
    this.queue.push(materialExpression);
    return this;
};

/**
 * Returns the Normals expression of Mesh (work in progress)
 *
 * @method getNormals
 * @returns The normals expression for Mesh
 */
Mesh.prototype.getNormals = function getNormals(materialExpression) {
    return null;
};

/**
 * Defines the glossiness of the mesh from either a material expression or a
 * scalar value
 *
 * @method setGlossiness
 * @param {MaterialExpression|Number}
 * @param {Object} Options Optional paramter to be passed with scalar
 * glossiness for tweening.
 * @chainable
 */
Mesh.prototype.setGlossiness = function setGlossiness() {
    this.dispatch.dirtyRenderable(this._id);
    var materialExpression = Array.prototype.concat.apply([], arguments);

    if (materialExpression[0]._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.glossiness = materialExpression[0];
        materialExpression = materialExpression[0]._compile();
    }
    else {
        this._glossiness.set(materialExpression[0], materialExpression[1]);
        this._expressions.glossiness = null;
        this.queue.push('GL_UNIFORMS');
        materialExpression = this._glossiness.get();
    }

    this.queue.push('glossiness');
    this.queue.push(materialExpression);
    return this;
};

/**
 * Returns material expression or scalar value for glossiness.
 *
 * @method getGlossiness
 * @returns {MaterialExpress|Number}
 */
Mesh.prototype.getGlossiness = function getGlossiness(materialExpression) {
    return this._expressions.glossiness || this._glossiness.get();
};

/**
 * Defines 1 element map which describes the electrical conductivity of a
 * material.
 *
 * @method metallic
 * @chainable
 *
 * @param {Object} Material or Image
 * @return {Element} current Mesh
 */
Mesh.prototype.setMetallness = function setMetallness(materialExpression) {
    this.dispatch.dirtyRenderable(this._id);
    if (materialExpression._compile) materialExpression = materialExpression._compile();
    this.queue.push(typeof materialExpression === 'number' ? 'UNIFORM_INPUT' : 'MATERIAL_INPUT');
    this.queue.push('metallic');
    this.queue.push(materialExpression);
    return this;
};

/**
 * Returns material expression for metallness.
 *
 * @method getMetallness
 * @returns {MaterialExpress}
 */
Mesh.prototype.getMetallness = function getMetallness() {
    return this._expressions.metallness || this._metallness.get();
};

/**
 * Defines 3 element map which displaces the position of each vertex in world
 * space.
 *
 * @method setPositionOffset
 * @chainable
 *
 * @param {Object} Material Expression
 * @chainable
 */
Mesh.prototype.setPositionOffset = function positionOffset(materialExpression) {
    this.dispatch.dirtyRenderable(this._id);
    var materialExpression = Array.prototype.concat.apply([], arguments);

    if (materialExpression[0]._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.positionOffset = materialExpression[0];
        materialExpression = materialExpression[0]._compile();
    }
    else {
        this._positionOffset.set(materialExpression[0], materialExpression[1]);
        this._expressions.positionOffset = null;
        this.queue.push('GL_UNIFORMS');
        materialExpression = this._positionOffset.get();
    }

    this.queue.push('positionOffset');
    this.queue.push(materialExpression);
    return this;
};

/**
 * Returns position offset.
 *
 * @method getPositionOffset
 * @returns {MaterialExpress|Number}
 */
Mesh.prototype.getPositionOffset = function getPositionOffset(materialExpression) {
    return this._expressions.positionOffset || this._positionOffset.get();
};

/**
 * Defines 3 element map which displaces the position of each vertex in world
 * space.
 *
 * @method setOptions
 * @chainable
 *
 * @param {Object} Options
 * @chainable
 */
Mesh.prototype.setOptions = function setOptions(options) {
    this.queue.push('GL_SET_DRAW_OPTIONS');
    this.queue.push(options);
    return this;
};

module.exports = Mesh;

},{"famous-transitions":233,"famous-utilities":416,"famous-webgl-geometries":445}],458:[function(require,module,exports){
'use strict';

module.exports = {
    Mesh: require('./Mesh'),
    PointLight: require('./lights/PointLight'),
    AmbientLight: require('./lights/AmbientLight'),
};

},{"./Mesh":457,"./lights/AmbientLight":459,"./lights/PointLight":461}],459:[function(require,module,exports){
'use strict';

var Light = require('./Light');


/**
 * AmbientLight extends the functionality of Light. It sets the ambience in
 * the scene. Ambience is a light source that emits light in the entire
 * scene, evenly.
 *
 * @class AmbientLight
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved
 * from the corresponding Render Node
 */
var AmbientLight = function AmbientLight(dispatch) {
    Light.call(this, dispatch);

    this.commands = {
        color: 'GL_AMBIENT_LIGHT'
    };
};

/**
* Returns the definition of the Class: 'AmbientLight'
*
* @method toString
* @return {string} definition
*/
AmbientLight.toString = function toString() {
    return 'AmbientLight';
};

/**
 * Extends Light constructor
 */
AmbientLight.prototype = Object.create(Light.prototype);

/**
 * Sets AmbientLight as the constructor
 */
AmbientLight.prototype.constructor = AmbientLight;

module.exports = AmbientLight;

},{"./Light":460}],460:[function(require,module,exports){
'use strict';

var Color = require('famous-utilities').Color;

/**
 * The blueprint for all light components for inheriting common functionality.
 *
 * @class Light
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved
 * from the corresponding Render Node
 */
function Light(dispatch) {
    this._dispatch = dispatch;
    this._id = dispatch.addComponent(this);
    this.queue = [];
    this._color = new Color();
    this.commands = { color: '' };
};

/**
* Returns the definition of the Class: 'Light'
*
* @method toString
* @return {string} definition
*/
Light.toString = function toString() {
    return 'Light';
};

/**
* Changes the color of the light, using 'Color' as its helper. It accepts an
* optional options parameter for tweening colors. Its default parameters are
* in RGB, however, you can also specify different inputs.
* setColor(r, g, b, option)
* setColor('rgb', 0, 0, 0, option)
* setColor('hsl', 0, 0, 0, option)
* setColor('hsv', 0, 0, 0, option)
* setColor('hex', '#000000', option)
* setColor('#000000', option)
* setColor('black', option)
* setColor(Color)
* @method setColor
* @param {number} r Used to set the r value of Color
* @param {number} g Used to set the g value of Color
* @param {number} b Used to set the b value of Color
* @param {object} options Optional options argument for tweening colors
* @chainable
*/
Light.prototype.setColor = function setColor() {
    this._dispatch.dirtyComponent(this._id);
    var values = Color.flattenArguments(arguments);

    if (values[0] instanceof Color) {
        this._color = values[0];
    }

    this._color.set(values);
    this.queue.push(this.commands.color);
    var color = this._color.getNormalizedRGB();
    this.queue.push(color[0]);
    this.queue.push(color[1]);
    this.queue.push(color[2]);
    return this;
};

/**
* Returns the current color value. Defaults to RGB values if no option is
* provided.

* @method getColor
* @param {string} option An optional specification for returning colors in
* different formats: RGB, HSL, Hex, HSV
* @returns {number} value The color value. Defaults to RGB.
*/
Light.prototype.getColor = function getColor(option) {
    return this._color.getColor(option);
};

/**
* Returns boolean: if true, component is to be updated on next engine tick
*
* @private
* @method clean
* @returns {boolean} Boolean
*/
Light.prototype.clean = function clean() {
    var path = this._dispatch.getRenderPath();

    this._dispatch
        .sendDrawCommand('WITH')
        .sendDrawCommand(path);

    var i = this.queue.length;
    while (i--) {
        this._dispatch.sendDrawCommand(this.queue.shift());
    }

    if (this._color.isActive()) {
        this._dispatch.sendDrawCommand(this.commands.color);
        var color = this._color.getNormalizedRGB();
        this._dispatch.sendDrawCommand(color[0]);
        this._dispatch.sendDrawCommand(color[1]);
        this._dispatch.sendDrawCommand(color[2]);
        return true;
    }

    return this.queue.length;
};

module.exports = Light;

},{"famous-utilities":416}],461:[function(require,module,exports){
'use strict';

var Light = require('./Light');

/**
 * PointLight extends the functionality of Light. PointLight is a light source
 * that emits light in all directions from a point in space.
 *
 * @class PointLight
 * @constructor
 * @component
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved
 * from the corresponding Render Node
 */
var PointLight = function PointLight(dispatch) {
    Light.call(this, dispatch);

    this.commands = {
        color: 'GL_LIGHT_COLOR',
        position: 'GL_LIGHT_POSITION'
    };

    this._receiveTransformChange(this._dispatch.getContext()._transform);
    this._dispatch.onTransformChange(this._receiveTransformChange.bind(this));
};

/**
* Returns the definition of the Class: 'PointLight'
*
* @method toString
* @return {string} definition
*/
PointLight.toString = function toString() {
    return 'PointLight';
};

/**
 * Extends Light constructor
 */
PointLight.prototype = Object.create(Light.prototype);

/**
 * Sets PointLight as the constructor
 */
PointLight.prototype.constructor = PointLight;

/**
 * Receives transform change updates from the scene graph.
 *
 * @private
 */
PointLight.prototype._receiveTransformChange = function _receiveTransformChange(transform) {
    this._dispatch.dirtyComponent(this._id);
    this.queue.push(this.commands.position);
    this.queue.push(transform._matrix[12]);
    this.queue.push(transform._matrix[13]);
    this.queue.push(transform._matrix[14]);
};

module.exports = PointLight;

},{"./Light":460}],462:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}],463:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"./after":466,"dup":2}],464:[function(require,module,exports){
arguments[4][3][0].apply(exports,arguments)
},{"./MultipleTransition":463,"./TweenTransition":465,"dup":3}],465:[function(require,module,exports){
arguments[4][4][0].apply(exports,arguments)
},{"./Easing":462,"dup":4}],466:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],467:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"./Easing":462,"./MultipleTransition":463,"./Transitionable":464,"./TweenTransition":465,"./after":466,"dup":6}],468:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],469:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28,"famous-transitions":467}],470:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"./Color":469,"dup":29}],471:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],472:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],473:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],474:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],475:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],476:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"./CallbackStore":468,"./Color":469,"./ColorPalette":470,"./KeyCodes":471,"./MethodStore":472,"./ObjectManager":473,"./clone":474,"./flatClone":475,"./loadURL":477,"./strip":478,"dup":35}],477:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],478:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"dup":37}],479:[function(require,module,exports){
arguments[4][317][0].apply(exports,arguments)
},{"dup":317}],480:[function(require,module,exports){
arguments[4][318][0].apply(exports,arguments)
},{"dup":318}],481:[function(require,module,exports){
arguments[4][319][0].apply(exports,arguments)
},{"dup":319,"glslify":479,"glslify/simple-adapter.js":480}],482:[function(require,module,exports){
arguments[4][320][0].apply(exports,arguments)
},{"dup":320}],483:[function(require,module,exports){
arguments[4][321][0].apply(exports,arguments)
},{"./Buffer":482,"dup":321}],484:[function(require,module,exports){
arguments[4][322][0].apply(exports,arguments)
},{"dup":322}],485:[function(require,module,exports){
arguments[4][323][0].apply(exports,arguments)
},{"dup":323,"famous-utilities":476,"famous-webgl-shaders":481}],486:[function(require,module,exports){
arguments[4][324][0].apply(exports,arguments)
},{"dup":324}],487:[function(require,module,exports){
arguments[4][325][0].apply(exports,arguments)
},{"./Buffer":482,"./BufferRegistry":483,"./Checkerboard":484,"./Program":485,"./Texture":486,"dup":325}],488:[function(require,module,exports){
arguments[4][326][0].apply(exports,arguments)
},{"./Buffer":482,"./BufferRegistry":483,"./Checkerboard":484,"./Program":485,"./Texture":486,"./WebGLRenderer":487,"dup":326}],489:[function(require,module,exports){
arguments[4][317][0].apply(exports,arguments)
},{"dup":317}],490:[function(require,module,exports){
arguments[4][318][0].apply(exports,arguments)
},{"dup":318}],491:[function(require,module,exports){
arguments[4][319][0].apply(exports,arguments)
},{"dup":319,"glslify":489,"glslify/simple-adapter.js":490}]},{},[184])(184)
});