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
            'style': {
                'background-color': 'whitesmoke',
                'border': '1px solid grey',
                'text-align': 'center',
                'line-height': '10',
                'border-radius': '50%',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#circle': {
            'famous:events:click': function($payload) {
                console.log('click event captured');
                //$timelines.get('timeline1').start();
            }
        }
    },
    states: {
        size: [200, 200]
    },
    timelines: {
        'timeline1': {
            duration: 3000,
            flexframes: {
                '10%': {
                    'size': [[100, 100], {curve: 'outExpo'}]
                },
                '20%': {
                    'size': [[300, 300], {curve: 'outBounce'}]
                },
                3000: {
                    'size': [[200, 200], {curve: 'easeInOut'}]
                }
            }
        }
    },
    tree: 'example.html',
});