FamousFramework.scene('famous-tests:webgl:custom-shader:fragment', {
    behaviors: {
        '.sphere': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'base-color': {
                'name': 'sphereFragment',
                'glsl': 'vec4((v_normal + 1.0) * 0.5, 1.0);',
                'output': 4,
            },
            'geometry': {
                'shape': 'GeodesicSphere',
                'options': {
                    'detail': 3
                }
            }
        },
        '.light': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position-z': 500,
            'light': {
                'type': 'point',
                'color': 'white'
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