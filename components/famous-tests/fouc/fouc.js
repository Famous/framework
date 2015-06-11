FamousFramework.scene('famous-tests:fouc', {
    behaviors: {
        '#view': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'background-color': '#d3d3d3',
                'border': '5px solid #666'
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <node id="view"></node>
    `
});