BEST.module('famous:examples:demos:clickable-square', {
    tree: 'clickable-square.html',
    behaviors: {
        '#context': {
            'size': [200, 200]
        },
        '#surface': {
            'template': function(count) {
                return { count: count };
            },
            'style': {
                'background-color': 'gray',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#surface': {
            'famous:events:click': function($state) {
                $state.set('count', $state.get('count') + 1);
            }
        }
    },
    states: {
        count: 0
    }
});
