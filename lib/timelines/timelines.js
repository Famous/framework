'use strict';

var EventHandler = require('./../utilities/event-handler');

function Timelines(timelineGroups) {
    EventHandler.apply(this);
    this._timelineGroups = timelineGroups || {};
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

module.exports = Timelines;