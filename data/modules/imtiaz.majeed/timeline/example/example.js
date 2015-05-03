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
        '#button': {
            'famous:events:click': function($timelines, $state) {
                var flag = $state.get('flag');

                if (flag) {
                    $timelines.get('timeline2').halt();
                    $timelines.get('timeline1').start();
                }
                else {
                    $timelines.get('timeline1').halt();
                    $timelines.get('timeline2').start();
                }

                $state.set('flag', !flag);
            }
        }
    },
    states: {
        size: [200, 200],
        borderRadius: 50,
        borderSize: 1,
        flag: true
    },
    timelines: {
        'timeline1': {
            duration: 10000,
            flexframes: {
                0: {
                    'size': [[200, 200], {curve: 'outBounce'}],
                    'borderRadius': [50, {curve: 'outBounce'}],
                    'borderSize': [1, {curve: 'outBounce'}]
                },
                '10%': {
                    'size': [[100, 100], {curve: 'outBounce'}],
                    'borderRadius': [20, {curve: 'outBounce'}],
                    'borderSize': [50, {curve: 'outBounce'}]
                },
                '20%': {
                    'size': [[300, 300], {curve: 'outBounce'}],
                    'borderSize': [3, {curve: 'outBounce'}]
                },
                3000: {
                    'size': [[200, 200]],
                    'borderRadius': [50],
                    'borderSize': [1]
                }
            }
        },
        'timeline2': {
            duration: 1000,
            flexframes: {
                0: {
                    'size': [[200, 200], {curve: 'outBounce'}],
                },
                '50%': {
                    'size': [[100, 100], {curve: 'outBounce'}]
                },
                1000: {
                    'size': [[200, 200]]
                }
            }
        }
    },
    tree: 'example.html',
});