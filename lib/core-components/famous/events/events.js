function addGesture($famousNode, $GestureHandler, $payload, eventName) {
    new $GestureHandler($famousNode, [
        {
            event: eventName,
            callback: function(event) {
                $payload.listener(event);
            }
        }
    ]);
}

FamousFramework.module('famous:events', {
    events: {
        '$public': {
            // Size events
            'size-change' : function($famousNode, $payload) {
                $famousNode.addComponent({
                    onSizeChange: function(sizeX, sizeY, sizeZ) {
                        $payload.listener({
                            eventName: 'onSizeChange',
                            value: [sizeX, sizeY, sizeZ]
                        });
                    }
                })
            },
            'parent-size-change' : function($famousNode, $payload) {
                var parentFamousNode = $famousNode.getParent();
                if (parentFamousNode) {
                    parentFamousNode.addComponent({
                        onSizeChange: function(sizeX, sizeY, sizeZ) {
                            $payload.listener({
                                eventName: 'onParentSizeChange',
                                value: [sizeX, sizeY, sizeZ]
                            });
                        }
                    });
                }
            },
            // Gestures
            'drag': function($famousNode, $GestureHandler, $payload) {
                addGesture($famousNode, $GestureHandler, $payload, 'drag');
            },
            'tap': function($famousNode, $GestureHandler, $payload) {
                addGesture($famousNode, $GestureHandler, $payload, 'tap');
            },
            'rotate': function($famousNode, $GestureHandler, $payload) {
                addGesture($famousNode, $GestureHandler, $payload, 'rotate');
            },
            'pinch': function($famousNode, $GestureHandler, $payload) {
                addGesture($famousNode, $GestureHandler, $payload, 'pinch');
            },
            // FamousEngine supported events
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
})
.config({
    imports: {
        'famous:events': [] // prevent expansion of 'size-change' to 'famous:events:size-change'
    },
    extends: []
});
