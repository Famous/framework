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
            'size' : function(itemHeight) {
                 return [undefined, itemHeight];
            },
            'position' : function($index, itemHeight) {
                return [0, $index * itemHeight];
            }
        }
    },
    events: {
        $public: {
            'item-height' : '[[setter|itemHeight]]',
            'scroll-view-position' : '[[setter|scrollViewPosition]]',
            'scroll-view-size' : '[[setter|scrollViewSize]]',
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
