FamousFramework.scene('famous-tests:physics:basic:particle', {
    behaviors: {
        '.particle': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position': function(position) {
                return position;
            },
            'style': {
                'background': 'whitesmoke',
                'border-radius': '50%'
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                $state.applyPhysicsForce('gravity1D', [ 'position' ]);
            }
        }
    },
    states: {
        'position': [0, 0, 0]
    },
    tree: `
        <node class="particle"></node>
    `
});
