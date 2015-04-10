(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./operator":2}],2:[function(require,module,exports){
'use strict';

function handleArrayInput (operator, a, b) {
    if (Array.isArray(b)) {
        for (var i = 0; i < b.length; i++) {
            if (b === a.length) return;
            a[i] = operations[operator](a[i], b[i]);
        };
    }
    else {
        for (var i = 0; i < a.length; i++) {
            a[i] = operations[operator](a[i], b);
        };
    }

    return a;
}

// Check for number/string/array
function isTypeValid(input) {
    return !isNaN(input) || typeof(input) === 'string' || Array.isArray(input);
}

// Convenient state operators.
var operations = {
    '+': function(a, b) { return a + b },
    '-': function(a, b) { return a - b },
    '*': function(a, b) { return a * b },
    '/': function(a, b) { return a / b },
    'pow': function(a, b) { return Math.pow(a, b) },
    'sqrt': function(a) { return Math.sqrt(a) },
    'abs': function(a) { return Math.abs(a) },
    'sin': function(a) { return Math.sin(a) },
    'cos': function(a) { return Math.cos(a) },
    'tan': function(a) { return Math.tan(a) },
    'ceil': function(a) { return Math.floor(a) },
    'floor': function(a) { return Math.floor(a) },

    'concat': function(a, b) { return a.concat(b) },
    'substring': function(a, b) { return a.substring(b[0], b[1]) },
    'toLower': function(a) { return a.toLowerCase() },
    'toUpper': function(a) { return a.toUpperCase() },

    'flip': function(a) { return !a },
    'toInt': function(a) { return a ? 1 : 0 },
}

 module.exports = {
    operate: function(operator, currentValue, newValue) {
        if (newValue) {
            if (!(isTypeValid(currentValue) && isTypeValid(newValue))) {
                console.warn('<currentValue :', currentValue, '> or <newValue: ', newValue, '> is not a valid input type')
                throw new Error('Invalid input');
            }
            else if (!Array.isArray(currentValue) && Array.isArray(newValue)) {
                if (typeof(currentValue) !== 'string') { // special case for 'substring' operation
                    console.warn('An array can not be used as input to operate on a non-array');
                    throw new Error('Invalid input');
                }
            }
        }

        if (Array.isArray(currentValue)) {
            return handleArrayInput(operator, currentValue, newValue);
        }
        else {
            return operations[operator](currentValue, newValue)
        }
     },
     addOperation: function(name, func) {
        operations[name] = func;
     }
 }

 

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('is-array')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var kMaxLength = 0x3fffffff
var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Note:
 *
 * - Implementation must support adding new properties to `Uint8Array` instances.
 *   Firefox 4-29 lacked support, fixed in Firefox 30+.
 *   See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *  - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *  - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *    incorrect length in some situations.
 *
 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they will
 * get the Object implementation, which is slower but will work correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = (function () {
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        new Uint8Array(1).subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding) {
  var self = this
  if (!(self instanceof Buffer)) return new Buffer(subject, encoding)

  var type = typeof subject
  var length

  if (type === 'number') {
    length = +subject
  } else if (type === 'string') {
    length = Buffer.byteLength(subject, encoding)
  } else if (type === 'object' && subject !== null) {
    // assume object is array-like
    if (subject.type === 'Buffer' && isArray(subject.data)) subject = subject.data
    length = +subject.length
  } else {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (length > kMaxLength) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x' +
      kMaxLength.toString(16) + ' bytes')
  }

  if (length < 0) length = 0
  else length >>>= 0 // coerce to uint32

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    self = Buffer._augment(new Uint8Array(length)) // eslint-disable-line consistent-this
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    self.length = length
    self._isBuffer = true
  }

  var i
  if (Buffer.TYPED_ARRAY_SUPPORT && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    self._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    if (Buffer.isBuffer(subject)) {
      for (i = 0; i < length; i++) {
        self[i] = subject.readUInt8(i)
      }
    } else {
      for (i = 0; i < length; i++) {
        self[i] = ((subject[i] % 256) + 256) % 256
      }
    }
  } else if (type === 'string') {
    self.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer.TYPED_ARRAY_SUPPORT) {
    for (i = 0; i < length; i++) {
      self[i] = 0
    }
  }

  if (length > 0 && length <= Buffer.poolSize) self.parent = rootParent

  return self
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length
  for (var i = 0, len = Math.min(x, y); i < len && a[i] === b[i]; i++) {}
  if (i !== len) {
    x = a[i]
    y = b[i]
  }
  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, totalLength) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (totalLength === undefined) {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

Buffer.byteLength = function byteLength (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    case 'hex':
      ret = str.length >>> 1
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    default:
      ret = str.length
  }
  return ret
}

// pre-set for values that may exist in the future
Buffer.prototype.length = undefined
Buffer.prototype.parent = undefined

// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function toString (encoding, start, end) {
  var loweredCase = false

  start = start >>> 0
  end = end === undefined || end === Infinity ? this.length : end >>> 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

function asciiWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  var charsWritten = blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function utf16leWrite (buf, string, offset, length) {
  var charsWritten = blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0

  if (length < 0 || offset < 0 || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = utf16leWrite(this, string, offset, length)
      break
    default:
      throw new TypeError('Unknown encoding: ' + encoding)
  }
  return ret
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) >>> 0 & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = value
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = value
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkInt(
      this, value, offset, byteLength,
      Math.pow(2, 8 * byteLength - 1) - 1,
      -Math.pow(2, 8 * byteLength - 1)
    )
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = value
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = value
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = value
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = value
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, target_start, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (target_start >= target.length) target_start = target.length
  if (!target_start) target_start = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (target_start < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - target_start < end - start) {
    end = target.length - target_start + start
  }

  var len = end - start

  if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < len; i++) {
      target[i + target_start] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-z\-]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []
  var i = 0

  for (; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (leadSurrogate) {
        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        } else {
          // valid surrogate pair
          codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
          leadSurrogate = null
        }
      } else {
        // no lead yet

        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else {
          // valid lead
          leadSurrogate = codePoint
          continue
        }
      }
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      leadSurrogate = null
    }

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x200000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

},{"base64-js":5,"ieee754":6,"is-array":7}],5:[function(require,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],6:[function(require,module,exports){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],7:[function(require,module,exports){

/**
 * isArray
 */

var isArray = Array.isArray;

/**
 * toString
 */

var str = Object.prototype.toString;

/**
 * Whether or not the given `val`
 * is an array.
 *
 * example:
 *
 *        isArray([]);
 *        // > true
 *        isArray(arguments);
 *        // > false
 *        isArray('');
 *        // > false
 *
 * @param {mixed} val
 * @return {bool}
 */

module.exports = isArray || function (val) {
  return !! val && '[object Array]' == str.call(val);
};

},{}],8:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
module.exports = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

},{}],11:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":12}],12:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],13:[function(require,module,exports){
module.exports = require("./lib/_stream_duplex.js")

},{"./lib/_stream_duplex.js":14}],14:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

module.exports = Duplex;

/*<replacement>*/
var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}
/*</replacement>*/


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

forEach(objectKeys(Writable.prototype), function(method) {
  if (!Duplex.prototype[method])
    Duplex.prototype[method] = Writable.prototype[method];
});

function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false)
    this.readable = false;

  if (options && options.writable === false)
    this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended)
    return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  process.nextTick(this.end.bind(this));
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

}).call(this,require('_process'))
},{"./_stream_readable":16,"./_stream_writable":18,"_process":12,"core-util-is":19,"inherits":9}],15:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function(chunk, encoding, cb) {
  cb(null, chunk);
};

},{"./_stream_transform":17,"core-util-is":19,"inherits":9}],16:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Readable;

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/


/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Readable.ReadableState = ReadableState;

var EE = require('events').EventEmitter;

/*<replacement>*/
if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

var Stream = require('stream');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var StringDecoder;

util.inherits(Readable, Stream);

function ReadableState(options, stream) {
  options = options || {};

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.buffer = [];
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = false;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // In streams that never have any data, and do push(null) right away,
  // the consumer can miss the 'end' event if they do some I/O before
  // consuming the stream.  So, we don't emit('end') until some reading
  // happens.
  this.calledRead = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;


  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder)
      StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function(chunk, encoding) {
  var state = this._readableState;

  if (typeof chunk === 'string' && !state.objectMode) {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = new Buffer(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null || chunk === undefined) {
    state.reading = false;
    if (!state.ended)
      onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var e = new Error('stream.unshift() after end event');
      stream.emit('error', e);
    } else {
      if (state.decoder && !addToFront && !encoding)
        chunk = state.decoder.write(chunk);

      // update the buffer info.
      state.length += state.objectMode ? 1 : chunk.length;
      if (addToFront) {
        state.buffer.unshift(chunk);
      } else {
        state.reading = false;
        state.buffer.push(chunk);
      }

      if (state.needReadable)
        emitReadable(stream);

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}



// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended &&
         (state.needReadable ||
          state.length < state.highWaterMark ||
          state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function(enc) {
  if (!StringDecoder)
    StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
};

// Don't raise the hwm > 128MB
var MAX_HWM = 0x800000;
function roundUpToNextPowerOf2(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2
    n--;
    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
    n++;
  }
  return n;
}

function howMuchToRead(n, state) {
  if (state.length === 0 && state.ended)
    return 0;

  if (state.objectMode)
    return n === 0 ? 0 : 1;

  if (n === null || isNaN(n)) {
    // only flow one buffer at a time
    if (state.flowing && state.buffer.length)
      return state.buffer[0].length;
    else
      return state.length;
  }

  if (n <= 0)
    return 0;

  // If we're asking for more than the target buffer level,
  // then raise the water mark.  Bump up to the next highest
  // power of 2, to prevent increasing it excessively in tiny
  // amounts.
  if (n > state.highWaterMark)
    state.highWaterMark = roundUpToNextPowerOf2(n);

  // don't have that much.  return null, unless we've ended.
  if (n > state.length) {
    if (!state.ended) {
      state.needReadable = true;
      return 0;
    } else
      return state.length;
  }

  return n;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function(n) {
  var state = this._readableState;
  state.calledRead = true;
  var nOrig = n;
  var ret;

  if (typeof n !== 'number' || n > 0)
    state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 &&
      state.needReadable &&
      (state.length >= state.highWaterMark || state.ended)) {
    emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    ret = null;

    // In cases where the decoder did not receive enough data
    // to produce a full chunk, then immediately received an
    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
    // howMuchToRead will see this and coerce the amount to
    // read to zero (because it's looking at the length of the
    // first <Buffer > in state.buffer), and we'll end up here.
    //
    // This can only happen via state.decoder -- no other venue
    // exists for pushing a zero-length chunk into state.buffer
    // and triggering this behavior. In this case, we return our
    // remaining data and end the stream, if appropriate.
    if (state.length > 0 && state.decoder) {
      ret = fromList(n, state);
      state.length -= ret.length;
    }

    if (state.length === 0)
      endReadable(this);

    return ret;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;

  // if we currently have less than the highWaterMark, then also read some
  if (state.length - n <= state.highWaterMark)
    doRead = true;

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading)
    doRead = false;

  if (doRead) {
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0)
      state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
  }

  // If _read called its callback synchronously, then `reading`
  // will be false, and we need to re-evaluate how much data we
  // can return to the user.
  if (doRead && !state.reading)
    n = howMuchToRead(nOrig, state);

  if (n > 0)
    ret = fromList(n, state);
  else
    ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  }

  state.length -= n;

  // If we have nothing in the buffer, then we want to know
  // as soon as we *do* get something into the buffer.
  if (state.length === 0 && !state.ended)
    state.needReadable = true;

  // If we happened to read() exactly the remaining amount in the
  // buffer, and the EOF has been seen at this point, then make sure
  // that we emit 'end' on the very next tick.
  if (state.ended && !state.endEmitted && state.length === 0)
    endReadable(this);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}


function onEofChunk(stream, state) {
  if (state.decoder && !state.ended) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // if we've ended and we have some data left, then emit
  // 'readable' now to make sure it gets picked up.
  if (state.length > 0)
    emitReadable(stream);
  else
    endReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (state.emittedReadable)
    return;

  state.emittedReadable = true;
  if (state.sync)
    process.nextTick(function() {
      emitReadable_(stream);
    });
  else
    emitReadable_(stream);
}

function emitReadable_(stream) {
  stream.emit('readable');
}


// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(function() {
      maybeReadMore_(stream, state);
    });
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended &&
         state.length < state.highWaterMark) {
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function(n) {
  this.emit('error', new Error('not implemented'));
};

Readable.prototype.pipe = function(dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;

  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
              dest !== process.stdout &&
              dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted)
    process.nextTick(endFn);
  else
    src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    if (readable !== src) return;
    cleanup();
  }

  function onend() {
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  function cleanup() {
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (!dest._writableState || dest._writableState.needDrain)
      ondrain();
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    unpipe();
    dest.removeListener('error', onerror);
    if (EE.listenerCount(dest, 'error') === 0)
      dest.emit('error', er);
  }
  // This is a brutally ugly hack to make sure that our error handler
  // is attached before any userland ones.  NEVER DO THIS.
  if (!dest._events || !dest._events.error)
    dest.on('error', onerror);
  else if (isArray(dest._events.error))
    dest._events.error.unshift(onerror);
  else
    dest._events.error = [onerror, dest._events.error];



  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    // the handler that waits for readable events after all
    // the data gets sucked out in flow.
    // This would be easier to follow with a .once() handler
    // in flow(), but that is too slow.
    this.on('readable', pipeOnReadable);

    state.flowing = true;
    process.nextTick(function() {
      flow(src);
    });
  }

  return dest;
};

function pipeOnDrain(src) {
  return function() {
    var dest = this;
    var state = src._readableState;
    state.awaitDrain--;
    if (state.awaitDrain === 0)
      flow(src);
  };
}

function flow(src) {
  var state = src._readableState;
  var chunk;
  state.awaitDrain = 0;

  function write(dest, i, list) {
    var written = dest.write(chunk);
    if (false === written) {
      state.awaitDrain++;
    }
  }

  while (state.pipesCount && null !== (chunk = src.read())) {

    if (state.pipesCount === 1)
      write(state.pipes, 0, null);
    else
      forEach(state.pipes, write);

    src.emit('data', chunk);

    // if anyone needs a drain, then we have to wait for that.
    if (state.awaitDrain > 0)
      return;
  }

  // if every destination was unpiped, either before entering this
  // function, or in the while loop, then stop flowing.
  //
  // NB: This is a pretty rare edge case.
  if (state.pipesCount === 0) {
    state.flowing = false;

    // if there were data event listeners added, then switch to old mode.
    if (EE.listenerCount(src, 'data') > 0)
      emitDataEvents(src);
    return;
  }

  // at this point, no one needed a drain, so we just ran out of data
  // on the next readable event, start it over again.
  state.ranOut = true;
}

function pipeOnReadable() {
  if (this._readableState.ranOut) {
    this._readableState.ranOut = false;
    flow(this);
  }
}


Readable.prototype.unpipe = function(dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0)
    return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes)
      return this;

    if (!dest)
      dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;
    if (dest)
      dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    this.removeListener('readable', pipeOnReadable);
    state.flowing = false;

    for (var i = 0; i < len; i++)
      dests[i].emit('unpipe', this);
    return this;
  }

  // try to find the right one.
  var i = indexOf(state.pipes, dest);
  if (i === -1)
    return this;

  state.pipes.splice(i, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1)
    state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function(ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data' && !this._readableState.flowing)
    emitDataEvents(this);

  if (ev === 'readable' && this.readable) {
    var state = this._readableState;
    if (!state.readableListening) {
      state.readableListening = true;
      state.emittedReadable = false;
      state.needReadable = true;
      if (!state.reading) {
        this.read(0);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function() {
  emitDataEvents(this);
  this.read(0);
  this.emit('resume');
};

Readable.prototype.pause = function() {
  emitDataEvents(this, true);
  this.emit('pause');
};

function emitDataEvents(stream, startPaused) {
  var state = stream._readableState;

  if (state.flowing) {
    // https://github.com/isaacs/readable-stream/issues/16
    throw new Error('Cannot switch to old mode now.');
  }

  var paused = startPaused || false;
  var readable = false;

  // convert to an old-style stream.
  stream.readable = true;
  stream.pipe = Stream.prototype.pipe;
  stream.on = stream.addListener = Stream.prototype.on;

  stream.on('readable', function() {
    readable = true;

    var c;
    while (!paused && (null !== (c = stream.read())))
      stream.emit('data', c);

    if (c === null) {
      readable = false;
      stream._readableState.needReadable = true;
    }
  });

  stream.pause = function() {
    paused = true;
    this.emit('pause');
  };

  stream.resume = function() {
    paused = false;
    if (readable)
      process.nextTick(function() {
        stream.emit('readable');
      });
    else
      this.read(0);
    this.emit('resume');
  };

  // now make it start, just in case it hadn't already.
  stream.emit('readable');
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function(stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function() {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length)
        self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function(chunk) {
    if (state.decoder)
      chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    //if (state.objectMode && util.isNullOrUndefined(chunk))
    if (state.objectMode && (chunk === null || chunk === undefined))
      return;
    else if (!state.objectMode && (!chunk || !chunk.length))
      return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (typeof stream[i] === 'function' &&
        typeof this[i] === 'undefined') {
      this[i] = function(method) { return function() {
        return stream[method].apply(stream, arguments);
      }}(i);
    }
  }

  // proxy certain important events.
  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
  forEach(events, function(ev) {
    stream.on(ev, self.emit.bind(self, ev));
  });

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function(n) {
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};



// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
function fromList(n, state) {
  var list = state.buffer;
  var length = state.length;
  var stringMode = !!state.decoder;
  var objectMode = !!state.objectMode;
  var ret;

  // nothing in the list, definitely empty.
  if (list.length === 0)
    return null;

  if (length === 0)
    ret = null;
  else if (objectMode)
    ret = list.shift();
  else if (!n || n >= length) {
    // read it all, truncate the array.
    if (stringMode)
      ret = list.join('');
    else
      ret = Buffer.concat(list, length);
    list.length = 0;
  } else {
    // read just some of it.
    if (n < list[0].length) {
      // just take a part of the first list item.
      // slice is the same for buffers and strings.
      var buf = list[0];
      ret = buf.slice(0, n);
      list[0] = buf.slice(n);
    } else if (n === list[0].length) {
      // first list is a perfect match
      ret = list.shift();
    } else {
      // complex case.
      // we have enough to cover it, but it spans past the first buffer.
      if (stringMode)
        ret = '';
      else
        ret = new Buffer(n);

      var c = 0;
      for (var i = 0, l = list.length; i < l && c < n; i++) {
        var buf = list[0];
        var cpy = Math.min(n - c, buf.length);

        if (stringMode)
          ret += buf.slice(0, cpy);
        else
          buf.copy(ret, c, 0, cpy);

        if (cpy < buf.length)
          list[0] = buf.slice(cpy);
        else
          list.shift();

        c += cpy;
      }
    }
  }

  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0)
    throw new Error('endReadable called on non-empty stream');

  if (!state.endEmitted && state.calledRead) {
    state.ended = true;
    process.nextTick(function() {
      // Check that we didn't get one last unshift.
      if (!state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.readable = false;
        stream.emit('end');
      }
    });
  }
}

function forEach (xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf (xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}

}).call(this,require('_process'))
},{"_process":12,"buffer":4,"core-util-is":19,"events":8,"inherits":9,"isarray":10,"stream":24,"string_decoder/":25}],17:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.


// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);


function TransformState(options, stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb)
    return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined)
    stream.push(data);

  if (cb)
    cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}


function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);

  Duplex.call(this, options);

  var ts = this._transformState = new TransformState(options, this);

  // when the writable side finishes, then flush out anything remaining.
  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  this.once('finish', function() {
    if ('function' === typeof this._flush)
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}

Transform.prototype.push = function(chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function(chunk, encoding, cb) {
  throw new Error('not implemented');
};

Transform.prototype._write = function(chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform ||
        rs.needReadable ||
        rs.length < rs.highWaterMark)
      this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function(n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};


function done(stream, er) {
  if (er)
    return stream.emit('error', er);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var rs = stream._readableState;
  var ts = stream._transformState;

  if (ws.length)
    throw new Error('calling transform done when ws.length != 0');

  if (ts.transforming)
    throw new Error('calling transform done when still transforming');

  return stream.push(null);
}

},{"./_stream_duplex":14,"core-util-is":19,"inherits":9}],18:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// A bit simpler than readable streams.
// Implement an async ._write(chunk, cb), and it'll handle all
// the drain event emission and buffering.

module.exports = Writable;

/*<replacement>*/
var Buffer = require('buffer').Buffer;
/*</replacement>*/

Writable.WritableState = WritableState;


/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Stream = require('stream');

util.inherits(Writable, Stream);

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
}

function WritableState(options, stream) {
  options = options || {};

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, becuase any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function(er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.buffer = [];

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;
}

function Writable(options) {
  var Duplex = require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, though they're not
  // instanceof Writable, they're instanceof Readable.
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function() {
  this.emit('error', new Error('Cannot pipe. Not readable.'));
};


function writeAfterEnd(stream, state, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  process.nextTick(function() {
    cb(er);
  });
}

// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  if (!Buffer.isBuffer(chunk) &&
      'string' !== typeof chunk &&
      chunk !== null &&
      chunk !== undefined &&
      !state.objectMode) {
    var er = new TypeError('Invalid non-string/buffer chunk');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function(chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  else if (!encoding)
    encoding = state.defaultEncoding;

  if (typeof cb !== 'function')
    cb = function() {};

  if (state.ended)
    writeAfterEnd(this, state, cb);
  else if (validChunk(this, state, chunk, cb))
    ret = writeOrBuffer(this, state, chunk, encoding, cb);

  return ret;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode &&
      state.decodeStrings !== false &&
      typeof chunk === 'string') {
    chunk = new Buffer(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer.isBuffer(chunk))
    encoding = 'buffer';
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret)
    state.needDrain = true;

  if (state.writing)
    state.buffer.push(new WriteReq(chunk, encoding, cb));
  else
    doWrite(stream, state, len, chunk, encoding, cb);

  return ret;
}

function doWrite(stream, state, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  if (sync)
    process.nextTick(function() {
      cb(er);
    });
  else
    cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(stream, state);

    if (!finished && !state.bufferProcessing && state.buffer.length)
      clearBuffer(stream, state);

    if (sync) {
      process.nextTick(function() {
        afterWrite(stream, state, finished, cb);
      });
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  cb();
  if (finished)
    finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}


// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;

  for (var c = 0; c < state.buffer.length; c++) {
    var entry = state.buffer[c];
    var chunk = entry.chunk;
    var encoding = entry.encoding;
    var cb = entry.callback;
    var len = state.objectMode ? 1 : chunk.length;

    doWrite(stream, state, len, chunk, encoding, cb);

    // if we didn't call the onwrite immediately, then
    // it means that we need to wait until it does.
    // also, that means that the chunk and cb are currently
    // being processed, so move the buffer counter past them.
    if (state.writing) {
      c++;
      break;
    }
  }

  state.bufferProcessing = false;
  if (c < state.buffer.length)
    state.buffer = state.buffer.slice(c);
  else
    state.buffer.length = 0;
}

Writable.prototype._write = function(chunk, encoding, cb) {
  cb(new Error('not implemented'));
};

Writable.prototype.end = function(chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (typeof chunk !== 'undefined' && chunk !== null)
    this.write(chunk, encoding);

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished)
    endWritable(this, state, cb);
};


function needFinish(stream, state) {
  return (state.ending &&
          state.length === 0 &&
          !state.finished &&
          !state.writing);
}

function finishMaybe(stream, state) {
  var need = needFinish(stream, state);
  if (need) {
    state.finished = true;
    stream.emit('finish');
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      process.nextTick(cb);
    else
      stream.once('finish', cb);
  }
  state.ended = true;
}

}).call(this,require('_process'))
},{"./_stream_duplex":14,"_process":12,"buffer":4,"core-util-is":19,"inherits":9,"stream":24}],19:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

