'use strict';

var EventHandler = require('./../utilities/event-handler');
var converter = require('best-timelineUI').converter;
// var TimelineHelper = require('./../utilities/TimelineHelper');

function Timelines(timelineGroups, states) {
    EventHandler.apply(this);

    this._timelineGroups = timelineGroups || {};
    this._states = states;

    this._currentTimeline = null;
    this._currentTimelineName = null;
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

Timelines.prototype.get = function get(timelineName) {;
    this._currentTimeline = this._timelineGroups[timelineName];
    this._currentTimelineName = timelineName;
    return this;
}

Timelines.prototype.start = function start() {
    var convertedTimeline = converter.sweetToSalty(this._currentTimeline);
    var stateTimelines = convertedTimeline.states;

    var state = '__' + this._currentTimelineName + 'Time'
    var duration = convertedTimeline.duration;

    // set time state of timeline equal to duration
    this._states.set(state, duration, {duration: duration});

    // loops through each individual state timeline
    for (var state in stateTimelines) {
        var timeline = stateTimelines[state];
    }
}

module.exports = Timelines;