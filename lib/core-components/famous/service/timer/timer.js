/**
 * Workaround due to the inability to save
 * the interval timer function as a state.
 *
 * It's a map because anything in this space is defacto singleton.
 */
var intervalMap = {};

/**
 * A service component used to periodically fire a 'time' event.
 * To use, include in your tree and set the 'period' behavior
 * to a numerical (milliseconds) value.
 * Originally justinsmith:service:timer, moved into core.
 */
FamousFramework.component('famous:service:timer', {

    events: {

        '$public': {

            /**
             * The interval period in milliseconds.
             *
             * @param $payload The period in milliseconds
             * @param $state The state manager.
             * @param $dispatcher The event dispatcher
             * @param $famousNode A reference to the Node this component belongs to.
             */
            'period': function($payload, $state, $dispatcher, $famousNode) {

                //save our period state
                var period = $payload;
                $state.set("period", period);

                //get a reference to the famous engine clock
                var clock = FamousFramework.FamousEngine.core.FamousEngine.getClock();
                var nodeId = $famousNode.getId();

                //reset the timer interval for this component (if it exists)
                if(intervalMap.hasOwnProperty(nodeId)) {
                    clock.clearTimer(intervalMap[nodeId]);
                }

                //create an interval to periodically
                //trigger a 'time' event
                intervalMap[nodeId] = clock.setInterval(function() {

                    //set the new time
                    var time = new Date().getTime();
                    $state.set("time", time);
                    $dispatcher.emit("tick", time);

                }, period);
            }
        }
    },

    states: {

        /**
         * Default timer update period 100 milliseconds
         */
        period: 100
    }
});
