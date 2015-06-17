FamousFramework.module('famous:events', {
    events: {
        '$public': {
            '$miss': function($DOMElement, $famousNode, $payload) {
                var eventName = $payload.eventName;
                var listener = $payload.listener;

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    listener(event);
                });
            },
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
            'drag': function($famousNode, $GestureHandler, $payload) {
                new $GestureHandler($famousNode, [
                    {
                        event: 'drag',
                        callback: function(event) {
                            $payload.listener(event);
                        }
                    }
                ]);
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
