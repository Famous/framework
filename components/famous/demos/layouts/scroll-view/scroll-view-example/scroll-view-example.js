BEST.scene('famous:demos:layouts:scroll-view:scroll-view-example', {
    behaviors: {
        'scroll-view' : {
            'item-height' : '[[identity|itemHeight]]'
        },
        '.scroll-view-item' : {
            'size-absolute-y' : '[[identity|itemHeight]]',
            'style': {
                'background-color': '#49afeb',
                'border' : '1px solid black'
            }
        }
    },
    events: {
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
