BEST.module('famous:physics:bodies:particle', {
    behaviors: {
        '$self': {
            'famous:physics:angular-momentum': function(angularMomentum) {
                return angularMomentum;
            },
            'famous:physics:angular-velocity': function(angularVelocity) {
                return angularVelocity;
            },
            'famous:physics:force': function(force) {
                return force;
            },
            'famous:physics:friction': function(friction) {
                return friction;
            },
            'famous:physics:mass': function(mass) {
                return mass;
            },
            'famous:physics:orientation': function(orientation) {
                return orientation;
            },
            'famous:physics:position': function(position) {
                return position;
            },
            'famous:physics:torque': function(torque) {
                return torque;
            }
        }
    },
    events: {
        '$public': {
            'angular-momentum': function($state, $payload) {
                $state.set('angularMomentum', $payload);
            },
            'angular-velocity': function($state, $payload) {
                $state.set('angularVelocity', $payload);
            },
            'force': function($state, $payload) {
                $state.set('force', $payload);
            },
            'friction': function($state, $payload) {
                $state.set('friction', $payload);
            },
            'mass': function($state, $payload) {
                $state.set('mass', $payload);
            },
            'orientation': function($state, $payload) {
                $state.set('orientation', $payload);
            },
            'position': function($state, $payload) {
                $state.set('position', $payload);
            },
            'torque': function($state, $payload) {
                $state.set('torque', $payload);
            }
        }
    },
    states: {
        angularMomentum: [0,0,0],
        angularVelocity: [0,0,0],
        force: [0,0,0],
        friction: [0,0,0],
        mass: [0,0,0],
        orientation: [0,0,0,0],
        position: [0,0,0],
        torque: [0,0,0]
    }
});
