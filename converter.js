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

    for (var selector in sweetTimeline) {
        var selectorBehaviors = sweetTimeline[selector];

        for (var behavior in selectorBehaviors) {
            var flexframes = selectorBehaviors[behavior];

            if (!saltyTimeline[behavior]) saltyTimeline[behavior] = [];

            for (var frame in flexframes) {
                var change = flexframes[frame];

                var time = Number(frame) || 0;
                var value = change.value || 0;
                var curve = change.curve || 'linear';

                saltyTimeline[behavior].push([time, value, curve]);
            }
        }
    }

    return saltyTimeline;
}

/**
 * Converts visual timeline
 * to BEST timeline representation.
 */
function saltyToSweet(saltyTimeline) {
    var sweetTimeline = {};
    return sweetTimeline;
}

module.exports = {
    sweetToSalty: sweetToSalty,
    saltyToSweet: saltyToSweet
}