function isBuffer(arg) {
  return Buffer.isBuffer(arg);
}
exports.isBuffer = isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}
}).call(this,require("buffer").Buffer)
},{"buffer":4}],20:[function(require,module,exports){
module.exports = require("./lib/_stream_passthrough.js")

},{"./lib/_stream_passthrough.js":15}],21:[function(require,module,exports){
var Stream = require('stream'); // hack to fix a circular dependency issue when used with browserify
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = Stream;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":14,"./lib/_stream_passthrough.js":15,"./lib/_stream_readable.js":16,"./lib/_stream_transform.js":17,"./lib/_stream_writable.js":18,"stream":24}],22:[function(require,module,exports){
module.exports = require("./lib/_stream_transform.js")

},{"./lib/_stream_transform.js":17}],23:[function(require,module,exports){
module.exports = require("./lib/_stream_writable.js")

},{"./lib/_stream_writable.js":18}],24:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":8,"inherits":9,"readable-stream/duplex.js":13,"readable-stream/passthrough.js":20,"readable-stream/readable.js":21,"readable-stream/transform.js":22,"readable-stream/writable.js":23}],25:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":4}],26:[function(require,module,exports){
'use strict';

module.exports = {
    components: require('famous-components'),
    core: require('famous-core'),
    engine: require('famous-engine'),
    domRenderables: require('famous-dom-renderables'),
    math: require('famous-math'),
    physics: require('famous-physics'),
    renderers: require('famous-renderers'),
    stylesheets: require('famous-stylesheets'),
    router: require('famous-router'),
    transitions: require('famous-transitions'),
    utilities: require('famous-utilities'),
    webglRenderables: require('famous-webgl-renderables'),
    webglGeometries: require('famous-webgl-geometries'),
    webglMaterials: require('famous-webgl-materials'),
    webglShaders: require('famous-webgl-shaders'),
    polyfills: require('famous-polyfills')
};

},{"famous-components":66,"famous-core":102,"famous-dom-renderables":120,"famous-engine":123,"famous-math":128,"famous-physics":177,"famous-polyfills":178,"famous-renderers":306,"famous-router":309,"famous-stylesheets":312,"famous-transitions":317,"famous-utilities":330,"famous-webgl-geometries":359,"famous-webgl-materials":373,"famous-webgl-renderables":417,"famous-webgl-shaders":423}],27:[function(require,module,exports){
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

    if (Math.abs(det) < 1e-40) return null;

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

},{}],28:[function(require,module,exports){
'use strict';

var Matrix = require('./Mat33');

var sin = Math.sin;
var cos = Math.cos;
var asin = Math.asin;
var acos = Math.acos;
var atan2 = Math.atan2;
var sqrt = Math.sqrt;

/**
 * A vector-like object used to represent rotations. If theta is the angle of
 * rotation, and (x', y', z') is a normalized vector representing the axis of
 * rotation, then w = cos(theta/2), x = sin(theta/2)*x', y = sin(theta/2)*y',
 * and z = sin(theta/2)*z'.
 *
 * @class Quaternion
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
function Quaternion(w, x, y, z) {
    this.w = w || 1;
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
}

/**
 * Multiply the current Quaternion by input Quaternion q.
 * Left-handed multiplication.
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

    this.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    this.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    this.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    this.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return this;
};

/**
 * Multiply the current Quaternion by input Quaternion q on the left, i.e. q * this.
 * Left-handed multiplication.
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
    this.w = -this.w;
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
    return this;
};

/**
 * Conjugate the current Quaternion.
 *
 * @method conjugate
 * @chainable
 */
Quaternion.prototype.conjugate = function conjugate() {
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;
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
 * Set the w, x, y, z components of the current Quaternion.
 *
 * @method set
 * @param {Number} w The w component.
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 * @chainable
 */
Quaternion.prototype.set = function set(w, x ,y, z) {
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
 * The dot product. Can be used to determine the cosine of the angle between
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
    var qx = q.x;
    var qy = q.y;
    var qz = q.z;

    var omega;
    var cosomega;
    var sinomega;
    var scaleFrom;
    var scaleTo;

    cosomega = w * qw + x * qx + y * qy + z * qz;
    if ((1.0 - cosomega) > 1e-5) {
        omega = acos(cosomega);
        sinomega = sin(omega);
        scaleFrom = sin((1.0 - t) * omega) / sinomega;
        scaleTo = sin(t * omega) / sinomega;
    }
    else {
        scaleFrom = 1.0 - t;
        scaleTo = t;
    }

    output.w = w * scaleFrom + qw * scaleTo;
    output.x = x * scaleFrom + qx * scaleTo;
    output.y = y * scaleFrom + qy * scaleTo;
    output.z = z * scaleFrom + qz * scaleTo;

    return output;
};

/**
 * Get the Mat33 matrix corresponding to the current Quaternion.
 *
 * @method toMatrix
 * @return {Transform}
 */
Quaternion.prototype.toMatrix = function toMatrix(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x*x;
    var yy = y*y;
    var zz = z*z;
    var xy = x*y;
    var xz = x*z;
    var yz = y*z;

    return output.set([
        1 - 2 * (yy + zz), 2 * (xy - w*z), 2 * (xz + w*y),
        2 * (xy + w*z), 1 - 2 * (xx + zz), 2 * (yz - w*x),
        2 * (xz - w*y), 2 * (yz + w*x), 1 - 2 * (xx + yy)
    ]);
};

/**
 * The rotation angles about the x, y, and z axes corresponding to the
 * current Quaternion, when applied in the ZYX order.
 *
 * @method toEuler
 * @param {Vec3} output Vec3 in which to put the result.
 * @return {Vec3}
 */

Quaternion.prototype.toEuler = function toEuler(output) {
    var w = this.w;
    var x = this.x;
    var y = this.y;
    var z = this.z;

    var xx = x * x;
    var yy = y * y;
    var zz = z * z;
    var ww = w * w;

    var ty = 2 * (x * z + y * w);
    ty = ty < -1 ? -1 : ty > 1 ? 1 : ty;

    output.x = atan2(2 * (x * w - y * z), 1 - 2 * (xx + yy));
    output.y = asin(ty);
    output.z = atan2(2 * (z * w - x * y), 1 - 2 * (yy + zz));

    return output;
};

/**
 * The Quaternion corresponding to the Euler angles x, y, and z,
 * applied in the ZYX order.
 *
 * @method fromEuler
 * @param {Number} x The angle of rotation about the x axis.
 * @param {Number} y The angle of rotation about the y axis.
 * @param {Number} z The angle of rotation about the z axis.
 * @param {Quaternion} output Quaternion in which to put the result.
 * @return {Quaternion} The equivalent Quaternion.
 */
Quaternion.prototype.fromEuler = function fromEuler(x, y, z) {
    var hx = x * 0.5;
    var hy = y * 0.5;
    var hz = z * 0.5;

    var sx = sin(hx);
    var sy = sin(hy);
    var sz = sin(hz);
    var cx = cos(hx);
    var cy = cos(hy);
    var cz = cos(hz);

    this.w = cx * cy * cz - sx * sy * sz;
    this.x = sx * cy * cz + cx * sy * sz;
    this.y = cx * sy * cz - sx * cy * sz;
    this.z = cx * cy * sz + sx * sy * cz;

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
Quaternion.prototype.fromAngleAxis = function fromAngleAxis(angle, x, y, z) {
    var len = sqrt(x * x + y * y + z * z);
    if (len === 0) {
        this.w = 1;
        this.x = this.y = this.z = 0;
    }
    else {
        len = 1 / len;
        var halfTheta = angle * 0.5;
        var s = sin(halfTheta);
        this.w = cos(halfTheta);
        this.x = s * x * len;
        this.y = s * y * len;
        this.z = s * z * len;
    }
    return this;
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

    output.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
    output.x = x1 * w2 + x2 * w1 + y2 * z1 - y1 * z2;
    output.y = y1 * w2 + y2 * w1 + x1 * z2 - x2 * z1;
    output.z = z1 * w2 + z2 * w1 + x2 * y1 - x1 * y2;
    return output;
};

/**
 * Normalize the input quaternion.
 *
 * @method normalize
 * @return {Quaternion} The normalized quaternion.
 */
Quaternion.normalize = function normalize(q, output) {
    var w = q.w;
    var x = q.x;
    var y = q.y;
    var z = q.z;
    var length = sqrt(w * w + x * x + y * y + z * z);
    if (length === 0) return;
    length = 1 / length;
    output.w *= length;
    output.x *= length;
    output.y *= length;
    output.z *= length;
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

},{"./Mat33":27}],29:[function(require,module,exports){
'use strict';

var sin = Math.sin;
var cos = Math.cos;
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

},{}],30:[function(require,module,exports){
'use strict';

var sin = Math.sin;
var cos = Math.cos;
var sqrt = Math.sqrt;

/**
 * A three-dimensional vector.
 *
 * @class Vec3
 * @param {Number} x The x component.
 * @param {Number} y The y component.
 * @param {Number} z The z component.
 */
var Vec3 = function(x ,y, z){
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
Vec3.prototype.set = function set(x, y, z) {
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

    this.x = x * cosTheta - y * sinTheta;
    this.y = x * sinTheta + y * cosTheta;

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
    this.x = -this.x;
    this.y = -this.y;
    this.z = -this.z;

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
    return this.x === 0 && this.y === 0 && this.z === 0;
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

},{}],31:[function(require,module,exports){
module.exports = {
    Mat33: require('./Mat33'),
    Quaternion: require('./Quaternion'),
    Vec2: require('./Vec2'),
    Vec3: require('./Vec3')
};


},{"./Mat33":27,"./Quaternion":28,"./Vec2":29,"./Vec3":30}],32:[function(require,module,exports){
/*jshint -W008 */

'use strict';

var Curves = {
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
        return 1.0 - Curves.outBounce(1.0-t);
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
        if (t < .5) return Curves.inBounce(t*2) * .5;
        return Curves.outBounce(t*2-1.0) * .5 + .5;
    },

    flat: function() {
        return 0;
    }
};

module.exports = Curves;

},{}],33:[function(require,module,exports){
/*jshint -W008 */

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
 * @deprecated Use curves instead
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
        console.warn('Easing is deprecated! Use transitions.curves instead!');
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
        console.warn('Easing is deprecated! Use transitions.curves instead!');
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
        console.warn('Easing is deprecated! Use transitions.curves instead!');
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
        console.warn('Easing is deprecated! Use transitions.curves instead!');
        return Object.keys(_defaultCurves).concat(Object.keys(_curves));
    },

    createBezierCurve: function(v1, v2) {
        console.warn('Easing is deprecated! Use transitions.curves instead!');
        v1 = v1 || 0; v2 = v2 || 0;
        return function(t) {
            return v1*t + (-2*v1 - v2 + 3)*t*t + (v1 + v2 - 2)*t*t*t;
        };
    }
};

module.exports = Easing;
},{}],34:[function(require,module,exports){
'use strict';

var Curves = require('./Curves');

/**
 * A state maintainer for a smooth transition between
 *    numerically-specified states. Example numeric states include floats and
 *    arrays of floats objects.
 *
 * An initial state is set with the constructor or using
 *     {@link Transitionable#from}. Subsequent transitions consist of an
 *     intermediate state, easing curve, duration and callback. The final state
 *     of each transition is the initial state of the subsequent one. Calls to
 *     {@link Transitionable#get} provide the interpolated state along the way.
 *
 * Note that there is no event loop here - calls to {@link Transitionable#get}
 *    are the only way to find state projected to the current (or provided)
 *    time and are the only way to trigger callbacks and mutate the internal
 *    transition queue.
 *
 * @example
 * var t = new Transitionable([0, 0]);
 * t
 *     .to([100, 0], 'linear', 1000)
 *     .delay(1000)
 *     .to([200, 0], 'outBounce', 1000);
 *
 * var div = document.createElement('div');
 * div.style.background = 'blue';
 * div.style.width = '100px';
 * div.style.height = '100px';
 * document.body.appendChild(div);
 *
 * div.addEventListener('click', function() {
 *     t.isPaused() ? t.resume() : t.pause();
 * });
 *
 * requestAnimationFrame(function loop() {
 *     div.style.transform = 'translateX(' + t.get()[0] + 'px)' + ' translateY(' + t.get()[1] + 'px)';
 *     requestAnimationFrame(loop);
 * });
 *
 * @class Transitionable
 * @constructor
 * @param {Number|Array.Number} initialState    initial state to transition
 *                                              from - equivalent to a pursuant
 *                                              invocation of
 *                                              {@link Transitionable#from}
 */
function Transitionable(initialState) {
    this._queue = [];
    this._multi = null;
    this._end = null;
    this._startedAt = null;
    this._pausedAt = null;
    if (initialState != null) this.from(initialState);
}

/**
 * Internal Clock used for determining the current time for the ongoing
 * transitions.
 *
 * @type {Performance|Date|Object}
 */
Transitionable.Clock = typeof performance !== 'undefined' ? performance : Date;

/**
 * Registers a transition to be pushed onto the internal queue.
 *
 * @method to
 * @chainable
 *
 * @param  {Number|Array.Number}    finalState              final state to
 *                                                          transiton to
 * @param  {String|Function}        [curve=Curves.linear]   easing function
 *                                                          used for
 *                                                          interpolating
 *                                                          [0, 1]
 * @param  {Number}                 [duration=100]          duration of
 *                                                          transition
 * @param  {Function}               [callback]              callback function
 *                                                          to be called after
 *                                                          the transition is
 *                                                          complete
 * @return {Transitionable}         this
 */
Transitionable.prototype.to = function to(finalState, curve, duration, callback) {
    curve = curve != null && curve.constructor === String ? Curves[curve] : curve;
    if (this._queue.length === 0) {
        this._startedAt = this.constructor.Clock.now();
        this._pausedAt = null;
    }
    this._queue.push(
        finalState,
        curve != null ? curve : Curves.linear,
        duration != null ? duration : 100,
        callback
    );
    return this;
};

/**
 * Resets the transition queue to a stable initial state.
 *
 * @method from
 * @chainable
 *
 * @param  {Number|Array.Number}    initialState    initial state to
 *                                                  transition from
 * @return {Transitionable}         this
 */
Transitionable.prototype.from = function from(initialState) {
    this._end = initialState;
    if (initialState.constructor === Array && this._multi != null && this._multi.constructor === Array) {
        this._multi.length = initialState.length;
    } else {
        this._multi = initialState.constructor === Array ? [] : false;
    }
    this._queue.length = 0;
    this._startedAt = this.constructor.Clock.now();
    this._pausedAt = null;
    return this;
};

/**
 * Delays the execution of the subsequent transition for a certain period of
 * time.
 *
 * @method delay
 * @chainable
 *
 * @param {Number}      duration    delay time in ms
 * @param {Function}    [callback]  Zero-argument function to call on observed
 *                                  completion (t=1)
 * @return {Transitionable}         this
 */
Transitionable.prototype.delay = function delay(duration, callback) {
    var endState = this._queue.length > 0 ? this._queue[this._queue.length - 4] : this._end;
    return this.to(endState, Curves.flat, duration, callback);
};

/**
 * Overrides current transition.
 *
 * @method override
 * @chainable
 *
 * @param  {Number|Array.Number}    [finalState]    final state to transiton to
 * @param  {String|Function}        [curve]         easing function used for
 *                                                  interpolating [0, 1]
 * @param  {Number}                 [duration]      duration of transition
 * @param  {Function}               [callback]      callback function to be
 *                                                  called after the transition
 *                                                  is complete
 * @return {Transitionable}         this
 */
Transitionable.prototype.override = function override(finalState, curve, duration, callback) {
    if (this._queue.length > 0) {
        if (finalState != null) this._queue[0] = finalState;
        if (curve != null)      this._queue[1] = curve.constructor === String ? Curves[curve] : curve;
        if (duration != null)   this._queue[2] = duration;
        if (callback != null)   this._queue[3] = callback;
    }
    return this;
};

Transitionable.prototype._interpolate = function _interpolate(from, to, progress) {
    if (this._multi) {
        for (var i = 0; i < to.length; i++) {
            this._multi[i] = from[i] + progress * (to[i] - from[i]);
        }
        return this._multi;
    } else {
        return from + progress * (to - from);
    }
};

/**
 * Get interpolated state of current action at provided time. If the last
 *    action has completed, invoke its callback.
 *
 * @method get
 *
 * @param {Number=} timestamp Evaluate the curve at a normalized version of this
 *    time. If omitted, use current time. (Unix epoch time)
 * @return {Number|Array.Number} beginning state
 *    interpolated to this point in time.
 */
Transitionable.prototype.get = function get(t) {
    t = this._pausedAt ? this._pausedAt : t;
    t = t ? t : this.constructor.Clock.now();
    if (this._queue.length === 0) return this._end;

    var progress = (t - this._startedAt) / this._queue[2];
    var state = this._interpolate(this._end, this._queue[0], this._queue[1](progress > 1 ? 1 : progress));
    if (progress >= 1) {
        this._startedAt = this._startedAt + this._queue[2];
        this._end = this._queue.shift();
        this._queue.shift();
        this._queue.shift();
        var callback = this._queue.shift();
        if (callback) callback();
    }
    return progress > 1 ? this.get() : state;
};

/**
 * Is there at least one transition pending completion?
 *
 * @method isActive
 *
 * @return {boolean}
 */
Transitionable.prototype.isActive = function isActive() {
    return this._queue.length > 0;
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
    return this.from(this.get());
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
    this._pausedAt = this.constructor.Clock.now();
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
    return !!this._pausedAt;
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
    var diff = this._pausedAt - this._startedAt;
    this._startedAt = this.constructor.Clock.now() - diff;
    this._pausedAt = null;
    return this;
};

/**
 * Cancel all transitions and reset to a stable state
 *
 * @method reset
 * @chainable
 * @deprecated Use `.from` instead!
 *
 * @param {Number|Array.Number|Object.<number, number>} startState
 *    stable state to set to
 */
Transitionable.prototype.reset = function(start) {
    return this.from(start);
};

/**
 * Add transition to end state to the queue of pending transitions. Special
 *    Use: calling without a transition resets the object to that state with
 *    no pending actions
 *
 * @method set
 * @chainable
 * @deprecated Use `.to` instead!
 *
 * @param {Number|FamousMatrix|Array.Number|Object.<number, number>} endState
 *    end state to which we interpolate
 * @param {transition=} transition object of type {duration: number, curve:
 *    f[0,1] -> [0,1] or name}. If transition is omitted, change will be
 *    instantaneous.
 * @param {function()=} callback Zero-argument function to call on observed
 *    completion (t=1)
 */
Transitionable.prototype.set = function(state, transition, callback) {
    if (transition == null) {
        this.from(state);
        if (callback) callback();
    } else {
        this.to(state, transition.curve, transition.duration, callback);
    }
    return this;
};

module.exports = Transitionable;

},{"./Curves":32}],35:[function(require,module,exports){
'use strict';

/**
 * Return wrapper around callback function. Once the wrapper is called N
 *   times, invoke the callback function. Arguments and scope preserved.
 *
 * @method after
 * @deprecated
 *
 * @param {number} count number of calls before callback function invoked
 * @param {Function} callback wrapped callback function
 *
 * @return {function} wrapped callback with coundown feature
 */
var after = function after(count, callback) {
    console.warn('transitions.after is deprecated!');
    var counter = count;
    return function() {
        counter--;
        if (counter === 0) callback.apply(this, arguments);
    };
};

module.exports = after;

},{}],36:[function(require,module,exports){
'use strict';

module.exports = {
    after: require('./after'),
    Easing: require('./Easing'),
    Curves: require('./Curves'),
    Transitionable: require('./Transitionable')
};

},{"./Curves":32,"./Easing":33,"./Transitionable":34,"./after":35}],37:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],38:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],39:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":37,"dup":34}],40:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],41:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":37,"./Easing":38,"./Transitionable":39,"./after":40,"dup":36}],42:[function(require,module,exports){
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

},{}],43:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

/**
 * @class Color
 * @constructor
 * @component
 * @param {Color|String|Array} Optional argument for setting color using
 * Hex, a Color instance, color name or RGB
 * @param {Object} Optional transition
 * @param {Function} Callback
 */
function Color(color, transition, cb) {
    this._r = new Transitionable(0);
    this._g = new Transitionable(0);
    this._b = new Transitionable(0);
    if (color) this.set(color, transition, cb);
};

/**
* Returns the definition of the Class: 'Color'
* @method toString
* @return {String} definition
*/
Color.toString = function toString() {
    return 'Color';
};

/**
* Sets the color. It accepts an optional transition parameter and callback.
* set(Color, transition, callback)
* set('#000000', transition, callback)
* set('black', transition, callback)
* set([r, g, b], transition, callback)
* @method set
 * @param {Color|String|Array} Optional argument for setting color using
 * Hex, a Color instance, color name or RGB
 * @param {Object} Optional transition
 * @param {Function} Callback
* @chainable
*/
Color.prototype.set = function set(color, transition, cb) {
    switch (Color.determineType(color)) {
        case 'hex': return this.setHex(color, transition, cb);
        case 'colorName': return this.setColor(color, transition, cb);
        case 'instance': return this.changeTo(color, transition, cb);
        case 'rgb': return this.setRGB(color[0], color[1], color[2], transition, cb);
    }
};

/**
 * Returns whether Color is still in an animating (transitioning) state.
 *
 * @method isActive
 * @returns {Boolean} boolean
 */
Color.prototype.isActive = function isActive() {
    return this._r.isActive() || this._g.isActive() || this._b.isActive();
};

/**
 * Halt transition at current state and erase all pending actions.
 *
 * @method halt
 * @chainable
 *
 * @return {Color} this
 */
Color.prototype.halt = function halt() {
    this._r.halt();
    this._g.halt();
    this._b.halt();
    return this;
};

/**
 * Sets the color values from another Color instance.
 *
 * @method changeTo
 * @param {Color} Color instance
 * @param {Object} transition Optional transition
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.changeTo = function changeTo(color, transition, cb) {
    if (Color.isColorInstance(color)) {
        var rgb = color.getRGB();
        this.setRGB(rgb[0], rgb[1], rgb[2], transition, cb);
    }
    return this;
};

/**
 * Sets the color based on static color names.
 *
 * @method setColor
 * @param {String} Color name
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setColor = function setColor(name, transition, cb) {
    if (colorNames[name]) {
        this.setHex(colorNames[name], transition, cb);
    }
    return this;
};

/**
 * Returns the color in either RGB or with the requested format.
 *
 * @method getColor
 * @param {String} Optional argument for determining which type of color to get (default is RGB)
 * @returns Color in either RGB or specific option value
 */
Color.prototype.getColor = function getColor(option) {
    if (Color.isString(option)) option = option.toLowerCase();
    return (option === 'hex') ? this.getHex() : this.getRGB();
};

/**
 * Sets the R of the Color's RGB
 *
 * @method setR
 * @param {Integer} R channel of color
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setR = function setR(r, transition, cb) {
    this._r.set(r, transition, cb);
    return this;
};

/**
 * Sets the G of the Color's RGB
 *
 * @method setG
 * @param {Integer} G channel of color
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setG = function setG(g, transition, cb) {
    this._g.set(g, transition, cb);
    return this;
};

/**
 * Sets the B of the Color's RGB
 *
 * @method setB
 * @param {Integer} B channel of color
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setB = function setB(b, transition, cb) {
    this._b.set(b, transition, cb);
    return this;
};

/**
 * Sets RGB
 *
 * @method setRGB
 * @param {Integer} R channel of color
 * @param {Integer} G channel of color
 * @param {Integer} B channel of color
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setRGB = function setRGB(r, g, b, transition, cb) {
    this.setR(r, transition);
    this.setG(g, transition);
    this.setB(b, transition, cb);
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
 * Returns the current color in Hex
 *
 * @method getHex
 * @returns Hex value
 */
Color.prototype.getHex = function getHex() {
    var r = Color.toHex(this.getR());
    var g = Color.toHex(this.getG());
    var b = Color.toHex(this.getB());
    return '#' + r + g + b;
};

