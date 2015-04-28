BEST.module('famous:tests:messaging', {
    tree: 'messaging.html',
    behaviors: {
        '#view': {
            size: [100, 100]
        },
        '#element': {
            style: {
                border: '1px solid black'
            }
        }
    },
    events: {
        '$public' : {
            'send-message' : function($state, $payload) {
                $state.set('message', $payload);
            }
        }
    },
    states: {
        message: null
    }
});
