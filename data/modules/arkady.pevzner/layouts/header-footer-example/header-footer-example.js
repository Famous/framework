BEST.module('arkady.pevzner:layouts:header-footer-example', {
    behaviors: {
        '#container' : {
            'size-proportional': function(containerProportion) {
                return containerProportion;
            }
        },
        '#hf' : {
            'header-height' : 100,
            'footer-height' : 100
        },
        '#header-el' : {
            content: function(title) {
                return title;
            },
            style: function(headerHeight, headerBackgroundColor) {
                return {
                    'background-color' : headerBackgroundColor,
                    'line-height' : headerHeight + 'px',
                    'text-align' : 'center',
                    'color' : 'white',
                    'font-size' : '30px',
                    'font-weight' : 'bold'
                }
            }
        },
        '#scroll-view' : {
            count: function(count) {
                return count;
            },
            'item-height': function(itemHeight) {
                return itemHeight;
            },
            'item-style' : function(itemStyle, itemHeight) {
                // Temp variable created because state should not be altered
                // inside of a behavior.
                var temp = itemStyle;
                temp['line-height'] = itemHeight + 'px';
                return temp;
            }
        },
        '#footer-el' : {
            style:  {
                'border' : '1px solid black',
                'background-color' : 'honeydew'
            }
        }
    },
    events: {
        $public: {
            'container-proportion' : 'setter|camel',
            'title' : 'setter',
            'header-height' : 'setter|camel',
            'header-background-color' : 'setter|camel',
            'count' : 'setter'
        }
    },
    states: {
        // Container properties
        containerProportion: [0.8, 0.8],

        // Header properties
        title: 'Basic Feed Layout',
        headerHeight: 100,
        headerBackgroundColor: 'rgb(29, 25, 115)',

        // Body properties
            // Scrollview properties
            count: 25,
            itemHeight: 100,
            itemStyle: {
                border: '1px solid black',
                'background-color' : 'whitesmoke',
                'text-align' : 'center',
                'font-size' : '24px',
                'cursor' : 'pointer'
            }
    },
    tree: 'header-footer-example.html'
})
.config({
    imports: {
        'famous:core': ['view', 'dom-element']
    }
});
