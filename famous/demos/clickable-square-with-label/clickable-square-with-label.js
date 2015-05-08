BEST.module('famous:demos:clickable-square-with-label', 'HEAD', {
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
        '#square': {
            'famous:events:click': function($state) {
                $state.set('count', $state.get('count') + 1);
            }
        },
        '$public': {
            'change-color': function($state, $payload) {
                $state.set('backgroundColor', $payload);
            },
            'position': function($state, $payload) {
                $state.set('position', $payload);
            }
        }
    },
    states: {
        count: 0,
        backgroundColor: 'gray',
        position: [0, 0, 0]
    }
});
