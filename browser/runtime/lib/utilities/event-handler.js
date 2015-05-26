/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Owner: will@famo.us
 *
 * @license MPL 2.0
 * @copyright Famous Industries, Inc. 2014
 */

'use strict';

/**
 * EventHandler forwards received events to a set of provided callback functions.
 * It allows events to be captured, processed, and optionally passed through to other Event modules.
 *
 * @class EventHandler
 * @constructor
 */
function EventHandler(context) {
    this._eventListeners = {};
    this._owner = context || this;
    this._subscribedIds = [];
}

/**
 * Binds a callback function to an event type handled by this object.
 *
 * @method "addListener"
 *
 * @param {string} type event name
 * @param {function(Object)} callback function to be called on event trigger
 * @param {Object} context the context in which the callback will be called
 * @return {string} id callback id
 */
EventHandler.prototype.addListener = function addListener(type, callback, context, id) {
    id = id || Math.random().toString(36);
    if (!this._eventListeners[type]) {
        this._eventListeners[type] = [];
    }
    this._eventListeners[type].push({
        callback: callback,
        context: context || null,
        id: id
    });
    return id;
};

/**
 * Alias for "addListener".
 * @method on
 */
EventHandler.prototype.on = EventHandler.prototype.addListener;

/**
 * Unbind an event by type and callback or id.
 *   This undoes the work of "addListener".
 *
 * @method removeListener
 *
 * @param {string} type event name
 * @param {function|string} callback, or id to remove
 * @return {EventHandler} this
 */
EventHandler.prototype.removeListener = function removeListener(type, callbackOrId) {
    var listeners = this._eventListeners[type];
    if (!listeners) {
        return null;
    }
    if (!callbackOrId) {
        this._eventListeners[type] = void 0;
        return null;
    }

    var length = listeners.length;
    var identifier = (callbackOrId instanceof Function) ? 'callback' : 'id';
    while (length--) {
        if (listeners[length][identifier] === callbackOrId) {
            listeners.splice(length, 1);
        }
    }
    return this;
};

/**
 * Alias for "removeListener".
 * @method off
 */
EventHandler.prototype.off = EventHandler.prototype.removeListener;

/**
 * Triggers an event, sending to all handlers
 *   listening for provided 'type' key.
 *
 * @method trigger
 *
 * @param {string} type event name
 * @param {Object} event event data
 * @return {EventHandler} this
 */
EventHandler.prototype.trigger = function trigger(type, event) {
    var response, length, context;
    if (this._eventListeners[type]) {
        length = this._eventListeners[type].length;
        while (length--) {
            response = this._eventListeners[type][length];
            context = response.context || this._owner;
            response.callback.call(context, event);
        }
    }
    if (this._eventListeners.all) {
        length = this._eventListeners.all.length;
        while (length--) {
            response = this._eventListeners.all[length];
            context = response.context || this._owner;
            response.callback.call(context, type, event);
        }
    }
    return this;
};

/**
 * Alias for trigger
 * @method emit
 */
EventHandler.prototype.emit = EventHandler.prototype.trigger;

/**
 * Listen for events from an upstream events object.
 *
 * @method subscribe
 *
 * @param {EventHandler} source source events object
 * @return {EventHandler} this
 */
EventHandler.prototype.subscribe = function subscribe(source) {
    if (~this._subscribedIds.indexOf(source)) {
        return null;
    }
    var self = this;
    var id = source.on('all', function(type, event) {
        self.trigger(type, event);
    });
    this._subscribedIds.push(source, id);
    return this;
};

/**
 * Stop listening to events from an upstream events object.
 *
 * @method unsubscribe
 *
 * @param {EventHandler} source source events object
 * @return {EventHandler} this
 */
EventHandler.prototype.unsubscribe = function unsubscribe(source) {
    var index = this._subscribedIds.indexOf(source);
    if (!~index) {
        return this;
    }
    source.off('all', this._subscribedIds[index + 1]);
    this._subscribedIds.splice(index, 2);
    return this;
};

/**
 * Call event handlers with default context set to owner.
 *
 * @method bindThis
 *
 * @param {Object} context object this EventHandler belongs to
 */
EventHandler.prototype.bindThis = function bindThis(context) {
    this._owner = context;
};

module.exports = EventHandler;
