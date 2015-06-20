FamousFramework.scene('famous-demos:best:floating-square', {
    behaviors: {
        '#container': {
            'position': function(position, hoverHeight) {
                // return [position[0], hoverHeight + 100 * (Math.sin(hoverHeight)) + position[1]];
                return position;
            }
        },
        '#square': {
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'rotation-z': Math.PI/4,
            'size': function(squareSize) {
                return squareSize;
            },
            'style': {
                'background': 'linear-gradient(45deg, #3F5AA7, #3DB0E4)'
            }
        },
        '#label': {
            'position-z': 10,
            'size': [200, 200],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'style': {
                'text-align': 'center',
                'line-height': '175px',
                'font-family': 'Lato',
                'font-size': '24px',
                'color': 'whitesmoke',
            },
            'unselectable': true,
            'content': function(labelContent) {
                return labelContent.split('').join(' ');
            }
        }
    },
    events: {
        '$public': {
            'content': function($state, $payload) {
                $state.set('labelContent', $payload);
            },
            'position': function($state, $payload) {
                $state.set('position', $payload);
            },
            'hover': function($state, $payload) {
                $state.set('hoverHeight', $payload, { duration: $payload * 1000 });
            }
        }
    },
    states: {
        'hoverHeight': 0,
        'position': [0, 0],
        'squareSize': [200, 200],
        'labelContent': 'TEXT'
    },
    tree: `
        <node id="container">
            <node id="label"></node>
            <node id="square"></node>
        </node>
    `
});
