'use strict';

var EventHandler = require('./../utilities/event-handler');
// var TimelineHelper = require('./../utilities/TimelineHelper');

function Timelines(timelineGroups) {
    EventHandler.apply(this);
    this._timelineGroups = timelineGroups || {};
    this._currentTimeline = null;
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

Timelines.prototype.get = function(timelineName) {
    this._currentTimeline = timelineName;
    return this;
}

Timelines.prototype.start = function() {
    console.log(this._currentTimeline, 'starting...');
}

module.exports = Timelines;