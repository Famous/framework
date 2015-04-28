BEST.module('famous:physics:bodies:wall < famous:physics:bodies:particle', {
    behaviors: {
        '$self': {
            'famous:physics:direction': function(direction) {
                return direction;
            }
        }
    },
    events: {
        '$public': {
            'direction': function($state, $payload) {
                $state.set('direction', $payload);
            }
        }
    },
    states: {
        direction: 0
    }
});
