'use strict';

var EventHandler = require('./../utilities/event-handler');
var converter = require('best-timelineUI').converter;
var timelineHelper = require('./../helpers/helpers').timeline;

function Timelines(timelineGroups, states) {
    EventHandler.apply(this);

    this._timelineGroups = timelineGroups || {};
    this._states = states;

    this._currTimeline = null;
    this._currName = null;

    this._pausedTimelines = {};

    this._startAutoTimelines();
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

Timelines.prototype._startAutoTimelines = function _startAutoTimelines() {
    for (var timeline in this._timelineGroups) {
        if (this._timelineGroups[timeline].auto) {
            this.get(timeline).start();
        }
    }
}

Timelines.prototype.get = function get(timelineName) {
    this._currTimeline = this._timelineGroups[timelineName];

    this._currName = timelineName;
    this._currStateName = '__' + timelineName + 'Time';

    return this;
}

Timelines.prototype.start = function start() {
    var duration = this._currTimeline.duration;
    var convertedTimeline = converter.sweetToSalty(this._currTimeline);

    var stateTimelines = convertedTimeline.states;

    this._states.set(this._currStateName, 0);
    this._states.set(this._currStateName, duration, { duration: duration});

    this._setPaused(this._currName, false);

    // loops through each individual state timeline
    for (var state in stateTimelines) {
        var timeline = stateTimelines[state];
        var valueFunction = timelineHelper(timeline);

        (function(state, valueFunction) {
            this._states.subscribeTo(this._currStateName, function(key, time) {
                this._states.set(state, valueFunction(time));
            }.bind(this));
        }.bind(this))(state, valueFunction);
    }

}

Timelines.prototype.halt = function halt() {
    var currTimelineTime = this._states.get(this._currStateName);

    // duration is needed until all states are stored in Transitionables
    this._states.set(this._currStateName, currTimelineTime, {duration:0});

    this._setPaused(this._currName, true);
}

Timelines.prototype.resume = function resume() {
    var time = this._timelineGroups[this._currName].duration;
    var timeLeft = time - this._states.get(this._currStateName);

    this._states.set(this._currStateName, time, {duration: timeLeft});

    this._setPaused(this._currName, false);
}

Timelines.prototype.rewind = function rewind() {
    var timeElapsed = this._states.get(this._currStateName);

    this._states.set(this._currStateName, 0, {duration: timeElapsed});

    this._setPaused(this._currName, false);
}

Timelines.prototype.isPaused = function isPaused() {
    return this._pausedTimelines[this._currName] || false;
}

Timelines.prototype._setPaused = function _setPaused(timelineName, bool) {
    this._pausedTimelines[timelineName] = bool;
}

module.exports = Timelines;