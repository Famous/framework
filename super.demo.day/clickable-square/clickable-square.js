BEST.scene('super.demo.day:clickable-square', 'HEAD', {
    behaviors: {
        '#square': {
            'size': [400, 400],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'content': function(numberOfClicks) {
                return '<h1>' + numberOfClicks + '</h1>';
            },
            'style': {
                'color': '#7099EE',
                'background': '#444444',
                'border': '6px solid #333333',
                'text-align': 'center',
                'font-size': '60px',
                'font-family': 'Lato',
                'cursor': 'pointer'
            },
            'unselectable': true
        }
    },
    events: {
        '#square': {
            'ui-click': function($state) {
                $state.set('numberOfClicks', 1 + $state.get('numberOfClicks'));
            }
        }
    },
    states: {
        numberOfClicks: 0
    },
    tree: `<ui-element id="square"></ui-element>`
});
