'use strict';

var operator = require('./operator');
var physics = require('famous/physics');
var math = require('famous/math');

/**
 * StateManager
 *
 * Manages states and observers to watch for changes in state.
 */
function StateManager (state, famousNode, Transitionable) {
    this._state = {};
    this._famousNode = famousNode;
    this._famousNodeId = this._famousNode.addComponent(this);
    this._Transitionable = Transitionable;

    // observers
    this._observers = {};                       // fires on change to target state
    this._globalObservers = [];                 // fires on every change to state
    this._globalObserversThatFireOnce = [];     // fires once on triggerGlobalChange()
    this._globalObserversThatFireEvery = [];    // fires on every triggerGlobalChange()

    this._transitionables = {};

    this._currentID = 0;
    this._thenSetPool = {};

    this._operator = operator;

    this._physicsStore = {};
    this._physicsStatus = {};

    this._initObservers(state);
    this._setInitialState(state);

    // tell engine to call .onUpdate() function
    this._famousNode.requestUpdate(this._famousNodeId);
}

/**
 * Initializes observers by creating an array for each state key.
 */
StateManager.prototype._initObservers = function _initObservers (state) {
    for (var key in state) this._observers[key] = [];
};

StateManager.prototype._setInitialState = function _setInitialState (state) {
    for (var key in state) {
        // No point triggering a state set that would be undefined anyway,
        // plus, we get the advantage of being able to declare states that
        // we might not want to set right away
        if (state[key] !== undefined) {
            this.setState(key, state[key]);
        }
    }
};

/**
 * State getter function.
 */
StateManager.prototype.getState = function getState (key) {
    var target = key[key.length - 1];
    return isArray(key) ? traverse(this._state, key)[target] : this._state[key];
};

/**
 * Alias for .getState()
 */
StateManager.prototype.get = StateManager.prototype.getState;

/**
 * Returns entire state object.
 */
StateManager.prototype.getStateObject = function getStateObject () {
    return this._state;
};

/**
 * State setter function.
 * Accepts calls in the format `setState('key', 'value') or
 * `setState('key', 5, {duration: 1000, curve: 'linear'});
 * (all numeric values can be treated as Transitionables)
 */
StateManager.prototype.setState = function setState (key, value, transition) {
    this._currentID++;

    var keyType = getType(key);
    var valueType = getType(value);
    var previousValue = this.get(key);
    var previousValueType = getType(previousValue);

    var typesDoMatch = valueType === previousValueType;

    if (keyType === 'Object') {
        var object = key;
        transition = value;
        for (var state in object) {
            this.setState(state, object[state], transition);
        }
        return this;
    }

    if (keyType === 'Array') key = JSON.stringify(key);

    switch(valueType) {
        case 'Array':
        case 'Number':
            if (this._state[key]) this._transitionables[key].halt();
            else this._transitionables[key] = new this._Transitionable(value);

            if (!transition) {
                this._transitionables[key].set(value, null, this._checkThenSetPool.bind(this, this._currentID));
                setOnObject(key, value, this._state);
                this._fireObservers(key, value);
            }
            else {
                if (typesDoMatch) {
                    this._setTransitionable(this._currentID, key, previousValue, value, transition);
                    setOnObject(key, previousValue, this._state);
                }
                else {
                    throw new Error('Cannot transition from a ' + previousValueType + ' to a ' + valueType);
                }
            }
            break;
        case 'Function':
            throw new Error('Cannot set state of type: ' + valueType);
        default:
            if (transition) {
                throw new Error('Cannot transition state of type: ' + valueType);
            }
            else {
                setOnObject(key, value, this._state);
                this._fireObservers(key, value);
            }
    }

    this._setLatestStateChange(key, value);

    return this;
};

/**
 * Alias for .setState()
 */
StateManager.prototype.set = StateManager.prototype.setState;

/**
 * Sugar for setting state in a callback.
 */
