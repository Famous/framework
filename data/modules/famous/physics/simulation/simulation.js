BEST.module('famous:physics:simulation', {
    behaviors: {
        '$self': {
            '$self:speed': function(speed) {
                return speed;
            },
            '$self:step': function(step) {
                return step;
            },
            '$self:iterations': function(iterations) {
                return iterations;
            },
            '$self:origin': function(origin) {
                return origin;
            },
            '$self:orientation': function(orientation) {
                return orientation;
            },
            '$self:frame-dependent': function(frameDependent) {
                return frameDependent;
            }
        }
    },
    events: {
        '$public': {
            'speed': 'setter',
            'step': 'setter',
            'iterations': 'setter',
            'origin': 'setter',
            'orientation': 'setter',
            'frame-dependent': 'setter|camel'
        },
        '$private': {
            'speed': function($physicsEngine, $payload) {
                $physicsEngine.speed = $payload;
            },
            'step': function($physicsEngine, $payload) {
                $physicsEngine.step = $payload;
            },
            'iterations': function($physicsEngine, $payload) {
                $physicsEngine.iterations = $payload;
            },
            'origin': function($physicsEngine, $payload) {
                $physicsEngine.setOrigin($payload[0], $payload[1], $payload[2]);
            },
            'orientation': function($physicsEngine, $payload) {
                $physicsEngine.setOrientation($payload[0], $payload[1], $payload[2], $payload[3]);
            },
            'frame-dependent': function($physicsEngine, $payload) {
                $physicsEngine.frameDependent = $payload;
            }
        }
    },
    states: {
        'speed': 1.0,
        'step': 1000 / 60,
        'iterations': 10,
        'origin': [0, 0, 0],
        'orientation': [0, 0, 0, 0],
        'frameDependent': false
    }
});
