BEST.scene('imtiaz.majeed:dom-skyscraper:base', 'HEAD', {
    behaviors: {
        '#base-container': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'rotation': function() {
                return [0, Math.PI/3, 0];
            }
        },
    },
    events: {},
    states: {},
    tree: 'base.html'
})
.config({
    imports: {
        'imtiaz.majeed:dom-skyscraper': ['side']
    }
});