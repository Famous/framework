BEST.component('famous:events', {
    events: {
        handlers: {
            'click': function($HTMLElement, $payload) {
                var CLICK_KEY = 'click';
                $HTMLElement.on(CLICK_KEY);
                var dispatch = $HTMLElement._dispatch;
                var registrant = $payload.registrant;
                var stateManager = $payload.stateManager;
                dispatch.registerTargetedEvent(CLICK_KEY, function(event) {
                    registrant(stateManager, event);
                });
            },
            'mousedown': function($HTMLElement, $payload) {
                var MOUSEDOWN_KEY = 'mousedown';
                $HTMLElement.on(MOUSEDOWN_KEY);
                var dispatch = $HTMLElement._dispatch;
                var registrant = $payload.registrant;
                var stateManager = $payload.stateManager;
                dispatch.registerTargetedEvent(MOUSEDOWN_KEY, function(event) {
                    registrant(stateManager, event);
                });
            },
            'mouseup': function($HTMLElement, $payload) {
                var MOUSEUP_KEY = 'mouseup';
                $HTMLElement.on(MOUSEUP_KEY);
                var dispatch = $HTMLElement._dispatch;
                var registrant = $payload.registrant;
                var stateManager = $payload.stateManager;
                dispatch.registerTargetedEvent(MOUSEUP_KEY, function(event) {
                    registrant(stateManager, event);
                });
            },
            'mousemove': function($HTMLElement, $payload) {
                var MOUSEMOVE_KEY = 'mousemove';
                $HTMLElement.on(MOUSEMOVE_KEY);
                var dispatch = $HTMLElement._dispatch;
                var registrant = $payload.registrant;
                var stateManager = $payload.stateManager;
                dispatch.registerTargetedEvent(MOUSEMOVE_KEY, function(event) {
                    registrant(stateManager, event);
                });
            },
            'wheel': function($HTMLElement, $payload) {
                var WHEEL_KEY = 'wheel';
                $HTMLElement.on(WHEEL_KEY);
                var dispatch = $HTMLElement._dispatch;
                var registrant = $payload.registrant;
                var stateManager = $payload.stateManager;
                dispatch.registerTargetedEvent(WHEEL_KEY, function(event) {
                    registrant(stateManager, event);
                });
            }
        }
    }
});
