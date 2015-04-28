BEST.module('famous:webgl:material', {
    events: {
        '$public': {
            'entry-point': function($state, $payload, $dispatcher) {
                $state.set('entryPoint', $payload);
                $dispatcher.emit('entry-point-change', $payload);
            },
            'color': function($state, $payload, $dispatcher) {
                $state.set('color', $payload);
                $dispatcher.emit('color-change', $payload);
            }
        }
    }
});
