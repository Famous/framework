BEST.component('famous:ambient-light', {
    behaviors: {
        '$self': {
            '$self:color': function(color) {
                return color;
            },
        }
    },
    events: {
        public: {
            'color': function(state, color) {
                state.set('color', color);
            }
        },
        handlers: {
            'color': function($pointLight, $payload) {
                $pointLight.setColor($payload);
            }
        }
    },
    states: {}
});
