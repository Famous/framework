BEST.scene('imtiaz.majeed:dispatcher-broadcasting:parent', 'HEAD', {
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
        'imtiaz.majeed:dispatcher-broadcasting': ['child']
    }
});