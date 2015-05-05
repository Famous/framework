BEST.module('arkady.pevzner:layouts:scroll-view-item', {
    behaviors: {
        '#item' : {
            content: function(content) {
                return content;
            },
            'size-absolute-y' : function(height) {
                return height;
            },
            'position' : function(position) {
                return position;
            },
            style: function(style) {
                return style;
            },
            scale: function(scale) {
                return scale;
            },
            origin: [0.5, 0.5]

        }
    },
    events: {
        $public: {
            'content' : 'setter',
            'height' : 'setter',
            'position' : function($payload, $state){
                // console.log($state.get('content'), $payload);
                $state.set('position', $payload);
            },
            'style' : 'setter'
        },
        '#item' : {
            'ui-click' : function($dispatcher, $state, $payload) {
                $dispatcher.emit('item-click', {
                    index: $state.get('$index'),
                    value: $payload
                });

                if ($state.get('animateClick')) {
                    $state.set('scale', [0.8, 0.8], {duration: 50})
                        .thenSet('scale', [1, 1], {duration: 100, curve: 'outBounce'});
                }
            }
        }
    },
    states: {
        content: 'Scroll view item',
        height: 100,
        position: [0, 0],
        style: {},
        animateClick: true,
        scale: [1, 1]
    },
    tree: 'scroll-view-item.html',
})
.config({
    imports: {
        'famous:core': ['ui-element']
    }
});
