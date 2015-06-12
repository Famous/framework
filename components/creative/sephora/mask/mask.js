FamousFramework.module('creative:sephora:mask', {
    behaviors: {
        '$self': {
            'align': '[[identity|align]]',
            'mount-point': '[[identity|mountPoint]]',
            'opacity': '[[identity|opacity]]',
            'origin': '[[identity|origin]]',
            'position': '[[identity|position]]',
            'scale': '[[identity|scale]]',
            'size': '[[identity|size]]',
            'style': {
                background: '#000000'
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
        opacity: 1,
        origin: [0.5, 0.5, 0.5],
        position: [0, 0, 0],
        scale: [1, 1, 1],
        size: [200, 200],
        foo: 22
    },
    tree: ''
});
