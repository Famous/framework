BEST.module('super.demo.day:layouts:scroll-view-item', 'HEAD', {
    behaviors: {
        '#item' : {
            content: '[[setter]]',
            'size-absolute-y' : '[[identity|height]]',
            position : '[[setter]]',
            style: '[[setter]]',
            scale: '[[setter]]',
            origin: [0.5, 0.5],
            'rotation-x' : '[[setter|camel]]'
        },
        '#event-catcher' : {
            'size-absolute-y' : '[[identity|height]]',
            position : function(position, height) {
                return [position[0], position[1], 10]; // Push the event-catcher in-front of the item
            },
            style: {
                opacity: 0,
                cursor: 'pointer'
            },
            origin: [0.5, 0.5],
        }
    },
    events: {
        $public: {
            'content' : '[[setter]]',
            'height' : '[[setter]]',
            'position' : '[[setter]]',
            'style' : '[[setter]]'
        },
        /*
        A see-through <ui-element> is overlayed on top of the actual scroll-view-item in order
        to easily capture events without having to account for the item's rotation / animation.
         */
        '#event-catcher' : {
            'mouseenter' : function($state) {
                if (!$state.get('animateHover')) {
                    return;
                }

                if (!$state.get('blockHover')) {
                    $state.set('blockHover', true);

                    var rotation = $state.get('rotationX') > 0 ? 0 : Math.PI * 2;

                    $state.set('rotationX', rotation, {duration: 600})
                        .thenSet('blockHover', false);
                }
            },
            'click' : function($dispatcher, $state, $payload) {
                $dispatcher.emit('item-click', {
                    index: $state.get('$index'),
                    value: $payload
                });

                if ($state.get('animateClick')) {
                    $state.set('scale', [0.8, 0.8], {duration: 50})
                        .thenSet('scale', [1, 1], {duration: 100, curve: 'outBounce'});
                }
            },
        },
    },
    states: {
        content: 'Scroll view item',
        height: 100,
        position: [0, 0],
        style: {},
        animateClick: true,
        scale: [1, 1],
        animateHover: true,
        blockHover: false,
        rotationX: 0
    },
    tree: 'scroll-view-item.html',
});
