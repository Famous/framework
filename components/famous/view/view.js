BEST.component('famous:view', {
    behaviors: {
        '$self': {
            '$yield' : true,
            'famous:components:align': function(align) {
                return align;
            },
            'famous:components:align-x': function(alignX) {
                return alignX;
            },
            'famous:components:align-y': function(alignY) {
                return alignY;
            },
            'famous:components:align-z': function(alignZ) {
                return alignZ;
            },
            'famous:components:mount-point': function(mountPoint) {
                return mountPoint;
            },
            'famous:components:mount-point-x': function(mountPointX) {
                return mountPointX;
            },
            'famous:components:mount-point-y': function(mountPointY) {
                return mountPointY;
            },
            'famous:components:mount-point-z': function(mountPointZ) {
                return mountPointZ;
            },
            'famous:components:opacity': function(opacity) {
                return opacity;
            },
            'famous:components:origin': function(origin) {
                return origin;
            },
            'famous:components:origin-x': function(originX) {
                return originX;
            },
            'famous:components:origin-y': function(originY) {
                return originY;
            },
            'famous:components:origin-z': function(originZ) {
                return originZ;
            },
            'famous:components:position': function(position) {
                return position;
            },
            'famous:components:position-x': function(positionX) {
                return positionX;
            },
            'famous:components:position-y': function(positionY) {
                return positionY;
            },
            'famous:components:position-z': function(positionZ) {
                return positionZ;
            },
            'famous:components:rotation': function(rotation) {
                return rotation;
            },
            'famous:components:rotation-x': function(rotationX) {
                return rotationX;
            },
            'famous:components:rotation-y': function(rotationY) {
                return rotationY;
            },
            'famous:components:rotation-z': function(rotationZ) {
                return rotationZ;
            },
            'famous:components:scale': function(scale) {
                return scale;
            },
            'famous:components:scale-x': function(scaleX) {
                return scaleX;
            },
            'famous:components:scale-y': function(scaleY) {
                return scaleY;
            },
            'famous:components:scale-z': function(scaleZ) {
                return scaleZ;
            },
            'famous:components:size-absolute': function(sizeAbsolute) {
                return sizeAbsolute;
            },
            'famous:components:size-proportional': function(sizeProportional) {
                return sizeProportional;
            },
            'famous:components:size-differential': function(sizeDifferential) {
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
