FamousFramework.scene('famous-tests:component-targeting:child', {
    behaviors: {
        '#child': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'size': '[[identity|mySize]]',
            'style': {
                'background': 'whitesmoke'
            }
        }
    },
    events: {
        '$public': {
            'my-size': '[[setter|mySize]]',
        }
    },
    states: {
        'mySize': [100, 100]
    },
    tree: `
        <node id="child"></node>
    `
});