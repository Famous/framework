FamousFramework.scene('famous-tests:webgl:basic:geometry', {
    behaviors: {
        '.sphere': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'base-color': 'whitesmoke',
            'geometry': {
                'shape': 'GeodesicSphere',
                'options': {
                    'detail': 3
                }
            },
            'light': {
                'type': 'point',
                'color': 'blue'
            }
        },
        '.light': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position-z': 50,
            'light': {
                'type': 'point',
                'color': 'red'
            }
        },
        '.background': {
            'size': [undefined, undefined],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'geometry': {
                'shape': 'Plane'
            }
        }
    },
    events: {},
    states: {},
    tree: `
        <node class="background"></node>
        <node class="sphere"></node>
        <node class="light"></node>
    `
});