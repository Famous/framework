BEST.module('famous:webgl:geometry', {
    behaviors: {
        '$self': {
            '$self:assign-shape': function(shape) {
                return shape;
            },
            '$self:assign-detail': function(detail) {
                return detail;
            },
            '$self:assign-vertex-buffer': function(vertexBuffer) {
                return vertexBuffer;
            }
        }
    },
    events: {
        '$public': {
            'shape': function($state, $payload, $dispatcher) {
                $state.set('shape', $payload);
                $dispatcher.emit('shape-change', $payload);
            },
            'detail': function($state, $payload) {
                $state.set('detail', $payload);
            },
            'vertex-buffer': function($state, $payload) {
                $state.set('vertexBuffer', $payload);
            }
        },
        '$private': {
            'assign-shape': function($geometry, $payload) {},
            'assign-detail': function($geometry, $payload) {},
            'assign-vertex-buffer': function($geometry, $payload) {
                if ($payload === false) {
                    $geometry.spec.dynamic = false;
                } 
                else {
                    for (var i in $payload) {
                        $geometry.setVertexBuffer(i, $payload[i], 1);
                    }
                }
            }
        }
    },
    states: {
        'shape': '',
        'detail': null,
        'vertexBuffer': false
    }
});
