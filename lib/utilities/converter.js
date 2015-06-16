'use strict';

/**
 * Converter
 *
 * Converts between 'sweet' (FamousFramework timeline)
 * and 'salty' (piecewise timeline) representations
 * for easier interfacing of the two timelines.
 */

/**
 * Converts FamousFramework timeline
 * to piecewise timeline representation.
 */
function sweetToSalty(sweetTimeline, options) {
    var saltyTimeline = {};

    options = options || {};
    var duration = options.duration || 0;

    for (var selector in sweetTimeline) {
        var selectorBehaviors = sweetTimeline[selector];

        for (var behavior in selectorBehaviors) {
            var flexframes = selectorBehaviors[behavior];

            var name = selector + '|' + behavior;
            if (!saltyTimeline[name]) saltyTimeline[name] = [];

            for (var frame in flexframes) {
                var change = flexframes[frame];

                var time = percentToNumber(frame, duration) || 0;
                var value = change.value || 0;
                var curve = change.curve || 'linear';

                saltyTimeline[name].push([time, value, curve]);
            }
        }
    }

    return saltyTimeline;
}

/**
 * Converts piecewise timeline
 * to FamousFramework timeline representation.
 */
function saltyToSweet(saltyTimeline, options) {
    var sweetTimeline = {};

    options = options || {};
    var duration = options.duration || 5000;

    for (var selectorBehavior in saltyTimeline) {
        var flexframes = saltyTimeline[selectorBehavior];

        var selector = selectorBehavior.split('|')[0];
        var behavior = selectorBehavior.split('|')[1];

        if (!sweetTimeline[selector]) sweetTimeline[selector] = {};
        sweetTimeline[selector][behavior] = {};

        for (var i = 0; i < flexframes.length; i++) {
            var change = flexframes[i];

            var time = numberToPercent(change[0], duration);
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

function percentToNumber(percentStr, total) {
    return (percentStr.split('%')[0] / 100) * total;
}

function numberToPercent(number, total) {
    return (number / total * 100) + '%';
}

module.exports = {
    sweetToSalty: sweetToSalty,
    saltyToSweet: saltyToSweet
};
