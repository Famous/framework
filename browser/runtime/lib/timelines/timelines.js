'use strict';

/*global BEST*/

var EventHandler = require('./../utilities/event-handler');

var converter = require('./../../../utilities/converter');
var toSalty = converter.sweetToSalty;

function Timelines(timelineGroups, states) {
    EventHandler.apply(this);

    this._timelineGroups = timelineGroups || {};
    this._states = states;

    this._currName = null;
    this._currTimeline = null;

    this._pausedTimelines = {};
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

Timelines.prototype._createBehaviors = function _createBehaviors(timelineDeclaration, duration) {
    for (var timelineName in this._timelineGroups) {
        var behaviorGroup = this._timelineGroups[timelineName];

        var time = '__' + timelineName + 'Time';
        var saltyTimeline = toSalty(behaviorGroup, {duration: duration});

        for (var selectorBehavior in saltyTimeline) {
            var timeline = saltyTimeline[selectorBehavior];

            var selectorName = selectorBehavior.split('|')[0];
            var behaviorName = selectorBehavior.split('|')[1];

            var definition = {
                timeName: time,
                selector: selectorName,
                name: behaviorName,
                params: []
            };

            this._states.subscribeTo(time, function(definition, timeline) {
                var time = this._states.get(definition.timeName);
                var value = BEST.helpers.piecewise(timeline)(time);
                definition.action = value;
                this._states.emit('behavior-update', definition);
            }.bind(this, definition, timeline));
        }
    }
};

Timelines.prototype.getBehaviors = function getBehaviors() {
    return this._behaviorList || {};
};

Timelines.prototype.get = function get(timelineName) {
    this._currTimeline = this._timelineGroups[timelineName];

    this._currName = timelineName;
    this._currStateName = '__' + timelineName + 'Time';

    return this;
};

Timelines.prototype.start = function start(options) {
    options = options || {};
    var speed = options.speed || 1;
    var duration = options.duration || 0;
    var transition = {duration: duration / speed};

    // TODO: consider unsubscribing state from the previous active timeline
    this._createBehaviors(this._currTimeline, duration);

    this._states.set(this._currStateName, 0);

    this._states.set(this._currStateName, duration, transition);
    this._setPaused(this._currName, false);

    return this;
};

Timelines.prototype.halt = function halt() {
    var timeElapsed = this._states.get(this._currStateName);

    // duration is needed until all states are stored in Transitionables
    this._states.set(this._currStateName, timeElapsed, {duration: 0});
    this._setPaused(this._currName, true);

    return this;
};

Timelines.prototype.resume = function resume() {
    var speed = this._currSpeed;
    var totalTime = this._currDuration;
    var timeElapsed = this._states.get(this._currStateName);

    var timeLeft = totalTime - timeElapsed;

    this._states.set(this._currStateName, totalTime, {duration: timeLeft / speed});
    this._setPaused(this._currName, false);

    return this;
};

Timelines.prototype.rewind = function rewind() {
    var speed = this._currSpeed;
    var timeElapsed = this._states.get(this._currStateName);
    var transition = {duration: timeElapsed / speed};

    this._states.set(this._currStateName, 0, transition);
    this._setPaused(this._currName, false);

    return this;
};

Timelines.prototype.isPaused = function isPaused() {
    return this._pausedTimelines[this._currName] || false;
};

Timelines.prototype._setPaused = function _setPaused(timelineName, bool) {
    this._pausedTimelines[timelineName] = bool;
};

Timelines.mergeBehaviors = function(definitionBehaviors, timelineBehaviors) {
    var behaviors = definitionBehaviors;

    for (var selector in timelineBehaviors) {
        var timelineSelector = timelineBehaviors[selector];
        var definitionSelector = definitionBehaviors[selector];

        if (definitionSelector) {
            for (var behavior in timelineSelector) {
                var timelineBehavior = timelineSelector[behavior];
                var definitionBehavior = definitionSelector[behavior];

                if (definitionBehavior) {
                    /* decide on injected timelineArgument api */
                }
                else {
                    behaviors[selector][behavior] = timelineBehavior;
                }
            }
        }
    }

    return behaviors;
};

module.exports = Timelines;
