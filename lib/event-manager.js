/**
 * Provides an interface for communication between BEST nodes in a
 * BEST application. One instance is created per BEST node.
 */
function EventManager(stateManager, publicEvents) {
    this.stateManager = stateManager;
    this.publicEvents = publicEvents || {};
}

/**
 * Route the given message to a public event exposed by the BEST
 * node associated with this instance.
 */
EventManager.prototype.send = function(key, message) {
    if (this.publicEvents[key]) {
        this.publicEvents[key](this.stateManager, message);
    }
    else {
        console.warn('No public `' + key + '` event found');
    }
};

module.exports = EventManager;
