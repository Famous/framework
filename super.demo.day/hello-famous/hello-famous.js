BEST.scene('super.demo.day:hello-famous', 'HEAD', {
    /**
     * Behaviors:
     *      Target hello-famous in our tree
     *      using selectors and set style
     *      and other Famous properties.
     */
    behaviors: {
        '#hello-famous': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'color': 'white',
                'background': 'linear-gradient(to right, #00B9D7, #9783F2)',
                'font-family': 'Lato',
                'font-size': '60px',
                'text-align': 'center',
                'line-height': window.innerHeight + 'px'
            }
        }
    },
    events: {},
    states: {},
    tree: 'hello-famous.html'
});
