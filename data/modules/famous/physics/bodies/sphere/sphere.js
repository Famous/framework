BEST.module('famous:physics:bodies:sphere < famous:physics:bodies:particle', {
    behaviors: {
        '$self': {
            'famous:physics:radius': function(radius) {
                return radius;
            }
        }
    },
    events: {
        '$public': {
            'radius': function($state, $message) {
                $state.set('radius', $message);
            }
        }
    },
    states: {
        'radius': 0
    }
});
