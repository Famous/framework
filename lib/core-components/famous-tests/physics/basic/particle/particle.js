FamousFramework.scene('famous-tests:physics:basic:particle', {
    behaviors: {
        '.particle': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'background': 'whitesmoke',
                'border-radius': '50%'
            }
        },
        '.one': {
            'position': function(position1) {
                return position1;
            }
        },
        '.two': {
            'position': function(position2) {
                return position2;
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                $state
                    .applyPhysicsForce('gravity1D', [ 'position1' ])
                    .applyPhysicsConstraint('distance', [ 'position1', 'position2' ], {
                        length: 400
                    });
            }
        },
        '.one': {
            'click': function($state) {
                $state
                    .removePhysicsForce('gravity1D')
                    .removePhysicsBody('position1');
            }
        },
        '.two': {
            'click': function($state) {
                $state
                    .removePhysicsConstraint('distance')
                    .removePhysicsBody('position2');
            }
        }
    },
    states: {
        'position1': [0, 0, 0],
        'position2': [0, -200, 0]
    },
    tree: `
        <node class="particle one"></node>
        <node class="particle two"></node>
    `
});
