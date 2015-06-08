BEST.scene('famous:demos:layouts:scroll-view:scroll-view-example', {
    behaviors: {
        'scroll-view' : {
            'item-height' : '[[identity|itemHeight]]'
        },
        '.scroll-view-item' : {
            'size-absolute-y' : '[[identity|itemHeight]]',
            'style': {
                'background-color': '#49afeb',
                'border' : '1px solid black',
                'padding': '20px',
                'font-family' : 'Lato, Helvetica, sans-serif',
                'font-size': '24px',
                'color' : 'white'
            }
        }
    },
    events: {
        '.scroll-view-item' : {
            'click' : function($index) {
                console.log('click', $index);
            }
        }
    }, 
    states: {
        itemHeight: 150
    }, 
    tree: 'scroll-view-example.jade'
})
.config({
    imports: {
        'famous:demos:layouts': ['scroll-view']
    }
});
