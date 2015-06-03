BEST.module('famous:demos:styling-inner-divs', {
    behaviors: {
        'ui-element' : {
            position: [100, 100],
            size: [200, 200],
            style: {
                'background-color' : 'whitesmoke',
                'border-radius' : '10px',
                'line-height' : '200px',
                'text-align' : 'center'
            },
            template: function(color, fontFamily) {
                return {
                    'link-style' : BEST.helpers.formatStyle({
                        'color': color,
                        'font-family': fontFamily,
                        'font-size' : '30px',
                        'text-align' : 'center',
                    })
                }
            }
        }
    },
    events: {
    },
    states: {
        color: '#49afeb',
        fontFamily: 'Lato, Helvetica, Arial, sans-serif'
    },
    tree: 'styling-inner-divs.html',
});
