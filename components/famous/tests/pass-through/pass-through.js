BEST.module('famous:tests:pass-through', 'HEAD', {
    tree: 'pass-through.html',
    behaviors: {
        '#container' : {
            position: [50, 50]
        },
        '#label' : {
            size: [600, 200]
        },
        '#block-view': {
            position: [0, 200]
        },
        '.block' : {
            size: [200, 200],
            style: {
                'background-color' : 'navy',
                'color': 'white',
                'font-family': 'monospace',
                'font-weight': 'bold',
                'font-size': '16px'
            }
        },
        '#two' : {
            position: [250, 0]
        },
        '#three' : {
            position: [500, 0]
        }
    },
    events: {
        '$pass-through' : {
            '#one' : '*',
            '#two' : ['content', 'scale', 'style'],
            '#three' : {'block-size' : 'size'}
        }
    },
    states: {
    }
});