StateManager.prototype.thenSetState = function thenSetState (key, value, transition) {
    var id = this._currentID;
    var pool = this._thenSetPool;

    if (pool[id] && pool[id].length) id++;
    pool[id] = [key, value, transition];

    return this;
};

/**
 * Alias for .thenSetState()
 */
StateManager.prototype.thenSet = StateManager.prototype.thenSetState;

/**
 * Check the thenQueue and call .setState on latest .then call.
 */
StateManager.prototype._checkThenSetPool = function _checkThenSetPool (id) {
    var thenSetArray = this._thenSetPool[id];

    if (thenSetArray && thenSetArray.length) {
        this.setState(thenSetArray[0], thenSetArray[1], thenSetArray[2]);
    }

    delete this._thenSetPool[id];
};

StateManager.prototype._setTransitionable = function _setTransitionable (id, key, previous, current, transition) {
    transition = transition || {};
    transition.curve = transition.curve || 'linear';
    transition.duration = transition.duration || 0;

    this._transitionables[key]
        .from(previous)
        .to(current, transition.curve, transition.duration, this._checkThenSetPool.bind(this, id));
};

/**
 * Get the key and value associated with the latest change to state.
 * @return {Object} Latest state change
 */
StateManager.prototype.getLatestStateChange = function getLatestStateChange () {
    return this._latestStateChange;
};

/**
 * Resets `_latestStateChange to updated key and value.
 * Used internally by `setState()`.
 * @protected
 */
StateManager.prototype._setLatestStateChange = function _setLatestStateChange (key, value) {
    this._latestStateChange = [key, value];
};

/**
 * Adds an observer to all observables.
 */
StateManager.prototype.subscribe = function subscribe (observer) {
    this._globalObservers.push(observer);
};

/**
 * Removes an observer from all observables.
 */
StateManager.prototype.unsubscribe = function unsubscribe (observer) {
    // Remove from global
    var globalKeys = {
        '_globalObservers': true,
        '_globalObserversThatFireEvery': true
    };

    var index;
    var listenerStack;
    var key;
    for (key in globalKeys) {
        listenerStack = this[key];
        index = listenerStack.indexOf(observer);
        if (index !== -1) {
            listenerStack.splice(index);
        }
    }

    // Remove from all key based observers
    for (key in this._observers) {
        this.unsubscribeFrom(key, observer);
    }
};

/**
 * Adds an observer to a key's list of observables.
 */
StateManager.prototype.subscribeTo = function subscribeTo (key, observer) {
    if (!this._observers.hasOwnProperty(key)) this._observers[key] = [];
    this._observers[key].push(observer);
};

/**
 * Removes an observer from a key's list of observables.
 */
StateManager.prototype.unsubscribeFrom = function unsubscribeFrom (key, observer) {
    if (this._observers.hasOwnProperty(key)) {
        var index = this._observers[key].indexOf(observer);
        if (index !== -1) this._observers[key].splice(index);
    }
};

StateManager.prototype._unsubscribeAllFromKey = function _unsubscribeAllFromKey (key) {
    if (this._observers.hasOwnProperty(key)) this._observers[key] = [];
};

/**
 * Adds an observer that will be fired a single time as soon
 * as triggerGlobalChange is invoked.
 */
StateManager.prototype.subscribeOnce = function subscribeOnce (observer) {
    this._globalObserversThatFireOnce.push(observer);
};

/**
 * Adds an observer that will be fired every time a global change
 * is triggered.
 */
StateManager.prototype.subscribeToGlobalChange = function subscribeToGlobalChange (observer) {
    this._globalObserversThatFireEvery.push(observer);
};

/**
 * Calls set state with current state's value on each state.
 * @param {RegEx} whiteList RegEx defining which keys state should be triggered on.
 *                          If both a whiteList & blackList are passed in, the whiteList's result
 *                          takes precedence over the blackList.
 * @param {RegEx} blackList RegEx defining which keys state should NOT be triggered on.
 */
