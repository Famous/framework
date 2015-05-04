BEST.module('famous:examples:demos:clickable-square', {
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
            'style' : function(backgroundColor) {
                return {
                    'background-color' : backgroundColor,
                    'cursor' : 'pointer'
                }
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
            },
            'background-color' : 'setter|camel'
        }
    },
    states: {
        count: 0,
        offset: 0,
        backgroundColor: 'gray'
    }
});
