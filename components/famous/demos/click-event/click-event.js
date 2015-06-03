BEST.scene('famous:demos:click-event', {
    /**
     * Behaviors:
     *      Target the background in our tree
     *      using selectors and set style
     *      and other Famous properties.
     *
     *      Style is a function of our background state
     *      and will rerun on each background state change.
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
        '#background': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': function(background) {
                return {
                    'color': 'white',
                    'background': background,
                    'font-family': 'Lato',
                    'font-size': '60px',
                    'text-align': 'center',
                    'line-height': window.innerHeight + 'px',
                    'cursor': 'pointer',
                    'transition': 'background 0.8s',
                }
            },
            'unselectable': true
        }
    },
    /**
     * Events:
     *      Target the background in our tree
     *      using selectors and attach a click
     *      event listener with a callback.
     *
     *      Inject state (denoted with a $)
     *      into our callback function. Choose
     *      a random index and use our injected
     *      state to get the color value of the
     *      colorPalette state at that index.
     *
     *      Then, set the background
     *      state to that color.
     */
    events: {
        '#background': {
            'click': function($state) {
                var index = Math.floor(Math.random() * 8);
                var color = $state.get(['colorPalette', index]);

                $state.set('background', color);
            }
        }
    },
    /**
     * States:
     *      Set the background and colorPalette
     *      states of our application.
     */
    states: {
        background: '#9783F2',
        colorPalette: ['#9783F2', '#ABAA98', '#82CDB9', '#F37259', '#00B9D7', '#611427', '#728453', '#657E84']
    },
    tree: 'click-event.html'
});
