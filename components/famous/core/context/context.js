BEST.module('famous:core:context', {
    events: {
        '$public': {
            'attach': function($payload, $famousNode) {
                $payload($famousNode);
            }
        }
    }
});
