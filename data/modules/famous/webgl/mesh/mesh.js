BEST.module('famous:webgl:mesh', {
    tree: 'mesh.html',
    behaviors: {
        '$self': {
            '$self:assign-color': function(color) {
                return color;
            },
            '$self:assign-geometry': function(geometry) {
                return geometry;
            },
            '$self:assign-flat-shading': function(flatShading) {
                return flatShading;
            },
            '$self:assign-position-offset': function(positionOffset) {
                return positionOffset;
            }
        },
        '#material-wrapper': {
            '$yield': '#material'
        },
        '#geometry-wrapper': {
            '$yield': '#geometry'
        },
        '#shaders-wrapper': {
            '$yield': '.shader'
        }
    },
    events: {
        '$public': {
            'color': function($state, $payload) {
                $state.set('color', $payload);
            },
            'geometry': function($state, $payload) {
                $state.set('geometry', $payload);
            },
            'flat-shading': function($state, $payload) {
                $state.set('flatShading', $payload);
            },
            'position-offset': function($state, $payload) {
                $state.set('positionOffset', $payload);
            }
        },
        '#geometry-wrapper': {
            'shape-change': function($state, $payload) {
                $state.set('geometry', $payload.detail);
            }
        },
        '#material-wrapper': {
            'entry-point-change': function($state, $payload) {
                $state.set('entryPoint', $payload.detail);
            },
            'color-change': function($state, $payload) {
                // TODO
            }
        },
        '#shaders-wrapper': {
            'glsl-change': function($state, $payload) {
                $state.set('glsl', $payload.detail);
                $state.set('color', {
                    entryPoint: $state.get('entryPoint') || false,
                    glsl: $state.get('glsl')
                });
            }
        },
        '$private': {
            'assign-color': function($webGLMesh, $material, $payload) {
                var entryPoint = $payload.entryPoint;
                var funcString = '';
                if (entryPoint === false) {
                    funcString = $payload.glsl;
                    $material.registerExpression(funcString, {
                        glsl: $payload.glsl
                    });
                }
                else {
                    funcString = entryPoint.slice(0, entryPoint.length - 3);
                    $material.registerExpression(funcString, {
                        defines: $payload.glsl,
                        glsl: entryPoint
                    });
                }
                $webGLMesh.setBaseColor($material[funcString]());
            },
            'assign-geometry': function($webGLMesh, $payload) {
                $webGLMesh.setGeometry($payload);
            },
            'assign-flat-shading': function($webGLMesh, $payload) {
                $webGLMesh.setFlatShading($payload);
            },
            'assign-position-offset': function($webGLMesh, $payload) {
                $webGLMesh.setPositionOffset($payload);
            }
        }
    }
});
