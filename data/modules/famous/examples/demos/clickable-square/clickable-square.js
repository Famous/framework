BEST.module('famous:examples:clickable-square', {
    tree: 'clickable-square.html',
    behaviors: {
        '#context': {
            'size': [200, 200],
            'position': function(offset) {
                return [offset, offset]
            }
        },
        '#surface': {
            'template': function(count) { return { count: count }; },
            'style': {
                'background-color': 'gray',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#context': {
            'famous:events:click': function($state, $payload) {
                $state.set('count', $state.get('count') + 1);
                console.log('Click event on context: ', $payload);
            }
        },
        '$public': {
            'hello' : function() {
                console.log('hello!');
            }
        }
    },
    states: {
        count: 0,
        offset: 0
    }
});
