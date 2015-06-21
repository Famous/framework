var DEGREES_IN_CIRCLE = 360;
var DEGREES_TO_RADIANS = Math.PI / 180;
var HOURS_IN_CLOCK = 12;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_MINUTE = 60;

/**
 * Get a value in radians for the specified percentage.
 *
 * TODO: it still feels weird to bust out of the framework
 * TODO: scene...but sometimes you just NEED a helper function.
 *
 * @param percentage The percentage.
 * @returns {number}
 */
var radians = function(percentage) {
    return DEGREES_IN_CIRCLE * DEGREES_TO_RADIANS * percentage;
};

/**
 * A simple analog clock based on the Android homescreen widget.
 */
FamousFramework.scene('famous-demos:widget-dashboard:clock', {

    //TODO: I think the hardest thing to grock when starting
    //TODO: out was that setting a 'behavior' value triggers
    //TODO: an 'event' on the child component. Might be easiest
    //TODO: for noobs by showing a flow chart of how the leg
    //TODO: bone's connected to the thigh bone?

    behaviors: {

        '.container': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'position-z': 1,
            'unselectable': true,
            'size-absolute': [400, 400],

            'style': {
                'background':'transparent',
                'border-radius':'50%',
                'border':'10px solid white',
                'box-shadow':'0 0 15px black, inset 0 0 15px black'
            }
        },

        '.hour': {

            'align': [0.5, 0],
            'mount-point': [0.5, 0],
            'origin': [0.5,.7],
            'position-z': 3,
            'size-absolute': [10, 200],
            'position-y':60,

            'rotation-z':function(hour) {
                return radians(hour / HOURS_IN_CLOCK);
            },

            'style': {
                'background':'#ffffff',
                'box-shadow':'0px 0px 10px black',
                'margin':'-10px 0 0 -10px'
            }
        },

        '.minute': {

            'align': [0.5, 0],
            'mount-point': [0.5, 0],
            'origin': [0.5,.85],
            'position-z': 2,
            'size-absolute': [10, 200],
            'position-y':30,

            'rotation-z':function(minute) {
                return radians(minute / MINUTES_IN_HOUR);
            },

            'style': {
                'background':'#ffffff',
                'box-shadow':'0px 0px 10px black',
                'margin':'-10px 0 0 -10px'
            }
        },

        '.second': {

            'align': [0.5, 0],
            'mount-point': [0.5, 0],
            'origin': [0.5,.9],
            'position-z': 1,
            'size-absolute': [2, 200],
            'position-y':20,

            'rotation-z':function(second) {
                return radians(second / SECONDS_IN_MINUTE);
            },

            'style': {
                'background':'#ffffff',
                'box-shadow':'0px 0px 10px black',
                'margin':'-10px 0 0 -10px'
            }
        },

        /**
         * TODO: This is a convention I adopted for 'service' components.
         * TODO: I include the word 'service' in the name.
         * TODO: A service can be anything, even if simple - in this case a
         * TODO: basic interval timer that fires once per the specified period.
         */
        '.timer-service': {

            /**
             * start the timer service by setting the interval period
             * we'll use 100 milliseconds to avoid any potential lag in the clock.
             */
            'period':100
        }
    },

    events: {

        '.timer-service': {

            /**
             * Dispatched at 'period' millisecond intervals (defined above).
             *
             * @param $state The state manager.
             * @param $payload A Datetime as a number.
             */
            'tick': function($state, $payload) {

                var d = new Date($payload);

                //using a 12-hour clock
                var hour = d.getHours();
                if(hour > 12) {
                    hour -= 12;
                }

                $state.set("hour", hour, { duration: 500, curve: 'outBack' });

                //workaround animation issue when rotation is 360
                var minute = d.getMinutes();
                if(minute == 0) {
                    $state.set("minute", minute);
                }
                else {
                    $state.set("minute", minute, { duration: 500, curve: 'outBack' });
                }

                //workaround animation issue when rotation is 360
                var second = d.getSeconds();
                if(second == 0) {
                    $state.set("second", second);
                }
                else {
                    $state.set("second", second, { duration: 100, curve: 'outBack' });
                }

                $state.set("time", d);
            }
        }
    },

    //TODO: states is weird for me.  It's not necessarily a state machine but
    //TODO: could be argued as one...but it's REALLY more of a presentation model.
    //TODO: The naming is confusing for anyone coming from other platforms that use
    //TODO: the term to actually define a finite state machine.
    //TODO: http://martinfowler.com/eaaDev/PresentationModel.html
    //TODO: http://martinfowler.com/dslCatalog/stateMachine.html

    states: {

        /**
         * The current datetime.
         */
        time: new Date(),

        /**
         * The hour value of our analog clock (0 - 12)
         */
        hour: 0,

        /**
         * The minute value of our analog clock (0 - 60)
         */
        minute: 0,

        /**
         * The second value of our analog clock (0 - 60)
         */
        second: 0
    },

    tree: 'clock.html'
});