/**
 * Sets color using Hex
 *
 * @method setHex
 * @param {String} Hex value
 * @param {Object} transition Optional transition parameters
 * @param {Function} callback Optional
 * @chainable
 */
Color.prototype.setHex = function setHex(hex, transition, cb) {
    hex = (hex.charAt(0) === '#') ? hex.substring(1, hex.length) : hex;

    if (hex.length === 3) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
    }

    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    this.setRGB(r, g, b, transition, cb);
    return this;
};

/**
 * Converts a number to a hex value
 *
 * @method toHex
 * @param {Integer} Number
 * @returns Hex value
 */
Color.toHex = function toHex(num) {
    var hex = num.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
};

/**
 * Determines the given input with the appropriate configuration
 *
 * @method determineType
 * @param {Color|String|Array} Color type
 * @returns {String} Appropriate color type
 */
Color.determineType = function determineType(type) {
    if (Color.isColorInstance(type)) return 'instance';
    if (colorNames[type]) return 'colorName';
    if (Color.isHex(type)) return 'hex';
    if (Array.isArray(type)) return 'rgb';
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
 * Returns a boolean checking whether string input has a hash (#) symbol
 *
 * @method isHex
 * @param String
 * @returns {Boolean} Boolean
 */
Color.isHex = function isHex(val) {
    if (!Color.isString(val)) return false;
    return val[0] === '#';
};

/**
 * Returns boolean whether the input is a Color instance
 *
 * @method isColorInstance
 * @param Color instance
 * @returns {Boolean} Boolean
 */
Color.isColorInstance = function isColorInstance(val) {
    return !!val.getColor;
};

/**
 * Common color names with their associated Hex values
 */
var colorNames = { aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#00ffff', aquamarine: '#7fffd4', azure: '#f0ffff', beige: '#f5f5dc', bisque: '#ffe4c4', black: '#000000', blanchedalmond: '#ffebcd', blue: '#0000ff', blueviolet: '#8a2be2', brown: '#a52a2a', burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00', chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc', crimson: '#dc143c', cyan: '#00ffff', darkblue: '#00008b', darkcyan: '#008b8b', darkgoldenrod: '#b8860b', darkgray: '#a9a9a9', darkgreen: '#006400', darkgrey: '#a9a9a9', darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f', darkorange: '#ff8c00', darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a', darkseagreen: '#8fbc8f', darkslateblue: '#483d8b', darkslategray: '#2f4f4f', darkslategrey: '#2f4f4f', darkturquoise: '#00ced1', darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff', dimgray: '#696969', dimgrey: '#696969', dodgerblue: '#1e90ff', firebrick: '#b22222', floralwhite: '#fffaf0', forestgreen: '#228b22', fuchsia: '#ff00ff', gainsboro: '#dcdcdc', ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520', gray: '#808080', green: '#008000', greenyellow: '#adff2f', grey: '#808080', honeydew: '#f0fff0', hotpink: '#ff69b4', indianred: '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0', khaki: '#f0e68c', lavender: '#e6e6fa', lavenderblush: '#fff0f5', lawngreen: '#7cfc00', lemonchiffon: '#fffacd', lightblue: '#add8e6', lightcoral: '#f08080', lightcyan: '#e0ffff', lightgoldenrodyellow: '#fafad2', lightgray: '#d3d3d3', lightgreen: '#90ee90', lightgrey: '#d3d3d3', lightpink: '#ffb6c1', lightsalmon: '#ffa07a', lightseagreen: '#20b2aa', lightskyblue: '#87cefa', lightslategray: '#778899', lightslategrey: '#778899', lightsteelblue: '#b0c4de', lightyellow: '#ffffe0', lime: '#00ff00', limegreen: '#32cd32', linen: '#faf0e6', magenta: '#ff00ff', maroon: '#800000', mediumaquamarine: '#66cdaa', mediumblue: '#0000cd', mediumorchid: '#ba55d3', mediumpurple: '#9370db', mediumseagreen: '#3cb371', mediumslateblue: '#7b68ee', mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc', mediumvioletred: '#c71585', midnightblue: '#191970', mintcream: '#f5fffa', mistyrose: '#ffe4e1', moccasin: '#ffe4b5', navajowhite: '#ffdead', navy: '#000080', oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23', orange: '#ffa500', orangered: '#ff4500', orchid: '#da70d6', palegoldenrod: '#eee8aa', palegreen: '#98fb98', paleturquoise: '#afeeee', palevioletred: '#db7093', papayawhip: '#ffefd5', peachpuff: '#ffdab9', peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd', powderblue: '#b0e0e6', purple: '#800080', rebeccapurple: '#663399', red: '#ff0000', rosybrown: '#bc8f8f', royalblue: '#4169e1', saddlebrown: '#8b4513', salmon: '#fa8072', sandybrown: '#f4a460', seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d', silver: '#c0c0c0', skyblue: '#87ceeb', slateblue: '#6a5acd', slategray: '#708090', slategrey: '#708090', snow: '#fffafa', springgreen: '#00ff7f', steelblue: '#4682b4', tan: '#d2b48c', teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347', turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3', white: '#ffffff', whitesmoke: '#f5f5f5', yellow: '#ffff00', yellowgreen: '#9acd32' };

module.exports = Color;

},{"famous-transitions":41}],44:[function(require,module,exports){
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


},{}],45:[function(require,module,exports){
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

},{}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
'use strict';

/**
 *  Deep clone an object.
 *  @memberof Utilities
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

},{}],48:[function(require,module,exports){
'use strict';

/**
 * Flat clone an object.
 * @memberof Utilities
 * @param {Object} obj - Object to clone
 * @return {Object} Cloned object
 */
function flatClone(obj) {
    var clone = {};
    for (var key in obj) clone[key] = obj[key];
    return clone;
}

module.exports = flatClone;

},{}],49:[function(require,module,exports){
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
    strip: require('./strip'),
    keyValueToArrays: require('./keyValueToArrays')
};


},{"./CallbackStore":42,"./Color":43,"./KeyCodes":44,"./MethodStore":45,"./ObjectManager":46,"./clone":47,"./flatClone":48,"./keyValueToArrays":50,"./loadURL":51,"./strip":52}],50:[function(require,module,exports){
/**
 * Takes an object containing keys and values and returns an object
 * comprising two "associate" arrays, one with the keys and the other
 * with the values.
 *
 * @method keyValuesToArrays
 *
 * @param {Object} Object
 * @returns {Object} Object Object containing two arrays, one with the keys and the other for values
 */
module.exports = function keyValuesToArrays(obj) {
    var keysArray = [], valuesArray = [];
    var i = 0;
    for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keysArray[i] = key;
            valuesArray[i] = obj[key];
            i++;
        }
    }
    return {
        keys: keysArray,
        values: valuesArray
    };
};

},{}],51:[function(require,module,exports){
'use strict';

/**
 * Load a URL and return its contents in a callback
 *
 * @method loadURL
 * @memberof Utilities
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

},{}],52:[function(require,module,exports){
'use strict';

/**
 * Removes all values not being of a primitive type from an arbitrary object
 * literal.
 *
 * @method strip
 * @memberof Utilities
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

},{}],53:[function(require,module,exports){
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

},{"./Position":61}],54:[function(require,module,exports){
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
    var path = this._dispatch.getRenderPath();

    this._dispatch
        .sendDrawCommand('WITH')
        .sendDrawCommand(path);

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

},{}],55:[function(require,module,exports){
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

},{}],56:[function(require,module,exports){
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
            this.on(eventName, callback);
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

},{"famous-utilities":49}],57:[function(require,module,exports){
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
    this._events = new CallbackStore();

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

    if (events) {
        for (var i = 0, len = events.length; i < len; i++) {
            this.on(events[i], events[i].callback);
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
 * Register a callback to be invoked on an event.
 *
 * @method on
 * @param {Object|String} ev The event object or event name.
 * @param {Function} cb The callback.
 */
GestureHandler.prototype.on = function on(ev, cb) {
    var gesture = ev.event || ev;
    if (gestures[gesture]) {
        this.trackedGestures[gesture] = true;
        this.gestures.push(gesture);
        if (ev.event) this.options[gesture] = ev;
        this._events.on(gesture, cb);
    }
};

/**
 * Deregister a callback from an event.
 *
 * @method on
 * @param {String} ev The event name.
 * @param {Function} cb The callback.
 */
GestureHandler.prototype.off = function off(ev, cb) {
    this._events.off(gesture, cb);
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
                if (payload.status === 'start') {
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

},{"famous-math":31,"famous-utilities":49}],58:[function(require,module,exports){
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

},{"./Position":61}],59:[function(require,module,exports){
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

},{"famous-transitions":36}],60:[function(require,module,exports){
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

},{"./Position":61}],61:[function(require,module,exports){
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
    var cbX = null;
    var cbY = null;
    var cbZ = null;

    if (z != null) cbZ = callback;
    else if (y != null) cbY = callback;
    else if (x != null) cbX = callback;

    if (x != null) this._x.set(x, options, cbX);
    if (y != null) this._y.set(y, options, cbY);
    if (z != null) this._z.set(z, options, cbZ);
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

},{"famous-transitions":36}],62:[function(require,module,exports){
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

},{"./Position":61}],63:[function(require,module,exports){
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

},{"./Position":61}],64:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;

/**
 * Size component used for managing the size of the underlying RenderContext.
 * Supports absolute and relative (proportional and differential) sizing.
 * 
 * @class Size
 * @constructor
 * @component
 * 
 * @param {LocalDispatch} dispatch LocalDispatch to be retrieved from
 *                                 corresponding RenderNode of the Size
 *                                 component
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
* Stringifies Size.
*
* @method toString
* 
* @return {String} `Size`
*/
Size.toString = function toString() {
    return 'Size';
};

/**
 * @typedef absoluteSizeState
 * @type {Object}
 * @property {String} type current type of sizing being applied ('absolute')
 * @property {String} component component name ('Size')
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * @typedef relativeSizeState
 * @type {Object}
 * @property {String} type current type of sizing being applied ('relative')
 * @property {String} component component name ('Size')
 * @property {Object} differential
 * @property {number} differential.x
 * @property {number} differential.y
 * @property {number} differential.z
 * @property {Object} proportional
 * @property {number} proportional.x
 * @property {number} proportional.y
 * @property {number} proportional.z
 */

/**
* Returns serialized state of the component.
*
* @method getState
* 
* @return {absoluteSizeState|relativeSizeState}
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
* Updates state of component.
*
* @method setState
* 
* @param {absoluteSizeState|relativeSizeState} state state encoded in same
*                                                    format as state retrieved
*                                                    through `getState`
* @return {Boolean}                                  boolean indicating
*                                                    whether the new state has
*                                                    been applied
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
* @method clean
* 
* @return {Boolean} boolean indicating whether the component is still dirty
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
* Applies absolute size.
*
* @method setAbsolute
* @chainable
* 
* @param {Number} x used to set absolute size in x-direction (width)
* @param {Number} y used to set absolute size in y-direction (height)
* @param {Number} z used to set absolute size in z-direction (depth)
* @param {Object} options options hash
* @param {Function} callback callback function to be executed after the
*                            transitions have been completed
* @return {Size} this
*/
Size.prototype.setAbsolute = function setAbsolute(x, y, z, options, callback) {
    this._absoluteMode = true;
    this._setSizeType(this._absolute, x, y, z, options, callback);
    return this;
};

Size.prototype._setSizeType = function setProp(prop, x, y, z, options, callback){
    this._dispatch.dirtyComponent(this._id);

    var cbX = null;
    var cbY = null;
    var cbZ = null;

    if (z != null) cbZ = callback;
    else if (y != null) cbY = callback;
    else if (x != null) cbX = callback;

    if (x != null) {
        prop.x.set(x, options, cbX);
        prop.dirtyX = true;
    }
    if (y != null) {
        prop.y.set(y, options, cbY);
        prop.dirtyY = true;
    }
    if (z != null) {
        prop.z.set(z, options, cbZ);
        prop.dirtyZ = true;
    }
};

/**
* Applies proportional size.
*
* @method setProportional
* @chainable
* 
* @param {Number} x used to set proportional size in x-direction (width)
* @param {Number} y used to set proportional size in y-direction (height)
* @param {Number} z used to set proportional size in z-direction (depth)
* @param {Object} options options hash
* @param {Function} callback callback function to be executed after the
*                            transitions have been completed
* @return {Size} this
*/
Size.prototype.setProportional = function setProportional(x, y, z, options, callback) {
    this._absoluteMode = false;
    this._setSizeType(this._proportional, x, y, z, options, callback);
    return this;
};

/**
* Applies differential size to Size component.
*
* @method setDifferential
* @chainable
* 
* @param {Number} x used to set differential size in x-direction (width)
* @param {Number} y used to set differential size in y-direction (height)
* @param {Number} z used to set differential size in z-direction (depth)
* @param {Object} options options hash
* @param {Function} callback callback function to be executed after the
*                            transitions have been completed
*/
Size.prototype.setDifferential = function setDifferential(x, y, z, options, callback) {
    this._absoluteMode = false;
    this._setSizeType(this._differential, x, y, z, options, callback);
    return this;
};

/**
* Retrieves the computed size applied to the underlying RenderContext.
*
* @method get
* 
* @return {Number[]} size three dimensional computed size
*/
Size.prototype.get = function get () {
    return this._dispatch.getContext().getSize();
};

/**
 * Halts all currently active size transitions.
 * 
 * @method halt
 * @chainable
 * 
 * @return {Size} this
 */
Size.prototype.halt = function halt () {
    this._proportional.x.halt();
    this._proportional.y.halt();
    this._proportional.z.halt();
    this._differential.x.halt();
    this._differential.y.halt();
    this._differential.z.halt();
    this._absolute.x.halt();
    this._absolute.y.halt();
    this._absolute.z.halt();
    return this;
};

module.exports = Size;

},{"famous-transitions":36}],65:[function(require,module,exports){
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
    this.dispatch = dispatch;
    this._events = new CallbackStore();

    if (events) {
        for (var i = 0, len = events.length; i < len; i++) {
            this.on(events[i], events[i].callback);
        }
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
 * Register a callback to be invoked on an event.
 *
 * @method on
 * @param {Object|String} ev The event object or event name.
 * @param {Function} cb The callback.
 */
UIEventHandler.prototype.on = function on(ev, cb) {
    var renderables = this.dispatch.getRenderables();
    var eventName = ev.event || ev;
    var methods = ev.methods;
    var properties = ev.properties;
    for (var i = 0, len = renderables.length; i < len; i++) {
        if (renderables[i].on) renderables[i].on(eventName, methods, properties);
    }
    this._events.on(eventName, cb);
    this.dispatch.registerTargetedEvent(eventName, this.trigger.bind(this, eventName));
};

/**
 * Deregister a callback from an event.
 *
 * @method on
 * @param {String} ev The event name.
 * @param {Function} cb The callback.
 */
UIEventHandler.prototype.off = function off(ev, cb) {
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
UIEventHandler.prototype.trigger = function trigger (ev, payload) {
    this._events.trigger(ev, payload);
};

module.exports = UIEventHandler;

},{"famous-utilities":49}],66:[function(require,module,exports){
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

},{"./Align":53,"./Camera":54,"./EventEmitter":55,"./EventHandler":56,"./GestureHandler":57,"./MountPoint":58,"./Opacity":59,"./Origin":60,"./Position":61,"./Rotation":62,"./Scale":63,"./Size":64,"./UIEventHandler":65}],67:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],68:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],69:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":67,"dup":34}],70:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],71:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":67,"./Easing":68,"./Transitionable":69,"./after":70,"dup":36}],72:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],73:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":71}],74:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],75:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],76:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],77:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],78:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],79:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":72,"./Color":73,"./KeyCodes":74,"./MethodStore":75,"./ObjectManager":76,"./clone":77,"./flatClone":78,"./keyValueToArrays":80,"./loadURL":81,"./strip":82,"dup":49}],80:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],81:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],82:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],83:[function(require,module,exports){
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
    this.z = 0.5;
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
    var z = size[2] * (this.z - 0.5);
    this.transform.setTranslation(x, y, z);
    return this.transform;
};

module.exports = Align;

},{"./Transform":101}],84:[function(require,module,exports){
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
    this._time = 0;

    this._updatingIndex = 0;
}

/**
 * Updates the internal clock time.
 *
 * @method  step
 * @chainable
 * 
 * @param  {Number} time high resolution timstamp used for invoking the
 *                       `update` method on all registered objects
 * @return {Clock}       this
 */
Clock.prototype.step = function step (time) {
    this._time = time;

    for (; this._updatingIndex < this._updates.length; this._updatingIndex++) {
        this._updates[this._updatingIndex].update(time);
    }

    while (this._nextStepUpdates.length > 0) {
        this._nextStepUpdates.shift().update(time);
    }

    this._updatingIndex = 0;

    return this;
};

/**
 * Registers an object to be updated on every frame.
 *
 * @method  update
 * @chainable
 * 
 * @param {Object}      updateable          Object having an `update` method
 * @param {Function}    updateable.update   update method to be called on every
 *                                          step
 * @return {Clock}                          this
 */
Clock.prototype.update = function update (updateable) {
    if (this._updates.indexOf(updateable) === -1) {
        this._updates.push(updateable);
    }
    return this;
};

/**
 * Deregisters a previously using `update` registered object to be no longer
 * updated on every frame.
 *
 * @method  noLongerUpdate
 * @chainable
 * 
 * @param  {Object} updateable  Object previously registered using the `update`
 *                              method
 * @return {Clock}              this
 */
Clock.prototype.noLongerUpdate = function noLongerUpdate(updateable) {
    var index = this._updates.indexOf(updateable);
    if (index > -1) {
        if (index <= this._updatingIndex && this._updatingIndex !== 0) this._updatingIndex--;
        this._updates.splice(index, 1);
    }
    return this;
};

/**
 * Returns the internal clock time.
 *
 * @method  getTime
 * 
 * @param  {Number} time high resolution timstamp used for invoking the
 *                       `update` method on all registered objects
 */
Clock.prototype.getTime = function getTime() {
    return this._time;
};

/**
 * Registers object to be updated **once** on the next step. Registered
 * updateables are not guaranteed to be unique, therefore multiple updates per
 * step per object are possible.
 *
 * @method nextStep
 * @chainable
 * 
 * @param {Object}      updateable          Object having an `update` method
 * @param {Function}    updateable.update   update method to be called on the
 *                                          next step
 * @return {Clock}                          this
 */
Clock.prototype.nextStep = function nextStep(updateable) {
    this._nextStepUpdates.push(updateable);
    return this;
};

/**
 * Wraps a function to be invoked after a certain amount of time.
 * After a set duration has passed, it executes the function and
 * removes it as a listener to 'prerender'.
 *
 * @method setTimeout
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} delay milliseconds from now to execute the function
 *
 * @return {Function} decorated passed in callback function
 */
Clock.prototype.setTimeout = function (callback, delay) {
    var params = Array.prototype.slice.call(arguments, 2);

    // problem this._time might be null
    var startedAt = this._time;
    var _this = this;
    var looper = {
        update: function update (time) {
            if (time - startedAt >= delay) {
                callback.apply(this, params);
                _this.noLongerUpdate(looper);
            }
        }
    };
    callback.__looper = looper
    this.update(looper);
    return callback;
};

/**
 * Removes previously via `Clock#setTimeout` or `Clock#setInterval`
 * registered callback function
 *
 * @method clearTimer
 * @chainable
 * 
 * @param  {Function} callback  previously via `Clock#setTimeout` or
 *                              `Clock#setInterval` registered callback function
 * @return {Clock}              this
 */
Clock.prototype.clearTimer = function (callback) {
    this.noLongerUpdate(callback.__looper);
    return this;
};

/**
 * Wraps a function to be invoked after a certain amount of time.
 *  After a set duration has passed, it executes the function and
 *  resets the execution time.
 *
 * @method setInterval
 *
 * @param {Function} callback function to be run after a specified duration
 * @param {Number} duration interval to execute function in milliseconds
 *
 * @return {Function} decorated passed in callback function
 */
Clock.prototype.setInterval = function setInterval(callback, delay) {
    var params = Array.prototype.slice.call(arguments, 2);
    var startedAt = this._time;

    var looper = {
        update: function update (time) {
            if (time - startedAt >= delay) {
                callback.apply(this, params);
                startedAt = time;
            }
        }
    };
    callback.__looper = looper;
    this.update(looper);
    return callback;
};


module.exports = Clock;

},{}],85:[function(require,module,exports){
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

},{"./Layer":89}],86:[function(require,module,exports){
'use strict';

var Node = require('./Node');
var RenderProxy = require('./RenderProxy');

/**
 * Context is the top-level node in the scene graph (= tree node).
 * As such, it populates the internal MessageQueue with commands received by
 * subsequent child-nodes. The Context is being updated by the Clock on every
 * FRAME and therefore recursively updates the scene grpah.
 *
 * @class  Context
 * @constructor
 * 
 * @param {String} [selector=body]  query selector used as container for
 *                                  context
 */
function Context (selector, messageQueue, globalDispatch, clock) {
    this._messageQueue = messageQueue;
    this._globalDispatch = globalDispatch;
    this._clock = clock;

    this._clock.update(this);

    this.proxy = new RenderProxy(this);
    this.node = new Node(this.proxy, this._globalDispatch);
    this.selector = selector || 'body';
    this.dirty = true;
    this.dirtyQueue = [];

    this._messageQueue.enqueue('NEED_SIZE_FOR').enqueue(this.selector);
    this._globalDispatch.targetedOn(this.selector, 'resize', this._receiveContextSize.bind(this));
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
},{"./Node":93,"./RenderProxy":99}],87:[function(require,module,exports){
'use strict';

/* global self, console */

var Clock = require('./Clock');
var GlobalDispatch = require('./GlobalDispatch');
var MessageQueue = require('./MessageQueue');
var ProxyRegistry = require('./ProxyRegistry');
var Context = require('./Context');

var isWorker = typeof self !== 'undefined' && self.window !== self;

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
    this._proxyRegistry = new ProxyRegistry(this._messageQueue);
    this._contexts = [];

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
            case 'INVOKE':
                this.handleInvoke(message);
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

Famous.prototype.handleInvoke = function handleInvoke (message) {
    var id = message.shift();
    var args = message.shift();
    this._proxyRegistry.invokeCallback(id, args);
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
Famous.prototype.createContext = function createContext (selector) {
    var context = new Context(selector, this._messageQueue, this._globalDispatch, this._clock);
    this._contexts.push(context);
    return context;
};

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

Famous.prototype.proxy = function proxy (target) {
    return this._proxyRegistry.getInstance(target);
};

module.exports = new Famous();

},{"./Clock":84,"./Context":86,"./GlobalDispatch":88,"./MessageQueue":91,"./ProxyRegistry":97}],88:[function(require,module,exports){
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
    if (this._targetedCallbacks[path]) this._targetedCallbacks[path].off(key, cb);
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

},{"famous-utilities":79}],89:[function(require,module,exports){
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

},{}],90:[function(require,module,exports){
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

},{"./ComponentStore":85,"./RenderContext":98,"./RenderProxy":99}],91:[function(require,module,exports){
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


},{}],92:[function(require,module,exports){
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
    var z = size[2] * -(this.z - 0.5);
    this.transform.setTranslation(x, y, z);
    return this.transform;
};

module.exports = MountPoint;

},{"./Align":83}],93:[function(require,module,exports){
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

},{"./LocalDispatch":90}],94:[function(require,module,exports){
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

},{}],95:[function(require,module,exports){
'use strict';

var Transform = require('./Transform');

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
    this.z = 0.5;
    this.isActive = false;
    this.dirty = false;
    this.toOriginTransform = new Transform();
    this.fromOriginTransform = new Transform();
}

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
    }
    if (this.y !== y && y != null) {
        this.y = y;
    }
    if (this.z !== z && z != null) {
        this.z = z;
    }
    return this;
};

