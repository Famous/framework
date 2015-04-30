BEST.module('arkady.pevzner:layouts:header-footer', {
    tree: 'header-footer.html',
    behaviors: {
        '#container' : {
        },
        '#header' : {
            '$yield' : '#header',
            'size-absolute-y' : function(headerHeight) {
                return headerHeight;
            }
        },
        '#body' : {
            '$yield' : '#body',
            'position' : function(headerHeight) {
                return [0, headerHeight]
            },
            'size-differential-y' : function(headerHeight, footerHeight) {
                return -headerHeight - footerHeight;
            }
            // 'size-absolute-y' : function() {
            //     return 300;
            // }
        },
        '#footer' : {
            '$yield' : '#footer',
            'size-absolute-y' : function(footerHeight) {
                return footerHeight;
            },
            'position-y': function(footerHeight) {
                return -footerHeight;
            },
            align: [0, 1],
        }
    },
    events: {
        '$public' : {
            'header-height' : 'setter|camel',
            'footer-height' : 'setter|camel'
        }
    },
    states: {
        'headerHeight' : 100,
        'footerHeight' : 100
    }
})
.config({
    imports: {
        'famous:core': ['view', 'dom-element']
    }
});
