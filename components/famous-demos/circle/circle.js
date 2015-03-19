BEST.component('famous-demos:circle', {
    tree: 'circle.html',
    behaviors: {
        '#wrapper': {
            'size': function(radius) {
                return [radius, radius];
            },
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#circle-header': {
            'style': {
                'color': 'black',
                'font-weight': 'bold',
                'font-family': 'Arial',
                'text-align': 'center',
                'font-size': '30px'
            }
        },

        '#circle-surface': {
            'style': {
                'border-radius': '50%',
                'background-color': '#666',
                'margin-top': '36px',
                'cursor' : 'pointer'
            },
            'unselectable': true
        },
        '#circle-label': {
            'size' : function() {
                return [150, 20];
            },
            position: [0, 0, 25],
            align: [0.5, 0.35],
            'mount-point': [0.5, 0.5],
            '$yield': true
        },
        '.circle-label-surface' : {
            'style' : {
                'color': 'white',
                'font-weight': 'bold',
                'font-family': 'monospace',
                'text-align': 'center',
                'font-size' : '20px',
                'cursor' : 'pointer',
                'z-index': 5
            },
            'unselectable': true
        }
    },
    events: {
        public: {
            'handle-click': function(state, message) {
                state.setState('radius', state.getState('radius') + 50, {duration: 1000, curve: 'outBounce'});
            }
        }
    },
    states: {
        radius: 200
    }
});
