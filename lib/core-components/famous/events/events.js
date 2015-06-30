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

var lastNaturalDOMEvent = {
    timeStamp: null,
    eventName: null
};

var naturalDOMListenersFor = {};

// Intentially setting this to a rather restricted list for now,
// and especially avoiding anything super expensive like mousemove
// that we want to be careful with. Feel free to add more, though.
var EVENTS_WHICH_REALLY_NEED_DOM_INFO = {
    'input': true,
    'change': true,
    'click': true,
    'focus': true,
    'blur': true,
    'select': true,
    'keydown': true,
    'keyup': true
};

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

                // It's pretty much impossible to do anything nontrivial without
                // being able to get data about the actual targeted element, so
                // what we do here - which is likely terrible for performance -
                // is set up listeners that listen for the needed events on the
                // document, and then later, we check the timestamp of the event
                // we got out of the Famous Engine, and basically synthesize the
                // two if we have a match. HACK! TODO
                if (eventName in EVENTS_WHICH_REALLY_NEED_DOM_INFO) {
                    if (!naturalDOMListenersFor[eventName]) {
                        naturalDOMListenersFor[eventName] = true;
                        document.addEventListener(eventName, function(event) {
                            lastNaturalDOMEvent.timeStamp = event.timeStamp;
                            lastNaturalDOMEvent.eventName = eventName;
                            lastNaturalDOMEvent.eventObject = event;
                        });
                    }
                }

                $famousNode.addUIEvent(eventName);
                $DOMElement.on(eventName, function(event) {
                    if (naturalDOMListenersFor[eventName]) {
                        if (lastNaturalDOMEvent.eventName === eventName && lastNaturalDOMEvent.timeStamp === event.timeStamp) {
                            // We've got a match of an event of the same name
                            // that occurred at the same time stamp, so now let's
                            // check to see if we should merge any additional info
                            // with the Famous Engine event we got
                            var naturalEvent = lastNaturalDOMEvent.eventObject;
                            var target = naturalEvent.target || naturalEvent.srcElement;
                            if (target) {
                                var nodeLocation = $famousNode.getLocation();
                                var currentElement = target;
                                while (currentElement) {
                                    if (currentElement.getAttribute('data-fa-path') === nodeLocation) {
                                        event.target = naturalEvent.target;
                                        event.relatedTarget = naturalEvent.relatedTarget;
                                        break;
                                    }
                                    currentElement = currentElement.parentNode;
                                }
                            }
                        }
                    }

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
