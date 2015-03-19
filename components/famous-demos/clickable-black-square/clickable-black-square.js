BEST.component('famous-demos:clickable-black-square', {
    tree: 'clickable-black-square.html',

    behaviors: {
        '#context': {
            'size': [200, 200]
        },
        '#square': {
            'template': function(count) {
                return { count: count };
            },
            'style': {
                'background-color': 'black',
                'cursor': 'pointer',
                'color': 'white'
            },
            'unselectable': true
        }
    },

    events: {
        public: {
            'handle-click': function(state) {
                state.set('count', state.get('count') + 1);
            }
        }
    },

    states: {
        count: 0
    }
});
