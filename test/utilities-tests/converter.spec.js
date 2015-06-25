'use strict';

var test = require('tape');

var converter = require('./../../lib/utilities/converter');

var toSalty = converter.sweetToSalty;
var toSweet = converter.saltyToSweet;

var sweetTimeline = {
    '#pen': {
        'position': {
            '0%'    : { value: [0, 0, 0], curve: 'outExpo' },
            '100%'  : { value: [1, 1, 1] }
        },
        'size': {
            '0%'     : { value: [0, 0], curve: 'outExpo' },
            '50%'   : { value: [9, 9] }
        }
    }
};

var saltyTimeline = {
    '#pen|position': [
        [0,     [0, 0, 0],  'outExpo'],
        [1000,  [1, 1, 1],  'linear']
    ],
    '#pen|size': [
        [0,     [0, 0],  'outExpo'],
        [500,   [9, 9],  'linear']
    ]
};

test('convert between timeline representations', function(t) {
    t.plan(2);

    var options = { duration: 1000 };

    var actualSaltyTimeline = toSalty(sweetTimeline, options);
    t.deepEqual(actualSaltyTimeline, saltyTimeline, 'should convert sweet to salty');

    var actualySweetTimeline = toSweet(saltyTimeline, options);
    t.deepEqual(actualySweetTimeline, sweetTimeline, 'should convert salty to sweet');
});

