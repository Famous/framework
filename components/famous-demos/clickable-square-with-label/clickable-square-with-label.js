BEST.component('famous-demos:clickable-square-with-label', {
    tree: 'clickable-square-with-label.html',

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
                    'color': 'black',
                    'border': '2px solid black'
                };
            },
            'unselectable': true
        },
        '#square-view' : {
            'position': [0, 25, 0]
        },
        '#label-view': {
            'size': [200, 25],
            '$yield': true
        },
        '#label' : {
            style : {
                'color': 'black',
                'fontSize': '10px'
            }
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
        backgroundColor: 'gray',
        position: [0, 0, 0]
    }
});
