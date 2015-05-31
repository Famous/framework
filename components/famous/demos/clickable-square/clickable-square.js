BEST.module('famous:demos:clickable-square', {
    behaviors: {
        '#context': {
            'size': function(size) { return [size, size]; },
            'rotation-z': function(time) { return time / 1000; },
            'mount-point': [0.5, 0.5],
            'align': [0.5, 0.5],
            'origin': [0.5, 0.5]
        },
        '#surface': {
            'content': function(count) { return '<h1>' + count + '</h1>'; },
            'unselectable': true,
            'style': {
                'background-color': 'gray',
                'border-radius': '10px',
                'cursor': 'pointer',
                'font-family': 'Helvetica'
            }
        }
    },
    events: {
        '$lifecycle': {
            'post-load': function($state) {
                var time = 1000000;
                $state.set('time', time, { duration: time });
            }
        },
        '#context': {
            'click': function($state, $payload) {
                $state.set('count', $state.get('count') + 1);
                $state.set('size', $state.get('size') + 50, {
                    duration: 1000,
                    curve: 'outBounce'
                });
            }
        }
    },
    states: { time: 0, count: 0, size: 100, offset: 50 },
    tree: 'clickable-square.html'
});
