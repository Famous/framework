BEST.module('famous:core:view', {
    behaviors: {
        '$self': {
            '$yield' : true,
            'famous:core:components:align': function(align) { return align; },
            'famous:core:components:align-x': function(alignX) { return alignX; },
            'famous:core:components:align-y': function(alignY) { return alignY; },
            'famous:core:components:align-z': function(alignZ) { return alignZ; },
            'famous:core:components:mount-point': function(mountPoint) { return mountPoint; },
            'famous:core:components:mount-point-x': function(mountPointX) { return mountPointX; },
            'famous:core:components:mount-point-y': function(mountPointY) { return mountPointY; },
            'famous:core:components:mount-point-z': function(mountPointZ) { return mountPointZ; },
            'famous:core:components:opacity': function(opacity) { return opacity; },
            'famous:core:components:origin': function(origin) { return origin; },
            'famous:core:components:origin-x': function(originX) { return originX; },
            'famous:core:components:origin-y': function(originY) { return originY; },
            'famous:core:components:origin-z': function(originZ) { return originZ; },
            'famous:core:components:position': function(position) { return position; },
            'famous:core:components:position-x': function(positionX) { return positionX; },
            'famous:core:components:position-y': function(positionY) { return positionY; },
            'famous:core:components:position-z': function(positionZ) { return positionZ; },
            'famous:core:components:offset-position': function(offsetPosition) { return offsetPosition; },
            'famous:core:components:rotation': function(rotation) { return rotation; },
            'famous:core:components:rotation-x': function(rotationX) { return rotationX; },
            'famous:core:components:rotation-y': function(rotationY) { return rotationY; },
            'famous:core:components:rotation-z': function(rotationZ) { return rotationZ; },
            'famous:core:components:scale': function(scale) { return scale; },
            'famous:core:components:scale-x': function(scaleX) { return scaleX; },
            'famous:core:components:scale-y': function(scaleY) { return scaleY; },
            'famous:core:components:scale-z': function(scaleZ) { return scaleZ; },

            'famous:core:components:size-absolute': function(sizeAbsolute) { return sizeAbsolute; },
            'famous:core:components:size-absolute-x': function(sizeAbsoluteX) { return sizeAbsoluteX; },
            'famous:core:components:size-absolute-y': function(sizeAbsoluteY) { return sizeAbsoluteY; },
            'famous:core:components:size-absolute-z': function(sizeAbsoluteZ) { return sizeAbsoluteZ; },

            'famous:core:components:size-proportional': function(sizeProportional) { return sizeProportional; },
            'famous:core:components:size-proportional-x': function(sizeProportionalX) { return sizeProportionalX; },
            'famous:core:components:size-proportional-y': function(sizeProportionalY) { return sizeProportionalY; },
            'famous:core:components:size-proportional-z': function(sizeProportionalZ) { return sizeProportionalZ; },

            'famous:core:components:size-differential': function(sizeDifferential) { return sizeDifferential; },
            'famous:core:components:size-differential-x': function(sizeDifferentialX) { return sizeDifferentialX; },
            'famous:core:components:size-differential-y': function(sizeDifferentialY) { return sizeDifferentialY; },
            'famous:core:components:size-differential-z': function(sizeDifferentialZ) { return sizeDifferentialZ; },
        }
    },
    events: {
        '$public': {
            'align': function($state, $payload) { $state.set('align', $payload); },
            'align-x': function($state, $payload) { $state.set('alignX', $payload); },
            'align-y': function($state, $payload) { $state.set('alignY', $payload); },
            'align-z': function($state, $payload) { $state.set('alignZ', $payload); },
            'mount-point': function($state, $payload) { $state.set('mount-point', $payload); },
            'mount-point-x': function($state, $payload) { $state.set('mountPointX', $payload); },
            'mount-point-y': function($state, $payload) { $state.set('mountPointY', $payload); },
            'mount-point-z': function($state, $payload) { $state.set('mountPointZ', $payload); },
            'opacity': function($state, $payload) { $state.set('opacity', $payload); },
            'origin': function($state, $payload) { 
                $state.set('origin', $payload); 
                console.log('set origin', $payload);
            },
            'origin-x': function($state, $payload) { $state.set('originX', $payload); },
            'origin-y': function($state, $payload) { $state.set('originY', $payload); },
            'origin-z': function($state, $payload) { $state.set('originZ', $payload); },
            'position': function($state, $payload) { $state.set('position', $payload); },
            'position-x': function($state, $payload) { $state.set('positionX', $payload); },
            'position-y': function($state, $payload) { $state.set('positionY', $payload); },
            'position-z': function($state, $payload) { $state.set('positionZ', $payload); },
            'offset-position' : function($state, $payload) { $state.set('offsetPosition', $payload); },
            'rotation': function($state, $payload) { $state.set('rotation', $payload); },
            'rotation-x': function($state, $payload) { $state.set('rotationX', $payload); },
            'rotation-y': function($state, $payload) { $state.set('rotationY', $payload); },
            'rotation-z': function($state, $payload) { $state.set('rotationZ', $payload); },
            'scale': function($state, $payload) { $state.set('scale', $payload); },
            'scale-x': function($state, $payload) { $state.set('scaleX', $payload); },
            'scale-y': function($state, $payload) { $state.set('scaleY', $payload); },
            'scale-z': function($state, $payload) { $state.set('scaleZ', $payload); },

            'size': function($state, $payload) { $state.set('sizeAbsolute', $payload); },
            'size-absolute': function($state, $payload) { $state.set('sizeAbsolute', $payload); },
            'size-absolute-x': function($state, $payload) { $state.set('sizeAbsoluteX', $payload); },
            'size-absolute-y': function($state, $payload) { $state.set('sizeAbsoluteY', $payload); },
            'size-absolute-z': function($state, $payload) { $state.set('sizeAbsoluteZ', $payload); },

            'size-proportional': function($state, $payload) { $state.set('sizeProportional', $payload); },
            'size-proportional-x': function($state, $payload) { $state.set('sizeProportionalX', $payload); },
            'size-proportional-y': function($state, $payload) { $state.set('sizeProportionalY', $payload); },
            'size-proportional-z': function($state, $payload) { $state.set('sizeProportionalZ', $payload); },

            'size-differential': function($state, $payload) { $state.set('sizeDifferential', $payload); },
            'size-differential-x': function($state, $payload) { $state.set('sizeDifferentialX', $payload); },
            'size-differential-y': function($state, $payload) { $state.set('sizeDifferentialY', $payload); },
            'size-differential-z': function($state, $payload) { $state.set('sizeDifferentialZ', $payload); },

            'overflow' : function($DOMElement, $payload) { $DOMElement.setProperty('overflow', $payload); }
        }
    }
});
