FamousFramework.scene('famous-tests:webgl:glsl-state:uniform', {
    behaviors: {
        '.sphere': {
            'size': [200, 200],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'geometry': {
                'shape': 'GeodesicSphere',
                'options': {
                    'detail': 3
                }
            },
            'position-offset': {
                'name': 'sphereVertex',
                'glsl': 'vec3(v_normal * (u_Offset * 5.0));',
                'output': 3,
                'defaults': {
                    'uniforms': {
                        'u_Offset': 1
                    }
                }
            },
            'base-color': {
                'name': 'sphereFragment',
                'glsl': 'vec4((v_normal + u_Offset / 2.0) * 0.5, 1.0);',
                'output': 4,
            },
            'uniform': function(offset) {
                return {
                    'vertexName': 'sphereVertex',
                    'variableName': 'u_Offset',
                    'value': offset
                }
            }
        }
    },
    events: {
        '$self': {
            'click': function($state) {
                $state
                    .set('offset', 2.0, { duration: 800, curve: 'outBack' })
                    .thenSet('offset', 0.0, { duration: 600, curve: 'outBack' });
            }
        }
    },
    states: {
        'offset': 0.0
    },
    tree: `
        <node class="sphere"></node>
    `
});