Origin.prototype.update = function update (size) {
    var x = size[0] * this.x;
    var y = size[1] * this.y;
    var z = size[2] * (this.z - 0.5);
    this.toOriginTransform.setTranslation(-x, -y, -z);
    this.fromOriginTransform.setTranslation(x, y, z);
    return this.transform;
};

module.exports = Origin;

},{"./Transform":101}],96:[function(require,module,exports){
'use strict';

/**
 * Proxies provide a way to access arbitrary global objects within a WebWorker.
 * 
 * @class Proxy
 * @constructor
 * @private
 * 
 * @param {String} target               window[target] refers to the proxied
 *                                      object
 * @param {MessageQueue} messageQueue   the message queue being used to append
 *                                      commands onto
 * @param {ProxyRegistry} proxyRegistry registry being used in order to
 *                                      register functions
 */
function Proxy(target, messageQueue, proxyRegistry) {
    this._target = target;
    this._messageQueue = messageQueue;
    this._proxyRegistry = proxyRegistry;
}

Proxy.prototype.invoke = function(methodName, args) {
    this._messageQueue.enqueue('INVOKE');
    this._messageQueue.enqueue(this._target);
    this._messageQueue.enqueue(methodName);

    var functionArgs = [];

    var functionId;
    for (var i = 0; i < args.length; i++) {
        functionArgs[i] = null;
        if (typeof args[i] === 'function') {
            functionId = this._proxyRegistry.registerCallback(args[i]);
            functionArgs[i] = functionId;
            args[i] = null;
        }
    }
    this._messageQueue.enqueue(args);
    this._messageQueue.enqueue(functionArgs);
};

module.exports = Proxy;

},{}],97:[function(require,module,exports){
'use strict';

var Proxy = require('./Proxy');

function ProxyRegistry(messageQueue) {
    this._proxies = {};
    this._callbacks = {};
    this._nextCallbackId = 0;
    this._messageQueue = messageQueue;
}

ProxyRegistry.prototype.getInstance = function getInstance(target) {
    if (!this._proxies[target]) this._proxies[target] = new Proxy(target, this._messageQueue, this);
    return this._proxies[target];
};

ProxyRegistry.prototype.registerCallback = function registerCallback (callback) {
    var id = this._nextCallbackId++;
    this._callbacks[id] = callback;
    return id;
};

ProxyRegistry.prototype.invokeCallback = function invokeCallback (id, args) {
    // function in arguments returns value used by proxied object
    // (conceptual limitation of offloading a synchronous process to a
    // worker, which essentially turns it into an asynchronous operation)
    // TL;DR We return this, because we can't do anything meaningful with the
    // return value
    if (this._callbacks[id].apply(null, args) !== undefined) {
        console.warn('Return value of proxied functions are being ignored');
    }
    return this;
};

module.exports = ProxyRegistry;

},{"./Proxy":96}],98:[function(require,module,exports){
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
    this._events.off(TRANSFORM, cb);
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

    var mySize = this._size.get();
    var parentSize = parentContext ? parentContext._size.get() : identSize;
    this._align.update(parentSize);
    this._mountPoint.update(mySize);
    this._origin.update(mySize);

    var alignInvalidations;

    if (this._recalcAll || (!this._noParent && !parentContext)) {
        alignInvalidations = (1 << 16) - 1;
    }
    else if (this._noParent && !parentContext) {
        alignInvalidations = 0;
    }
    else {
        alignInvalidations = parentContext._origin.toOriginTransform._previouslyInvalidated;
    }

    this._align.transform._update(
        alignInvalidations,
        parentContext ? parentContext._origin.toOriginTransform._matrix : identTrans
    );

    this._mountPoint.transform._update(
        this._align.transform._previouslyInvalidated,
        this._align.transform._matrix
    );

    this._origin.fromOriginTransform._update(
        this._mountPoint.transform._previouslyInvalidated,
        this._mountPoint.transform._matrix
    );

    this._transform._update(
        this._origin.fromOriginTransform._previouslyInvalidated,
        this._origin.fromOriginTransform._matrix
    );

    this._origin.toOriginTransform._update(
        this._transform._previouslyInvalidated,
        this._transform._matrix
    );

    var worldTransform = this._origin.toOriginTransform;

    if (worldTransform._previouslyInvalidated) {
       this._events.trigger(TRANSFORM, worldTransform);
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

},{"./Align":83,"./MountPoint":92,"./Opacity":94,"./Origin":95,"./Size":100,"./Transform":101,"famous-utilities":79}],99:[function(require,module,exports){
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

},{}],100:[function(require,module,exports){
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

},{}],101:[function(require,module,exports){
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
    var report = this._invalidated;
    if (parentReport) {
        this._previouslyInvalidated = parentReport;
        var counter = 0;
        while (report) {
            if (report & 1) this._matrix[counter] = parentMatrix[counter];
            counter++;
            report >>>= 1;
        }
    }

    return report;
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
    if (parentReport) this._invalidateFromParent(parentReport);
    if (!parentMatrix) parentMatrix = IDENTITY;
    if (this._isIdentity()) return this._copyParent(parentReport, parentMatrix);
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

},{}],102:[function(require,module,exports){
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

},{"./Align":83,"./Clock":84,"./ComponentStore":85,"./Context":86,"./Famous":87,"./GlobalDispatch":88,"./Layer":89,"./LocalDispatch":90,"./MountPoint":92,"./Node":93,"./Opacity":94,"./Origin":95,"./RenderContext":98,"./RenderProxy":99,"./Size":100,"./Transform":101}],103:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],104:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],105:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":103,"dup":34}],106:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],107:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":103,"./Easing":104,"./Transitionable":105,"./after":106,"dup":36}],108:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],109:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":107}],110:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],111:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],112:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],113:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],114:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],115:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":108,"./Color":109,"./KeyCodes":110,"./MethodStore":111,"./ObjectManager":112,"./clone":113,"./flatClone":114,"./keyValueToArrays":116,"./loadURL":117,"./strip":118,"dup":49}],116:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],117:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],118:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],119:[function(require,module,exports){
'use strict';

var CallbackStore = require('famous-utilities').CallbackStore;

var WITH = 'WITH';
var CHANGE_TRANSFORM = 'CHANGE_TRANSFORM';
var CHANGE_PROPERTY = 'CHANGE_PROPERTY';
var INIT_DOM = 'INIT_DOM';
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
function HTMLElement(dispatch, options) {
    if (typeof options === 'string') {
        console.warn(
            'HTMLElement constructor signature changed!\n' +
            'Pass in an options object with {tagName: ' + options + '} instead.'
        );
        options = {
            tagName: options
        };
    }

    options = options || {};
    this._dispatch = dispatch;
    this._id = dispatch.addRenderable(this);
    this._queue = [];

    this._tagName = options.tagName ? options.tagName : 'div';
    this._transform = new Float32Array(16);
    this._size = [0, 0, 0];
    this._trueSized = [false, false];
    this._opacity = 1;
    this._properties = {};
    this._classes = {};
    this._attributes = {};
    this._content = '';

    this._queue.push(INIT_DOM);
    this._queue.push(this._tagName);

    this._callbacks = new CallbackStore();
    this._dispatch.onTransformChange(this._receiveTransformChange.bind(this));
    this._dispatch.onSizeChange(this._receiveSizeChange.bind(this));
    this._dispatch.onOpacityChange(this._receiveOpacityChange.bind(this));

    this._receiveTransformChange(this._dispatch.getContext()._transform);
    this._receiveSizeChange(this._dispatch.getContext()._size);
    this._receiveOpacityChange(this._dispatch.getContext()._opacity);

    if (options == null) return;

    if (options.classes) {
        for (var i = 0; i < options.classes.length; i++)
            this.addClass(options.classes[i]);
    }

    if (options.attributes) {
        for (var key in options.attributes)
            this.attribute(key, options.attributes[key]);
    }

    if (options.properties) {
        for (var key in options.properties)
            this.property(key, options.properties[key]);
    }

    if (options.id) this.id(options.id);
    if (options.content) this.content(options.content);
}

// Return the name of the Element Class: 'element'
HTMLElement.toString = function toString() {
    return 'element';
};

HTMLElement.prototype.getState = function getState() {
    return {
        renderable: this.constructor.toString(),
        tagName: this._tagName,
        transform: this._transform,
        size: this._size,
        trueSized: this._trueSized,
        opacity: this._opacity,
        properties: this._properties,
        classes: this._classes,
        attributes: this._attributes,
        content: this._content
    };
};

HTMLElement.prototype.clean = function clean() {
    var len = this._queue.length;
    if (len) {
    	var path = this._dispatch.getRenderPath();
    	this._dispatch
            .sendDrawCommand(WITH)
            .sendDrawCommand(path);

    	for (var i = 0 ; i < len ; i++)
    	    this._dispatch.sendDrawCommand(this._queue.shift());
    }
    return false;
};

HTMLElement.prototype._receiveTransformChange = function _receiveTransformChange(transform) {
    this._transform = transform._matrix;
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
    this._size = size;
    this._dispatch.dirtyRenderable(this._id);
    var width = this._trueSized[0] ? this._trueSized[0] : size._size[0];
    var height = this._trueSized[1] ? this._trueSized[1] : size._size[1];
    this._queue.push('CHANGE_SIZE');
    this._queue.push(width);
    this._queue.push(height);
    this._size[0] = width;
    this._size[1] = height;
};

HTMLElement.prototype._receiveOpacityChange = function _receiveOpacityChange(opacity) {
    this._opacity = opacity;
    this.property('opacity', opacity.value);
};

HTMLElement.prototype.getSize = function getSize() {
    return this._size;
};

HTMLElement.prototype.on = function on (ev, methods, properties) {
    this.eventListener(ev, methods, properties);
    return this;
};

HTMLElement.prototype.kill = function kill () {
    this._dispatch.sendDrawCommand(WITH).sendDrawCommand(this._dispatch.getRenderPath()).sendDrawCommand('DOM').sendDrawCommand(RECALL);
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
    this._properties[key] = value;
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
    this._attributes[key] = value;
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
    this._classes[value] = true;
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
    delete this._classes[value];
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
    this._attributes.id = value;
    this._dispatch.dirtyRenderable(this._id);
    this._queue.push(CHANGE_ATTRIBUTE);
    this._queue.push('id');
    this._queue.push(value);
    return this;
};

/**
 * Define the content of the DOM element
 *
 * @method content
 * @chainable
 *
 * @param {String|DOMElement|DocumentFragment} value content to be inserted into the DOM element
 * @return {HTMLElement} current HTMLElement
 */
HTMLElement.prototype.content = function content(value) {
    this._content = value;
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

},{"famous-utilities":115}],120:[function(require,module,exports){
'use strict';

module.exports = {
    HTMLElement: require('./HTMLElement')
};

},{"./HTMLElement":119}],121:[function(require,module,exports){
'use strict';

module.exports = {
    requestAnimationFrame: require('./requestAnimationFrame')
};

},{"./requestAnimationFrame":122}],122:[function(require,module,exports){
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

},{}],123:[function(require,module,exports){
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

    // Opera 12.10 and Firefox 18 and later support
    if (typeof document.hidden !== 'undefined') {
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

/**
 * Engine class used for updating objects on a frame-by-frame. Synchronizes the
 * `update` method invocations to the refresh rate of the screen. Manages
 * the `requestAnimationFrame`-loop by normalizing the passed in timestamp
 * when switching tabs.
 * 
 * @class Engine
 * @constructor
 */
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

/**
 * Starts the Engine.
 *
 * @method start
 * @chainable
 * 
 * @return {Engine} this
 */
Engine.prototype.start = function start() {
    this._startOnVisibilityChange = true;
    this._running = true;
    this._sleep += _now() - this._stoppedAt;
    return this;
};

/**
 * Stops the Engine.
 *
 * @method stop
 * @chainable
 * 
 * @return {Engine} this
 */
Engine.prototype.stop = function stop() {
    this._startOnVisibilityChange = false;
    this._running = false;
    this._stoppedAt = _now();
    return this;
};

/**
 * Determines whether the Engine is currently running or not.
 *
 * @method isRunning
 * 
 * @return {Boolean}    boolean value indicating whether the Engine is
 *                      currently running or not
 */
Engine.prototype.isRunning = function isRunning() {
    return this._running;
};

/**
 * Updates all registered objects.
 *
 * @method step
 * @chainable
 * 
 * @param  {Number} time high resolution timstamp used for invoking the
 *                       `update` method on all registered objects
 * @return {Engine}      this
 */
Engine.prototype.step = function step (time) {
    for (var i = 0, len = this._updates.length ; i < len ; i++) {
        this._updates[i].update(time);
    }
    return this;
};

/**
 * Method being called by `requestAnimationFrame` on every paint. Indirectly
 * recursive by scheduling a future invocation of itself on the next paint.
 *
 * @method loop
 * @chainable
 * 
 * @param  {Number} time high resolution timstamp used for invoking the
 *                       `update` method on all registered objects
 * @return {Engine}      this
 */
Engine.prototype.loop = function loop(time) {
    this.step(time - this._sleep);
    if (this._running) {
        rAF(this.looper);
    }
    return this;
};

/**
 * Registeres an updateable object which `update` method should be invoked on
 * every paint, starting on the next paint (assuming the Engine is running).
 *
 * @method update
 * @chainable
 * 
 * @param  {Object} updateable          object to be updated
 * @param  {Function} updateable.update update function to be called on the
 *                                      registered object
 * @return {Engine}                     this
 */
Engine.prototype.update = function update(updateable) {
    if (this._updates.indexOf(updateable) === -1) {
        this._updates.push(updateable);
    }
    return this;
};

/**
 * Deregisters an updateable object previously registered using `update` to be
 * no longer updated.
 *
 * @method noLongerUpdate
 * @chainable
 * 
 * @param  {Object} updateable          updateable object previously
 *                                      registered using `update`
 * @return {Engine}                     this
 */
Engine.prototype.noLongerUpdate = function noLongerUpdate(updateable) {
    var index = this._updates.indexOf(updateable);
    if (index > -1) {
        this._updates.splice(index, 1);
    }
    return this;
};

module.exports = Engine;

},{"famous-polyfills":121}],124:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],125:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":124,"dup":28}],126:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],127:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],128:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":124,"./Quaternion":125,"./Vec2":126,"./Vec3":127,"dup":31}],129:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],130:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":129,"dup":28}],131:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],132:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],133:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":129,"./Quaternion":130,"./Vec2":131,"./Vec3":132,"dup":31}],134:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],135:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],136:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":134,"dup":34}],137:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],138:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":134,"./Easing":135,"./Transitionable":136,"./after":137,"dup":36}],139:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],140:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":138}],141:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],142:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],143:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],144:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],145:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],146:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":139,"./Color":140,"./KeyCodes":141,"./MethodStore":142,"./ObjectManager":143,"./clone":144,"./flatClone":145,"./keyValueToArrays":147,"./loadURL":148,"./strip":149,"dup":49}],147:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],148:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],149:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],150:[function(require,module,exports){
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

},{"famous-math":133,"famous-utilities":146}],151:[function(require,module,exports){
'use strict';

var Particle = require('./bodies/Particle');
var Constraint = require('./constraints/Constraint');
var Force = require('./forces/Force');

var Vec3 = require('famous-math').Vec3;
var Quaternion = require('famous-math').Quaternion;

var VEC_REGISTER = new Vec3();
var ZYX_REGISTER = new Vec3();
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

    this.frameDependent = options.frameDependent || false;

    this.transformBuffers = {
        position: [0, 0, 0],
        rotation: [0, 0, 0]
    };
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
 * @return {Object} Position and rotation of the boy, taking into account
 * the origin and orientation of the world.
 */
PhysicsEngine.prototype.getTransform = function getTransform(body) {
    var o = this.origin;
    var oq = this.orientation;
    var transform = this.transformBuffers;

    var p = body.position;
    var q = body.orientation;
    var rot = q;
    var loc = p;
    var ZYX;

    if (oq.w !== 1) {
        rot = Quaternion.multiply(q, oq, QUAT_REGISTER);
        loc = oq.rotateVector(p, VEC_REGISTER);
    }
    var ZYX = rot.toEuler(ZYX_REGISTER);

    transform.position[0] = o.x+loc.x;
    transform.position[1] = o.y+loc.y;
    transform.position[2] = o.z+loc.z;

    transform.rotation[0] = ZYX.x;
    transform.rotation[1] = ZYX.y;
    transform.rotation[2] = ZYX.z;

    return transform;
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

        if (x !== null || y !== null || z !== null) body.setVelocity(x,y,z);
        if (ax !== null || ay !== null || az !== null) body.setAngularVelocity(ax, ay, az);
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

    body.updateInertia();
};

module.exports = PhysicsEngine;

},{"./bodies/Particle":154,"./constraints/Constraint":159,"./forces/Force":171,"famous-math":133}],152:[function(require,module,exports){
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

},{"./ConvexBodyFactory":153,"famous-math":133}],153:[function(require,module,exports){
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
 * @return {Function} The constructor.
 */
function ConvexBodyFactory(hull) {
    if (!(hull instanceof ConvexHull)) {
        if (!(hull instanceof Array)) throw new Error('ConvexBodyFactory requires a ConvexHull object or an array of Vec3\'s as input.');
        else hull = new ConvexHull(hull);
    }

    /**
     * The body class with inertia and vertices inferred from the input ConvexHull or Vec3 array.
     *
     * @class ConvexBody
     * @param {Object} options The options hash.
     */
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
        this.inverseInertia.copy(this.localInverseInertia);
        this.updateInertia();
    }

    ConvexBody.prototype = Object.create(Particle.prototype);
    ConvexBody.prototype.constructor = ConvexBody;

    /**
     * Set the size and recalculate
     *
     * @method setSize
     * @chainable
     * @param {Number} x The x span.
     * @param {Number} y The y span.
     * @param {Number} z The z span.
     */
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

        return this;
    };

    /**
     * Update the local inertia and inverse inertia to reflect the current size.
     *
     * @method updateLocalInertia
     * @chainable
     */
    ConvexBody.prototype.updateLocalInertia = function updateInertia() {
        var scaleX = this._scale[0];
        var scaleY = this._scale[1];
        var scaleZ = this._scale[2];

        var T = new Mat33([scaleX, 0, 0, 0, scaleY, 0, 0, 0, scaleZ]);

        _computeInertiaProperties.call(this, T);

        return this;
    };

    /**
     * Retrieve the vertex furthest in a direction. Used internally for collision detection.
     *
     * @method support
     * @return {Vec3} The furthest vertex.
     */
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

    /**
     * Update vertices to reflect current orientation.
     *
     * @method updateShape
     * @chainable
     */
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

        return this;
    };

    return ConvexBody;
}

/**
 * Determines mass and inertia tensor based off the density, size, and facet information of the polyhedron.
 *
 * @method _computeInertiaProperties
 * @private
 * @param {Mat33} T The matrix transforming the intial set of vertices to a set reflecting the body size.
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

    this.localInertia.set(inertia);
    Mat33.inverse(this.localInertia, this.localInverseInertia);
}

module.exports = ConvexBodyFactory;

},{"../Geometry":150,"../bodies/Particle":154,"famous-math":133}],154:[function(require,module,exports){
'use strict';

var Vec3 = require('famous-math').Vec3;
var Quaternion = require('famous-math').Quaternion;
var Mat33 = require('famous-math').Mat33;

var CallbackStore = require('famous-utilities').CallbackStore;

var ZERO_VECTOR = new Vec3();

var MAT1_REGISTER = new Mat33();
var QUAT_REGISTER = new Mat33();

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

    this.events = new CallbackStore();

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

    this.inverseInertia = new Mat33([0,0,0,0,0,0,0,0,0]);

    this.localInertia = new Mat33([0,0,0,0,0,0,0,0,0]);
    this.localInverseInertia = new Mat33([0,0,0,0,0,0,0,0,0]);

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
 * Resets the inertia tensor and its inverse to reflect the current shape.
 *
 * @method updateLocalInertia
 * @chainable
 * @param {Mat33} Mat33
 */
Particle.prototype.updateLocalInertia = function updateLocalInertia() {
    this.localInertia.set([0,0,0,0,0,0,0,0,0]);
    this.localInverseInertia.set([0,0,0,0,0,0,0,0,0]);
    return this;
};

/**
 * Updates the world inverse inertia tensor.
 *
 * @method updateInertia
 * @chainable
 */
Particle.prototype.updateInertia = function updateInertia() {
    var localInvI = this.localInverseInertia;
    var q = this.orientation;
    if (localInvI[0] === localInvI[4] && localInvI[4] === localInvI[8]) return;
    if (q.w === 1) return;
    var R = q.toMatrix(MAT1_REGISTER);
    Mat33.multiply(R, this.inverseInertia, this.inverseInertia);
    Mat33.multiply(this.localInverseInertia, R.transpose(), this.inverseInertia);
    return this;
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
    this.updateInertia();
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
    var I = Mat33.inverse(this.inverseInertia, MAT1_REGISTER)
    if (I) I.vectorMultiply(this.angularVelocity, this.angularMomentum);
    else this.angularMomentum.clear();
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

},{"famous-math":133,"famous-utilities":146}],155:[function(require,module,exports){
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
    this.updateLocalInertia();
    this.inverseInertia.copy(this.localInverseInertia);

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
Sphere.prototype.updateLocalInertia = function updateInertia() {
    var m = this.mass;
    var r = this.radius;

    var mrr = m * r * r;

    this.localInertia.set([
        0.4 * mrr, 0, 0,
        0, 0.4 * mrr, 0,
        0, 0, 0.4 * mrr
    ]);

    this.localInverseInertia.set([
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

},{"./Particle":154,"famous-math":133}],156:[function(require,module,exports){
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

},{"./Particle":154,"famous-math":133}],157:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Constraint":159,"famous-math":133}],158:[function(require,module,exports){
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
    this.targets = [].concat(targets);

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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
 */
Collision.prototype.resolve = function resolve(time, dt) {
    this.contactManifoldTable.resolveManifolds(dt);
};

/**
 * Add a target or targets to the collision system.
 *
 * @method addTarget
 * @param {Particle}
 */
Collision.prototype.addTarget = function addTarget(target) {
    this.targets.push(target);
    this.broadPhase.add(target);
};

/**
 * Remove a target or targets from the collision system.
 *
 * @method addTarget
 * @param {Particle}
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

},{"./Constraint":159,"./collision/BruteForce":166,"./collision/ContactManifold":167,"./collision/ConvexCollisionDetection":168,"./collision/SweepAndPrune":169,"famous-math":133,"famous-utilities":146}],159:[function(require,module,exports){
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
 * Decorates the Constraint with the options object.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
 */
Constraint.prototype.update = function update(time, dt) {}

/**
 * Apply impulses to resolve the constraint.
 *
 * @method resolve
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
 */
Constraint.prototype.resolve = function resolve(time, dt) {}

module.exports = Constraint;

},{}],160:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
},{"./Constraint":159,"famous-math":133}],161:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Constraint":159,"famous-math":133}],162:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Constraint":159,"famous-math":133}],163:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Constraint":159,"famous-math":133}],164:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Constraint":159,"famous-math":133}],165:[function(require,module,exports){
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

},{}],166:[function(require,module,exports){
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

},{"./AABB":165}],167:[function(require,module,exports){
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
    var manifold = OMRequestManifold().reset(lowID, highID, bodyA, bodyB);
    this.manifolds[index] = manifold;

    return manifold;
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
 * Update each of the manifolds, removing those that no longer contain contact points.
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
        if (!persists) {
            this.removeManifold(manifold, i);
            manifold.bodyA.events.trigger('collision:end', manifold);
            manifold.bodyB.events.trigger('collision:end', manifold);
        }
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
        bodyA.events.trigger('collision:start', manifold);
        bodyB.events.trigger('collision:start', manifold);
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

},{"famous-math":133,"famous-utilities":146}],168:[function(require,module,exports){
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
        var v = vertices.pop();
        if (v !== null) OMFreeGJK_EPASupportPoint(v);
    }
    geometry.numVertices = 0;
    var features = geometry.features;
    var i = features.length
    while (i--) {
        var f = features.pop();
        if (f !== null) OMFreeDynamicGeometryFeature(f);
    }
    geometry.numFeatures = 0;
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

},{"../../Geometry":150,"famous-math":133,"famous-utilities":146}],169:[function(require,module,exports){
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

},{"./AABB":165}],170:[function(require,module,exports){
'use strict';

var Force = require('./Force');
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Force":171,"famous-math":133}],171:[function(require,module,exports){
'use strict';

var _ID = 0;
/**
 * Abstract force manager to apply forces to targets.
 *
 * @class Force
 * @virtual
 * @param {Particle[]} targets The targets of the force.
 * @param {Object} options The options hash.
 */
function Force(targets, options) {
    if (targets) {
        if (targets instanceof Array) this.targets = targets;
        else this.targets = [targets];
    }
    else this.targets = [];

    options = options || {};
    this.setOptions(options);

    this._ID = _ID++;
}

/**
 * Decorates the Force with the options object.
 *
 * @method setOptions
 * @param {Object} options The options hash.
 */
Force.prototype.setOptions = function setOptions(options) {
    for (var key in options) this[key] = options[key];
    this.init(options);
};

/**
 * Add a target or targets to the Force.
 *
 * @method addTarget
 * @param {Particle} target The body to begin targetting.
 */
Force.prototype.addTarget = function addTarget(target) {
    this.targets.push(target);
};

/**
 * Remove a target or targets from the Force.
 *
 * @method addTarget
 * @param {Particle} target The body to stop targetting.
 */
Force.prototype.removeTarget = function removeTarget(target) {
    var index = this.targets.indexOf(target);
    if (index < 0) return;
    this.targets.splice(index, 1);
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
 */
Force.prototype.update = function update(time, dt) {};

module.exports = Force;

},{}],172:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Vec3 = require('famous-math').Vec3;

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
    if (options.acceleration) {
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Force":171,"famous-math":133}],173:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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

},{"./Force":171,"famous-math":133}],174:[function(require,module,exports){
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
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
        target.applyTorque(torque);
    }
};

