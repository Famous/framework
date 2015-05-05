'use strict';

var EventHandler = require('./../utilities/event-handler');
var converter = require('best-timelineUI').converter;
var timelineHelper = require('./../helpers/helpers').timeline;

function Timelines(timelineGroups, states) {
    EventHandler.apply(this);

    this._timelineGroups = timelineGroups || {};
    this._states = states;

    this._currName = null;
    this._currTimeline = null;

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
    this._currTimeline = converter.sweetToSalty(this._timelineGroups[timelineName]);

    this._currSpeed = this._currTimeline.speed;
    this._currRepeat = this._currTimeline.repeat;
    this._currDuration = this._currTimeline.duration;

    this._currName = timelineName;
    this._currStateName = '__' + timelineName + 'Time';

    return this;
}

Timelines.prototype.start = function start() {
    var speed = this._currSpeed;
    var duration = this._currDuration;
    var transition = {duration: duration / speed};

    // var convertedTimeline = converter.sweetToSalty(this._currTimeline);
    var stateTimelines = this._currTimeline.states;

    this._states.set(this._currStateName, 0);

    this._states.set(this._currStateName, duration, transition);
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

    return this;
}

Timelines.prototype.halt = function halt() {
    var timeElapsed = this._states.get(this._currStateName);

    // duration is needed until all states are stored in Transitionables
    this._states.set(this._currStateName, timeElapsed, {duration: 0});
    this._setPaused(this._currName, true);

    return this;
}

Timelines.prototype.resume = function resume() {
    var speed = this._currSpeed;
    var totalTime = this._currDuration;
    var timeElapsed = this._states.get(this._currStateName);

    var timeLeft = totalTime - timeElapsed;
    var transition = {duration: timeLeft / speed};

    this._states.set(this._currStateName, totalTime, {duration: timeLeft / speed});
    this._setPaused(this._currName, false);

    return this;
}

Timelines.prototype.rewind = function rewind() {
    var speed = this._currSpeed;
    var timeElapsed = this._states.get(this._currStateName);
    var transition = {duration: timeElapsed / speed};

    this._states.set(this._currStateName, 0, transition);
    this._setPaused(this._currName, false);

    return this;
}

Timelines.prototype.isPaused = function isPaused() {
    return this._pausedTimelines[this._currName] || false;
}

Timelines.prototype._setPaused = function _setPaused(timelineName, bool) {
    this._pausedTimelines[timelineName] = bool;
}

module.exports = Timelines;