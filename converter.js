'use strict';

var ObjectUtils = require('./object');

/**
 * Converter
 *
 * Converts between 'sweet' (BEST timeline)
 * and 'salty' (visual timeline) representations
 * for easier interfacing of the two timelines.
 */

/**
 * Converts BEST timeline
 * to visual timeline representation.
 */
function sweetToSalty(sweetTimeline) {
    var saltyTimeline = {};

    var auto = sweetTimeline.auto || false;
    var speed = sweetTimeline.speed || 1;
    var repeat = sweetTimeline.repeat || 1;
    var duration = sweetTimeline.duration;

    var flexframes = processTimelineToNumbers(sweetTimeline).flexframes;

    if (!duration) {
        saltyTimeline.didInferDuration = true;
        duration = inferDuration(flexframes);
    }

    if (auto) saltyTimeline.auto = auto;
    if (speed) saltyTimeline.speed = speed;
    if (repeat) saltyTimeline.repeat = repeat;

    saltyTimeline.duration = duration * repeat;
    saltyTimeline.states = {};

    var states = saltyTimeline.states;

    for (var frame in flexframes) {
        var frameChange = flexframes[frame];

        for (var state in frameChange) {
            var stateChange = frameChange[state];

            states[state] = states[state] || [];

            var value = stateChange[0];
            var options = stateChange[1] || {};
            var curve = options.curve || 'linear';
            var meta = options.meta || {};

            saltyTimeline.states[state].push([Number(frame), value, curve, meta]);
        }
    }

    expandWithRepeat(saltyTimeline.states, repeat, duration);

    return saltyTimeline;
}

/**
 * Converts visual timeline
 * to BEST timeline representation.
 */
function saltyToSweet(saltyTimeline) {
    var sweetTimeline = {};

    var auto = saltyTimeline.auto || false;
    var speed = saltyTimeline.speed || 1;
    var repeat = saltyTimeline.repeat || 1;
    var duration = saltyTimeline.duration;

    var didInferDuration = saltyTimeline.didInferDuration || false;

    var states = saltyTimeline.states;

    if (auto) sweetTimeline.auto = auto;
    if (speed != 1) sweetTimeline.speed = speed;
    if (repeat != 1) sweetTimeline.repeat = repeat;

    if (duration && !didInferDuration) 
        sweetTimeline.duration = duration / repeat;

    sweetTimeline.flexframes = {};

    var flexframes = sweetTimeline.flexframes;

    for (var state in states) {
        var stateChange = states[state];
        var len = stateChange.length / repeat;

        if (repeat > 1) stateChange.splice(len, len * repeat);

        for (var i = 0; i < len; i++) {
            var change = stateChange[i];

            var value = change[1];
            var curve = change[2];
            var meta = change[3];
            var frame = meta.percent || change[0];

            flexframes[frame] = flexframes[frame] || {};

            var frameChange = flexframes[frame];
            frameChange[state] = frameChange[state] || [];

            frameChange[state].push(value, { curve: curve });
            if (curve == 'linear') frameChange[state].splice(1);
        }
    }

    return sweetTimeline;
}

/**
 * Helper function used to convert percent
 * flexframes to number flexframes while
 * maintaining consistent object order.
 * Makes it easier to translate sweet to
 * salty by adding a meta property with
 * the original flexframe percent.
 */
function processTimelineToNumbers(sweetTimeline) {
    var processedTimeline = {};

    var flexframes = sweetTimeline.flexframes;
    var duration = sweetTimeline.duration || inferDuration(flexframes);

    processedTimeline.flexframes = {};
    var processedFlexframes = processedTimeline.flexframes;

    for (var frame in flexframes) {
        var isFramePercent = isPercentage(frame);

        var processedFrame = isFramePercent ?
            percentToNumber(frame, duration) : frame;

        processedFlexframes[processedFrame] = ObjectUtils.clone(flexframes[frame]);

        var stateChange = processedFlexframes[processedFrame];

        for (var state in stateChange) {
            var change = stateChange[state];

            if (isFramePercent) {
                change[1] = change[1] || {};
                change[1].meta = { percent: frame };
            }
        }
    }
    return processedTimeline;
}

function expandWithRepeat(statesObject, repeat, duration) {
    for (var state in statesObject) {
        var keyframes = statesObject[state];
        var len = keyframes.length;

        var nextDuration = duration;

        for (var i = 0; i < repeat - 1; i++) {

            for (var j = 0; j < len; j++) {
                var frame = keyframes[j];
                keyframes.push([nextDuration + frame[0], frame[1], frame[2], frame[3]]);

                if (j == len - 1) nextDuration += frame[0];

            }

        }
    }
}

function inferDuration(flexframes) {
    var duration = 0;

    for (var flexframe in flexframes) {
        if (Number(flexframe) > duration) {
            duration = flexframe
        }
    }

    return duration;
}

/**
 * Helper function used to determine
 * if a flexframe is a percent or not.
 */
function isPercentage(string) {
    return string.split('%').length > 1;
}

/**
 * Helper function used to convert
 * percent flexframe to number flexframe.
 */
function percentToNumber(string, denominator) {
    return denominator * string.split('%')[0] / 100;
}

module.exports = {
    sweetToSalty: sweetToSalty,
    saltyToSweet: saltyToSweet
}
