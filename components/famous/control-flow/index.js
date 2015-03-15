BEST.component('famous:control-flow', {
    events: {
        handlers: {
            'if': function($payload) {
                console.warn('Handler `if` not yet implemented');
            },
            'repeat': function($node, $parent, $payload) {
                console.warn('Handler `repeat` not yet implemented');
            },
            'yield': function($domNode, $payload) {
                while ($domNode.firstChild) $domNode.removeChild($domNode.firstChild);
                while ($payload.length > 0) $domNode.appendChild($payload[0]);
            }
        }
    }
});
