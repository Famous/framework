FamousFramework.scene('famous-tests:physics:basic:add-and-remove', {
    behaviors: {
        '.button': {
            'size': [150, 50],
            'align': [0, 0.5],
            'mount-point': [0, 0.5],
            'position-x': 20,
            '$repeat': function (physicsData) {
                return Array
                    .apply(null, { length: physicsData.length })
                    .map(function(number, index) { return index + 1 });
            },
            'position': function($index) {
                return [20, $index * 50 - 300];
            },
            'content': function(physicsData, $index) {
                return physicsData[$index].text;
            },
            'style': function (physicsData, $index) {
                var background = physicsData[$index].status ? '#999' : 'whitesmoke';
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
                'border-radius': '50%',
                'cursor': 'pointer'
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

                var data = $state.get('physicsData')[$index];
                var particles = ['position1', 'position2'];

                var name = data.name;
                var status = data.status;
                var options = data.options;

                $state.set(['physicsData', $index, 'status'], !status);

                if (!status) {
                    if (isForce) $state.applyPhysicsForce(name, particles, options);
                    else         $state.applyPhysicsConstraint(name, particles, options);

                    $state.setPhysicsMass('position1', 5);
                    $state.setPhysicsMass('position2', 500);
                }
                else {
                    if (isForce) {
                        $state
                            .removePhysicsForce(name)
                            .removePhysicsBody('position1')
                            .removePhysicsBody('position2');
                    }
                    else {
                        $state
                            .removePhysicsConstraint(name)
                            .removePhysicsBody('position1')
                            .removePhysicsBody('position2');
                    }
                }
            }
        },
        '.one': {
            'drag': function($state, $event) {
                var delta = $event.centerDelta;
                var curr = $state.get('position1');

                $state.setPhysicsPosition('position1', [curr[0] + delta.x, curr[1] + delta.y]);
            }
        },
        '.two': {
            'drag': function($state, $event) {
                var delta = $event.centerDelta;
                var curr = $state.get('position2');

                $state.setPhysicsPosition('position2', [curr[0] + delta.x, curr[1] + delta.y]);
            }
        }
    },
    states: {
        position1: [-200, 0, 0],
        position2: [ 200, 0, 0],
        physicsData: [
            {
                name: 'drag',
                options: {},
                text: 'Drag',
                status: false

            },
            {
                name: 'gravity1D',
                options: {},
                text: '1D Gravity',
                status: false
            },
            {
                name: 'gravity3D',
                options: {},
                text: '3D Gravity',
                status: false
            },
            {
                name: 'rotationalDrag',
                options: {},
                text: 'Rotational Drag',
                status: false
            },
            {
                name: 'rotationalSpring',
                options: {
                    period: 2,
                    dampingRatio: 0.5
                },
                text: 'Rotational Spring',
                status: false
            },
            {
                name: 'spring',
                options: {
                    period: 2,
                    dampingRatio: 0.25
                },
                text: 'Spring',
                status: false
            },
            {
                name: 'angle',
                options: {},
                text: 'Angle',
                status: false
            },
            {
                name: 'ballAndSocket',
                options: {},
                text: 'Ball and Socket',
                status: false
            },
            {
                name: 'collision',
                options: {},
                text: 'Collision',
                status: false
            },
            {
                name: 'curve',
                options: {},
                text: 'Curve',
                status: false
            },
            {
                name: 'direction',
                options: {},
                text: 'Direction',
                status: false
            },
            {
                name: 'distance',
                options: {},
                text: 'Distance',
                status: false
            },
            {
                name: 'hinge',
                options: {},
                text: 'Hinge',
                status: false
            },
        ]
    },
    tree: `
        <node class="particle one"></node>
        <node class="particle two"></node>

        <node class="button"></node>
    `
});