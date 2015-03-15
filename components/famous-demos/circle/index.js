BEST.component('famous-demos:circle', {
    tree: 'circle.html',
    behaviors: {
        '$self': {
            'famous:control-flow:yield': function($surrogates) {
                return $surrogates;
            }
        },
        '#wrapper': {
            'size': function(radius) {
                return [radius, radius];
            },
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5]
        },
        '#surface': {
            'style': {
                'color': 'white',
                'font-weight': 'bold',
                'font-family': 'monospace',
                'border-radius': '50%',
                'background-color': '#666',
                'text-align': 'center'
            },
            'unselectable': true
        }
    },
    events: {
        public: {
            'handle-click': function(state, message) {
                state.setState('radius', state.getState('radius') + 5);
            }
        }
    },
    states: {
        radius: 200,
    }
});
