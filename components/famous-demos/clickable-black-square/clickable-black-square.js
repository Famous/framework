BEST.component('famous-demos:clickable-black-square', {
    tree: 'clickable-black-square.html',

    behaviors: {
        '#context': {
            'size': [200, 200],
            'position': function(position) {
                return position;
            }
        },
        '#square': {
            'template': function(count) {
                return { count: count };
            },
            'style': function(backgroundColor) {
                return {
                    'background-color': backgroundColor,
                    'cursor': 'pointer',
                    'color': 'white'
                };
            },
            'unselectable': true
        }
    },

    events: {
        public: {
            'handle-click': function(state) {
                state.set('count', state.get('count') + 1);
            },
            'change-color': function(state, message) {
                state.set('backgroundColor', message);
            },
            'position': function(state, message) {
                state.set('position', message);
            }
        }
    },

    states: {
        count: 0,
        backgroundColor: 'black',
        position: [0, 0, 0]
    }
});
