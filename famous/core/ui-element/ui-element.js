BEST.module('famous:core:ui-element', 'HEAD', {
    tree: 'ui-element.html',
    behaviors: {
        '#view' : {
            'align' : '[[setter]]',
            'align-x' : '[[setter|camel]]',
            'align-y' : '[[setter|camel]]',
            'align-z' : '[[setter|camel]]',
            'mount-point' : '[[setter|camel]]',
            'mount-point-x' : '[[setter|camel]]',
            'mount-point-y' : '[[setter|camel]]',
            'mount-point-z' : '[[setter|camel]]',
            'opacity' : '[[setter]]',
            'origin' : '[[setter]]',
            'origin-x' : '[[setter|camel]]',
            'origin-y' : '[[setter|camel]]',
            'origin-z' : '[[setter|camel]]',
            'position' : '[[setter]]',
            'position-x' : '[[setter|camel]]',
            'position-y' : '[[setter|camel]]',
            'position-z' : '[[setter|camel]]',
            'offset-position' : '[[setter|camel]]',
            'rotation' : '[[setter]]',
            'rotation-x' : '[[setter|camel]]',
            'rotation-y' : '[[setter|camel]]',
            'rotation-z' : '[[setter|camel]]',
            'scale' : '[[setter]]',
            'scale-x' : '[[setter|camel]]',
            'scale-y' : '[[setter|camel]]',
            'scale-z' : '[[setter|camel]]',
            'size' : '[[setter]]',
            'size-absolute' : '[[setter|camel]]',
            'size-absolute-x' : '[[setter|camel]]',
            'size-absolute-y' : '[[setter|camel]]',
            'size-absolute-z' : '[[setter|camel]]',
            'size-proportional' : '[[setter|camel]]',
            'size-proportional-x' : '[[setter|camel]]',
            'size-proportional-y' : '[[setter|camel]]',
            'size-proportional-z' : '[[setter|camel]]',
            'size-differential' : '[[setter|camel]]',
            'size-differential-x' : '[[setter|camel]]',
            'size-differential-y' : '[[setter|camel]]',
            'size-differential-z' : '[[setter|camel]]',
            'overflow' : '[[setter]]',
            'border' : '[[setter]]',
        },
        '#element' : {
            '$yield' : true,
            'id' : '[[setter]]',
            'content' : '[[setter]]',
            'style' : '[[setter]]',
            'attributes' : '[[setter]]',
            'unselectable' : '[[setter]]',
            'backface-visible' : '[[setter|camel]]',
            'box-shadow' : '[[setter|camel]]',
            'template' : '[[setter]]'
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
