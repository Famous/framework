BEST.module('famous:events', 'HEAD', {
    events: {
        '$public': {
            '$miss': function($DOMElement, $famousNode, $payload) {
                var eventName = $payload.eventName;
                var listener = $payload.listener;

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    listener(event);
                });
            }
        }
    }
});
