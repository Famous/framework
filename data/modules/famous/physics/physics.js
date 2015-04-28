BEST.module('famous:physics', {
    events: {
        '$public': {
            'angular-momentum': function($body, $payload) {
                $body.setAngularMomentum($payload[0], $payload[1], $payload[2]);
            },
            'angular-velocity': function($body, $payload) {
                $body.setAngularVelocity($payload[0], $payload[1], $payload[2]);
            },
            'direction': function($body, $payload) {
                // For walls; not yet implemented
            },
            'force': function($body, $payload) {
                $body.setForce($payload[0], $payload[1], $payload[2]);
            },
            'friction': function($body, $payload) {
                $body.setFriction($payload[0], $payload[1], $payload[2]);
            },
            'mass': function($body, $payload) {
                $body.setMass($payload[0], $payload[1], $payload[2]);
            },
            'orientation': function($body, $payload) {
                $body.setOrientation($payload[0], $payload[1], $payload[2], $payload[3]);
            },
            'position': function($body, $payload) {
                $body.setPosition($payload[0], $payload[1], $payload[2]);
            },
            'radius': function($body, $payload) {
                $body.setRadius($payload);
            },
            'size': function($body, $payload) {
                $body.setSize($payload[0], $payload[1], $payload[2]);
            },
            'torque': function($body, $payload) {
                $body.setTorque($payload[0], $payload[1], $payload[2]);
            }
        }
    }
});
