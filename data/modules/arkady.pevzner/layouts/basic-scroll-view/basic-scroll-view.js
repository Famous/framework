BEST.module('arkady.pevzner:layouts:basic-scroll-view', {
    tree: 'basic-scroll-view.html',
    behaviors: {
        '#container' : {
            'overflow' : 'scroll'
        },
        '#view' : {
            'size-absolute-y' : function(itemHeight) {
                return itemHeight;
            },
            '$repeat' : function(count, itemHeight) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        position: [0, i * itemHeight]
                    });
                }
                return result;
            }
        },
        '.el' : {
            style : {
                'border' : '1px solid black'
            }
        }
    },
    events: {
    },
    states: {
        count: 50,
        itemHeight: 100
    }
})
.config({
    imports: {
        'famous:core': ['view', 'dom-element']
    }
});