function clamp(value, lower, upper) {
    return value < lower ? lower : value > upper ? upper : value;
}

module.exports = RotationalDrag;

},{"./Force":171,"famous-math":133}],175:[function(require,module,exports){
'use strict';

var Force = require('./Force');
var Quaternion = require('famous-math').Quaternion;
var Vec3 = require('famous-math').Vec3;
var Mat33 = require('famous-math').Mat33;

var Q_REGISTER = new Quaternion();
var DAMPING_REGISTER = new Vec3();
var XYZ_REGISTER = new Vec3();
var MAT_REGISTER = new Mat33();

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
    if (options.stiffness || options.damping) {
        this.stiffness = this.stiffness || 100;
        this.damping = this.damping || 0;
        this.period = null;
        this.dampingRatio = null;
    }
    else if (options.period || options.dampingRatio) {
        this.period = this.period || 1;
        this.dampingRatio = this.dampingRatio || 0;

        this.stiffness = 2 * PI / this.period;
        this.stiffness *= this.stiffness;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
};

/**
 * Adds a torque force to a physics body's torque accumulator.
 *
 * @method update
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
    var invSourceInertia = this.anchor ? null : source.inverseInertia;
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

        if (invSourceInertia !== null) {
            Mat33.add(invSourceInertia, target.inverseInertia, effInertia).inverse();
        } else {
            Mat33.inverse(target.inverseInertia, effInertia);
        }

        if (damping !== 0) {
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

},{"./Force":171,"famous-math":133}],176:[function(require,module,exports){
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
    if (options.stiffness || options.damping) {
        this.stiffness = this.stiffness || 100;
        this.damping = this.damping || 0;
        this.period = null;
        this.dampingRatio = null;
    }
    else if (options.period || options.dampingRatio) {
        this.period = this.period || 1;
        this.dampingRatio = this.dampingRatio || 0;

        this.stiffness = 2 * PI / this.period;
        this.stiffness *= this.stiffness;
        this.damping = 4 * PI * this.dampingRatio / this.period;
    }
};

/**
 * Apply the force.
 *
 * @method update
 * @param {Number} time The current time in the physics engine.
 * @param {Number} dt The physics engine frame delta.
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
        if (this.period !== null) {
            stiffness *= effMass;
            damping *= effMass;
        }

        force.scale(stiffness * type(stretch, maxLength) / stretch);

        if (damping !== 0) {
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

},{"./Force":171,"famous-math":133}],177:[function(require,module,exports){
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

},{"./Geometry":150,"./PhysicsEngine":151,"./bodies/Box":152,"./bodies/ConvexBodyFactory":153,"./bodies/Particle":154,"./bodies/Sphere":155,"./bodies/Wall":156,"./constraints/Angle":157,"./constraints/Collision":158,"./constraints/Constraint":159,"./constraints/Curve":160,"./constraints/Direction":161,"./constraints/Distance":162,"./constraints/Hinge":163,"./constraints/Point2Point":164,"./forces/Drag":170,"./forces/Force":171,"./forces/Gravity1D":172,"./forces/Gravity3D":173,"./forces/RotationalDrag":174,"./forces/RotationalSpring":175,"./forces/Spring":176}],178:[function(require,module,exports){
arguments[4][121][0].apply(exports,arguments)
},{"./requestAnimationFrame":179,"dup":121}],179:[function(require,module,exports){
arguments[4][122][0].apply(exports,arguments)
},{"dup":122}],180:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],181:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":180,"dup":28}],182:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],183:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],184:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":180,"./Quaternion":181,"./Vec2":182,"./Vec3":183,"dup":31}],185:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],186:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],187:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":185,"dup":34}],188:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],189:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":185,"./Easing":186,"./Transitionable":187,"./after":188,"dup":36}],190:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],191:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],192:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":190,"dup":34}],193:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],194:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":190,"./Easing":191,"./Transitionable":192,"./after":193,"dup":36}],195:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],196:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":194}],197:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],198:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],199:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],200:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],201:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],202:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":195,"./Color":196,"./KeyCodes":197,"./MethodStore":198,"./ObjectManager":199,"./clone":200,"./flatClone":201,"./keyValueToArrays":203,"./loadURL":204,"./strip":205,"dup":49}],203:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],204:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],205:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],206:[function(require,module,exports){
arguments[4][53][0].apply(exports,arguments)
},{"./Position":214,"dup":53}],207:[function(require,module,exports){
arguments[4][54][0].apply(exports,arguments)
},{"dup":54}],208:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],209:[function(require,module,exports){
arguments[4][56][0].apply(exports,arguments)
},{"dup":56,"famous-utilities":202}],210:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"dup":57,"famous-math":184,"famous-utilities":202}],211:[function(require,module,exports){
arguments[4][58][0].apply(exports,arguments)
},{"./Position":214,"dup":58}],212:[function(require,module,exports){
arguments[4][59][0].apply(exports,arguments)
},{"dup":59,"famous-transitions":189}],213:[function(require,module,exports){
arguments[4][60][0].apply(exports,arguments)
},{"./Position":214,"dup":60}],214:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61,"famous-transitions":189}],215:[function(require,module,exports){
arguments[4][62][0].apply(exports,arguments)
},{"./Position":214,"dup":62}],216:[function(require,module,exports){
arguments[4][63][0].apply(exports,arguments)
},{"./Position":214,"dup":63}],217:[function(require,module,exports){
arguments[4][64][0].apply(exports,arguments)
},{"dup":64,"famous-transitions":189}],218:[function(require,module,exports){
arguments[4][65][0].apply(exports,arguments)
},{"dup":65,"famous-utilities":202}],219:[function(require,module,exports){
arguments[4][66][0].apply(exports,arguments)
},{"./Align":206,"./Camera":207,"./EventEmitter":208,"./EventHandler":209,"./GestureHandler":210,"./MountPoint":211,"./Opacity":212,"./Origin":213,"./Position":214,"./Rotation":215,"./Scale":216,"./Size":217,"./UIEventHandler":218,"dup":66}],220:[function(require,module,exports){
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
    }
    this._allocatedNodes[type] = this._allocatedNodes[type] ? this._allocatedNodes[type] : [];
    this._allocatedNodes[type].push(result);
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

},{}],221:[function(require,module,exports){
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
    this._rootElement = rootElement || this;
    this._finalTransform = new Float32Array(16);
    this._MV = new Float32Array(16);
    this._perspectiveTransform = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    this._isRoot = root ? root : false;
}

VirtualElement.prototype.getTarget = function getTarget () {
    return this._target;
};

VirtualElement.prototype.addChild = function addChild(path, index, tagName) {
    this._tagName = tagName;

    var div = this._allocator.allocate(tagName);
    var child = new VirtualElement(div, path, this._renderer, this, this._rootElement);

    this._children[index] = child;

    return child;
};

VirtualElement.prototype.getChild = function getChild(index) {
    return this._children[index];
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

    this._perspectiveTransform[8] = perspectiveTransform[11] * ((this._rootElement._size[0] * 0.5)),
    this._perspectiveTransform[9] = perspectiveTransform[11] * ((this._rootElement._size[1] * 0.5));
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

VirtualElement.prototype.changeSize = function changeSize(width, height) {
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
}

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

module.exports = VirtualElement;

},{"./ElementAllocator":220}],222:[function(require,module,exports){
'use strict';

module.exports = {
    ElementAllocator: require('./ElementAllocator'),
    VirtualElement: require('./VirtualElement')
};

},{"./ElementAllocator":220,"./VirtualElement":221}],223:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],224:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],225:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":223,"dup":34}],226:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],227:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":223,"./Easing":224,"./Transitionable":225,"./after":226,"dup":36}],228:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],229:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":227}],230:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],231:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],232:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],233:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],234:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],235:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":228,"./Color":229,"./KeyCodes":230,"./MethodStore":231,"./ObjectManager":232,"./clone":233,"./flatClone":234,"./keyValueToArrays":236,"./loadURL":237,"./strip":238,"dup":49}],236:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],237:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],238:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],239:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],240:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],241:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":239,"dup":34}],242:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],243:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":239,"./Easing":240,"./Transitionable":241,"./after":242,"dup":36}],244:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],245:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":243}],246:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],247:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],248:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],249:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],250:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],251:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":244,"./Color":245,"./KeyCodes":246,"./MethodStore":247,"./ObjectManager":248,"./clone":249,"./flatClone":250,"./keyValueToArrays":252,"./loadURL":253,"./strip":254,"dup":49}],252:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],253:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],254:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],255:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],256:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":255,"dup":28}],257:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],258:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],259:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":255,"./Quaternion":256,"./Vec2":257,"./Vec3":258,"dup":31}],260:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],261:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],262:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":260,"dup":34}],263:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],264:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":260,"./Easing":261,"./Transitionable":262,"./after":263,"dup":36}],265:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],266:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":264}],267:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],268:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],269:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],270:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],271:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],272:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":265,"./Color":266,"./KeyCodes":267,"./MethodStore":268,"./ObjectManager":269,"./clone":270,"./flatClone":271,"./keyValueToArrays":273,"./loadURL":274,"./strip":275,"dup":49}],273:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],274:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],275:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],276:[function(require,module,exports){
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

},{"./Geometry":277}],277:[function(require,module,exports){
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

},{}],278:[function(require,module,exports){
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

    var Xrange = Math.PI + (Math.PI / (detailX - 1));
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

    var uv = [];

    for(var i = 0; i < length; i++) {
        vertex = outputs[0].set(
            vertices[i * 3],
            vertices[i * 3 + 1],
            vertices[i * 3 + 2]
        )
        .normalize()
        .toArray();

        uv[0] = this.getAzimuth(vertex) * 0.5 / Math.PI + 0.5;
        uv[1] = this.getAltitude(vertex) / Math.PI + 0.5;

        out.push.apply(out, uv);
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

},{"famous-math":259}],279:[function(require,module,exports){
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
                this._onsuccess.bind(
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
OBJLoader._onsuccess = function _onsuccess(url, options, text) {
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
            cached.vertices,
            cached.indices
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

},{"./GeometryHelper":278,"famous-utilities":272}],280:[function(require,module,exports){
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
},{"./DynamicGeometry":276,"./Geometry":277,"./GeometryHelper":278,"./OBJLoader":279,"./primitives/Box":281,"./primitives/Circle":282,"./primitives/Cylinder":283,"./primitives/GeodesicSphere":284,"./primitives/Icosahedron":285,"./primitives/ParametricCone":286,"./primitives/Plane":287,"./primitives/Sphere":288,"./primitives/Tetrahedron":289,"./primitives/Torus":290,"./primitives/Triangle":291}],281:[function(require,module,exports){
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

},{"../Geometry":277}],282:[function(require,module,exports){
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

},{"../Geometry":277}],283:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],284:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],285:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],286:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],287:[function(require,module,exports){
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

},{"../Geometry":277}],288:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],289:[function(require,module,exports){
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
    var t = Math.sqrt(3);
    
    var vertices = [
        // Back 
         1, -1, -1 / t,
        -1, -1, -1 / t,
         0,  1,  0,
        
        // Right
         0,  1,  0,
         0, -1, t - 1 / t,
         1, -1, -1 / t,

        // Left
         0,  1,  0,
        -1, -1, -1 / t,
         0, -1,  t - 1 / t,

        // Bottom
         0, -1,  t - 1 / t,
        -1, -1, -1 / t,
         1, -1, -1 / t,
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

},{"../Geometry":277,"../GeometryHelper":278}],290:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],291:[function(require,module,exports){
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

},{"../Geometry":277,"../GeometryHelper":278}],292:[function(require,module,exports){
module.exports = noop

function noop() {
  throw new Error(
      'You should bundle your code ' +
      'using `glslify` as a transform.'
  )
}

},{}],293:[function(require,module,exports){
module.exports = programify

function programify(vertex, fragment, uniforms, attributes) {
  return {
    vertex: vertex, 
    fragment: fragment,
    uniforms: uniforms, 
    attributes: attributes
  };
}

},{}],294:[function(require,module,exports){
"use strict";
var glslify = require("glslify");
var shaders = require("glslify/simple-adapter.js")("\n#define GLSLIFY 1\n\nmat3 a_x_getNormalMatrix(in mat4 t) {\n  mat3 matNorm;\n  mat4 a = t;\n  float a00 = a[0][0], a01 = a[0][1], a02 = a[0][2], a03 = a[0][3], a10 = a[1][0], a11 = a[1][1], a12 = a[1][2], a13 = a[1][3], a20 = a[2][0], a21 = a[2][1], a22 = a[2][2], a23 = a[2][3], a30 = a[3][0], a31 = a[3][1], a32 = a[3][2], a33 = a[3][3], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n  det = 1.0 / det;\n  matNorm[0][0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;\n  matNorm[0][1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;\n  matNorm[0][2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;\n  matNorm[1][0] = (a02 * b10 - a01 * b11 - a03 * b09) * det;\n  matNorm[1][1] = (a00 * b11 - a02 * b08 + a03 * b07) * det;\n  matNorm[1][2] = (a01 * b08 - a00 * b10 - a03 * b06) * det;\n  matNorm[2][0] = (a31 * b05 - a32 * b04 + a33 * b03) * det;\n  matNorm[2][1] = (a32 * b02 - a30 * b05 - a33 * b01) * det;\n  matNorm[2][2] = (a30 * b04 - a31 * b02 + a33 * b00) * det;\n  return matNorm;\n}\nfloat b_x_inverse(float m) {\n  return 1.0 / m;\n}\nmat2 b_x_inverse(mat2 m) {\n  return mat2(m[1][1], -m[0][1], -m[1][0], m[0][0]) / (m[0][0] * m[1][1] - m[0][1] * m[1][0]);\n}\nmat3 b_x_inverse(mat3 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];\n  float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];\n  float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];\n  float b01 = a22 * a11 - a12 * a21;\n  float b11 = -a22 * a10 + a12 * a20;\n  float b21 = a21 * a10 - a11 * a20;\n  float det = a00 * b01 + a01 * b11 + a02 * b21;\n  return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11), b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10), b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;\n}\nmat4 b_x_inverse(mat4 m) {\n  float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3], a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3], a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3], a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3], b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12, b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32, det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;\n  return mat4(a11 * b11 - a12 * b10 + a13 * b09, a02 * b10 - a01 * b11 - a03 * b09, a31 * b05 - a32 * b04 + a33 * b03, a22 * b04 - a21 * b05 - a23 * b03, a12 * b08 - a10 * b11 - a13 * b07, a00 * b11 - a02 * b08 + a03 * b07, a32 * b02 - a30 * b05 - a33 * b01, a20 * b05 - a22 * b02 + a23 * b01, a10 * b10 - a11 * b08 + a13 * b06, a01 * b08 - a00 * b10 - a03 * b06, a30 * b04 - a31 * b02 + a33 * b00, a21 * b02 - a20 * b04 - a23 * b00, a11 * b07 - a10 * b09 - a12 * b06, a00 * b09 - a01 * b07 + a02 * b06, a31 * b01 - a30 * b03 - a32 * b00, a20 * b03 - a21 * b01 + a22 * b00) / det;\n}\nfloat c_x_transpose(float m) {\n  return m;\n}\nmat2 c_x_transpose(mat2 m) {\n  return mat2(m[0][0], m[1][0], m[0][1], m[1][1]);\n}\nmat3 c_x_transpose(mat3 m) {\n  return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);\n}\nmat4 c_x_transpose(mat4 m) {\n  return mat4(m[0][0], m[1][0], m[2][0], m[3][0], m[0][1], m[1][1], m[2][1], m[3][1], m[0][2], m[1][2], m[2][2], m[3][2], m[0][3], m[1][3], m[2][3], m[3][3]);\n}\nvec4 applyTransform(vec4 pos) {\n  mat4 MVMatrix = view * transform;\n  pos.x += 1.0;\n  pos.y -= 1.0;\n  pos.xyz *= size * 0.5;\n  pos.y *= -1.0;\n  v_Position = (MVMatrix * pos).xyz;\n  MVMatrix[0][1] *= -1.0;\n  MVMatrix[1][1] *= -1.0;\n  MVMatrix[2][1] *= -1.0;\n  MVMatrix[3][1] *= -1.0;\n  mat4 MVPMatrix = perspective * MVMatrix;\n  pos = MVPMatrix * pos;\n  pos.x /= (resolution.x * 0.5);\n  pos.y /= (resolution.y * 0.5);\n  pos.x -= 1.0;\n  pos.y += 1.0;\n  pos.z *= -0.00001;\n  return pos;\n}\n#vert_definitions\n\nvec3 calculateOffset(vec3 ID) {\n  \n  #vert_applications\n  return vec3(0.0);\n}\nvoid main() {\n  gl_PointSize = 10.0;\n  vec3 invertedNormals = normals;\n  invertedNormals.y *= -1.0;\n  v_Normal = c_x_transpose(mat3(b_x_inverse(transform))) * invertedNormals;\n  v_TextureCoordinate = texCoord;\n  vec3 offsetPos = pos + calculateOffset(positionOffset);\n  gl_Position = applyTransform(vec4(offsetPos, 1.0));\n}", "\n#define GLSLIFY 1\n\n#float_definitions\n\nfloat a_x_applyMaterial(float ID) {\n  \n  #float_applications\n  return 1.;\n}\n#vec_definitions\n\nvec3 a_x_applyMaterial(vec3 ID) {\n  \n  #vec_applications\n  return vec3(.5);\n}\nvec3 b_x_applyLight(in vec3 material) {\n  int numLights = int(u_NumLights);\n  float lambertianTerm;\n  vec3 finalColor = vec3(0.0);\n  vec3 normal = normalize(v_Normal);\n  vec3 ambientLight = u_AmbientLight * material;\n  vec3 eyeVector = vec3(-v_Position);\n  vec3 diffuse, specular, lightDirection;\n  for(int i = 0; i < 4; i++) {\n    if(i >= numLights)\n      break;\n    diffuse = vec3(0.0, 0.0, 0.0);\n    specular = vec3(0.0, 0.0, 0.0);\n    lightDirection = normalize(u_LightPosition[i].xyz - v_Position);\n    lambertianTerm = dot(lightDirection, normal);\n    if(lambertianTerm > 0.0 && glossiness > 0.0) {\n      diffuse = material * lambertianTerm;\n      vec3 E = normalize(eyeVector);\n      vec3 R = reflect(lightDirection, normal);\n      float specularWeight = pow(max(dot(R, E), 0.0), glossiness);\n      specular = u_LightColor[i].rgb * specularWeight;\n      finalColor += diffuse + specular;\n    } else {\n      lambertianTerm = max(lambertianTerm, 0.0);\n      finalColor += u_LightColor[i].rgb * material * lambertianTerm;\n    }\n  }\n  return ambientLight + finalColor;\n}\nvoid main() {\n  vec3 material = baseColor.r >= 0.0 ? baseColor : a_x_applyMaterial(baseColor);\n  bool lightsEnabled = (u_FlatShading == 0.0) && (u_NumLights > 0.0 || length(u_AmbientLight) > 0.0);\n  vec3 color = lightsEnabled ? b_x_applyLight(material) : material;\n  gl_FragColor = vec4(color, opacity);\n}", [], []);
module.exports = shaders;
},{"glslify":292,"glslify/simple-adapter.js":293}],295:[function(require,module,exports){
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

},{}],296:[function(require,module,exports){
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

},{"./Buffer":295}],297:[function(require,module,exports){
'use strict';

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

},{}],298:[function(require,module,exports){
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
 * @param {WebGL_Context} gl Context to be used to create the shader program.
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
 * @param {Number|Array} value Value of uniform spec being evaluated.
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

},{"famous-utilities":251,"famous-webgl-shaders":294}],299:[function(require,module,exports){
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
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    
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

},{}],300:[function(require,module,exports){
'use strict';

var Texture = require('./Texture');
var Program = require('./Program');
var Buffer = require('./Buffer');
var BufferRegistry = require('./BufferRegistry');
var checkers = require('./Checkerboard');
var Plane = require('famous-webgl-geometries').Plane;
var sorter = require('./radixSort');

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
function WebGLRenderer(canvas) {
    this.canvas = canvas;

    var gl = this.gl = this.getWebGLContext(this.canvas);

    gl.polygonOffset(0.1, 0.1);
    gl.enable(gl.POLYGON_OFFSET_FILL);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.depthFunc(gl.LEQUAL);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.CULL_FACE);

    this.meshRegistry = {};
    this.meshRegistryKeys = [];

    this.cutoutRegistry = {};
    this.cutoutRegistryKeys = [];
    this.cutoutGeometry;

    /**
     * Lights
     */

    this.numLights = 0;
    this.ambientLightColor = [0, 0, 0];
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
        uniformKeys: ['opacity', 'transform', 'size', 'baseColor', 'positionOffset', 'u_FlatShading'],
        uniformValues: [1, identity, [0, 0, 0], [0.5, 0.5, 0.5], [0, 0, 0], 0],
        buffers: {},
        geometry: null,
        drawType: null,
        texture: null
    };
};

WebGLRenderer.prototype.getOrSetCutout = function getOrSetCutout(path) {
    var geometry;

    if (this.cutoutRegistry[path]) {
        return this.cutoutRegistry[path];
    }
    else {
        if (!this.cutoutGeometry) {
            geometry = this.cutoutGeometry = Plane();

            this.bufferRegistry.allocate(geometry.id, 'pos', geometry.spec.bufferValues[0], 3);
            this.bufferRegistry.allocate(geometry.id, 'texCoord', geometry.spec.bufferValues[1], 2);
            this.bufferRegistry.allocate(geometry.id, 'normals', geometry.spec.bufferValues[2], 3);
            this.bufferRegistry.allocate(geometry.id, 'indices', geometry.spec.bufferValues[3], 1);
        }

        this.cutoutRegistryKeys.push(path);

        return this.cutoutRegistry[path] = {
            uniformKeys: ['transform', 'size', 'origin', 'baseColor', 'opacity'],
            uniformValues: [identity, [0, 0, 0], [0, 0, 0], [0, 0, 0], 0],
            geometry: this.cutoutGeometry.id,
            drawType: 4
        };
    }

};

