FamousFramework.scene('famous-demos:best:arrow', {
    behaviors: {
        '#arrow': {
            'size': [true, 70],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'style': {
                'color': 'whitesmoke',
                'font-size': '50px'
            },
            'content': '⬆',
            'position': function(position) {
                return position;
            },
            'rotation-z': function(angle) {
                return angle;
            } 
        }
    },
    events: {
        '$public': {
            'position': function($state, $payload) {
                $state.set('position', $payload);
            },
            'angle': function($state, $payload) {
                $state.set('angle', $payload);
            }
        }
    },
    states: {
        'position': [0, 0],
        'angle': 0
    },
    tree: `
        <node id="arrow"></node>
    `
});
