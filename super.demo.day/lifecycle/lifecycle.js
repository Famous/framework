BEST.scene('super.demo.day:lifecycle', 'HEAD', {
    behaviors: {
        '#ball': {
            'size': [400, 400],
            'align': [0, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position-x': function(positionX) { return positionX; },
            'rotation-z': function(rotationZ) { return rotationZ; },
            'style': {
                'border-radius': '100%',
                'border': '10px dotted #9783F2',
            }
        },
        '#ground': {
            'size': [window.innerWidth, 1],
            'position-y': 200,
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': { 'border': '4px solid #333333' }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                $state.set('positionX', window.innerWidth - 200, {duration: 10000, curve: 'outBounce'});
                $state.set('rotationZ', Math.PI*4, {duration: 10000, curve: 'outBounce'});
            }
        }
    },
    states: {
        'positionX': 0,
        'rotationZ': 0
    },
    tree: 'lifecycle.html'
});