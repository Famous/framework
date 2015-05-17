BEST.scene('super.demo.day:click-event', 'HEAD', {
    behaviors: {
        '#background': {
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': function(background) {
                return {
                    'color': 'white',
                    'background': background,
                    'font-family': 'Lato',
                    'font-size': '60px',
                    'text-align': 'center',
                    'line-height': window.innerHeight + 'px',
                    'cursor': 'pointer',
                    'transition': 'background 0.8s',
                }
            },
            'unselectable': true
        }
    },
    events: {
        '#background': {
            'click': function($state) {
                var index = Math.floor(Math.random() * 8);
                var color = $state.get(['colorPalette', index]);

                $state.set('background', color);
            }
        }
    },
    states: {
        background: '#314043',
        colorPalette: ['#F7208B', '#ABAA98', '#82CDB9', '#F37259', '#00B9D7', '#98805B', '#728453', '#657E84']
    },
    tree: 'click-event.html'
});
