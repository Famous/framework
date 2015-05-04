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
            'align': 'setter',
            'align-x': 'setter|camel',
            'align-y': 'setter|camel',
            'align-z': 'setter|camel',
            'mount-point': 'setter|camel',
            'mount-point-x': 'setter|camel',
            'mount-point-y': 'setter|camel',
            'mount-point-z': 'setter|camel',
            'opacity': 'setter',
            'origin': 'setter',
            'origin-x': 'setter|camel',
            'origin-y': 'setter|camel',
            'origin-z': 'setter|camel',
            'position': 'setter',
            'position-x': 'setter|camel',
            'position-y': 'setter|camel',
            'position-z': 'setter|camel',
            'offset-position' : 'setter|camel',
            'rotation': 'setter',
            'rotation-x': 'setter|camel',
            'rotation-y': 'setter|camel',
            'rotation-z': 'setter|camel',
            'scale': 'setter',
            'scale-x': 'setter|camel',
            'scale-y': 'setter|camel',
            'scale-z': 'setter|camel',

            'size': function($state, $payload){
                  $state.set('sizeAbsolute', $payload);
            },
            'size-absolute': 'setter|camel',
            'size-absolute-x': 'setter|camel',
            'size-absolute-y': 'setter|camel',
            'size-absolute-z': 'setter|camel',

            'size-proportional': 'setter|camel',
            'size-proportional-x': 'setter|camel',
            'size-proportional-y': 'setter|camel',
            'size-proportional-z': 'setter|camel',

            'size-differential': 'setter|camel',
            'size-differential-x': 'setter|camel',
            'size-differential-y': 'setter|camel',
            'size-differential-z': 'setter|camel',

            'overflow' : function($DOMElement, $payload) { $DOMElement.setProperty('overflow', $payload); },
            'border' : function($DOMElement, $payload) { $DOMElement.setProperty('border', $payload); }
        }
    }
});
