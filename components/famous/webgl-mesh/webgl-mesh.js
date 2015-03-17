BEST.component('famous:webgl-mesh', {
    behaviors: {
        '$self': {
            '$self:size': function(size) {
                return size;
            },
            '$self:color': function(color) {
                return color;
            },
            '$self:origin': function(origin) {
                return origin;
            },
            '$self:normals': function(normals) {
                return normals;
            },
            '$self:position': function(position) {
                return position;
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
            }
        }
    },
    events: {
        public: {
            'size': function(state, size) {
                state.set('size', size);
            },
            'color': function(state, color) {
                state.set('color', color);
            },
            'origin': function(state, origin) {
                state.set('origin', origin);
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
            }
        },
        handlers: {
            'size': function($webGLMesh, $payload) {
                $webGLMesh.setSize($payload);
            },
            'color': function($webGLMesh, $payload) {
                $webGLMesh.setBaseColor($payload);
            },
            'origin': function($webGLMesh, $payload) {
                $webGLMesh.setOrigin($payload);
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
            }
        }
    }
});
