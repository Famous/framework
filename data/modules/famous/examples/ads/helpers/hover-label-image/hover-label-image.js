BEST.module('famous:examples:ads:helpers:hover-label-image', {
    tree: 'hover-label-image.html',
    behaviors: {
        '#label' : {
            'content' : function(label) {
                return label;
            },
            'origin' : [0.5, 1],
            'position' : function(labelSize, labelPosition) {
                return [labelPosition[0], labelPosition[1] -labelSize[1]];
            },
            'size': function(labelSize) {
                return labelSize;
            },
            'rotation-x': function(rotationX) {
                return rotationX;
            },
            style: function(labelStyle) {
                return labelStyle;
            }
        },
        '#image' : {
            'content' : function(imageUrl) {
                return '<img src="' + imageUrl + '">';
            },
            'true-size': true,
            'style': {
                'cursor': 'pointer'
            }
        },
        '#container' : {
            'position' : function(position) {
                return position;
            },
            size: function(size) {
                return size;
            }
        },
        '#animate' : {
            'position' : function(animationPosition) {
                return animationPosition;
            }
        }
    },
    events: {
        '$public': {
            'position' : 'setter',
            'size' : 'setter',
            'image-url': 'setter|camel',
            'image-size': 'setter|camel',
            'label': 'setter',
            'label-size' : 'setter|camel',
            'animate-in-curve': 'setter|camel',
            'animate-out-curve': 'setter|camel',
            'label-style': 'setter|camel',
            'animation-position' : 'setter|camel',
            'rotation-x' : 'setter|camel',
            'label-position': 'setter|camel'
        },
        '#image' : {
            'famous:events:mouseenter': function($state, $payload, $dispatcher) {
                $state.set('rotationX', 0, $state.get('animateInCurve'));
                $dispatcher.emit('start-hover', {
                    'payload' : $payload,
                    'index' : $state.get('$index')
                });
            },
            'famous:events:mouseleave': function($state, $payload, $dispatcher) {
                $state.set('rotationX', Math.PI/2, $state.get('animateInCurve'));
                $dispatcher.emit('end-hover', {
                    'payload' : $payload,
                    'index' : $state.get('$index')
                });
            }
        }
    },
    states: {
        imageUrl: 'http://famo.us/assets/images/famous_logo.svg',
        label: 'Famo.us',
        labelStyle: {},
        labelSize: [50, 30],
        animateInCurve: {duration: 300, curve: 'easeOut'},
        animateOutCurve: {duration: 300, curve: 'easeOut'},
        rotatationX: Math.PI/2,
        imageSize: [true, true],
        labelPosition: [0, 0]
    }
});
