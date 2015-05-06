'use strict';

var test = require('tape');

var converter = require('../lib/helpers/helpers').converter;

var toSalty = converter.sweetToSalty;
var toSweet = converter.saltyToSweet;

var sweetTimeline = {
    auto: true,
    duration: 10000,
    flexframes: {
        0: {
            'position': [[0, 0]]
        },
        '10%': {
            'position': [[100, 100], { curve: 'outExpo' }]
        },
        '20%': {
            'position': [[100, 100]]
        },
        3000: {
            'position': [[0, 0], { curve: 'spring' }]
        }
    }
}

var saltyTimeline = {
    auto: true,
    duration: 10000,
    speed: 1,
    repeat: 1,
    states: {
        'position': [
            [0,     [0,0],      'linear',    {}],
            [1000,  [100, 100], 'outExpo',   { percent: '10%' }],
            [2000,  [100, 100], 'linear',    { percent: '20%' }],
            [3000,  [0, 0],     'spring',    {}]
        ]
    }
}

test('convert between timeline representations', function(t) {
    t.plan(2);

    var actualSaltyTimeline = toSalty(sweetTimeline);
    t.deepEqual(actualSaltyTimeline, saltyTimeline, 'should convert sweet to salty');

    var actualSweetTimeline = toSweet(saltyTimeline);
    t.deepEqual(actualSweetTimeline, sweetTimeline, 'should convert salty to sweet');
});


var sweetTimeline2 = {
    repeat: 2,
    duration: 1000,
    flexframes: {
        0: {
            'width': [10, {curve: 'outBounce'}],
            'height': [5, {curve: 'outBounce'}]
        },
        500: {
            'width': [20, {curve: 'outBounce'}],
            'height': [10, {curve: 'outBounce'}]
        },
        1000: {
            'width': [50],
            'height': [25]
        }
    }
}

var saltyTimeline2 = {
    repeat: 2,
    speed: 1,
    duration: 2000,
    states: {
        'width': [
            [0,     10,     'outBounce',    {}],
            [500,   20,     'outBounce',    {}],
            [1000,  50,     'linear',       {}],
            [1000,  10,     'outBounce',    {}],
            [1500,  20,     'outBounce',    {}],
            [2000,  50,     'linear',       {}]
        ],
        'height': [
            [0,     5,      'outBounce',    {}],
            [500,   10,     'outBounce',    {}],
            [1000,  25,     'linear',       {}],
            [1000,  5,      'outBounce',    {}],
            [1500,  10,     'outBounce',    {}],
            [2000,  25,     'linear',       {}]
        ]
    }
}

test('converts repeat into expanded keyframes', function(t) {
    t.plan(2);

    var actualSaltyTimeline2 = toSalty(sweetTimeline2);
    t.deepEqual(actualSaltyTimeline2, saltyTimeline2, 'should convert sweet to salty');

    var actualSweetTimeline2 = toSweet(saltyTimeline2);
    t.deepEqual(actualSweetTimeline2, sweetTimeline2, 'should convert salty to sweet');

})

var sweetTimeline3 = {
    flexframes: {
        0: {
            'size': [[50, 50]]
        },
        1000: {
            'size': [[100, 100], {curve: 'inExpo'}]
        }
    }
}

var saltyTimeline3 = {
    repeat: 1,
    speed: 1,
    didInferDuration: true,
    duration: 1000,
    states: {
        'size': [
            [0,     [50, 50],   'linear',   {}],
            [1000,  [100, 100], 'inExpo',   {}]
        ]
    }
}

test('infers duration when no duration is given', function(t) {
    t.plan(2);

    var actualSaltyTimeline3 = toSalty(sweetTimeline3);
    t.deepEqual(actualSaltyTimeline3, saltyTimeline3);

    var actualSweetTimeline3 = toSweet(saltyTimeline3);
    t.deepEqual(actualSweetTimeline3, sweetTimeline3);
});
