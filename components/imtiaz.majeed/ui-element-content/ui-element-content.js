BEST.scene('imtiaz.majeed:ui-element-content', 'HEAD', {
    behaviors: {
        '#element-with-div': {
            'position': [-200, 0, 0],
            'style': {
                'background': '#006699'
            }
        },
        '#element-without-div': {
            'position': [200, 0, 0],
            'style': {
                'background': '#996699'
            }
        },
        '.element': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'font-size': '30px',
                'text-align': 'center',
                'line-height': '200px',
                'font-family': 'Lato'
            }
        }
    },
    events: {},
    states: {},
    tree: 'ui-element-content.html'
});