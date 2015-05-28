BEST.scene('imtiaz.majeed:array-tweening', 'HEAD', {
    behaviors: {
        '#square': {
            'position': '[[identity|position]]',
            'size': [200, 200],
            'style': {
                'background': 'red'
            }
        }
    },
    events: {
        '#square': {
            'click': function($state) {
                $state.set('position', [400, 400], {
                    duration: 500,
                    curve: 'outBack'
                });
            }
        }
    },
    states: {
        position: [0, 0]
    },
    tree: 'array-tweening.html'
});