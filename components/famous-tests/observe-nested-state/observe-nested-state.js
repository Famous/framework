FamousFramework.scene('famous-tests:observe-nested-state', {
    behaviors: {
        '#thing': {
            'size': function(size) {
                return [size.x, size.y];
            },
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {
        '#thing': {
            'click': function($state) {
                var x = $state.get(['size', 'x']);
                var y = $state.get(['size', 'y']);

                $state
                    .set(['size', 'x'], x + 100, { duration: 1000, curve: 'outBack' })
                    .set(['size', 'y'], y + 100, { duration: 1000, curve: 'outBack' })
            }
        }
    },
    states: {
        'size': {
            'x': 100,
            'y': 100
        }
    },
    tree: `
        <node id="thing"></node>
    `
});