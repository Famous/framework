BEST.module('imtiaz.majeed:timeline:example', {
    behaviors: {
        '#wrapper': {
            'size': function(size) {
                return size;
            },
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#circle': {
            'style': function(borderSize, borderRadius) {
                return {
                    'background-color': 'whitesmoke',
                    'border': borderSize + 'px solid grey',
                    'text-align': 'center',
                    'line-height': '10',
                    'border-radius': borderRadius + '%',
                    'cursor': 'pointer',
                }
            },
            'unselectable': true
        },
        '#button': {
            'size': [200, 50],
            'position': [0, 250],
            'style': {
                'background-color': '#666',
                'color': 'white',
                'border-radius': '10px',
                'font-size': '20px',
                'font-weight': 'bold',
                'line-height': '2.3',
                'text-align': 'center',
                'cursor': 'pointer'
            }
        }
    },
    events: {
        '#circle': {
            'famous:events:click': function($timelines, $state, $payload) {
                $timelines.get('timeline1').start();
            }
        }
    },
    states: {
        size: [200, 200],
        borderRadius: 50,
        borderSize: 1,
    },
    timelines: {
        'timeline1': {
            duration: 10000,
            flexframes: {
                0: {
                    'size': [[200, 200]],
                    'borderRadius': [50],
                    'borderSize': [1]
                },
                '10%': {
                    'size': [[100, 100], {curve: 'outExpo'}],
                    'borderRadius': [20, {curve: 'outBounce'}],
                    'borderSize': [50, {curve: 'outBounce'}]
                },
                '20%': {
                    'size': [[300, 300], {curve: 'outBounce'}],
                    'borderSize': [3, {curve: 'easeInOut'}]
                },
                3000: {
                    'size': [[200, 200], {curve: 'easeInOut'}],
                    'borderRadius': [50, {curve: 'outExpo'}],
                    'borderSize': [1, {curve: 'outBounce'}]

                }
            }
        }
    },
    tree: 'example.html',
});