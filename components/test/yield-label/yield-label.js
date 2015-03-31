BEST.component('test:yield-label', {
    tree: 'yield-label.html',
    behaviors: {
        '#label-view' : {
            size: [300, 25],
            $yield: true
        },
        '#square-view' : {
            size: [300, 300],
            position: [0, 25]
        },
        '#square-element' : {
            style: {
                'background-color': 'gray',
                'font-size' : '30px'
            }
        }
    },
    events: {
    },
    states: {
    }
});
