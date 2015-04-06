BEST.component('famous:core:components', {
    events: {
        handlers: {
            'align': function($align, $payload) {
                $align.set($payload[0], $payload[1], $payload[2] || 0);
            },
            'align-x': function($align, $payload) {
                $align.setX($payload);
            },
            'align-y': function($align, $payload) {
                $align.setY($payload);
            },
            'align-z': function($align, $payload) {
                $align.setZ($payload);
            },
            'camera': function($camera, $payload) {
                $camera.set($payload[0], $payload[1]);
            },
            'mount-point': function($mountPoint, $payload) {
                $mountPoint.set($payload[0], $payload[1], $payload[2] || 0);
            },
            'mount-point-x': function($mountPoint, $payload) {
                $mountPoint.setX($payload);
            },
            'mount-point-y': function($mountPoint, $payload) {
                $mountPoint.setY($payload);
            },
            'mount-point-z': function($mountPoint, $payload) {
                $mountPoint.setZ($payload);
            },
            'opacity': function($opacity, $payload) {
                $opacity.set($payload);
            },
            'origin': function($origin, $payload) {
                $origin.set($payload[0], $payload[1], $payload[2] || 0);
            },
            'origin-x': function($origin, $payload) {
                $origin.setX($payload);
            },
            'origin-y': function($origin, $payload) {
                $origin.setY($payload);
            },
            'origin-z': function($origin, $payload) {
                $origin.setZ($payload);
            },
            'position': function($position, $payload) {
                $position.set($payload[0], $payload[1], $payload[2] || 0);
            },
            'position-x': function($position, $payload) {
                $position.setX($payload);
            },
            'position-y': function($position, $payload) {
                $position.setY($payload);
            },
            'position-z': function($position, $payload) {
                $position.setZ($payload);
            },
            'rotation': function($rotation, $payload) {
                $rotation.set($payload[0], $payload[1], $payload[2] || 0);
            },
            'rotation-x': function($rotation, $payload) {
                $rotation.setX($payload);
            },
            'rotation-y': function($rotation, $payload) {
                $rotation.setY($payload);
            },
            'rotation-z': function($rotation, $payload) {
                $rotation.setZ($payload);
            },
            'scale': function($scale, $payload) {
                $scale.set($payload[0], $payload[1], $payload[2] || 1);
            },
            'scale-x': function($scale, $payload) {
                $scale.setX($payload);
            },
            'scale-y': function($scale, $payload) {
                $scale.setY($payload);
            },
            'scale-z': function($scale, $payload) {
                $scale.setZ($payload);
            },
            'size-absolute': function($size, $payload) {
                $size.setAbsolute($payload[0], $payload[1], $payload[2]);
            },
            'size-proportional': function($size, $payload) {
                $size.setProportional($payload[0], $payload[1], $payload[2]);
            },
            'size-differential': function($size, $payload) {
                $size.setDifferential($payload[0], $payload[1], $payload[2]);
            }
        }
    }
});
