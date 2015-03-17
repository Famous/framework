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
                'color': 'white',
                'font-weight': 'bold',
                'font-family': 'monospace',
                'border-radius': '50%',
                'background-color': '#666',
                'text-align': 'center',
                'margin-top': '36px'
            },
            'unselectable': true
        },
        '#label' : {
            'yield' : function(_surrogates) {
                return _surrogates;
            }
        }
    },
    events: {
        public: {
            'handle-click': function(state, message) {
                state.setState('radius', state.getState('radius') + 5);
            },
            'yield' : function(state, _surrogates) {
                state.set('_surrogates', _surrogates);
            }
        }
    },
    states: {
        radius: 200
    }
});
