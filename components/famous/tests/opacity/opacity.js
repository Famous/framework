BEST.module('famous:tests:opacity', {
    behaviors: {
        '#ui2' : {
            position: [0, 250],
            opacity: 0.5
        },
        '.ui' : {
            style: function(myStyle) {
                return myStyle
            },
            size: [200, 200]
        }
    },
    events: {
    },
    states: {
        myStyle : {
            'background-color' : 'black',
            'text-align' : 'center',
            'line-height' : '200px',
            'color' : 'white',
            'cursor' : 'pointer'
        }
    },
    tree: 'opacity.html',
})
.config({
    imports: {
        'famous:core': ['ui-element']
    }
});