StateManager.prototype.triggerGlobalChange = function triggerGlobalChange (whiteList, blackList) {
    for (var key in this._state) {
        if (whiteList) {
            if (whiteList.test(key)) this.setState(key, this.getState(key));
        }
        else if (blackList) {
            if (!blackList.test(key)) this.setState(key, this.getState(key));
        }
        else {
            this.setState(key, this.getState(key));
        }
    }

    var i;
    for (i = 0; i < this._globalObservers.length; i++) {
        this._globalObservers[i]();
    }
    for (i = 0; i < this._globalObserversThatFireEvery.length; i++) {
        this._globalObserversThatFireEvery[i]();
    }

    var observer;
    while (this._globalObserversThatFireOnce.length) {
        observer = this._globalObserversThatFireOnce.pop();
        observer();
    }
};

StateManager.prototype._fireObservers = function _fireObservers (key, value) {
    // if stateName is an array (nested state), use first string
    var parsedKey = parse(key);
    if (isArray(parsedKey)) key = parsedKey[0];

    if (this._observers[key]) {
        for (var i = 0; i < this._observers[key].length; i++) {
            this._observers[key][i](key, value);
        }
    }

    for (var j = 0; j < this._globalObservers.length; j++) {
        this._globalObservers[j](key, value);
    }
};

StateManager.prototype.onUpdate = function onUpdate (time) {
    // keep internal state object in sync with transitionable values
    for (var key in this._transitionables) {
        if (this._transitionables.hasOwnProperty(key)) {
            var t = this._transitionables[key];
            if (t && t.isActive()) {
                setOnObject(key, t.get(), this._state);
                this._fireObservers(key, t.get());
            }
        }
    }

    if (this._physicsEngine) {
        this._physicsEngine.update(time);
        for (key in this._physicsStore) {
            if (this._physicsStore.hasOwnProperty(key)) {
                var physicsInstance = this._physicsStore[key];
                if (physicsInstance instanceof physics.Particle) {
                    var position = physicsInstance.getPosition().toArray();
                    setOnObject(key, position, this._state);
                    this._fireObservers(key, position);
                }
            }
        }
    }

    // Update on each tick
    this._famousNode.requestUpdateOnNextTick(this._famousNodeId);
};

StateManager.prototype._addToPhysicsStore = function _addToPhysicsStore (name, particle) {
    this._physicsStore[name] = particle;
};

StateManager.prototype._removeFromPhysicsStore = function _removeFromPhysicsStore (name) {
    delete this._physicsStore[name];
};

StateManager.prototype._createPhysicsEngine = function _createPhysicsEngine () {
    this._physicsEngine = new physics.PhysicsEngine();
};

StateManager.prototype._createPhysicsParticle = function _createPhysicsParticle (name, position) {
    var particle = new physics.Particle({
        position: new math.Vec3(position[0], position[1], position[2])
    });

    this._physicsEngine.add(particle);
    this._addToPhysicsStore(name, particle);

    this.set(name, position);

    return particle;
};

StateManager.prototype._convertToPhysicsParticles = function _convertToPhysicsParticles (names) {
    var bodies = [];

    for (var i = 0, len = names.length; i < len; i++) {
        var name = names[i];

        var body;

        if (this._physicsStore[name]) {
            body = this._physicsStore[name];
        }
        else {
            var position = this.get(name);

            if (isArray(position)) {
                body = this._createPhysicsParticle(name, position);
            }
            else {
                console.error('The state \'' + name + '\' should be an array corresponding to a position.');
            }
        }

        bodies.push(body);
    }

    return bodies;
};

