BEST.module('creative:sephora:mask', {
    behaviors: {
        '#mask': {
            'align': '[[identity|align]]',
            'mount-point': '[[identity|mountPoint]]',
            'opacity': '[[identity|opacity]]',
            'origin': '[[identity|origin]]',
            'position': '[[identity|position]]',
            'scale': '[[identity|scale]]',
            'size': '[[identity|size]]',
            'properties': {
                background: '#ff0099'
            }
        }
    },
    events: {
        '$pass-through' : {
            '#mask' : ['align', 'mountPoint', 'opacity', 'origin', 'position', 'scale', 'size']
        }
    },
    states: {
        align: [0.5, 0.5, 0.5],
        mountPoint: [0.5, 0.5, 0.5],
        opacity: 0,
        origin: [0.5, 0.5, 0.5],
        position: [0, 0, 0],
        scale: [1, 1, 1],
        size: [200, 200]
    },
    tree: '<dom-element id="mask"></dom-element>'
});