WebGLRenderer.prototype.setCutoutUniform = function setCutoutUniform(path, uniformName, uniformValue) {
    var cutout = this.getOrSetCutout(path);

    var index = cutout.uniformKeys.indexOf(uniformName);

    cutout.uniformValues[index] = uniformValue;
}

WebGLRenderer.prototype.setMeshOptions = function(path, options) {
    var mesh = this.meshRegistry[path] || this.createMesh(path);

    mesh.options = options;
    return this;
};

WebGLRenderer.prototype.setAmbientLightColor = function setAmbientLightColor(path, r, g, b) {
    this.ambientLightColor[0] = r;
    this.ambientLightColor[1] = g;
    this.ambientLightColor[2] = b;
    return this;
};

WebGLRenderer.prototype.setLightPosition = function setLightPosition(path, x, y, z) {
    var light = this.lightRegistry[path] || this.createLight(path);

    light.position[0] = x;
    light.position[1] = y;
    light.position[2] = z;
    return this;
};

WebGLRenderer.prototype.setLightColor = function setLightColor(path, r, g, b) {
    var light = this.lightRegistry[path] || this.createLight(path);

    light.color[0] = r;
    light.color[1] = g;
    light.color[2] = b;
    return this;
};

WebGLRenderer.prototype.handleMaterialInput = function handleMaterialInput(path, name, material) {
    var mesh = this.meshRegistry[path] || this.createMesh(path);

    mesh.uniformValues[name === 'baseColor' ? 3 : 4][0] = - material._id;
    if (material.texture) mesh.texture = handleTexture.call(this, material.texture);
    this.program.registerMaterial(name, material);
    return this.updateSize();
};

WebGLRenderer.prototype.setGeometry = function setGeometry(path, geometry, drawType, dynamic) {
    var mesh = this.meshRegistry[path] || this.createMesh(path);

    mesh.geometry = geometry;
    mesh.drawType = drawType;
    mesh.dynamic = dynamic;

    return this;
}

WebGLRenderer.prototype.setMeshUniform = function setMeshUniform(path, uniformName, uniformValue) {
    var mesh = this.meshRegistry[path] || this.createMesh(path);

    var index = mesh.uniformKeys.indexOf(uniformName);

    if (index === -1) {
        mesh.uniformKeys.push(uniformName);
        mesh.uniformValues.push(uniformValue);
    }
    else {
        mesh.uniformValues[index] = uniformValue;
    }
}

