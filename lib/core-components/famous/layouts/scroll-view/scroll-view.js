FamousFramework.scene('famous:layouts:scroll-view', {
    behaviors: {
        '$self': {
            position: '[[identity|scrollViewPosition]]', 
            size: '[[identity|scrollViewSize]]',
            style: function(border) {
                var style = {};
                style.overflow = 'scroll';
                if (border) style.border = border;
                return style;
            }
        },
        '.item' : {
            '$yield' : '.scroll-view-item',
            'position' : function($index, itemHeight) {
                return [0, $index * itemHeight];
            }
        }
    },
    events: {
        $public: {
            'item-height' : '[[setter|camel]]',
            'scroll-view-position' : '[[setter|camel]]',
            'scroll-view-size' : '[[setter|camel]]',
        }
    },
    states: {
        itemHeight: 100,
        scrollViewSize: [400, 800],
        scrollViewPosition: [0, 0],
        border: '3px solid #40b2e8'
    }, 
    tree: `
        <node class='item'></node>
    `
});
