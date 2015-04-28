BEST.module('famous:physics:bodies:box < famous:physics:bodies:particle', {
    behaviors: {
        '$self': {
            'famous:physics:size': function(size) {
                return size;
            }
        }
    },
    events: {
        '$public': {
            'size': function($state, $payload) {
                $state.set('size', $payload);
            }
        }
    },
    states: {
        'size': [0,0,0]
    }
});
