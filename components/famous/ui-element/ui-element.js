BEST.component('famous:ui-element', {
    tree: 'ui-element.html',
    behaviors: {
        '$self' : {
            '$yield' : true,
            '$self:use-child-size': function(useChildSize) {
                return useChildSize;
            }
        },
        '#view' : {
            'align': function(align) {
                return align;
            },
            'align-x': function(alignX) {
                return alignX;
            },
            'align-y': function(alignY) {
                return alignY;
            },
            'align-z': function(alignZ) {
                return alignZ;
            },
            'mount-point': function(mountPoint) {
                return mountPoint;
            },
            'mount-point-x': function(mountPointX) {
                return mountPointX;
            },
            'mount-point-y': function(mountPointY) {
                return mountPointY;
            },
            'mount-point-z': function(mountPointZ) {
                return mountPointZ;
            },
            'opacity': function(opacity) {
                return opacity;
            },
            'origin': function(origin) {
                return origin;
            },
            'origin-x': function(originX) {
                return originX;
            },
            'origin-y': function(originY) {
                return originY;
            },
            'origin-z': function(originZ) {
                return originZ;
            },
            'position': function(position) {
                return position;
            },
            'position-x': function(positionX) {
                return(positionX);
            },
            'position-y': function(positionY) {
                return positionY;
            },
            'position-z': function(positionZ) {
                return positionZ;
            },
            'rotation': function(rotation) {
                return rotation;
            },
            'rotation-x': function(rotationX) {
                return rotationX;
            },
            'rotation-y': function(rotationY) {
                return rotationY;
            },
            'rotation-z': function(rotationZ) {
                return rotationZ;
            },
            'scale': function(scale) {
                return scale;
            },
            'scale-x': function(scaleX) {
                return scaleX;
            },
            'scale-y': function(scaleY) {
                return scaleY;
            },
            'scale-z': function(scaleZ) {
                return scaleZ;
            },
            'size': function(size) {
                return size;
            },
            'size-absolute': function(sizeAbsolute) {
                return sizeAbsolute;
            },
            'size-proportional': function(sizeProportional) {
                return sizeProportional;
            },
            'size-differential': function(sizeDifferential) {
                return sizeDifferential;
            }
        },
        '#element' : {
            'id': function(id) {
                return id;
            },
            'content': function(content) {
                return content;
            },
            'style': function(style) {
                return style;
            },
            'attributes': function(attributes) {
                return attributes;
            },
            'unselectable': function(unselectable) {
                return unselectable;
            },
            'backface-visible': function(backfaceVisible) {
                return backfaceVisible;
            },
            'box-shadow': function(boxShadow) {
                return boxShadow;
            },
            'true-size': function(trueSize) {
                return trueSize;
            },
            'template': function(template) {
                return template;
            }
        }
    },

    events: {
        public: {
            // famous:view events
            'align': function() {
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
            },

            // famous:html-element events
            '$yield': function(state, message) {
                var content = '';
                var surrogates = message.surrogateRoot.childNodes;
                for (var i = 0; i < surrogates.length; i++) {
                    var outerHTML = surrogates[i].outerHTML;
                    content += (outerHTML) ? outerHTML : '';
                }
                state.set('content', content);
            },
            'id': function(state, message) {
                state.set('id', message);
            },
            'content': function(state, message) {
                state.set('content', message);
            },
            'style': function(state, message) {
                state.set('style', message);
            },
            'attributes': function(state, message) {
                state.set('attributes', message);
            },
            'unselectable': function(state, message) {
                state.set('unselectable', message);
            },
            'backface-visible': function(state, message) {
                state.set('backfaceVisible', message);
            },
            'box-shadow': function(state, message) {
                state.set('boxShadow', message);
            },
            'true-size': function(state, message) {
                state.set('trueSize', message);
            },
            'template': function(state, message) {
                state.set('template', message);
            },

            'use-child-size' : function(state, message) {
                state.set('useChildSize', message);
            }
        },
        handlers: {
            'use-child-size' : function($HTMLElement, $payload) {
                $HTMLElement.trueSize(!!$payload, !!$payload);
            }
        }
    },
    states: {
        useChildSize: true
    }
});
