FamousFramework.scene('famous-demos:clickable-square', {
    /**
     * Behaviors:
     *      Target the square in our tree
     *      using selectors and set size, style
     *      and other Famous properties.
     *
     *      Content is a function of our numberOfClicks state
     *      and will rerun on each numberOfClicks state change.
     *
     *      Rotation is also a function
     *      of our numberOfClicks state.
     *
     *      Sugar:
     *          'unselectable': true
     *
     *          ... is equivalent to ...
     *
     *          'style': {
     *              '-webkit-touch-callout': 'none'
     *              '-webkit-user-select': 'none'
     *              '-khtml-user-select': 'none'
     *              '-moz-user-select': 'none'
     *              '-ms-user-select': 'none'
     *              'user-select': 'none'
     *          }
     */
    behaviors: {
        '$self': {
            'size': [400, 400],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'rotation-z': function(angle) {
                return angle;
            },
            'style': {
                'color': '#7099EE',
                'background': '#222222',
                'border': '6px solid #333333',
                'text-align': 'center',
                'font-size': '60px',
                'font-family': 'Lato',
                'cursor': 'pointer'
            },
            'unselectable': true
        },
        'div' : {
            'text-content': '[[identity|numberOfClicks]]'
        }
    },
    /**
     * Events:
     *      Target the square in our tree
     *      using selectors and attach a click
     *      event listener with a callback.
     *
     *      Inject state (denoted with a $)
     *      into our callback function.
     *
     *      Set the numberOfClicks state to one
     *      plus the current numberOfClicks state.
     */
    events: {
        '$self': {
            'click': function($state) {
                $state.set('numberOfClicks', 1 + $state.get('numberOfClicks'));
                $state.set('angle', $state.get('angle') + Math.PI/2, {
                    duration: 500,
                    curve: 'outBounce'
                });
            }
        }
    },
    /**
     * States:
     *      The numberOfClicks state is 0.
     */
    states: {
        numberOfClicks: 0,
        angle: 0,
        logoRotation: 0
    },
    tree: `
        <div></div>
    `
});


