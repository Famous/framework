FamousFramework.scene('jordan.papaleo:hello-famous', {
        behaviors: {
            ".meow": {
                'origin': [0.5, 0.5],
                'mount-point': [0.5, 0.5],
                'align': [0.5, 0.5],
                'size': [400, 150],
                'unselectable': true,
                style: function(color){
                    return {
                        'background-color': color,
                        'color': 'white',
                        'font-family': 'Lato',
                        'font-size': '60px',
                        'text-align': 'center'
                        
                    }
                },
                position: '[[identity|position]]'
            },
            "#header": {
                '$yield' : '#header',
                'size-absolute-y' : '[[identity|headerHeight]]'
            },
            '#footer' : {
                '$yield': '#footer',
                'size-absolute-y' : '[[identity|headerHeight]]'
            }
        },
        events: {
            ".meow": {
                "click": function($state){
                    let color = $state.get('color');
                    if(color === 'orange') {
                        $state.set('color', 'hotpink');
                    } else {
                        $state.set('color', 'orange');
                    }
                }
            }
        },
        states: {
            color: 'blue',
            position: [300, 100, 100],
            'headerHeight' : 100,
            'footerHeight' : 100
        },
        tree: 'hello-famous.jade'
        //tree: 'hello-famous.html'
    })
    .config({
        imports: {
            'famous:layouts': ['header-footer']
        }
    });
