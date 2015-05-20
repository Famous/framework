BEST.scene('super.demo.day:clickable-square', 'HEAD', {
    /**
     * Behaviors:
     *      Target the square in our tree
     *      using selectors and set size, style
     *      and other Famous properties.
     *
     *      Content is a function of our numberOfClicks state
     *      and will rerun on each numberOfClicks state change.
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
        '#square': {
            'size': [400, 400],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'content': function(numberOfClicks) {
                return '<h1>' + numberOfClicks + '</h1>';
            },
            'style': {
                'color': '#7099EE',
                'background': '#444444',
                'border': '6px solid #333333',
                'text-align': 'center',
                'font-size': '60px',
                'font-family': 'Lato',
                'cursor': 'pointer'
            },
            'unselectable': true
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
        '#square': {
            'ui-click': function($state) {
                $state.set('numberOfClicks', 1 + $state.get('numberOfClicks'));
            }
        }
    },
    /**
     * States:
     *      The numberOfClicks state is 0.
     */
    states: {
        numberOfClicks: 0
    },
    /**
     * Tree:
     *      Create a square.
     */
    tree: `<ui-element id="square"></ui-element>`
});