StateManager.prototype.applyPhysicsForce = function applyPhysicsForce (forceName, bodyNames, options) {
    if (!this._physicsEngine) this._createPhysicsEngine();

    var bodies = this._convertToPhysicsParticles(bodyNames);
    var force = physics[capitalizeFirstLetter(forceName)];

    var forceInstance;

    if (options && options.anchor) {
        var anchor = options.anchor;
        options.anchor = new math.Vec3(anchor[0], anchor[1], anchor[2]);
    }

    switch (forceName) {
        case 'drag':
        case 'gravity1D':
        case 'rotationalDrag':
            forceInstance = new force(bodies, options);
            this._physicsEngine.add(forceInstance);
            this._addToPhysicsStore(forceName, force);
            break;
        case 'gravity3D':
        case 'rotationalSpring':
        case 'spring':
            if (bodies.length < 2) {
                console.error('\'' + forceName + '\' requires a source and at least one target. \n\n The source is the first element in the array and the targets are the subsequent elements in the array.');
            }
            else {
                forceInstance = new force(bodies[0], bodies.slice(1, bodies.length), options);
                this._physicsEngine.add(forceInstance);
                this._addToPhysicsStore(forceName, force);
            }
            break;
        default:
            console.error('\'' + forceName + '\' is not a valid force. \n\n The valid forces are: \'drag\', \'gravity1D\', \'gravity3D\', \'rotationalDrag\', \'rotationalSpring\', and \'spring\'.');
    }

    this._addToPhysicsStatus(forceName, bodyNames, 'force');

    return this;
};

StateManager.prototype.applyPhysicsConstraint = function applyPhysicsConstraint (constraintName, bodyNames, options) {
    if (!this._physicsEngine) this._createPhysicsEngine();

    var bodies = this._convertToPhysicsParticles(bodyNames);
    var constraint = physics[capitalizeFirstLetter(constraintName)];

    var constraintInstance;

    if (options && options.anchor) {
        var anchor = options.anchor;
        options.anchor = new math.Vec3(anchor[0], anchor[1], anchor[2]);
    }
    if (options && options.axis) {
        var axis = options.axis;
        options.axis = new math.Vec3(axis[0], axis[1], axis[2]);
    }

    switch (constraintName) {
        case 'angle':
        case 'ballAndSocket':
        case 'direction':
        case 'distance':
        case 'hinge':
            if (bodies.length !== 2) {
                console.error('\'' + constraintName + '\' requires exactly 2 targets. \n\n If there are more than two, than the first 2 elements in the array are used.');
            }
            else {
                constraintInstance = new constraint(bodies[0], bodies[1], options);
                this._physicsEngine.add(constraintInstance);
                this._addToPhysicsStore(constraintName, constraintInstance);
            }
            break;
        case 'collision':
        case 'curve':
            if (bodies.length < 2) {
                console.error('\'' + constraintName + '\' requires at least 2 targets.');
            }
            else {
                constraintInstance = new constraint(bodies, options);
                this._physicsEngine.add(constraintInstance);
                this._addToPhysicsStore(constraintName, constraintInstance);
            }
            break;
        default:
            console.error('\'' + constraintName + '\' is not a valid constraint. \n\n The valid forces are: \'angle\', \'ballAndSocket\', \'collision\', \'curve\', \'direction\', \'distance\', and \'hinge\'.');
    }

    this._addToPhysicsStatus(constraintName, bodyNames, 'constraint');

    return this;
};

StateManager.prototype.setPhysicsPosition = function setPhysicsVelocity (name, position) {
    this._physicsStore[name].setPosition(position[0], position[1], position[2]);
};

StateManager.prototype.setPhysicsVelocity = function setPhysicsVelocity (name, velocity) {
    this._physicsStore[name].setVelocity(velocity[0], velocity[1], velocity[2]);
};

StateManager.prototype.setPhysicsMomentum = function setPhysicsMomentum (name, momentum) {
    this._physicsStore[name].setMomentum(momentum[0], momentum[1], momentum[2]);
};

StateManager.prototype.setPhysicsMass = function setPhysicsMass (name, mass) {
    this._physicsStore[name].setMass(mass);
};

