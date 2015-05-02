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
    var duration = this._currentTimeline.duration;
    var convertedTimeline = converter.sweetToSalty(this._currentTimeline);

    var stateTimelines = convertedTimeline.states;

    // loops through each individual state timeline
    for (var state in stateTimelines) {
        var timeline = stateTimelines[state];

        for (var i = 0; i < timeline.length; i++) {
            var change = timeline[i];

            var value = change[1];
            var transition = { duration: change[0], curve: change[2] };

        }
    }

}

module.exports = Timelines;