WebGLRenderer.prototype.bufferData = function bufferData(path, geometryId, bufferName, bufferValue, bufferSpacing) {
    this.bufferRegistry.allocate(geometryId, bufferName, bufferValue, bufferSpacing);

    return this;
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
    var cutout;

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
    this.program.setUniforms(['u_AmbientLight'], [this.ambientLightColor]);
    this.program.setUniforms(['u_LightPosition'], [this.lightPositions]);
    this.program.setUniforms(['u_LightColor'], [this.lightColors]);

    this.projectionTransform[11] = renderState.perspectiveTransform[11];

    this.program.setUniforms(['perspective', 'time', 'view'], [this.projectionTransform, Date.now()  % 100000 / 1000, renderState.viewTransform]);
    var keys = this.meshRegistryKeys;
    var registry = this.meshRegistry;

    this.meshRegistryKeys = sorter(keys, registry);

    for (var i = 0, len = this.cutoutRegistryKeys.length; i < len; i++) {
        cutout = this.cutoutRegistry[this.cutoutRegistryKeys[i]];
        buffers = this.bufferRegistry.registry[cutout.geometry];

        this.gl.enable(this.gl.BLEND);
        this.program.setUniforms(cutout.uniformKeys, cutout.uniformValues);
        this.drawBuffers(buffers, cutout.drawType, cutout.geometry);
        this.gl.disable(this.gl.BLEND);
    }

    for(var i = 0; i < this.meshRegistryKeys.length; i++) {
        mesh = this.meshRegistry[this.meshRegistryKeys[i]];
        buffers = this.bufferRegistry.registry[mesh.geometry];

        var gl = this.gl;
        if (mesh.uniformValues[0] < 1) {
            gl.depthMask(false);
            gl.enable(gl.BLEND);
        } else {
            gl.depthMask(true);
            gl.disable(gl.BLEND);
        }

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
WebGLRenderer.prototype.updateSize = function updateSize(size) {
    if (size) {
        this.cachedSize[0] = size[0];
        this.cachedSize[1] = size[1];
        this.cachedSize[2] = (size[0] > size[1]) ? size[0] : size[1];
    }

    this.gl.viewport(0, 0, this.cachedSize[0], this.cachedSize[1]);

    this.resolutionValues[0] = this.cachedSize;
    this.program.setUniforms(this.resolutionName, this.resolutionValues);

    return this;
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
            source.addEventListener('loadeddata', function() {
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

},{"./Buffer":295,"./BufferRegistry":296,"./Checkerboard":297,"./Program":298,"./Texture":299,"./radixSort":302,"famous-webgl-geometries":280}],301:[function(require,module,exports){
'use strict';

module.exports = {
    Buffer: require('./Buffer'),
    BufferRegistry: require('./BufferRegistry'),
    Checkerboard: require('./Checkerboard'),
    Program: require('./Program'),
    WebGLRenderer: require('./WebGLRenderer'),
    Texture: require('./Texture')
};

},{"./Buffer":295,"./BufferRegistry":296,"./Checkerboard":297,"./Program":298,"./Texture":299,"./WebGLRenderer":300}],302:[function(require,module,exports){
var radixBits = 11,
    maxRadix = 1 << (radixBits),
    radixMask = maxRadix - 1,
    buckets = new Array(maxRadix * Math.ceil(64 / radixBits)),
    msbMask = 1 << ((32 - 1) % radixBits),
    lastMask = (msbMask << 1) - 1,
    passCount = ((32 / radixBits) + 0.999999999999999) | 0,
    maxOffset = maxRadix * (passCount - 1),
    normalizer = Math.pow(20, 6);

var buffer = new ArrayBuffer(4);
var floatView = new Float32Array(buffer, 0, 1);
var intView = new Int32Array(buffer, 0, 1);

function comp(list, registry, i) {
    var key = list[i];
    return registry[key].uniformValues[1][14] + normalizer;
}

function mutator(list, registry, i, value) {
    var key = list[i];
    registry[key].uniformValues[1][14] = intToFloat(value) - normalizer;
    return key;
}


function floatToInt(k) {
    floatView[0] = k;
    return intView[0];
}

function intToFloat(k) {
    intView[0] = k;
    return floatView[0];
}

function sort(list, registry) {
    var pass = 0;
    var out = [];

    var i, j, k, n, div, offset, swap, id, sum, tsum, size;

    passCount = ((32 / radixBits) + 0.999999999999999) | 0;

    for (i = 0, n = maxRadix * passCount; i < n; i++) buckets[i] = 0;

    for (i = 0, n = list.length; i < n; i++) {
        div = floatToInt(comp(list, registry, i));
        div ^= div >> 31 | 0x80000000;
        for (j = 0, k = 0; j < maxOffset; j += maxRadix, k += radixBits) {
            buckets[j + (div >>> k & radixMask)]++;
        }
        buckets[j + (div >>> k & lastMask)]++;
    }

    for (j = 0; j <= maxOffset; j += maxRadix) {
        for (id = j, sum = 0; id < j + maxRadix; id++) {
            tsum = buckets[id] + sum;
            buckets[id] = sum - 1;
            sum = tsum;
        }
    }
    if (--passCount) {
        for (i = 0, n = list.length; i < n; i++) {
            div = floatToInt(comp(list, registry, i));
            out[++buckets[div & radixMask]] = mutator(list, registry, i, div ^= div >> 31 | 0x80000000);
        }
        swap = out, out = list, list = swap;
        while (++pass < passCount) {
            for (i = 0, n = list.length, offset = pass * maxRadix, size = pass * radixBits; i < n; i++) {
                div = floatToInt(comp(list, registry, i));
                out[++buckets[offset + (div >>> size & radixMask)]] = list[i];
            }
            swap = out, out = list, list = swap;
        }
    }

    for (i = 0, n = list.length, offset = pass * maxRadix, size = pass * radixBits; i < n; i++) {
        div = floatToInt(comp(list, registry, i));
        out[++buckets[offset + (div >>> size & lastMask)]] = mutator(list, registry, i, div ^ (~div >> 31 | 0x80000000));
    }

    return out;

}

module.exports = sort;

},{}],303:[function(require,module,exports){
'use strict';

var VirtualElement = require('famous-dom-renderers').VirtualElement;
var strip = require('famous-utilities').strip;
var flatClone = require('famous-utilities').flatClone;

var Context = require('./Context');

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

    this.clearCommands();
}

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
    var path = commands[commands.index++];
    var pathArr = path.split('/');
    var context = this.getOrSetContext(pathArr.shift());

    context.receive(pathArr, path, commands);
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
    else return (this._contexts[selector] = new Context(selector, this));
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
    var selector = commands[commands.index++];

    var size = this.getOrSetContext(selector).getRootSize();
    this.sendResize(selector, size);
    var _this = this;
    if (selector === 'body')
        window.addEventListener('resize', function() {
            if (!_this._sentResize) {
                _this.sendResize(selector, _this.getOrSetContext(selector).getRootSize());
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

Compositor.prototype._wrapProxyFunction = function _wrapProxyFunction(id) {
    var _this = this;
    return function() {
        var i;

        for (i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] === 'object') {
                arguments[i] = strip(flatClone(arguments[i]));
            }
        }
        _this._outCommands.push('INVOKE', id, Array.prototype.slice.call(arguments));
    };
};

Compositor.prototype.invoke = function invoke (target, methodName, args, functionArgs) {
    var targetObject = window[target];

    for (var i = 0; i < args.length; i++) {
        if (functionArgs[i] != null) {
            args[i] = this._wrapProxyFunction(functionArgs[i]);
        }
    }

    targetObject[methodName].apply(targetObject, args);
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
    var command = commands[commands.index++];

    while (command) {
        switch (command) {
            case 'WITH':
                this.handleWith(commands);
                break;

            case 'INVOKE':
                this.invoke(
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'NEED_SIZE_FOR':
                this.giveSizeFor(commands);
                break;
        }

        command = commands[commands.index++];
    }

    // TODO: Switch to associative arrays here...

    for (var key in this._contexts) {
        this._contexts[key].draw();
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
    this._inCommands.index = 0;
    this._inCommands.length = 0;
    this._outCommands.length = 0;
    this._sentResize = false;
};

module.exports = Compositor;

},{"./Context":304,"famous-dom-renderers":222,"famous-utilities":235}],304:[function(require,module,exports){
var VirtualElement = require('famous-dom-renderers').VirtualElement;
var WebGLRenderer = require('famous-webgl-renderers').WebGLRenderer;
var Camera = require('famous-components').Camera;

function Context(selector, compositor) {
    this._rootEl = document.querySelector(selector);
    if (this._rootEl === document.body) {
        window.addEventListener('resize', this.updateSize.bind(this));
    }

    var DOMLayerEl = document.createElement('div');
    DOMLayerEl.style.width = '100%';
    DOMLayerEl.style.height = '100%';
    this._rootEl.appendChild(DOMLayerEl);
    this.DOMRenderer = new VirtualElement(DOMLayerEl, selector, compositor, undefined, undefined, true);
    this.DOMRenderer.setMatrix(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    
    this.WebGLRenderer;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'famous-webgl';
    this._rootEl.appendChild(this.canvas);

    this._renderState = {
        projectionType: Camera.ORTHOGRAPHIC_PROJECTION,
        perspectiveTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        viewTransform: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
    };

    this._size = [];
    this._renderers = [];
    this._children = {};
    this._elementHash = {};

    this._meshTransform = [];
    this._meshSize = [0, 0, 0];

    this.updateSize();
}

Context.prototype.updateSize = function () {
    var newSize = this.DOMRenderer._getSize();

    var width = newSize[0];
    var height = newSize[1];

    this._size[0] = width;
    this._size[1] = height;
    this._size[2] = (width > height) ? width : height;

    this.canvas.width  = width;
    this.canvas.height = height;

    if (this.WebGLRenderer) this.WebGLRenderer.updateSize(this._size);

    return this;
}

Context.prototype.draw = function draw() {
    for (var i = 0; i < this._renderers.length; i++) {
        this._renderers[i].draw(this._renderState);
    }
};

Context.prototype.getRootSize = function getRootSize() {
    return this._size;
};

Context.prototype.initWebGL = function initWebGL() {
    this._renderers.push((this.WebGLRenderer = new WebGLRenderer(this.canvas)));
    this.WebGLRenderer.updateSize(this._size);
};

Context.prototype.receive = function receive(pathArr, path, commands) {
    var pointer;
    var parentEl;
    var element;
    var id;

    var command = commands[commands.index++];

    while (command) {
        switch (command) {
            case 'INIT_DOM':
                id = pathArr.shift();
                pointer = this._children;
                parentEl = this.DOMRenderer;

                while (pathArr.length) {
                    pointer = pointer[id] = pointer[id] || {};
                    if (pointer.DOM) parentEl = pointer.DOM;
                    id = pathArr.shift();
                }
                pointer = pointer[id] = pointer[id] || {};
                element = parentEl.addChild(path, id, commands[commands.index++]);
                this._elementHash[path] = element;
                this._renderers.push((pointer.DOM = element));
                break;

            case 'CHANGE_TRANSFORM':
                if (!element) element = this._elementHash[path];

                for (var i = 0; i < 16; i++) {
                    this._meshTransform[i] = commands[commands.index++];
                }
                element.setMatrix.apply(element, this._meshTransform);
                if (this.WebGLRenderer) this.WebGLRenderer.setCutoutUniform(path, 'transform', this._meshTransform);
                break;

            case 'CHANGE_SIZE':
                if (!element) element = this._elementHash[path];
                var width = commands[commands.index++];
                var height = commands[commands.index++];

                element.changeSize(width, height);
                if (this.WebGLRenderer) {
                    this._meshSize[0] = width;
                    this._meshSize[1] = height;
                    this.WebGLRenderer.setCutoutUniform(path, 'size', this._meshSize);
                }
                break;

            case 'CHANGE_PROPERTY':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                element.setProperty(commands[commands.index++], commands[commands.index++]);
                break;

            case 'CHANGE_CONTENT':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                element.setContent(commands[commands.index++]);
                break;

            case 'CHANGE_ATTRIBUTE':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                element.setAttribute(commands[commands.index++], commands[commands.index++]);
                break;

            case 'ADD_CLASS':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                element.addClass(commands[commands.index++]);
                break;

            case 'REMOVE_CLASS':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                element.removeClass(commands[commands.index++]);
                break;

            case 'ADD_EVENT_LISTENER':
                if (!element) element = this._elementHash[path];
                if (this.WebGLRenderer) this.WebGLRenderer.getOrSetCutout(path);
                var ev = commands[commands.index++];
                var methods;
                var properties;
                var c;
                while ((c = commands[commands.index++]) !== 'EVENT_PROPERTIES') methods = c;
                while ((c = commands[commands.index++]) !== 'EVENT_END') properties = c;
                methods = methods || [];
                properties = properties || [];
                element.addEventListener(ev, element.dispatchEvent.bind(element, ev, methods, properties));
                break;

            case 'RECALL':
                if (!element) element = this._elementHash[path];
                element.setProperty('display', 'none');
                element._parent._allocator.deallocate(element._target);
                this._renderers.splice(this._renderers.indexOf(element), 1);
                delete this._elementHash[path];
                break;

            case 'GL_SET_DRAW_OPTIONS': 
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setMeshOptions(path, commands[commands.index++]);
                break;

            case 'GL_AMBIENT_LIGHT':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setAmbientLightColor(
                    path,
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'GL_LIGHT_POSITION':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setLightPosition(
                    path,
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'GL_LIGHT_COLOR':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setLightColor(
                    path,
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'MATERIAL_INPUT':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.handleMaterialInput(
                    path,
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'GL_SET_GEOMETRY':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setGeometry(
                    path,
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'GL_UNIFORMS':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.setMeshUniform(
                    path,
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'GL_BUFFER_DATA':
                if (!this.WebGLRenderer) this.initWebGL();
                this.WebGLRenderer.bufferData(
                    path,
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++],
                    commands[commands.index++]
                );
                break;

            case 'PINHOLE_PROJECTION':
                this._renderState.projectionType = Camera.PINHOLE_PROJECTION;
                this._renderState.perspectiveTransform[11] = -1 / commands[commands.index++];
                break;

            case 'ORTHOGRAPHIC_PROJECTION':
                this._renderState.projectionType = Camera.ORTHOGRAPHIC_PROJECTION;
                this._renderState.perspectiveTransform[11] = 0;
                break;

            case 'CHANGE_VIEW_TRANSFORM':
                this._renderState.viewTransform[0] = commands[commands.index++];
                this._renderState.viewTransform[1] = commands[commands.index++];
                this._renderState.viewTransform[2] = commands[commands.index++];
                this._renderState.viewTransform[3] = commands[commands.index++];

                this._renderState.viewTransform[4] = commands[commands.index++];
                this._renderState.viewTransform[5] = commands[commands.index++];
                this._renderState.viewTransform[6] = commands[commands.index++];
                this._renderState.viewTransform[7] = commands[commands.index++];

                this._renderState.viewTransform[8] = commands[commands.index++];
                this._renderState.viewTransform[9] = commands[commands.index++];
                this._renderState.viewTransform[10] = commands[commands.index++];
                this._renderState.viewTransform[11] = commands[commands.index++];

                this._renderState.viewTransform[12] = commands[commands.index++];
                this._renderState.viewTransform[13] = commands[commands.index++];
                this._renderState.viewTransform[14] = commands[commands.index++];
                this._renderState.viewTransform[15] = commands[commands.index++];
                break;

            case 'WITH': return commands.index--;
        }

        command = commands[commands.index++];
    }
};

module.exports = Context;
},{"famous-components":219,"famous-dom-renderers":222,"famous-webgl-renderers":301}],305:[function(require,module,exports){
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

},{}],306:[function(require,module,exports){
'use strict';

module.exports = {
    Compositor: require('./Compositor'),
    ThreadManager: require('./ThreadManager')
};

},{"./Compositor":303,"./ThreadManager":305}],307:[function(require,module,exports){
'use strict';

var sessionHistorySupport = window.history && window.history.pushState && window.history.replaceState;

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

module.exports = History;

},{}],308:[function(require,module,exports){
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

},{"./History":307}],309:[function(require,module,exports){
'use strict';

module.exports = {
    History: require('./History'),
    Router: require('./Router')
};

},{"./History":307,"./Router":308}],310:[function(require,module,exports){
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

},{}],311:[function(require,module,exports){
var css = "html {\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    overflow: hidden;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\nbody {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-font-smoothing: antialiased;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-perspective: 0;\n    perspective: none;\n    overflow: hidden;\n}\n\n.famous-container, .famous-group {\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    bottom: 0px;\n    right: 0px;\n    overflow: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    pointer-events: none;\n}\n\n.famous-group {\n    width: 0px;\n    height: 0px;\n    margin: 0px;\n    padding: 0px;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d;\n}\n\n.fa-surface {\n    position: absolute;\n    -webkit-transform-origin: 0% 0%;\n    transform-origin: 0% 0%;\n    -webkit-backface-visibility: visible;\n    backface-visibility: visible;\n    -webkit-transform-style: preserve-3d;\n    transform-style: preserve-3d; /* performance */\n    -webkit-tap-highlight-color: transparent;\n    pointer-events: auto;\n    z-index: 1; /* HACK to account for browser issues with eventing on the same z-plane*/\n}\n\n.fa-content {\n    position: absolute;\n}\n\n.famous-container-group {\n    position: relative;\n    width: 100%;\n    height: 100%;\n}\n\n.fa-container {\n    position: absolute;\n    -webkit-transform-origin: center center;\n    transform-origin: center center;\n    overflow: hidden;\n}\n\ncanvas.famous-webgl {\n    pointer-events: none;\n    position: absolute;\n    z-index: 1;\n    top: 0px;\n    left: 0px;\n}"; (require("/Users/imtiazmajeed/Desktop/Code/famous/framework/state-manager/node_modules/famous/node_modules/famous-stylesheets/node_modules/cssify"))(css); module.exports = css;
},{"/Users/imtiazmajeed/Desktop/Code/famous/framework/state-manager/node_modules/famous/node_modules/famous-stylesheets/node_modules/cssify":310}],312:[function(require,module,exports){
'use strict';

require('./famous.css');

},{"./famous.css":311}],313:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],314:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],315:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":313,"dup":34}],316:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],317:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":313,"./Easing":314,"./Transitionable":315,"./after":316,"dup":36}],318:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],319:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],320:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":318,"dup":34}],321:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],322:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":318,"./Easing":319,"./Transitionable":320,"./after":321,"dup":36}],323:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],324:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":322}],325:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],326:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],327:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],328:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],329:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],330:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":323,"./Color":324,"./KeyCodes":325,"./MethodStore":326,"./ObjectManager":327,"./clone":328,"./flatClone":329,"./keyValueToArrays":331,"./loadURL":332,"./strip":333,"dup":49}],331:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],332:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],333:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],334:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],335:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":334,"dup":28}],336:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],337:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],338:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":334,"./Quaternion":335,"./Vec2":336,"./Vec3":337,"dup":31}],339:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],340:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],341:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":339,"dup":34}],342:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],343:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":339,"./Easing":340,"./Transitionable":341,"./after":342,"dup":36}],344:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],345:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":343}],346:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],347:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],348:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],349:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],350:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],351:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":344,"./Color":345,"./KeyCodes":346,"./MethodStore":347,"./ObjectManager":348,"./clone":349,"./flatClone":350,"./keyValueToArrays":352,"./loadURL":353,"./strip":354,"dup":49}],352:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],353:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],354:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],355:[function(require,module,exports){
arguments[4][276][0].apply(exports,arguments)
},{"./Geometry":356,"dup":276}],356:[function(require,module,exports){
arguments[4][277][0].apply(exports,arguments)
},{"dup":277}],357:[function(require,module,exports){
arguments[4][278][0].apply(exports,arguments)
},{"dup":278,"famous-math":338}],358:[function(require,module,exports){
arguments[4][279][0].apply(exports,arguments)
},{"./GeometryHelper":357,"dup":279,"famous-utilities":351}],359:[function(require,module,exports){
arguments[4][280][0].apply(exports,arguments)
},{"./DynamicGeometry":355,"./Geometry":356,"./GeometryHelper":357,"./OBJLoader":358,"./primitives/Box":360,"./primitives/Circle":361,"./primitives/Cylinder":362,"./primitives/GeodesicSphere":363,"./primitives/Icosahedron":364,"./primitives/ParametricCone":365,"./primitives/Plane":366,"./primitives/Sphere":367,"./primitives/Tetrahedron":368,"./primitives/Torus":369,"./primitives/Triangle":370,"dup":280}],360:[function(require,module,exports){
arguments[4][281][0].apply(exports,arguments)
},{"../Geometry":356,"dup":281}],361:[function(require,module,exports){
arguments[4][282][0].apply(exports,arguments)
},{"../Geometry":356,"dup":282}],362:[function(require,module,exports){
arguments[4][283][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":283}],363:[function(require,module,exports){
arguments[4][284][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":284}],364:[function(require,module,exports){
arguments[4][285][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":285}],365:[function(require,module,exports){
arguments[4][286][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":286}],366:[function(require,module,exports){
arguments[4][287][0].apply(exports,arguments)
},{"../Geometry":356,"dup":287}],367:[function(require,module,exports){
arguments[4][288][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":288}],368:[function(require,module,exports){
arguments[4][289][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":289}],369:[function(require,module,exports){
arguments[4][290][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":290}],370:[function(require,module,exports){
arguments[4][291][0].apply(exports,arguments)
},{"../Geometry":356,"../GeometryHelper":357,"dup":291}],371:[function(require,module,exports){
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

},{"./TextureRegistry":372}],372:[function(require,module,exports){
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

},{}],373:[function(require,module,exports){
'use strict';

module.exports = {
    Material: require('./Material'),
    TextureRegistry: require('./TextureRegistry')
};
},{"./Material":371,"./TextureRegistry":372}],374:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],375:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],376:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":374,"dup":34}],377:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],378:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":374,"./Easing":375,"./Transitionable":376,"./after":377,"dup":36}],379:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],380:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"./Mat33":379,"dup":28}],381:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],382:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],383:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"./Mat33":379,"./Quaternion":380,"./Vec2":381,"./Vec3":382,"dup":31}],384:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],385:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],386:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"./Curves":384,"dup":34}],387:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],388:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"./Curves":384,"./Easing":385,"./Transitionable":386,"./after":387,"dup":36}],389:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"dup":42}],390:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43,"famous-transitions":388}],391:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],392:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],393:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"dup":46}],394:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],395:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"dup":48}],396:[function(require,module,exports){
arguments[4][49][0].apply(exports,arguments)
},{"./CallbackStore":389,"./Color":390,"./KeyCodes":391,"./MethodStore":392,"./ObjectManager":393,"./clone":394,"./flatClone":395,"./keyValueToArrays":397,"./loadURL":398,"./strip":399,"dup":49}],397:[function(require,module,exports){
arguments[4][50][0].apply(exports,arguments)
},{"dup":50}],398:[function(require,module,exports){
arguments[4][51][0].apply(exports,arguments)
},{"dup":51}],399:[function(require,module,exports){
arguments[4][52][0].apply(exports,arguments)
},{"dup":52}],400:[function(require,module,exports){
arguments[4][276][0].apply(exports,arguments)
},{"./Geometry":401,"dup":276}],401:[function(require,module,exports){
arguments[4][277][0].apply(exports,arguments)
},{"dup":277}],402:[function(require,module,exports){
arguments[4][278][0].apply(exports,arguments)
},{"dup":278,"famous-math":383}],403:[function(require,module,exports){
arguments[4][279][0].apply(exports,arguments)
},{"./GeometryHelper":402,"dup":279,"famous-utilities":396}],404:[function(require,module,exports){
arguments[4][280][0].apply(exports,arguments)
},{"./DynamicGeometry":400,"./Geometry":401,"./GeometryHelper":402,"./OBJLoader":403,"./primitives/Box":405,"./primitives/Circle":406,"./primitives/Cylinder":407,"./primitives/GeodesicSphere":408,"./primitives/Icosahedron":409,"./primitives/ParametricCone":410,"./primitives/Plane":411,"./primitives/Sphere":412,"./primitives/Tetrahedron":413,"./primitives/Torus":414,"./primitives/Triangle":415,"dup":280}],405:[function(require,module,exports){
arguments[4][281][0].apply(exports,arguments)
},{"../Geometry":401,"dup":281}],406:[function(require,module,exports){
arguments[4][282][0].apply(exports,arguments)
},{"../Geometry":401,"dup":282}],407:[function(require,module,exports){
arguments[4][283][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":283}],408:[function(require,module,exports){
arguments[4][284][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":284}],409:[function(require,module,exports){
arguments[4][285][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":285}],410:[function(require,module,exports){
arguments[4][286][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":286}],411:[function(require,module,exports){
arguments[4][287][0].apply(exports,arguments)
},{"../Geometry":401,"dup":287}],412:[function(require,module,exports){
arguments[4][288][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":288}],413:[function(require,module,exports){
arguments[4][289][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":289}],414:[function(require,module,exports){
arguments[4][290][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":290}],415:[function(require,module,exports){
arguments[4][291][0].apply(exports,arguments)
},{"../Geometry":401,"../GeometryHelper":402,"dup":291}],416:[function(require,module,exports){
'use strict';

var Transitionable = require('famous-transitions').Transitionable;
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

    this._glossiness = new Transitionable(0);
    this._positionOffset = new Transitionable([0, 0, 0]);

    this._size = [];
    this._expressions = {};
    this._flatShading = false;
    this._geometry;
    this._color;

    this.dispatch.onTransformChange(this._receiveTransformChange.bind(this));
    this.dispatch.onSizeChange(this._receiveSizeChange.bind(this));
    this.dispatch.onOpacityChange(this._receiveOpacityChange.bind(this));

    this._receiveTransformChange(this.dispatch.getContext()._transform);
    this._receiveSizeChange(this.dispatch.getContext()._size);
    this._receiveOpacityChange(this.dispatch.getContext()._opacity);

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
 * Pass custom options to Mesh, such as a 3 element map
 * which displaces the position of each vertex in world space.
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
* Pushes invalidations commands, if any exist
*
* @private
* @method _pushInvalidations
*/
Mesh.prototype._pushInvalidations = function _pushInvalidations(expressionName) {
    var uniformKey;
    var expression = this._expressions[expressionName];
    if (expression) {
        var i = expression.invalidations.length;
        while (i--) {
            uniformKey = expression.invalidations.pop();
            this.dispatch.sendDrawCommand('GL_UNIFORMS');
            this.dispatch.sendDrawCommand(uniformKey);
            this.dispatch.sendDrawCommand(expression.uniforms[uniformKey]);
        }
    }
};

/**
* Pushes active commands for any values that are in transition (active) state
*
* @private
* @method _pushActiveCommands
*/
Mesh.prototype._pushActiveCommands = function _pushActiveCommands(property, command, value) {
    if (this[property] && this[property].isActive()) {
        this.dispatch.sendDrawCommand('GL_UNIFORMS');
        this.dispatch.sendDrawCommand(command);
        this.dispatch.sendDrawCommand(this[property][value || 'get']());
        return true;
    }
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
    var bufferIndex;
    var i;

    this.dispatch
        .sendDrawCommand('WITH')
        .sendDrawCommand(path);

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

    // If any invalidations exist, push them into the queue
    this._pushInvalidations('baseColor');
    this._pushInvalidations('positionOffset');

    // If any values are active, push them into the queue
    this._pushActiveCommands('_color', 'baseColor', 'getNormalizedRGB');
    this._pushActiveCommands('_glossiness', 'glossiness');
    this._pushActiveCommands('_positionOffset', 'positionOffset');

    i = this.queue.length;
    while (i--) {
        this.dispatch.sendDrawCommand(this.queue.shift());
    }

    return this.queue.length;
};

/**
* Changes the color of Mesh, passing either a material expression or
* color using the 'Color' utility component.
*
* @method setBaseColor
* @param {Object|Color} Material, image, vec3, or Color instance
* @chainable
*/
Mesh.prototype.setBaseColor = function setBaseColor(color) {
    this.dispatch.dirtyRenderable(this._id);

    // If a material expression
    if (color._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.baseColor = color;
        color = color._compile();
    }
    // If a color component
    else if (color.getNormalizedRGB) {
        this.queue.push('GL_UNIFORMS');
        this._expressions.baseColor = null;
        this._color = color;
        color = color.getNormalizedRGB();
    }

    this.queue.push('baseColor');
    this.queue.push(color);
    return this;
};


/**
 * Returns either the material expression or the color instance of Mesh.
 *
 * @method getBaseColor
 * @returns {MaterialExpress|Color}
 */
Mesh.prototype.getBaseColor = function getBaseColor() {
    return this._expressions.baseColor || this._color;
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
    this._flatShading = bool;
    this.queue.push('GL_UNIFORMS');
    this.queue.push('u_FlatShading');
    this.queue.push(this._flatShading ? 1 : 0);
    return this;
};

/**
 * Returns a boolean for whether Mesh is affected by light.
 *
 * @method getFlatShading
 * @returns {Boolean} Boolean
 */
Mesh.prototype.getFlatShading = function getFlatShading() {
    return this._flatShading;
};


/**
 * Defines a 3-element map which is used to provide significant physical
 * detail to the surface by perturbing the facing direction of each individual
 * pixel.
 *
 * @method normal
 * @chainable
 *
 * @param {Object|Array} Material, Image or vec3
 * @return {Element} current Mesh
 */
Mesh.prototype.setNormals = function setNormals(materialExpression) {
    this.dispatch.dirtyRenderable(this._id);
    if (materialExpression._compile) {
        this._expressions.normals = materialExpression;
        materialExpression = materialExpression._compile();
    }
    this.queue.push(typeof materialExpression === 'number' ? 'UNIFORM_INPUT' : 'MATERIAL_INPUT');
    this.queue.push('normal');
    this.queue.push(materialExpression);
    return this;
};

/**
 * Returns the Normals expression of Mesh
 *
 * @method getNormals
 * @returns The normals expression for Mesh
 */
Mesh.prototype.getNormals = function getNormals(materialExpression) {
    return this._expressions.normals;
};

/**
 * Defines the glossiness of the mesh from either a material expression or a
 * scalar value
 *
 * @method setGlossiness
 * @param {MaterialExpression|Number}
 * @param {Object} Optional tweening parameter
 * @param {Function} Callback
 * @chainable
 */
Mesh.prototype.setGlossiness = function setGlossiness(materialExpression, transition, cb) {
    this.dispatch.dirtyRenderable(this._id);

    if (materialExpression._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.glossiness = materialExpression;
        materialExpression = materialExpression._compile();
    }
    else {
        this.queue.push('GL_UNIFORMS');
        this._expressions.glossiness = null;
        this._glossiness.set(materialExpression, transition, cb);
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
Mesh.prototype.getGlossiness = function getGlossiness() {
    return this._expressions.glossiness || this._glossiness.get();
};

/**
 * Defines 3 element map which displaces the position of each vertex in world
 * space.
 *
 * @method setPositionOffset
 * @chainable
 *
 * @param {MaterialExpression|Array}
 * @param {Object} Optional tweening parameter
 * @param {Function} Callback
 * @chainable
 */
Mesh.prototype.setPositionOffset = function positionOffset(materialExpression, transition, cb) {
    this.dispatch.dirtyRenderable(this._id);

    if (materialExpression._compile) {
        this.queue.push('MATERIAL_INPUT');
        this._expressions.positionOffset = materialExpression;
        materialExpression = materialExpression._compile();
    }
    else {
        this.queue.push('GL_UNIFORMS');
        this._expressions.positionOffset = null;
        this._positionOffset.set(materialExpression, transition, cb);
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

module.exports = Mesh;

},{"famous-transitions":378,"famous-webgl-geometries":404}],417:[function(require,module,exports){
'use strict';

module.exports = {
    Mesh: require('./Mesh'),
    PointLight: require('./lights/PointLight'),
    AmbientLight: require('./lights/AmbientLight'),
};

},{"./Mesh":416,"./lights/AmbientLight":418,"./lights/PointLight":420}],418:[function(require,module,exports){
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
function AmbientLight(dispatch) {
    Light.call(this, dispatch);
    this.commands.color = 'GL_AMBIENT_LIGHT';
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

},{"./Light":419}],419:[function(require,module,exports){
'use strict';

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
    this._color;
    this.commands = { color: 'GL_LIGHT_COLOR' };
};

/**
* Returns the definition of the Class: 'Light'
*
* @method toString
* @return {String} definition
*/
Light.toString = function toString() {
    return 'Light';
};

/**
* Changes the color of the light, using the 'Color' utility component.
*
* @method setColor
* @param {Color} Color instance
* @chainable
*/
Light.prototype.setColor = function setColor(color) {
    if (!color.getNormalizedRGB) return false;
    this._dispatch.dirtyComponent(this._id);
    this._color = color;
    this.queue.push(this.commands.color);
    var rgb = this._color.getNormalizedRGB();
    this.queue.push(rgb[0]);
    this.queue.push(rgb[1]);
    this.queue.push(rgb[2]);
    return this;
};

/**
* Returns the current color.

* @method getColor
* @returns {Color} Color.
*/
Light.prototype.getColor = function getColor(option) {
    return this._color;
};

/**
* Returns boolean: if true, component is to be updated on next engine tick
*
* @private
* @method clean
* @returns {Boolean} Boolean
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

    if (this._color && this._color.isActive()) {
        this._dispatch.sendDrawCommand(this.commands.color);
        var rgb = this._color.getNormalizedRGB();
        this._dispatch.sendDrawCommand(rgb[0]);
        this._dispatch.sendDrawCommand(rgb[1]);
        this._dispatch.sendDrawCommand(rgb[2]);
        return true;
    }

    return this.queue.length;
};

module.exports = Light;

},{}],420:[function(require,module,exports){
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
function PointLight(dispatch) {
    Light.call(this, dispatch);
    this.commands.position = 'GL_LIGHT_POSITION';
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

},{"./Light":419}],421:[function(require,module,exports){
arguments[4][292][0].apply(exports,arguments)
},{"dup":292}],422:[function(require,module,exports){
arguments[4][293][0].apply(exports,arguments)
},{"dup":293}],423:[function(require,module,exports){
arguments[4][294][0].apply(exports,arguments)
},{"dup":294,"glslify":421,"glslify/simple-adapter.js":422}],424:[function(require,module,exports){
(function (process){
var defined = require('defined');
var createDefaultStream = require('./lib/default_stream');
var Test = require('./lib/test');
var createResult = require('./lib/results');
var through = require('through');

var canEmitExit = typeof process !== 'undefined' && process
    && typeof process.on === 'function' && process.browser !== true
;
var canExit = typeof process !== 'undefined' && process
    && typeof process.exit === 'function'
;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

exports = module.exports = (function () {
    var harness;
    var lazyLoad = function () {
        return getHarness().apply(this, arguments);
    };
    
    lazyLoad.only = function () {
        return getHarness().only.apply(this, arguments);
    };
    
    lazyLoad.createStream = function (opts) {
        if (!opts) opts = {};
        if (!harness) {
            var output = through();
            getHarness({ stream: output, objectMode: opts.objectMode });
            return output;
        }
        return harness.createStream(opts);
    };
    
    return lazyLoad
    
    function getHarness (opts) {
        if (!opts) opts = {};
        opts.autoclose = !canEmitExit;
        if (!harness) harness = createExitHarness(opts);
        return harness;
    }
})();

function createExitHarness (conf) {
    if (!conf) conf = {};
    var harness = createHarness({
        autoclose: defined(conf.autoclose, false)
    });
    
    var stream = harness.createStream({ objectMode: conf.objectMode });
    var es = stream.pipe(conf.stream || createDefaultStream());
    if (canEmitExit) {
        es.on('error', function (err) { harness._exitCode = 1 });
    }
    
    var ended = false;
    stream.on('end', function () { ended = true });
    
    if (conf.exit === false) return harness;
    if (!canEmitExit || !canExit) return harness;

    var inErrorState = false;

    process.on('exit', function (code) {
        // let the process exit cleanly.
        if (code !== 0) {
            return
        }

        if (!ended) {
            var only = harness._results._only;
            for (var i = 0; i < harness._tests.length; i++) {
                var t = harness._tests[i];
                if (only && t.name !== only) continue;
                t._exit();
            }
        }
        harness.close();
        process.exit(code || harness._exitCode);
    });
    
    return harness;
}

exports.createHarness = createHarness;
exports.Test = Test;
exports.test = exports; // tap compat
exports.test.skip = Test.skip;

var exitInterval;

function createHarness (conf_) {
    if (!conf_) conf_ = {};
    var results = createResult();
    if (conf_.autoclose !== false) {
        results.once('done', function () { results.close() });
    }
    
    var test = function (name, conf, cb) {
        var t = new Test(name, conf, cb);
        test._tests.push(t);
        
        (function inspectCode (st) {
            st.on('test', function sub (st_) {
                inspectCode(st_);
            });
            st.on('result', function (r) {
                if (!r.ok) test._exitCode = 1
            });
        })(t);
        
        results.push(t);
        return t;
    };
    test._results = results;
    
    test._tests = [];
    
    test.createStream = function (opts) {
        return results.createStream(opts);
    };
    
    var only = false;
    test.only = function (name) {
        if (only) throw new Error('there can only be one only test');
        results.only(name);
        only = true;
        return test.apply(null, arguments);
    };
    test._exitCode = 0;
    
    test.close = function () { results.close() };
    
    return test;
}

}).call(this,require('_process'))
},{"./lib/default_stream":425,"./lib/results":426,"./lib/test":427,"_process":12,"defined":431,"through":435}],425:[function(require,module,exports){
(function (process){
var through = require('through');
var fs = require('fs');

module.exports = function () {
    var line = '';
    var stream = through(write, flush);
    return stream;
    
    function write (buf) {
        for (var i = 0; i < buf.length; i++) {
            var c = typeof buf === 'string'
                ? buf.charAt(i)
                : String.fromCharCode(buf[i])
            ;
            if (c === '\n') flush();
            else line += c;
        }
    }
    
    function flush () {
        if (fs.writeSync && /^win/.test(process.platform)) {
            try { fs.writeSync(1, line + '\n'); }
            catch (e) { stream.emit('error', e) }
        }
        else {
            try { console.log(line) }
            catch (e) { stream.emit('error', e) }
        }
        line = '';
    }
};

}).call(this,require('_process'))
},{"_process":12,"fs":3,"through":435}],426:[function(require,module,exports){
(function (process){
var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var through = require('through');
var resumer = require('resumer');
var inspect = require('object-inspect');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = Results;
inherits(Results, EventEmitter);

function Results () {
    if (!(this instanceof Results)) return new Results;
    this.count = 0;
    this.fail = 0;
    this.pass = 0;
    this._stream = through();
    this.tests = [];
}

Results.prototype.createStream = function (opts) {
    if (!opts) opts = {};
    var self = this;
    var output, testId = 0;
    if (opts.objectMode) {
        output = through();
        self.on('_push', function ontest (t, extra) {
            if (!extra) extra = {};
            var id = testId++;
            t.once('prerun', function () {
                var row = {
                    type: 'test',
                    name: t.name,
                    id: id
                };
                if (has(extra, 'parent')) {
                    row.parent = extra.parent;
                }
                output.queue(row);
            });
            t.on('test', function (st) {
                ontest(st, { parent: id });
            });
            t.on('result', function (res) {
                res.test = id;
                res.type = 'assert';
                output.queue(res);
            });
            t.on('end', function () {
                output.queue({ type: 'end', test: id });
            });
        });
        self.on('done', function () { output.queue(null) });
    }
    else {
        output = resumer();
        output.queue('TAP version 13\n');
        self._stream.pipe(output);
    }
    
    nextTick(function next() {
        var t;
        while (t = getNextTest(self)) {
            t.run();
            if (!t.ended) return t.once('end', function(){ nextTick(next); });
        }
        self.emit('done');
    });
    
    return output;
};

Results.prototype.push = function (t) {
    var self = this;
    self.tests.push(t);
    self._watch(t);
    self.emit('_push', t);
};

Results.prototype.only = function (name) {
    if (this._only) {
        self.count ++;
        self.fail ++;
        write('not ok ' + self.count + ' already called .only()\n');
    }
    this._only = name;
};

Results.prototype._watch = function (t) {
    var self = this;
    var write = function (s) { self._stream.queue(s) };
    t.once('prerun', function () {
        write('# ' + t.name + '\n');
    });
    
    t.on('result', function (res) {
        if (typeof res === 'string') {
            write('# ' + res + '\n');
            return;
        }
        write(encodeResult(res, self.count + 1));
        self.count ++;

        if (res.ok) self.pass ++
        else self.fail ++
    });
    
    t.on('test', function (st) { self._watch(st) });
};

Results.prototype.close = function () {
    var self = this;
    if (self.closed) self._stream.emit('error', new Error('ALREADY CLOSED'));
    self.closed = true;
    var write = function (s) { self._stream.queue(s) };
    
    write('\n1..' + self.count + '\n');
    write('# tests ' + self.count + '\n');
    write('# pass  ' + self.pass + '\n');
    if (self.fail) write('# fail  ' + self.fail + '\n')
    else write('\n# ok\n')

    self._stream.queue(null);
};

function encodeResult (res, count) {
    var output = '';
    output += (res.ok ? 'ok ' : 'not ok ') + count;
    output += res.name ? ' ' + res.name.toString().replace(/\s+/g, ' ') : '';
    
    if (res.skip) output += ' # SKIP';
    else if (res.todo) output += ' # TODO';
    
    output += '\n';
    if (res.ok) return output;
    
    var outer = '  ';
    var inner = outer + '  ';
    output += outer + '---\n';
    output += inner + 'operator: ' + res.operator + '\n';
    
    if (has(res, 'expected') || has(res, 'actual')) {
        var ex = inspect(res.expected);
        var ac = inspect(res.actual);
        
        if (Math.max(ex.length, ac.length) > 65) {
            output += inner + 'expected:\n' + inner + '  ' + ex + '\n';
            output += inner + 'actual:\n' + inner + '  ' + ac + '\n';
        }
        else {
            output += inner + 'expected: ' + ex + '\n';
            output += inner + 'actual:   ' + ac + '\n';
        }
    }
    if (res.at) {
        output += inner + 'at: ' + res.at + '\n';
    }
    if (res.operator === 'error' && res.actual && res.actual.stack) {
        var lines = String(res.actual.stack).split('\n');
        output += inner + 'stack:\n';
        output += inner + '  ' + lines[0] + '\n';
        for (var i = 1; i < lines.length; i++) {
            output += inner + lines[i] + '\n';
        }
    }
    
    output += outer + '...\n';
    return output;
}

function getNextTest (results) {
    if (!results._only) {
        return results.tests.shift();
    }
    
    do {
        var t = results.tests.shift();
        if (!t) continue;
        if (results._only === t.name) {
            return t;
        }
    } while (results.tests.length !== 0)
}

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'))
},{"_process":12,"events":8,"inherits":432,"object-inspect":433,"resumer":434,"through":435}],427:[function(require,module,exports){
(function (process,__dirname){
var deepEqual = require('deep-equal');
var defined = require('defined');
var path = require('path');
var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = Test;

var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

inherits(Test, EventEmitter);

var getTestArgs = function (name_, opts_, cb_) {
    var name = '(anonymous)';
    var opts = {};
    var cb;

    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        var t = typeof arg;
        if (t === 'string') {
            name = arg;
        }
        else if (t === 'object') {
            opts = arg || opts;
        }
        else if (t === 'function') {
            cb = arg;
        }
    }
    return { name: name, opts: opts, cb: cb };
};

function Test (name_, opts_, cb_) {
    if (! (this instanceof Test)) {
        return new Test(name_, opts_, cb_);
    }

    var args = getTestArgs(name_, opts_, cb_);

    this.readable = true;
    this.name = args.name || '(anonymous)';
    this.assertCount = 0;
    this.pendingCount = 0;
    this._skip = args.opts.skip || false;
    this._plan = undefined;
    this._cb = args.cb;
    this._progeny = [];
    this._ok = true;

    if (args.opts.timeout !== undefined) {
        this.timeoutAfter(args.opts.timeout);
    }

    for (var prop in this) {
        this[prop] = (function bind(self, val) {
            if (typeof val === 'function') {
                return function bound() {
                    return val.apply(self, arguments);
                };
            }
            else return val;
        })(this, this[prop]);
    }
}

Test.prototype.run = function () {
    if (!this._cb || this._skip) {
        return this._end();
    }
    this.emit('prerun');
    this._cb(this);
    this.emit('run');
};

Test.prototype.test = function (name, opts, cb) {
    var self = this;
    var t = new Test(name, opts, cb);
    this._progeny.push(t);
    this.pendingCount++;
    this.emit('test', t);
    t.on('prerun', function () {
        self.assertCount++;
    })
    
    if (!self._pendingAsserts()) {
        nextTick(function () {
            self._end();
        });
    }
    
    nextTick(function() {
        if (!self._plan && self.pendingCount == self._progeny.length) {
            self._end();
        }
    });
};

Test.prototype.comment = function (msg) {
    this.emit('result', msg.trim().replace(/^#\s*/, ''));
};

Test.prototype.plan = function (n) {
    this._plan = n;
    this.emit('plan', n);
};

Test.prototype.timeoutAfter = function(ms) {
    if (!ms) throw new Error('timeoutAfter requires a timespan');
    var self = this;
    var timeout = setTimeout(function() {
        self.fail('test timed out after ' + ms + 'ms');
        self.end();
    }, ms);
    this.once('end', function() {
        clearTimeout(timeout);
    });
}

Test.prototype.end = function (err) { 
    var self = this;
    if (arguments.length >= 1) {
        this.ifError(err);
    }
    
    if (this.calledEnd) {
        this.fail('.end() called twice');
    }
    this.calledEnd = true;
    this._end();
};

Test.prototype._end = function (err) {
    var self = this;
    if (this._progeny.length) {
        var t = this._progeny.shift();
        t.on('end', function () { self._end() });
        t.run();
        return;
    }
    
    if (!this.ended) this.emit('end');
    var pendingAsserts = this._pendingAsserts();
    if (!this._planError && this._plan !== undefined && pendingAsserts) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount
        });
    }
    this.ended = true;
};

Test.prototype._exit = function () {
    if (this._plan !== undefined &&
        !this._planError && this.assertCount !== this._plan) {
        this._planError = true;
        this.fail('plan != count', {
            expected : this._plan,
            actual : this.assertCount,
            exiting : true
        });
    }
    else if (!this.ended) {
        this.fail('test exited without ending', {
            exiting: true
        });
    }
};

Test.prototype._pendingAsserts = function () {
    if (this._plan === undefined) {
        return 1;
    }
    else {
        return this._plan - (this._progeny.length + this.assertCount);
    }
};

Test.prototype._assert = function assert (ok, opts) {
    var self = this;
    var extra = opts.extra || {};
    
    var res = {
        id : self.assertCount ++,
        ok : Boolean(ok),
        skip : defined(extra.skip, opts.skip),
        name : defined(extra.message, opts.message, '(unnamed assert)'),
        operator : defined(extra.operator, opts.operator)
    };
    if (has(opts, 'actual') || has(extra, 'actual')) {
        res.actual = defined(extra.actual, opts.actual);
    }
    if (has(opts, 'expected') || has(extra, 'expected')) {
        res.expected = defined(extra.expected, opts.expected);
    }
    this._ok = Boolean(this._ok && ok);
    
    if (!ok) {
        res.error = defined(extra.error, opts.error, new Error(res.name));
    }
    
    if (!ok) {
        var e = new Error('exception');
        var err = (e.stack || '').split('\n');
        var dir = path.dirname(__dirname) + '/';
        
        for (var i = 0; i < err.length; i++) {
            var m = /^[^\s]*\s*\bat\s+(.+)/.exec(err[i]);
            if (!m) {
                continue;
            }
            
            var s = m[1].split(/\s+/);
            var filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[1]);
            if (!filem) {
                filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[2]);
                
                if (!filem) {
                    filem = /(\/[^:\s]+:(\d+)(?::(\d+))?)/.exec(s[3]);

                    if (!filem) {
                        continue;
                    }
                }
            }
            
            if (filem[1].slice(0, dir.length) === dir) {
                continue;
            }
            
            res.functionName = s[0];
            res.file = filem[1];
            res.line = Number(filem[2]);
            if (filem[3]) res.column = filem[3];
            
            res.at = m[1];
            break;
        }
    }

    self.emit('result', res);
    
    var pendingAsserts = self._pendingAsserts();
    if (!pendingAsserts) {
        if (extra.exiting) {
            self._end();
        } else {
            nextTick(function () {
                self._end();
            });
        }
    }
    
    if (!self._planError && pendingAsserts < 0) {
        self._planError = true;
        self.fail('plan != count', {
            expected : self._plan,
            actual : self._plan - pendingAsserts
        });
    }
};

Test.prototype.fail = function (msg, extra) {
    this._assert(false, {
        message : msg,
        operator : 'fail',
        extra : extra
    });
};

Test.prototype.pass = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'pass',
        extra : extra
    });
};

Test.prototype.skip = function (msg, extra) {
    this._assert(true, {
        message : msg,
        operator : 'skip',
        skip : true,
        extra : extra
    });
};

Test.prototype.ok
= Test.prototype['true']
= Test.prototype.assert
= function (value, msg, extra) {
    this._assert(value, {
        message : msg,
        operator : 'ok',
        expected : true,
        actual : value,
        extra : extra
    });
};

Test.prototype.notOk
= Test.prototype['false']
= Test.prototype.notok
= function (value, msg, extra) {
    this._assert(!value, {
        message : msg,
        operator : 'notOk',
        expected : false,
        actual : value,
        extra : extra
    });
};

Test.prototype.error
= Test.prototype.ifError
= Test.prototype.ifErr
= Test.prototype.iferror
= function (err, msg, extra) {
    this._assert(!err, {
        message : defined(msg, String(err)),
        operator : 'error',
        actual : err,
        extra : extra
    });
};

Test.prototype.equal
= Test.prototype.equals
= Test.prototype.isEqual
= Test.prototype.is
= Test.prototype.strictEqual
= Test.prototype.strictEquals
= function (a, b, msg, extra) {
    this._assert(a === b, {
        message : defined(msg, 'should be equal'),
        operator : 'equal',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notEqual
= Test.prototype.notEquals
= Test.prototype.notStrictEqual
= Test.prototype.notStrictEquals
= Test.prototype.isNotEqual
= Test.prototype.isNot
= Test.prototype.not
= Test.prototype.doesNotEqual
= Test.prototype.isInequal
= function (a, b, msg, extra) {
    this._assert(a !== b, {
        message : defined(msg, 'should not be equal'),
        operator : 'notEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.deepEqual
= Test.prototype.deepEquals
= Test.prototype.isEquivalent
= Test.prototype.same
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.deepLooseEqual
= Test.prototype.looseEqual
= Test.prototype.looseEquals
= function (a, b, msg, extra) {
    this._assert(deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'deepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype.notDeepEqual
= Test.prototype.notEquivalent
= Test.prototype.notDeeply
= Test.prototype.notSame
= Test.prototype.isNotDeepEqual
= Test.prototype.isNotDeeply
= Test.prototype.isNotEquivalent
= Test.prototype.isInequivalent
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b, { strict: true }), {
        message : defined(msg, 'should not be equivalent'),
        operator : 'notDeepEqual',
        actual : a,
        notExpected : b,
        extra : extra
    });
};

Test.prototype.notDeepLooseEqual
= Test.prototype.notLooseEqual
= Test.prototype.notLooseEquals
= function (a, b, msg, extra) {
    this._assert(!deepEqual(a, b), {
        message : defined(msg, 'should be equivalent'),
        operator : 'notDeepLooseEqual',
        actual : a,
        expected : b,
        extra : extra
    });
};

Test.prototype['throws'] = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }

    var caught = undefined;

    try {
        fn();
    } catch (err) {
        caught = { error : err };
        var message = err.message;
        delete err.message;
        err.message = message;
    }

    var passed = caught;

    if (expected instanceof RegExp) {
        passed = expected.test(caught && caught.error);
        expected = String(expected);
    }

    if (typeof expected === 'function') {
        passed = caught.error instanceof expected;
        caught.error = caught.error.constructor;
    }

    this._assert(passed, {
        message : defined(msg, 'should throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error: !passed && caught && caught.error,
        extra : extra
    });
};

Test.prototype.doesNotThrow = function (fn, expected, msg, extra) {
    if (typeof expected === 'string') {
        msg = expected;
        expected = undefined;
    }
    var caught = undefined;
    try {
        fn();
    }
    catch (err) {
        caught = { error : err };
    }
    this._assert(!caught, {
        message : defined(msg, 'should not throw'),
        operator : 'throws',
        actual : caught && caught.error,
        expected : expected,
        error : caught && caught.error,
        extra : extra
    });
};

function has (obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

Test.skip = function (name_, _opts, _cb) {
    var args = getTestArgs.apply(null, arguments);
    args.opts.skip = true;
    return Test(args.name, args.opts, args.cb);
};

// vim: set softtabstop=4 shiftwidth=4:


}).call(this,require('_process'),"/node_modules/tape/lib")
},{"_process":12,"deep-equal":428,"defined":431,"events":8,"inherits":432,"path":11}],428:[function(require,module,exports){
var pSlice = Array.prototype.slice;
var objectKeys = require('./lib/keys.js');
var isArguments = require('./lib/is_arguments.js');

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return opts.strict ? actual === expected : actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer (x) {
  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return typeof a === typeof b;
}

},{"./lib/is_arguments.js":429,"./lib/keys.js":430}],429:[function(require,module,exports){
var supportsArgumentsClass = (function(){
  return Object.prototype.toString.call(arguments)
})() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object){
  return object &&
    typeof object == 'object' &&
    typeof object.length == 'number' &&
    Object.prototype.hasOwnProperty.call(object, 'callee') &&
    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
    false;
};

},{}],430:[function(require,module,exports){
exports = module.exports = typeof Object.keys === 'function'
  ? Object.keys : shim;

exports.shim = shim;
function shim (obj) {
  var keys = [];
  for (var key in obj) keys.push(key);
  return keys;
}

},{}],431:[function(require,module,exports){
module.exports = function () {
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) return arguments[i];
    }
};

},{}],432:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],433:[function(require,module,exports){
module.exports = function inspect_ (obj, opts, depth, seen) {
    if (!opts) opts = {};
    
    var maxDepth = opts.depth === undefined ? 5 : opts.depth;
    if (depth === undefined) depth = 0;
    if (depth > maxDepth && maxDepth > 0) return '...';
    
    if (seen === undefined) seen = [];
    else if (indexOf(seen, obj) >= 0) {
        return '[Circular]';
    }
    
    function inspect (value, from) {
        if (from) {
            seen = seen.slice();
            seen.push(from);
        }
        return inspect_(value, opts, depth + 1, seen);
    }
    
    if (typeof obj === 'string') {
        return inspectString(obj);
    }
    else if (typeof obj === 'function') {
        var name = nameOf(obj);
        return '[Function' + (name ? ': ' + name : '') + ']';
    }
    else if (obj === null) {
        return 'null';
    }
    else if (isElement(obj)) {
        var s = '<' + String(obj.nodeName).toLowerCase();
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
            s += ' ' + attrs[i].name + '="' + quote(attrs[i].value) + '"';
        }
        s += '>';
        if (obj.childNodes && obj.childNodes.length) s += '...';
        s += '</' + String(obj.tagName).toLowerCase() + '>';
        return s;
    }
    else if (isArray(obj)) {
        if (obj.length === 0) return '[]';
        var xs = Array(obj.length);
        for (var i = 0; i < obj.length; i++) {
            xs[i] = has(obj, i) ? inspect(obj[i], obj) : '';
        }
        return '[ ' + xs.join(', ') + ' ]';
    }
    else if (typeof obj === 'object' && typeof obj.inspect === 'function') {
        return obj.inspect();
    }
    else if (typeof obj === 'object' && !isDate(obj) && !isRegExp(obj)) {
        var xs = [], keys = [];
        for (var key in obj) {
            if (has(obj, key)) keys.push(key);
        }
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (/[^\w$]/.test(key)) {
                xs.push(inspect(key) + ': ' + inspect(obj[key], obj));
            }
            else xs.push(key + ': ' + inspect(obj[key], obj));
        }
        if (xs.length === 0) return '{}';
        return '{ ' + xs.join(', ') + ' }';
    }
    else return String(obj);
};

