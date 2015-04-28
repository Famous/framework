BEST.module('famous:webgl:shader', {
    events: {
        '$public': {
            'glsl': function($state, $payload, $dispatcher) {
                $state.set('glsl', $payload);
                $dispatcher.emit('glsl-change', $payload);
            }
        }
    }
});
