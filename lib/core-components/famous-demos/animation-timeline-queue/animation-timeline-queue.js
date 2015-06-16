FamousFramework.scene('famous-demos:animation-timeline-queue', {
    /**
     * Behaviors:
     *      Target each circle in our tree
     *      using selectors and set size, style
     *      and other Famous properties.
     */
    behaviors: {
        '.little-circle': {
            'size': [200, 200],
            'style': { 'border': '10px solid #49AFEB' }
        },
        '.medium-circle': {
            'size': [400, 400],
            'style': { 'border': '10px solid #7099EE' }
        },
        '.large-circle': {
            'size': [600, 600],
            'style': { 'border': '10px solid #9783F2' }
        },
        '.circle': {
            'origin': [0.5, 0.5],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'border-radius': '50%',
                'cursor': 'pointer'
            }
        }
    },
    /**
     * Events:
     *      Target each circle in our tree
     *      using selectors and attach a click
     *      event listener with a callback.
     *
     *      Inject timelines (denoted with a $)
     *      into our callback function, get the
     *      pulse-animation and start it with a
     *      duration of 1500 seconds.
     */
    events: {
        '.circle': {
            'click': function($timelines) {
                $timelines.queue([
                    [ 'animation-1', { duration: 800 }, ()=> console.log('--> animation-1 complete!') ],
                    [ 'animation-2', { duration: 800 }, ()=> console.log('--> animation-2 complete!') ],
                    [ 'animation-3', { duration: 800 }, ()=> console.log('--> animation-3 complete!') ]
                ], function() {
                    console.log('----> all animations complete!');
                }).startQueue();
            }
        }
    },
    states: {},
    tree: 'animation-timeline-queue.html'
})
/**
 * Timelines:
 *      Outline changes to each circle's behavior
 *      using a keyframe-like API. Percentage
 *      based frames mean that animations stay
 *      in sync regardless of duration.
 */
.timelines({
    'animation-1': {
        '.little-circle': {
            'scale': {
                '0%':   { value: [1.0, 1.0], curve: 'linear' },
                '25%':  { value: [1.5, 1.5], curve: 'linear' },
                '50%':  { value: [1.0, 1.0] }
            }
        }
    },
    'animation-2': {
        '.medium-circle': {
            'scale': {
                '0%':   { value: [1.0, 1.0], curve: 'linear' },
                '50%':  { value: [1.5, 1.5], curve: 'linear' },
                '75%':  { value: [1.0, 1.0] }
            }
        }
    },
    'animation-3': {
        '.large-circle': {
            'scale': {
                '0%':   { value: [1.0, 1.0], curve: 'linear' },
                '75%':  { value: [1.5, 1.5], curve: 'linear' },
                '100%': { value: [1.0, 1.0] }
            }
        }
    }
});
