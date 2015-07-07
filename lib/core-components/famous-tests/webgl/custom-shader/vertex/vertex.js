FamousFramework.scene('famous-tests:webgl:custom-shader:vertex', {
    behaviors: {
        '$camera': {
            'depth': 1000
        },
        '.sphere': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'base-color': 'whitesmoke',
            'geometry': {
                'shape': 'GeodesicSphere',
                'dynamic': true,
                'options': {
                    'detail': 3
                }
            },
            'position-offset': {
                'name': 'sphereVertex',
                'glsl': 'vec3(v_normal * 3.0);',
                'output': 3
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