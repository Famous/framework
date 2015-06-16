FamousFramework.scene('famous-tests:does-behavior-void:child', {
    behaviors: {
        '#child': {
            'size': [200, 200],
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <node id="child"></node>
    `
});