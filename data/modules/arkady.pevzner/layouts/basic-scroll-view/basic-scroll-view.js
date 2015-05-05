BEST.module('arkady.pevzner:layouts:basic-scroll-view', {
    behaviors: {
        '#container' : {
            'overflow' : 'scroll'
        },
        '#item' : {
            'height' : function(itemHeight) {
                return itemHeight;
            },
            '$repeat' : function(count, itemHeight) {
                var result = [];
                for (var i = 0; i < count; i++) {
                    result.push({
                        content: 'Item ' + i,
                        position: [0, i * itemHeight]
                    });
                }
                return result;
            },
            'style' : function(itemStyle) {
                return itemStyle;
            }
        }
    },
    events: {
        '$public' : {
            'count': 'setter',
            'item-height': 'setter|camel',
            'content': 'setter',
            'item-style' : 'setter|camel'
        },
        '#item' : {
            'item-click' : function($dispatcher, $state, $payload) {}
        }
    },
    states: {
        count: 0,
        itemHeight: 100,
        content: [],
        itemStyle : {
            'border' : '1px solid black'
        }
    },
    tree: 'basic-scroll-view.html',
})
.config({
    imports: {
        'famous:core': ['view'],
        'arkady.pevzner:layouts' : ['scroll-view-item']
    }
});
