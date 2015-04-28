BEST.module('famous:tests:repeat-element', {
    tree: 'repeat-element.html',
    behaviors: {
        '#element': {
            style: {
                'background-color': 'black'
            }
        },
        '#view' : {
            'size': [100, 100],
            '$repeat': function(count) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        'position': [100, i*110 + 100]
                    });
                };
                return result;
            }
        }
    },
    events: {
        '$public': {
            'update-count': function($state, $payload) {
                $state.set('count', $payload);
            }
        }
    },
    states: {
        count: 3
    }
});
