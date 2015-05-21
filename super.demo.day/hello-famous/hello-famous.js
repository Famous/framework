BEST.scene('super.demo.day:hello-famous', 'HEAD', {
    /**
     * Behaviors:
     *      Target the background and text in
     *      our tree using selectors and sets
     *      style and other Famous properties.
     */
    behaviors: {
        '#background': {
            'style': {
                'background': 'linear-gradient(to right, #00B9D7, #9783F2)'
            }
        },
        '#text': {
            'size': [400, 80],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'color': 'white',
                'font-family': 'Lato',
                'font-size': '60px',
                'text-align': 'center'
            }
        }
    },
    events: {},
    states: {},
    tree: 'hello-famous.html'
});
