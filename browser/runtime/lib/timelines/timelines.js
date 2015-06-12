'use strict';

/*global FamousFramework*/

var EventHandler = require('./../utilities/event-handler');

var converter = require('./../../../utilities/converter');
var toSalty = converter.sweetToSalty;

function Timelines(timelineGroups, states) {
    EventHandler.apply(this);

    this._timelineGroups = timelineGroups || {};
    this._states = states;

    this._currName = null;
    this._currTimeline = null;

    this._cue = { index: null, timelines: null };
    this._pausedTimelines = {};
}

Timelines.prototype = Object.create(EventHandler.prototype);
Timelines.prototype.constructor = Timelines;

Timelines.prototype._createBehaviors = function _createBehaviors(timelineDeclaration, duration) {
    for (var timelineName in this._timelineGroups) {
        var behaviorGroup = this._timelineGroups[timelineName];

        if (this._currName === timelineName) {
            var time = '__' + timelineName + 'Time';
            var saltyTimeline = toSalty(behaviorGroup, {duration: duration});
            var durationEnded = false;

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
                    var value = FamousFramework.helpers.piecewise(timeline)(time);
                    definition.action = value;
                    this._states.emit('behavior-update', definition);
                    if (this._currCallback && !durationEnded && time === duration) {
                        durationEnded = true;
                        this._currCallback();
                    }
                }.bind(this, definition, timeline));
            }
        }
    }
};

Timelines.prototype.getBehaviors = function getBehaviors() {
    return this._behaviorList || {};
};

/**
 * Retrieve a Timeline and prepare it for playing.
 * @method  get
 * @param   {String}  timelineName  The name of the Timeline to get.
 * @return  {Timelines}  An instance of this Timelines object.
 */
Timelines.prototype.get = function get(timelineName) {
    this._currTimeline = this._timelineGroups[timelineName];

    this._currName = timelineName;
    this._currStateName = '__' + timelineName + 'Time';

    return this;
};

/**
 * Cue up an array of Timelines that will play in sequence.
 *
 * Each element in the array is a new Array that represents
 * the arguments to be passed to Timelines.start() function.
 *
 * @example
 *     $timelines.cue([
 *         [ 'animation-1', {duration: 1800}, function timelineCallback() { console.log('animation-1 complete'); } ],
 *         [ 'animation-2', {duration: 2800} ]
 *     ], function cueCallback() {
 *         console.log('All animations complete!');
 *     }).startCue();
 *
 * @method  cue
 * @param   {Array}      timelines  An array of Timelines that will play one after another.
 * @param   {Function}   callback   Callback function to call when all timelines have completed.
 * @return  {Timelines}  An instance of this Timelines object.
 */
Timelines.prototype.cue = function cue(timelines, callback) {
    this._cue = {
        index: -1,
        timelines: timelines,
        callback: callback
    };
    return this;
};

/**
 * Starts the cue of Timelines from the beginning.
 * @method  startCue
 * @return  {Timelines}  An instance of this Timelines object.
 */
Timelines.prototype.startCue = function startCue() {
    this._cue.index = -1;
    this.halt();
    this.nextInCue();
};

/**
 * Play the next Timeline in the cue.
 *
 * Once the end of the cue has been reached call the optional callback
 * if it exists.
 *
 * @method  nextInCue
 * @return  {Timelines}  An instance of this Timelines object.
 */
Timelines.prototype.nextInCue = function nextInCue() {
    this._cue.index++;
    if (this._cue.index >= this._cue.timelines.length) {
        if (this._cue.callback) this._cue.callback();
        this._cue.index = -1;
        this._cue.timelines = null;
        this._cue.callback = null;
    }
    else {
        var currTimeline = this._cue.timelines[this._cue.index];
        this.get(currTimeline[0]);
        this.start(currTimeline[1], function() {
            if (typeof currTimeline[2] === 'function') currTimeline[2]();
            this.nextInCue();
        }.bind(this));
    }
    return this;
};

/**
 * Start a the currently selected Timelines animation.
 * @method  start
 * @param   {Number}     options.speed     The speed of the animation which the duration is divided by.
 * @param   {Number}     options.duration  The duration of the animation.
 * @param   {Function}   callback          Callback function to call when the Timeline has completed.
 * @return  {Timelines}  An instance of this Timelines object.
 */
Timelines.prototype.start = function start(options, callback) {
    options = options || {};
    var speed = options.speed || 1;
    var duration = options.duration || 0;
    var transition = {duration: duration / speed};

    this._currCallback = callback;

    // TODO: consider unsubscribing state from the previous active timeline
    this._createBehaviors(this._currTimeline, duration);

    this._states.set(this._currStateName, 0);

    this._states.set(this._currStateName, duration, transition);
    this._setPaused(this._currName, false);

    return this;
};

Timelines.prototype.halt = function halt() {
    if (this._currStateName) {
        var timeElapsed = this._states.get(this._currStateName);

        // duration is needed until all states are stored in Transitionables
        this._states.set(this._currStateName, timeElapsed, {duration: 0});
        this._setPaused(this._currName, true);
    }

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

                if (!definitionBehavior) {
                    behaviors[selector][behavior] = timelineBehavior;
                }
                /* decide on injected timelineArgument api */
            }
        }
    }

    return behaviors;
};

module.exports = Timelines;
