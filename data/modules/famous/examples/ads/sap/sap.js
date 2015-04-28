BEST.module('famous:examples:ads:sap', {
    tree: 'sap.html',
    behaviors: {
        '#ad-container': {
            'size': function(adSize) {
                return adSize;
            },
        },
        '#part-one-container': {
            'position': function(time, partOnePosition) {
                return BEST.helpers.timeline([
                    [0,     partOnePosition],
                    [3500,  partOnePosition, 'easeOut'],
                    [4000,  [-150, 0, 0]]
                ])(time);
            },
        },
        '#part-one-component': {
            'start-one': function(time) {
                return BEST.helpers.timeline([
                    [0,     1],
                    [3500,  0]
                ])(time);
            }
        },
        '#part-two-container': {
            'position': function(time, partTwoPosition) {
                return BEST.helpers.timeline([
                    [0,     partTwoPosition],
                    [3500,  partTwoPosition, 'easeOut'],
                    [4000,  [0, 0, 0]]
                ])(time);
            }
        },
        '#part-two-component': {
            'start-two': function(time) {
                return BEST.helpers.timeline([
                    [0,     0],
                    [3500,  1]
                ])(time);
            }
        },
        '#start-button-container': {
            'position': function(startButtonPosition) {
                return startButtonPosition;
            },
            'size': function(startButtonSize) {
                return startButtonSize;
            }
        },
        '#start-button': {
            'style': {
                'cursor': 'pointer',
                'background-color': '#666',
                'color': 'whitesmoke',
                'font-weight': 'bold',
                'font-size': '18px',
                'text-align': 'center'
            },
            'unselectable': true
        },
        '$self': {
            '$self:startAd' : function(startAd) {
                return true;
            }
        },
    },

    events: {
        public: {},
        handlers: {
            'startAd' : function($state, $payload) {
                $state.set('time', 5500, {duration: 5500});
            }
        }
    },
    states: {
        adSize: [300, 600],
        partOnePosition: [0, 0, 0],
        partTwoPosition: [150, 0, 0],
        startButtonPosition: [0, 600, 0],
        startButtonSize: [80, 30],
        _partOneStart: '',
        _partTwoStart: '',
        time: 0,
        startAd: false
    }
});