StateManager.prototype.removePhysicsForce = function removePhysicsForce (forceName) {
    this._physicsEngine.removeForce(this._physicsStore[forceName]);
    this._removeFromPhysicsStatus(forceName, 'force');
    this._removeFromPhysicsStore(forceName);
    return this;
};

StateManager.prototype.removePhysicsConstraint = function removePhysicsConstraint (constraintName) {
    this._physicsEngine.removeConstraint(this._physicsStore[constraintName]);
    this._removeFromPhysicsStatus(constraintName, 'constraint');
    this._removeFromPhysicsStore(constraintName);
    return this;
};

StateManager.prototype.removePhysicsBody = function removePhysicsBody (bodyName) {
    this._physicsEngine.removeBody(this._physicsStore[bodyName]);
    this._removeFromPhysicsStatus(bodyName, 'body');
    this._removeFromPhysicsStore(bodyName);
    return this;
};

StateManager.prototype._addToPhysicsStatus = function _addToPhysicsStatus(forceOrConstraint, bodyNames, type) {
    var physicsType;

    if (type === 'force') physicsType = 'forces';
    else                  physicsType = 'constraints';

    var physicsStatus = this._physicsStatus;

    if (!physicsStatus[forceOrConstraint]) physicsStatus[forceOrConstraint] = {};
    if (!physicsStatus[forceOrConstraint]['bodies']) physicsStatus[forceOrConstraint]['bodies'] = [];

    for (var i = 0, len = bodyNames.length; i < len; i++) {
        var bodyName = bodyNames[i];

        if (physicsStatus[bodyName] === undefined)
            physicsStatus[bodyName] = {};

        if (physicsStatus[bodyName][physicsType] === undefined)
            physicsStatus[bodyName][physicsType] = [];

        if (physicsStatus[bodyName][physicsType].indexOf(forceOrConstraint) === -1)
            physicsStatus[bodyName][physicsType].push(forceOrConstraint);

        physicsStatus[forceOrConstraint]['bodies'].push(bodyName);
    }
};

StateManager.prototype._removeFromPhysicsStatus = function _removeFromPhysicsStatus (name, type) {
    var physicsType;

    if (type === 'bodies')      physicsType = 'bodies';
    else if (type === 'forces') physicsType = 'forces';
    else                        physicsType = 'constraints';

    var physicsStatus = this._physicsStatus;

    if (physicsStatus[name]) delete physicsStatus[name];
};

StateManager.prototype.getPhysicsStatus = function getPhysicsStatus (name) {
    if (name) return this._physicsStatus[name];
    else      return this._physicsStatus;
};

/**
 * Sets properties on an object.
 * Handles traversing nested object setting.
 */
function setOnObject (key, val, object) {
    key = parse(key);

    if (isString(key)) {
        object[key] = val;
    }
    else if (isArray(key)) {
        var targetKey = key[key.length - 1];
        var hostObject = traverse(object, key);
        hostObject[targetKey] = val;
    }
}

/**
 * Returns the host object of nested state.
 */
function traverse (object, path) {
    if (object.hasOwnProperty(path[0])) {
        if (path.length === 1) return object;
        else return traverse(object[path.slice(0, 1)], path.slice(1, path.length));
    }
    else {
        console.error('Incorrect path: ' + path[0]);
    }
}

/**
 * Capitalizes the first letter of a string.
 */
function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}

/**
 * Parses nested state keys.
 * Returns key if not nested.
 */
function parse (key) {
    if (isString(key) && key.indexOf('[') === 0) {
        return JSON.parse(key);
    }
    else {
        return key;
    }
}

/**
 * Returns a Boolean indication whether the state is an array or not.
 */
function isArray (state) {
    return getType(state) === 'Array';
}

/**
 * Returns a Boolean indication whether the state is a string or not.
 */
function isString (state) {
    return getType(state) === 'String';
}

/**
 * Returns a String corresponding to the state's type.
 */
function getType (state) {
    return Object.prototype.toString.call(state).slice(8, -1);
}

module.exports = StateManager;
