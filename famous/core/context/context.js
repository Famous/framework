BEST.module('famous:core:context', 'HEAD', {
    events: {
        '$public': {
            'attach': function($payload, $famousNode) {
                $payload($famousNode);
            }
        }
    }
});
