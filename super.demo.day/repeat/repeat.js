BEST.scene('super.demo.day:repeat', 'HEAD', {
    behaviors: {
        '#line': {
            'size': [window.innerWidth/2, 2],
            'align': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'origin': [0.5, 0.5],
            '$repeat': function() {
                var messages = [];
                for (var i = 0; i < 360; i++) {
                    messages.push({ i: i });
                }
                return messages;
            },
            'rotation-z': function($index) {
                return $index * Math.PI/360;
            },
            'style': function($index) {
                return {
                    'background': "hsl(" + $index + ", 100%, 50%)"
                }
            }
        }
    },
    events: {},
    states: {},
    tree: 'repeat.html'
});
