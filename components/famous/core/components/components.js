BEST.module('famous:core:components', {
    events: {
        '$public': {
            'align': function($famousNode, $payload) { $famousNode.setAlign($payload[0], $payload[1], $payload[2]); },
            'align-x': function($famousNode, $payload) { $famousNode.setAlign($payload, null, null); },
            'align-y': function($famousNode, $payload) { $famousNode.setAlign(null, $payload, null); },
            'align-z': function($famousNode, $payload) { $famousNode.setAlign(null, null, $payload); },
            
            'camera': function($camera, $payload) { $camera.set($payload[0], $payload[1]); },

            'mount-point': function($famousNode, $payload) { $famousNode.setMountPoint($payload[0], $payload[1], $payload[2]); },
            'mount-point-x': function($famousNode, $payload) { $famousNode.setMountPoint($payload, null, null); },
            'mount-point-y': function($famousNode, $payload) { $famousNode.setMountPoint(null, $payload, null); },
            'mount-point-z': function($famousNode, $payload) { $famousNode.setMountPoint(null, null, $payload); },
            
            'opacity': function($famousNode, $payload) { $famousNode.setOpacity($payload); },
            
            'origin': function($famousNode, $payload) {$famousNode.setOrigin($payload[0], $payload[1], $payload[2]); },
            'origin-x': function($famousNode, $payload) { $famousNode.setOrigin($payload, null, null); },
            'origin-y': function($famousNode, $payload) { $famousNode.setOrigin(null, $payload, null); },
            'origin-z': function($famousNode, $payload) { $famousNode.setOrigin(null, null, $payload); },
            
            'position': function($famousNode, $payload) { $famousNode.setPosition($payload[0], $payload[1], $payload[2]); },
            'position-x': function($famousNode, $payload) { $famousNode.setPosition($payload, null, null); },
            'position-y': function($famousNode, $payload) { $famousNode.setPosition(null, $payload, null); },
            'position-z': function($famousNode, $payload) { $famousNode.setPosition(null, null, $payload); },
            
            'offset-position': function($famousNode, $payload) {
                var currentPos = $famousNode.getPosition();
                $famousNode.setPosition(
                    currentPos[0] + $payload[0] || 0,
                    currentPos[1] + $payload[1] || 0,
                    currentPos[2] + $payload[2] || 0
                );
            },

            'rotation': function($famousNode, $payload) { $famousNode.setRotation($payload[0], $payload[1], $payload[2], $payload[3]); },
            'rotation-x': function($famousNode, $payload) { $famousNode.setRotation($payload, null, null); },
            'rotation-y': function($famousNode, $payload) { $famousNode.setRotation(null, $payload, null); },
            'rotation-z': function($famousNode, $payload) { $famousNode.setRotation(null, null, $payload); },
            
            'scale': function($famousNode, $payload) { $famousNode.setScale($payload[0], $payload[1], $payload[2]); },
            'scale-x': function($famousNode, $payload) { $famousNode.setScale($payload, null, null); },
            'scale-y': function($famousNode, $payload) { $famousNode.setScale(null, $payload, null); },
            'scale-z': function($famousNode, $payload) { $famousNode.setScale(null, null, $payload); },

            'size-absolute': function($famousNode, $payload) {
                $famousNode.setSizeMode(1, 1, 1);
                $famousNode.setAbsoluteSize($payload[0], $payload[1], $payload[2]);
            },
            'size-absolute-x': function($famousNode, $payload) {
                $famousNode.setSizeMode(1, null, null);
                $famousNode.setAbsoluteSize($payload, null, null);
            },
            'size-absolute-y': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, 1, null);
                $famousNode.setAbsoluteSize(null, $payload, null);
            },
            'size-absolute-z': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, null, 1);
                $famousNode.setAbsoluteSize(null, null, $payload[2]);
            },

            'size-proportional': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, 0, 0);
                $famousNode.setProportionalSize($payload[0], $payload[1], $payload[2]);
            },
            'size-proportional-x': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, null, null);
                $famousNode.setProportionalSize($payload, null, null);
            },
            'size-proportional-y': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, 0, null);
                $famousNode.setProportionalSize(null, $payload, null);
            },
            'size-proportional-z': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, null, 0);
                $famousNode.setProportionalSize(null, null, $payload[2]);
            },

            'size-differential': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, 0, 0);
                $famousNode.setDifferentialSize($payload[0], $payload[1], $payload[2]);
            },
            'size-differential-x': function($famousNode, $payload) {
                $famousNode.setSizeMode(0, null, null);
                $famousNode.setDifferentialSize($payload, null, null);
            },
            'size-differential-y': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, 0, null);
                $famousNode.setDifferentialSize(null, $payload, null);
            },
            'size-differential-z': function($famousNode, $payload) {
                $famousNode.setSizeMode(null, null, 0);
                $famousNode.setDifferentialSize(null, null, $payload[2]);
            }
        }
    }
})
.config({
    extends: []
});