function quote (s) {
    return String(s).replace(/"/g, '&quot;');
}

function isArray (obj) {
    return {}.toString.call(obj) === '[object Array]';
}

function isDate (obj) {
    return {}.toString.call(obj) === '[object Date]';
}

function isRegExp (obj) {
    return {}.toString.call(obj) === '[object RegExp]';
}

function has (obj, key) {
    if (!{}.hasOwnProperty) return key in obj;
    return {}.hasOwnProperty.call(obj, key);
}

function nameOf (f) {
    if (f.name) return f.name;
    var m = f.toString().match(/^function\s*([\w$]+)/);
    if (m) return m[1];
}

function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) return i;
    }
    return -1;
}

function isElement (x) {
    if (!x || typeof x !== 'object') return false;
    if (typeof HTMLElement !== 'undefined') {
        return x instanceof HTMLElement;
    }
    else return typeof x.nodeName === 'string'
        && typeof x.getAttribute === 'function'
    ;
}

function inspectString (str) {
    var s = str.replace(/(['\\])/g, '\\$1').replace(/[\x00-\x1f]/g, lowbyte);
    return "'" + s + "'";
    
    function lowbyte (c) {
        var n = c.charCodeAt(0);
        var x = { 8: 'b', 9: 't', 10: 'n', 12: 'f', 13: 'r' }[n];
        if (x) return '\\' + x;
        return '\\x' + (n < 0x10 ? '0' : '') + n.toString(16);
    }
}

},{}],434:[function(require,module,exports){
(function (process){
var through = require('through');
var nextTick = typeof setImmediate !== 'undefined'
    ? setImmediate
    : process.nextTick
;

module.exports = function (write, end) {
    var tr = through(write, end);
    tr.pause();
    var resume = tr.resume;
    var pause = tr.pause;
    var paused = false;
    
    tr.pause = function () {
        paused = true;
        return pause.apply(this, arguments);
    };
    
    tr.resume = function () {
        paused = false;
        return resume.apply(this, arguments);
    };
    
    nextTick(function () {
        if (!paused) tr.resume();
    });
    
    return tr;
};

}).call(this,require('_process'))
},{"_process":12,"through":435}],435:[function(require,module,exports){
(function (process){
var Stream = require('stream')

// through
//
// a stream that does nothing but re-emit the input.
// useful for aggregating a series of changing but not ending streams into one stream)

exports = module.exports = through
through.through = through

//create a readable writable stream.

function through (write, end, opts) {
  write = write || function (data) { this.queue(data) }
  end = end || function () { this.queue(null) }

  var ended = false, destroyed = false, buffer = [], _ended = false
  var stream = new Stream()
  stream.readable = stream.writable = true
  stream.paused = false

//  stream.autoPause   = !(opts && opts.autoPause   === false)
  stream.autoDestroy = !(opts && opts.autoDestroy === false)

  stream.write = function (data) {
    write.call(this, data)
    return !stream.paused
  }

  function drain() {
    while(buffer.length && !stream.paused) {
      var data = buffer.shift()
      if(null === data)
        return stream.emit('end')
      else
        stream.emit('data', data)
    }
  }

  stream.queue = stream.push = function (data) {
//    console.error(ended)
    if(_ended) return stream
    if(data === null) _ended = true
    buffer.push(data)
    drain()
    return stream
  }

  //this will be registered as the first 'end' listener
  //must call destroy next tick, to make sure we're after any
  //stream piped from here.
  //this is only a problem if end is not emitted synchronously.
  //a nicer way to do this is to make sure this is the last listener for 'end'

  stream.on('end', function () {
    stream.readable = false
    if(!stream.writable && stream.autoDestroy)
      process.nextTick(function () {
        stream.destroy()
      })
  })

  function _end () {
    stream.writable = false
    end.call(stream)
    if(!stream.readable && stream.autoDestroy)
      stream.destroy()
  }

  stream.end = function (data) {
    if(ended) return
    ended = true
    if(arguments.length) stream.write(data)
    _end() // will emit or queue
    return stream
  }

  stream.destroy = function () {
    if(destroyed) return
    destroyed = true
    ended = true
    buffer.length = 0
    stream.writable = stream.readable = false
    stream.emit('close')
    return stream
  }

  stream.pause = function () {
    if(stream.paused) return
    stream.paused = true
    return stream
  }

  stream.resume = function () {
    if(stream.paused) {
      stream.paused = false
      stream.emit('resume')
    }
    drain()
    //may have become paused again,
    //as drain emits 'data'.
    if(!stream.paused)
      stream.emit('drain')
    return stream
  }
  return stream
}


}).call(this,require('_process'))
},{"_process":12,"stream":24}],436:[function(require,module,exports){
'use strict';

var test = require('tape');
var path = require('path');
var Famous = require('famous').core.Famous;
var Clock = Famous.getClock();
var Transitionable = require('famous').transitions.Transitionable;

var StateManager = require('./../lib');

test('StateManager', function(t) {
  t.ok(StateManager, 'exports');

  var dogState = {
    age: 4,
    name: 'Yorkie',
    breed: 'Yorkshire Terrier',
    isSleeping: false,
    isHungry: true,
    cutenessLevel: 8.1,
    playfulnessLevel: 8.8,
    size: [100, 200, 300],
    points: 10,
    fluffiness: 10
  }

  var globalObserverFlag = false;
  var ageObserverFlag = false;

  var globalObserver = function (key, value) {
    globalObserverFlag = true;
  }

  var SM = new StateManager(dogState, Clock, Transitionable);

  console.log('GETTER');
  t.equal(SM.getState('age'), 4, 'should get state');
  t.equal(SM.getState('breed'), 'Yorkshire Terrier', 'should get state');
  t.equal(SM.getState('isSleeping'), false, 'should get state');
  t.equal(SM.getState('isHungry'), true, 'should get state');

  console.log('SETTER');
  SM.setState('isSleeping', true);
  t.equal(SM.getState('isSleeping'), true, 'should set state');

  console.log('LATEST STATE CHANGE');
  SM.setState('age', SM.get('age'));
  var latest = SM.getLatestStateChange();
  var stateKey = Object.keys(latest)
  t.true(stateKey.length === 1 && stateKey[0] === 'age', 'should set key for latest state');
  t.equal(latest[stateKey], 4, 'should set value for latest state');

  console.log('SUBSCRIBE TO');
  var ageObserverValue;
  var ageObserverFn = function(key, value) {
    ageObserverValue = value;
  }
  SM.subscribeTo('age', ageObserverFn);
  SM.set('age', SM.get('age'));
  t.equal(ageObserverValue, 4, 'Subscribe to updates on state set');
  SM.unsubscribeFrom('age', ageObserverFn);
  SM.set('age', 10);
  t.equal(ageObserverValue, 4, 'UnsubscribeFrom stops updates on state set');
  ageObserverValue = -1;
  SM.subscribeTo('age', ageObserverFn);
  SM.set('age', SM.get('age'));
  SM.unsubscribe(ageObserverFn);
  SM.set('age', 4);
  t.equal(ageObserverValue, 10, 'Unsubrice stops updates on state set');

  console.log('GLOBAL SUBSCRIBE');
  var count = 0;
  var globalObserver = function() {
    count++;
  };
  SM.subscribe(globalObserver);
  SM.chain('points').add(10).subtract(10);
  SM.chain('age').add(2).subtract(2);
  t.equal(count, 4, 'Global observer works with state changes that are part of constructor');

  SM.set('newProperty', 8);
  t.equal(SM.get('newProperty'), 8, 'StateManager properly sets/retrieves dynamcially added state');
  t.equal(count, 5, 'Global observer works with state changes on dynamcially added properties');

  SM.unsubscribe(globalObserver);
  SM.set('newProperty', 10);
  t.equal(count, 5, 'Global observer properly unsubscribes');

  console.log('ONCE SUBSCRIBE');
  var onceValue = 0;
  var once = function() {
    onceValue++;
  }
  SM.subscribeOnce(once);
  SM.triggerGlobalChange();
  t.equal(onceValue, 1, 'subscribeOnce should trigger on first triggerGlobalChange');
  SM.triggerGlobalChange();
  t.equal(onceValue, 1, 'subscribeOnce should not trigger on subsequent triggerGlobalChange');

  console.log('OPERATION');
  SM.setState('age', 5);
  SM.chain('age').add(1);
  t.equal(SM.getState('age'), 6, 'should be able to add');
  SM.chain('age').subtract(1);
  t.equal(SM.getState('age'), 5, 'should be able to subtract');
  SM.chain('age').multiply(2);
  t.equal(SM.getState('age'), 10, 'should be able to nultiply');
  SM.chain('age').timesPI();
  t.equal(SM.getState('age'), 10 * Math.PI, 'should be able to multiply by PI');
  SM.chain('age').divide(2 * Math.PI);
  t.equal(SM.getState('age'), 5, 'should be able to divide');
  SM.chain('age').pow(2);
  t.equal(SM.getState('age'), 25, 'should be able to perform exponents');
  SM.chain('age').sqrt();
  t.equal(SM.getState('age'), 5, 'should be able to perform square root');
  SM.chain('age').multiply(-1);
  SM.chain('age').abs();
  t.equal(SM.getState('age'), 5, 'should be able to take absolute value');
  SM.chain('age').sin();
  t.equal(SM.getState('age'), Math.sin(5), 'should be able to perform sine');
  SM.chain('age').cos();
  t.equal(SM.getState('age'), Math.cos(Math.sin(5)), 'should be able to perform cosine');
  SM.chain('age').tan();
  t.equal(SM.getState('age'), Math.tan(Math.cos(Math.sin(5))), 'should be able to perform tangent');
  SM.chain('playfulnessLevel').ceil();
  t.equal(SM.getState('playfulnessLevel'), 8, 'should be able to round up');
  SM.chain('cutenessLevel').floor();
  t.equal(SM.getState('cutenessLevel'), 8, 'should be able to round down');
  SM.chain('name').concat('Yorkie');
  t.equal(SM.getState('name'), 'YorkieYorkie', 'should be able to concatenate strings');
  SM.chain('name').substring([0, 6]);
  t.equal(SM.getState('name'), 'Yorkie', 'should be able to substring');
  SM.chain('name').toUpper();
  t.equal(SM.getState('name'), 'YORKIE', 'should be able to set uppercase');
  SM.chain('name').toLower();
  t.equal(SM.getState('name'), 'yorkie', 'should be able to set lowercase');
  SM.chain('isHungry').flip();
  t.equal(SM.getState('isHungry'), false, 'should be able to flip boolean');
  SM.chain('isHungry').toInt();
  t.equal(SM.getState('isHungry'), 0, 'should be able to convert boolean to integer')

  t.test('Should work with arrays', function(st) {
    st.test('Array: Should retrieve values', function(stt){
      stt.plan(3);
      stt.equal(SM.getState('size')[0], 100);
      stt.equal(SM.getState('size')[1], 200);
      stt.equal(SM.getState('size')[2], 300);
    });

    st.test('Array: Should operate with constant', function(stt){
      stt.plan(3);
      SM.chain('size').add(5);
      stt.equal(SM.getState('size')[0], 105);
      stt.equal(SM.getState('size')[1], 205);
      stt.equal(SM.getState('size')[2], 305);
      SM.chain('size').subtract(5);
    });

    st.test('Array: Should operate with array', function(stt){
      SM.chain('size').add([5]);
      stt.equal(SM.getState('size')[0], 105);
      stt.equal(SM.getState('size')[1], 200);
      stt.equal(SM.getState('size')[2], 300);
      SM.chain('size').subtract(5);

      stt.end();
    });

    st.end();
  });

  console.log('ADDING A CUSTOM OPERATOR');
  SM.addOperator('triple', function (a) { return 3 * a });
  SM.chain('cutenessLevel').triple();
  t.equal(SM.getState('cutenessLevel'), 24, 'should be able to add custom operators');

  SM.addOperator('addThenMultiplyBy2', function (a, b) { return (a + b) * 2 });
  SM.chain('points').addThenMultiplyBy2(5);
  t.equal(SM.getState('points'), 30, 'should be able to add multiple operators (1/2)');
  SM.chain('points').triple();
  t.equal(SM.getState('points'), 90, 'should be able to add multiple operators (2/2)');


  console.log('CHAINING');
  SM.chain('cutenessLevel')
    .multiply(2) //48
    .add(25) // 73
    .triple() // 219
    .multiply(3)
    .divide(3);
  t.equal(SM.getState('cutenessLevel'), 219, 'should be able to chain operations');


  console.log('THROWS ERROR ON NON-STANDARD INPUTS');
  t.test('Should check for invalid inputs', function(st){
    st.plan(1);

    try {
      SM.chain('cutenessLevel').add([1, 2]);
    }
    catch(err) {
      st.ok(err, 'Caught error attempting to add array to integer');
    }
  });

  t.end();
});

},{"./../lib":1,"famous":26,"path":11,"tape":424}]},{},[436]);
