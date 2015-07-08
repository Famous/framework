FamousFramework.scene('famous-tests:physics:basic:add-and-remove', {
    behaviors: {
        '.button': {
            'size': [150, 50],
            'align': [0, 0.5],
            'mount-point': [0, 0.5],
            'position-x': 20,
            '$repeat': function (physicsText) {
                return Array
                    .apply(null, { length: physicsText.length })
                    .map(function(number, index) { return index + 1 });
            },
            'position': function($index) {
                return [20, $index * 50 - 300];
            },
            'content': function(physicsText, $index) {
                return physicsText[$index];
            },
            'style': function (physicsStatus, $index) {
                var background = physicsStatus[$index] ? '#999' : 'whitesmoke';
                return {
                    'background': background,
                    'line-height': '50px',
                    'text-align': 'center',
                    'cursor': 'pointer'
                }
            },
            'unselectable': true
        },
        '.particle': {
            'size': [100, 100],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'background': 'whitesmoke',
                'border-radius': '50%'
            }
        },
        '.one': {
            'position': function(position1) {
                return position1
            }
        },
        '.two': {
            'position': function(position2) {
                return position2;
            }
        }
    },
    events: {
        '.button': {
            'click': function($state, $index) {
                var isForce = $index < 6 ? true : false;

                var data = $state.get('physicsData');
                var status = $state.get(['physicsStatus', $index]);
                var particles = ['position1', 'position2'];

                $state.set(['physicsStatus', $index], !status);

                if (!status) {
                    if (isForce) $state.applyPhysicsForce(data[$index], particles);
                    else         $state.applyPhysicsConstraint(data[$index], particles);
                }
                else {
                    if (isForce) {
                        $state
                            .removePhysicsForce(data[$index])
                            .removePhysicsBody('position1')
                            .removePhysicsBody('position2');
                    }
                    else {
                        $state
                            .removePhysicsConstraint(data[$index])
                            .removePhysicsBody('position1')
                            .removePhysicsBody('position2');
                    }
                }
            }
        }
    },
    states: {
        'position1': [-200, 0, 0],
        'position2': [ 200, 0, 0],
        'physicsText': [
            'Drag',
            '1D Gravity',
            '3D Gravity',
            'Rotational Drag',
            'Rotational Spring',
            'Spring',
            'Angle',
            'Ball and Socket',
            'Collision',
            'Curve',
            'Direction',
            'Distance',
            'Hinge'
        ],
        'physicsStatus': [
            false, false, false, false, false, false, false, false, false, false, false, false, false
        ],
        'physicsData': [
            'drag',
            'gravity1D',
            'gravity3D',
            'rotationalDrag',
            'rotationalSpring',
            'spring',
            'angle',
            'ballAndSocket',
            'collision',
            'curve',
            'direction',
            'distance',
            'hinge'
        ]
    },
    tree: `
        <node class="particle one"></node>
        <node class="particle two"></node>

        <node class="button"></node>
    `
});