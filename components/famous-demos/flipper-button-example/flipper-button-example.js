BEST.component('famous-demos:flipper-button-example', {
    tree: 'flipper-button-example.html',
    behaviors: {
        '#appView' : {
            'position' : function(appPosition) {
                return appPosition
            }
        },
        '#button2view' : {
            'position' : function(buttonSize, verticalPadding) {
                return [0, buttonSize[1] + verticalPadding]
            }
        },
        '.myLabel' : {
            style: {
                'pointer-events' : 'none',
                'text-align' : 'center',
                'padding-top' : '20px',
                'border-radius': '5%',
                'font-weight' : 'bold',
                'font-family' : 'Helvetica Neue",Helvetica,Arial,sans-serif',
                'font-size' : '24px',
                'color' : 'white'
            },
            'backface-visible': false
        },
        '.front-label' : {
            style: {
                'background-color' : '#337ab7',
                'border' : '5px solid #2e6da4',
            }
        },
        '.back-label' : {
            style: {
                'background-color' : '#5cb85c',
                'border' : '5px solid #4cae4c',
            }
        }
    },
    events: {},
    states: {
        appPosition: [200, 100],
        buttonSize: [200, 80],
        verticalPadding: 20
    }
});
