BEST.module('famous:events', {
    events: {
        '$public': {
            '$miss': function($DOMElement, $node, $payload) {
                var proxy = $payload.proxy;
                var selector = $payload.selector;
                var listener = $payload.listener;

                $node.famousNode.addUIEvent(proxy);
                $DOMElement.on(proxy, function(event) {
                    listener('famous:events:' + proxy, event, selector);
                });
            }
        }
    }
});
