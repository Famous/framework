FamousFramework.scene('famous-demos:lifecycle', {
    /**
     * Behaviors:
     *      Target the ball and ground in our tree
     *      using selectors and set style, size
     *      and other Famous properties.
     *
     *      position-x is a function of our positionX state
     *      and will rerun on each positionX state change.
     *
     *      rotation-z is a function of our rotationZ state
     *      and will rerun on each rotationZ state change.
     */
    behaviors: {
        '#ball': {
            'size': [400, 400],
            'align': [0, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position-x': function(positionX) { return positionX; },
            'rotation-z': function(rotationZ) { return rotationZ; },
            'style': {
                'border-radius': '100%',
                'border': '10px dotted #9783F2',
            }
        },
        '#ground': {
            'size': [window.innerWidth, 1],
            'position-y': 200,
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': { 'border': '4px solid #222222' }
        }
    },
    /**
     * Events:
     *      On our component's post-load
     *      event, a callback will fire.
     *
     *      Lifecycle:
     *          Throughout the life of a component,
     *          special lifecycle events will be emitted.
     *
     *      Inject state (denoted with a $)
     *      into our callback function.
     *
     *      Set the positionX to 200 less than the width of the window over a duration.
     *      and curve. Also, set the rotationX to Math.PI*4 over a duration and curve.
     */
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                $state.set('positionX', window.innerWidth - 200, {duration: 10000, curve: 'outBounce'});
                $state.set('rotationZ', Math.PI*4, {duration: 10000, curve: 'outBounce'});
            }
        }
    },
    /**
     * States:
     *      Set the positonX and rotationZ
     *      states of our application.
     */
    states: {
        'positionX': 0,
        'rotationZ': 0
    },
    tree: 'lifecycle.html'
});
