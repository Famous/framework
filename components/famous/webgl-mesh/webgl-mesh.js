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
                if ($payload instanceof Array)
                    $webGLMesh.setBaseColor($payload[1], $payload[2], $payload[3]);
                else
                    $webGLMesh.setBaseColor($payload);
            },
            'normals': function($webGLMesh, $payload) {
                $webGLMesh.setNormals($payload);
            },
            'geometry': function($webGLMesh, $payload) {
                $webGLMesh.setGeometry($payload);
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
