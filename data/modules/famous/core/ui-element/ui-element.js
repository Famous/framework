BEST.module('famous:core:ui-element', {
    tree: 'ui-element.html',
    behaviors: {
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
            'offset-position': function(offsetPosition) {
                return offsetPosition;
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
            'size-absolute-x': function(sizeAbsoluteX) {
                return sizeAbsoluteX;
            },
            'size-absolute-y': function(sizeAbsoluteY) {
                return sizeAbsoluteY;
            },
            'size-absolute-z': function(sizeAbsoluteZ) {
                return sizeAbsoluteZ;
            },
            'size-proportional': function(sizeProportional) {
                return sizeProportional;
            },
            'size-proportional-x': function(sizeProportionalX) {
                return sizeProportionalX;
            },
            'size-proportional-y': function(sizeProportionalY) {
                return sizeProportionalY;
            },
            'size-proportional-z': function(sizeProportionalZ) {
                return sizeProportionalZ;
            },
            'size-differential': function(sizeDiffential) {
                return sizeDiffential;
            },
            'size-differential-x': function(sizeDiffentialX) {
                return sizeDiffentialX;
            },
            'size-differential-y': function(sizeDiffentialY) {
                return sizeDiffentialY;
            },
            'size-differential-z': function(sizeDiffentialZ) {
                return sizeDiffentialZ;
            },
            'overflow' : function(overflow) {
                return overflow;
            },
            'border' : function(border) {
                return border;
            }
        },
        '#element' : {
            '$yield' : true,
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
            'template': function(template) {
                return template;
            }
        }
    },
    events: {
        '$public': {
            // famous:core:view events
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
            'size': 'setter',
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
            'overflow' : 'setter',
            'border' : 'setter',

            // famous:core:dom-element events
            'id': 'setter',
            'content': 'setter',
            'style': 'setter',
            'attributes': 'setter',
            'unselectable': 'setter',
            'backface-visible': 'setter|camel',
            'box-shadow': 'setter|camel',
            'template': 'setter'
        },

        '#element' : {
            // TODO --> Consider adding/removing to this list of default
            // event listeners
            'famous:events:click' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-click', $payload);
            },
            'famous:events:mouseenter' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-mouseenter', $payload);
            },
            'famous:events:mouseleave' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-mouseleave', $payload);
            },
            'famous:events:mousemove' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-mousemove', $payload);
            },
            'famous:events:mouseout' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-mouseout', $payload);
            },
            'famous:events:mouseover' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-mouseover', $payload);
            },
            'famous:events:resize' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-resize', $payload);
            },
            'famous:events:touchstart' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-touchstart', $payload);
            },
            'famous:events:touchmove' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-touchmove', $payload);
            },
            'famous:events:touchend' : function($dispatcher, $payload) {
                $dispatcher.emit('ui-touchend', $payload);
            }
        }
    }
});
