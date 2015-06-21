/**
 * The amount of time (in milliseconds) to wait
 * for the browser to return geo coordinates of
 *
 * the user's location.
 * @type {number}
 */
var TIMEOUT = 10000;

/**
 * A service component used to get the users
 * geographic location from the browser.
 * Originally justinsmith:service:location, moved into core.
 */
FamousFramework.component('famous:service:location', {

    events: {

        '$lifecycle': {

            /**
             * Trigger the location-requested event on load.
             *
             * @param $dispatcher The event dispatcher
             */
            'post-load': function($dispatcher) {
                $dispatcher.trigger("location-requested");
            }
        },

        '$public': {

            /**
             * Requests the geographic location from the browser (if supported).
             * If the browser doesn't respond within 10 seconds, an error event
             * is dispatched.
             *
             * @param $state
             * @param $dispatcher
             */
            'location-requested': function($state, $dispatcher) {

                //quick exit if the browser doesn't support geolocation
                if(!navigator.geolocation) {
                    var message = "Geolocation is not supported by this browser."
                    console.warn(message);
                    $dispatcher.emit("error", message);
                    return
                }

                //timeout after 10 seconds
                //TODO: maybe make this configurable???

                var isTimedOut = false;
                var timeout = setTimeout(function() {
                    isTimedOut = true;
                    $dispatcher.emit("error", "Geolocation request timed out or permission was not granted.");
                }, TIMEOUT);

                /**
                 * The callback handler for the geolocation api.
                 *
                 * @param position The geographic position of the user's browser.
                 */
                function callback(position) {

                    clearTimeout(timeout);

                    //if the callback actually DOES return
                    //but we've exceeded the timeout, ignore the result.
                    if(isTimedOut) {
                        return;
                    }

                    //save our data and dispatch an event
                    $state.set("location", position.coords);
                    $dispatcher.emit("location", position.coords);
                };

                //call the geolocation api
                navigator.geolocation.getCurrentPosition(callback);
            }
        }
    },

    //TODO: if all I'm doing is just emitting events, do i really NEED the state?
    //TODO: probably not, but leaving it in here anyways
    states: {
        location: null
    }
});
