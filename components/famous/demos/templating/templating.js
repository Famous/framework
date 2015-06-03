BEST.scene('famous:demos:templating', {
    /**
     * Behaviors:
     *      Target the circle in our tree
     *      using selectors and set size, style
     *      and other Famous properties.
     *
     *      Template:
     *          Lets us map specific state or values to
     *          mustache templates ({{ looks like this }})
     *          in our tree.
     *
     *          {{ line1 }} in our tree
     *
     *          ... will be compiled to ...
     *
     *          Supports
     */
    behaviors: {
        '#circle': {
            'size': [800, 800],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'color': '#F2F2F0',
                'border-radius': '100%',
                'padding-top': '50px',
                'padding-left': '120px',
                'font-size': '65px',
                'font-family': 'Lato',
                'border': '120px solid transparent',
                'border-style': 'solid',
                'border-top-color': '#222222',
                'border-right-color': '#222222',
                'border-bottom-color': '#7099EE',
                'border-left-color': '#7099EE'
            },
            'template': function(lines) {
                return {
                    line1: lines[0],
                    line2: lines[1],
                    line3: lines[2],
                    line4: lines[3]
                }
            }
        }
    },
    events: {},
    /**
     * States:
     *      Set our lines of text.
     */
    states: {
        'lines': ['Supports', 'Jade &', 'Mustache', 'Templating']
    },
    tree: 'templating.jade'
});
