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

                /*
                    HACK: This condition should be removed to enforce API consistency.
                    By the time that the $payload gets to this point, it should be a
                    NodeList and the developer using yield should either pass back a
                    NodeList or a CSS Selector.
                 */
                if (Array.isArray($payload)) {
                    for(var i = 0; i < $payload.length; i++) {
                        $domNode.appendChild($payload[i]);
                    }
                }
                else {
                    while ($payload.length > 0) $domNode.appendChild($payload[0]);
                }
            }
        }
    }
});
