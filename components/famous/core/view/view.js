BEST.component('famous:core:view', {
    behaviors: {
        '$self': {
            '$yield' : true,
            'famous:core:components:align': function(align) {
                return align;
            },
            'famous:core:components:align-x': function(alignX) {
                return alignX;
            },
            'famous:core:components:align-y': function(alignY) {
                return alignY;
            },
            'famous:core:components:align-z': function(alignZ) {
                return alignZ;
            },
            'famous:core:components:mount-point': function(mountPoint) {
                return mountPoint;
            },
            'famous:core:components:mount-point-x': function(mountPointX) {
                return mountPointX;
            },
            'famous:core:components:mount-point-y': function(mountPointY) {
                return mountPointY;
            },
            'famous:core:components:mount-point-z': function(mountPointZ) {
                return mountPointZ;
            },
            'famous:core:components:opacity': function(opacity) {
                return opacity;
            },
            'famous:core:components:origin': function(origin) {
                return origin;
            },
            'famous:core:components:origin-x': function(originX) {
                return originX;
            },
            'famous:core:components:origin-y': function(originY) {
                return originY;
            },
            'famous:core:components:origin-z': function(originZ) {
                return originZ;
            },
            'famous:core:components:position': function(position) {
                return position;
            },
            'famous:core:components:position-x': function(positionX) {
                return positionX;
            },
            'famous:core:components:position-y': function(positionY) {
                return positionY;
            },
            'famous:core:components:position-z': function(positionZ) {
                return positionZ;
            },
            'famous:core:components:rotation': function(rotation) {
                return rotation;
            },
            'famous:core:components:rotation-x': function(rotationX) {
                return rotationX;
            },
            'famous:core:components:rotation-y': function(rotationY) {
                return rotationY;
            },
            'famous:core:components:rotation-z': function(rotationZ) {
                return rotationZ;
            },
            'famous:core:components:scale': function(scale) {
                return scale;
            },
            'famous:core:components:scale-x': function(scaleX) {
                return scaleX;
            },
            'famous:core:components:scale-y': function(scaleY) {
                return scaleY;
            },
            'famous:core:components:scale-z': function(scaleZ) {
                return scaleZ;
            },
            'famous:core:components:size-absolute': function(sizeAbsolute) {
                return sizeAbsolute;
            },
            'famous:core:components:size-proportional': function(sizeProportional) {
                return sizeProportional;
            },
            'famous:core:components:size-differential': function(sizeDifferential) {
                return sizeDifferential;
            }
        }
    },
    events: {
        public: {
            'align': function(state, message) {
                state.set('align', message);
            },
            'align-x': function(state, message) {
                state.set('alignX', message);
            },
            'align-y': function(state, message) {
                state.set('alignY', message);
            },
            'align-z': function(state, message) {
                state.set('alignZ', message);
            },
            'mount-point': function(state, message) {
                state.set('mountPoint', message);
            },
            'mount-point-x': function(state, message) {
                state.set('mountPointX', message);
            },
            'mount-point-y': function(state, message) {
                state.set('mountPointY', message);
            },
            'mount-point-z': function(state, message) {
                state.set('mountPointZ', message);
            },
            'opacity': function(state, message) {
                state.set('opacity', message);
            },
            'origin': function(state, message) {
                state.set('origin', message);
            },
            'origin-x': function(state, message) {
                state.set('originX', message);
            },
            'origin-y': function(state, message) {
                state.set('originY', message);
            },
            'origin-z': function(state, message) {
                state.set('originZ', message);
            },
            'position': function(state, message) {
                state.set('position', message);
            },
            'position-x': function(state, message) {
                state.set('positionX', message);
            },
            'position-y': function(state, message) {
                state.set('positionY', message);
            },
            'position-z': function(state, message) {
                state.set('positionZ', message);
            },
            'rotation': function(state, message) {
                state.set('rotation', message);
            },
            'rotation-x': function(state, message) {
                state.set('rotationX', message);
            },
            'rotation-y': function(state, message) {
                state.set('rotationY', message);
            },
            'rotation-z': function(state, message) {
                state.set('rotationZ', message);
            },
            'scale': function(state, message) {
                state.set('scale', message);
            },
            'scale-x': function(state, message) {
                state.set('scaleX', message);
            },
            'scale-y': function(state, message) {
                state.set('scaleY', message);
            },
            'scale-z': function(state, message) {
                state.set('scaleZ', message);
            },
            'size': function(state, message) {
                state.set('sizeAbsolute', message);
            },
            'size-absolute': function(state, message) {
                state.set('sizeAbsolute', message);
            },
            'size-proportional': function(state, message) {
                state.set('sizeProportional', message);
            },
            'size-differential': function(state, message) {
                state.set('sizeDifferential', message);
            }
        }
    }
});
