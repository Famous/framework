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
            }
        }
    }
});
