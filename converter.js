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

            var name = selector + '|' + behavior;
            if (!saltyTimeline[name]) saltyTimeline[name] = [];

            for (var frame in flexframes) {
                var change = flexframes[frame];

                var time = Number(frame) || 0;
                var value = change.value || 0;
                var curve = change.curve || 'linear';

                saltyTimeline[name].push([time, value, curve]);
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

    for (var selectorBehavior in saltyTimeline) {
        var flexframes = saltyTimeline[selectorBehavior];

        var selector = selectorBehavior.split('|')[0];
        var behavior = selectorBehavior.split('|')[1];

        sweetTimeline[selector] = {};
        sweetTimeline[selector][behavior] = {};

        for (var i = 0; i < flexframes.length; i++) {
            var change = flexframes[i];

            var time = change[0];
            var value = change[1];
            var curve = change[2];

            sweetTimeline[selector][behavior][time] = {};
            sweetTimeline[selector][behavior][time].value = value;

            if (curve !== 'linear')
                sweetTimeline[selector][behavior][time].curve = curve;
        }
    }

    return sweetTimeline;
}

module.exports = {
    sweetToSalty: sweetToSalty,
    saltyToSweet: saltyToSweet
}
