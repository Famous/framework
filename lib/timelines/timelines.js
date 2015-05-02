'use strict';

var EventHandler = require('./../utilities/event-handler');
var converter = require('best-timelineUI').converter;
var timelineHelper = require('./../helpers/helpers').timelineHelper;

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
    var duration = this._currentTimeline.duration;
    var convertedTimeline = converter.sweetToSalty(this._currentTimeline);

    var stateTimelines = convertedTimeline.states;

    var timelineStateName = '__' + this._currentTimelineName + 'Time';

    this._states.set(timelineStateName, 0);
    this._states.set(timelineStateName, duration, { duration: duration});

    // loops through each individual state timeline
    for (var state in stateTimelines) {
        var timeline = stateTimelines[state];
        var valueFunction = timelineHelper(timeline);

        for (var i = 0; i < timeline.length; i++) {
            (function(state, valueFunction) {
                this._states.subscribeTo(timelineStateName, function(key, time) {
                    this._states.set(state, valueFunction(time));
                }.bind(this));
            }.bind(this))(state, valueFunction);
        }
    }

}

module.exports = Timelines;