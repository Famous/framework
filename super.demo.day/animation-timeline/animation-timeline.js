BEST.scene('super.demo.day:animation-timeline', 'HEAD', {
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
            'ui-click': function($timelines) {
                $timelines.get('pulse-animation').start({ duration: 1500 });
            }
        }
    },
    states: {},
    tree: 'animation-timeline.html'
})
/**
 * Timelines:
 *      Outline changes to each circle's behavior
 *      using a keyframe-like API. Percentage
 *      based frames mean that animations stay
 *      in sync regardless of duration.
 */
.timelines({
    'pulse-animation': {
        '.little-circle': {
            'size': {
                '0%':   { value: [200, 200], curve: 'outBack' },
                '25%':  { value: [400, 400], curve: 'outBack' },
                '50%':  { value: [200, 200] }
            }
        },
        '.medium-circle': {
            'size': {
                '0%':   { value: [400, 400], curve: 'outBack' },
                '50%':  { value: [600, 600], curve: 'outBack' },
                '75%':  { value: [400, 400] }
            }
        },
        '.large-circle': {
            'size': {
                '0%':   { value: [600, 600], curve: 'outBack' },
                '75%':  { value: [800, 800], curve: 'outBack' },
                '100%': { value: [600, 600] }
            }
        },
    }
});
