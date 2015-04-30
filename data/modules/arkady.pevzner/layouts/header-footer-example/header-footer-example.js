BEST.module('arkady.pevzner:layouts:header-footer-example', {
    tree: 'header-footer-example.html',
    behaviors: {
        '#container' : {
            'size-proportional': function(containerProportion) {
                return containerProportion;
            }
        },
        '#hf' : {
            'header-height' : 150,
            'footer-height' : 50
        },
        '#header-el' : {
            style:  {
                'border' : '1px solid black',
                'background-color' : 'mintcream'
            }
        },
        '#body-el' : {
            style:  {
                'border-right' : '1px solid black',
                'border-left' : '1px solid black',
                'background-color' : 'whitesmoke'
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
    },
    states: {
        containerProportion: [0.8, 0.8]
    }
})
.config({
    imports: {
        'famous:core': ['view', 'dom-element']
    }
});
