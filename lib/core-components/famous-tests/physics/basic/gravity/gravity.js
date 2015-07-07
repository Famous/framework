FamousFramework.scene('famous-tests:physics:basic:gravity', {
    behaviors: {
        '$camera': {
            'depth': 1000
        },
        '.sphere': {
            'size': [100, 100],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position': function(spherePosition) {
                return spherePosition;
            },
            'style': {
                'background': '#666',
                'border-radius': '50%',
                'box-shadow': '0 0 100px #fff'
            }
        },
        '.particle': {
            'size': [50, 50],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position': function(particlePosition) {
                return particlePosition;
            },
            'style': {
                'background': '#999',
                'border-radius': '50%'
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                $state.applyPhysicsForce('gravity3D', [ 'spherePosition', 'particlePosition' ]);

                $state.setPhysicsMass('spherePosition', 10000);
                $state.setPhysicsMass('particlePosition', 5);

                $state.setPhysicsVelocity('particlePosition', [
                    -250 / Math.PI,
                    -250 / Math.PI / 2,
                    -250 / 2
                ]);
            }
        }
    },
    states: {
        'spherePosition': [0, 0, 0],
        'particlePosition': [100, 0, 0]
    },
    tree: `
        <node class="sphere"></node>
        <node class="particle"></node>
    `
});