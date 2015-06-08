BEST.scene('famous:demos:layouts:scroll-view', {
    behaviors: {
        '$self': {
            '$yield' : false, // overwrite <node>'s default $yield
            position: [50, 50],
            size: [400, 800],
            style: {
                'overflow' : 'scroll',
                'border' : '1px solid white'
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
            'item-height' : 'setter|camel'
        }
    },
    states: {
        itemHeight: 100
    }, 
    tree: `
        <node class='item'></node>
    `
});
