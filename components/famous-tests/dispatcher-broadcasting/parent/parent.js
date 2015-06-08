BEST.scene('famous-tests:dispatcher-broadcasting:parent', {
    behaviors: {
        '#parent': {
            'size': [window.innerWidth, window.innerHeight]
        }
    },
    events: {
        '#parent': {
            'click': function($dispatcher) {
                $dispatcher.broadcast('set-child-size', [600, 600]);
            }
        }
    },
    states: {},
    tree: 'parent.html'
})
.config({
    imports: {
        'famous-tests:dispatcher-broadcasting': ['child']
    }
});