BEST.scene('famous:demos:hello-famous', {
    /**
     * Behaviors:
     *      Target the background and text in
     *      our tree using selectors and sets
     *      style and other Famous properties.
     */
    behaviors: {
        '#text': {
            'size': [400, 400, 400],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'base-color': 'red',
            'geometry': {
                shape: 'Sphere',
                options: {
                    detail: 100
                }
            },
            content: 'ZZZZZ',
            style: {
                background: 'yellow'
            }
        }
    },
    events: {},
    states: {},
    tree: 'hello-famous.html'
});
