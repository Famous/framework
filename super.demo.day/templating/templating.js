BEST.scene('super.demo.day:templating', 'HEAD', {
    behaviors: {
        '#circle': {
            'size': [800, 800],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'color': '#7E827A',
                'border-radius': '100%',
                'padding-top': '50px',
                'padding-left': '120px',
                'font-size': '65px',
                'font-family': 'Lato',
                'border': '120px solid transparent',
                'border-style': 'solid',
                'border-top-color': '#2C3E50',
                'border-right-color': '#2C3E50',
                'border-bottom-color': '#00B9D7',
                'border-left-color': '#00B9D7'
            },
            'template': function(lines) {
                return { 
                    line1: lines[0],
                    line2: lines[1],
                    line3: lines[2],
                    line4: lines[3]
                }
            }
        }
    },
    events: {},
    states: { 
        'lines': ['Supports', 'Jade &', 'Mustache', 'Templating'] 
    },
    tree: 'templating.jade'
});