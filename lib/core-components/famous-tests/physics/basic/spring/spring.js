FamousFramework.scene('famous-tests:physics:basic:spring', {
    behaviors: {
        '.particle': {
            'size': [100, 100],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5]
        },
        '.one': {
            'position': function(position1) {
                return position1
            },
            'style': {
                'background': '#666',
                'border-radius': '50%',
                'box-shadow': '0 0 100px #fff'
            }
        },
        '.two': {
            'position': function(position2) {
                return position2;
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
                $state.applyPhysicsForce('spring', [ 'position1', 'position2' ], {
                    period: 2,
                    dampingRatio: 0.3
                });

                $state.setPhysicsMass('position1', 500);
                $state.setPhysicsMass('position2', 5);
            }
        },
        '.one': {
            'click': function($state) {
                var xPos = Math.floor(Math.random() * window.innerWidth / 2);
                var yPos = Math.floor(Math.random() * window.innerHeight / 2);

                xPos = Math.random() > 0.5 ? -xPos : xPos;
                yPos = Math.random() > 0.5 ? -yPos : yPos;

                $state.setPhysicsPosition('position1', [ xPos, yPos, 0 ]);
            }
        },
        '.two': {
            'click': function($state) {
                var xPos = Math.floor(Math.random() * window.innerWidth / 2);
                var yPos = Math.floor(Math.random() * window.innerHeight / 2);

                xPos = Math.random() > 0.5 ? -xPos : xPos;
                yPos = Math.random() > 0.5 ? -yPos : yPos;

                $state.setPhysicsPosition('position1', [ xPos, yPos, 0 ]);
            }
        }
    },
    states: {
        'position1': [ 200, 0, 0],
        'position2': [-200, 0, 0]
    },
    tree: `
        <node class="particle one"></node>
        <node class="particle two"></node>
    `
});