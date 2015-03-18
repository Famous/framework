BEST.component('famous:webgl-mesh', {
    behaviors: {
        '$self': {
            '$self:color': function(color) {
                return color;
            },
            '$self:normals': function(normals) {
                return normals;
            },
            '$self:geometry': function(geometry) {
                return geometry;
            },
            '$self:glossiness': function(glossiness) {
                return glossiness;
            },
            '$self:metallness': function(metallness) {
                return metallness;
            },
            '$self:flatShading': function(flatShading) {
                return flatShading;
            },
            '$self:positionOffset': function(positionOffset) {
                return positionOffset;
            }
        }
    },
    events: {
        public: {
            'color': function(state, color) {
                state.set('color', color);
            },
            'normals': function(state, normals) {
                state.set('normals', normals);
            },
            'geometry': function(state, geometry) {
                state.set('geometry', geometry);
            },
            'glossiness': function(state, glossiness) {
                state.set('glossiness', glossiness);
            },
            'metallness': function(state, metallness) {
                state.set('metallness', metallness);
            },
            'flatShading': function(state, flatShading) {
                state.set('flatShading', flatShading);
            },
            'positionOffset': function(state, positionOffset) {
                state.set('positionOffset', positionOffset);
            }
        },
        handlers: {
            'color': function($webGLMesh, $payload) {
                // setBaseColor takes in 4 arguments not in an array
                //console.log('setting base color: ', $payload);
                //console.log('webGLMesh: ', $webGLMesh)
                if ($payload instanceof Array)
                    $webGLMesh.setBaseColor($payload[1], $payload[2], $payload[3]);
                else
                    $webGLMesh.setBaseColor($payload);
                //console.log('webGLMesh get geometry: ', $webGLMesh.getGeometry());
            },
            'normals': function($webGLMesh, $payload) {
                $webGLMesh.setNormals($payload);
            },
            'geometry': function($webGLMesh, $payload) {
                var testGeometry = {
                    buffers: [
                        { name: 'pos', data: [-1, 1, 0, 0, -1, 0, 1, 1, 0] },
                        { name: 'texCoord', data: [0, 0, 0.5, 1, 1, 0], size: 2 },
                        { name: 'normals', data: [0, 0, 0] },
                        { name: 'indices', data: [0, 1, 2], size: 1}
                    ]
                }
                var testSpec = {
                    spec: {
                        id: 1,
                        dynamic: false,
                        type: 'TRIANGLES',
                        bufferNames: ['pos', 'texCoord', 'normals', 'indices'],
                        bufferValues: [[-1, 1, 0, 0, -1, 0, 1, 1, 0], [0, 0, 0.5, 1, 1, 0], [0, 0, 0], [0, 1, 2]],
                        bufferSpacings: [3, 2, 3, 1],
                        invalidations: [1, 2, 3, 4]
                    },
                    options: testGeometry.buffers,
                    id: 1,
                    DEFAULT_BUFFER_SIZE: 3
                }
                //$webGLMesh.setGeometry($payload);
                console.log('webGLMesh: ', $webGLMesh);
                $webGLMesh.setGeometry('Box');
            },
            'glossiness': function($webGLMesh, $payload) {
                $webGLMesh.setGlossiness($payload);
            },
            'metallness': function($webGLMesh, $payload) {
                $webGLMesh.setMetallness($payload);
            },
            'flatShading': function($webGLMesh, $payload) {
                $webGLMesh.setFlatShading($payload);
            },
            'positionOffset': function($webGLMesh, $payload) {
                $webGLMesh.setPositionOffset($payload);
            }
        }
    },
     states: {
        'color': ['rgb', 0.5, 0.5, 0.5],
        // bug in setNormals
        //'normals': [0, 0, 0],
        'glossiness': 0,
        'metallness': 0,
        'flatShading': 0,
        'positionOffset': [0, 0, 0]
     }
});
