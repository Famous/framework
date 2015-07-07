FamousFramework.scene('famous-tests:dispatcher:broadcasting:child', {
    behaviors: {
        '#child': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'size': function(childSize) {
                return childSize;
            },
            'style': {
                'background': '#222',
                'border': '1px solid whitesmoke',
                'color': 'whitesmoke'
            }
        }
    },
    events: {
        '#child': {
            'child-size': function($state, $payload) {
                $state.set('childSize', $payload, { duration: 400, curve: 'outBack' });
            }
        }
    },
    states: {
        childSize: [200, 200]
    },
    tree: `<node id="child">Click here!</node>`
});