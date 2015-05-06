'use strict';

var FamousConnector = require('./../famous-connector/famous-connector');
var Curves = FamousConnector.Curves;

var linear = function(x) {
    return x;
};

var ADD = 'ADD';
var SUBTRACT = 'SUBTRACT';
var MULTIPLY = 'MULTIPLY';

var operations = {
    ADD: function(a, b) {
        return a + b;
    },
    SUBTRACT: function(a, b) {
        return a - b;
    },
    MULTIPLY: function(a, b) {
        return a * b;
    }
};

function polymorphicOperation(operationName, a, b) {
    if (typeof a === 'number') {
        return operations[operationName](a, b);
    }
    else {
        var isArray = Array.isArray(b);
        return a.map(function(value, i) {
            return operations[operationName](value, isArray ? b[i] : b);
        });
    }
}

function scale(time, easingCurve, t1, t2, v1, v2) {
    var standardizedTime = (time - t1) / (t2 - t1); // value from 0 to 1
    var timeScale = easingCurve(standardizedTime); // adjusted with easing curve

    var valueSpan = polymorphicOperation(SUBTRACT, v2, v1);
    var valueProgess = polymorphicOperation(MULTIPLY, valueSpan, timeScale);
    var value = polymorphicOperation(ADD, valueProgess, v1);
    return value;
}

// Store timeline by UID
var timelines = {};

function piecewise(points) {
    var timelineUID = JSON.stringify(points);

    if (timelines[timelineUID]) {
        return timelines[timelineUID];
    }
    else {
        timelines[timelineUID] = function(t) {
            if (t <= points[0][0]) {
                return points[0][1];
            }
            else {
                for (var i = 0; i < points.length - 1; i++) {
                    if (points[i][0] <= t && t < points[i + 1][0]) {
                        return scale(
                            t,
                            Curves[points[i][2]] || linear,
                            points[i][0],
                            points[i + 1][0],
                            points[i][1],
                            points[i + 1][1]
                        );
                    }
                }
            }
            return points[points.length - 1][1];
        };
        return timelines[timelineUID];
    }
}

module.exports = piecewise;
