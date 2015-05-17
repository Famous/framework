BEST.scene('super.demo.day:hello-famous', 'HEAD', {
    behaviors: {
        '#hello-famous': {
            'size': [window.innerWidth, window.innerHeight],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'color': 'white',
                'background': 'linear-gradient(to right, #00B9D7, #82CDB9)',
                'font-family': 'Lato',
                'font-size': '60px',
                'text-align': 'center',
                'line-height': window.innerHeight + 'px'
            }
        }
    },
    events: {},
    states: {},
    tree: 'hello-famous.html'
});
