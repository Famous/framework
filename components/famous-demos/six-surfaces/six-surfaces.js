BEST.component('famous-demos:six-surfaces', {
    tree: 'six-surfaces.html',
    behaviors: {
        '.square': {
            'size': function(size, $time) {
                    var chg = (Math.sin($time / 1000) / 2) + 1;
                    return [chg * size, chg * size];
            },
            'rotation': function(_isAnimating, $time) {
                if (_isAnimating)
                    return [0, 0, $time / 1000];
                else
                    return [$time / 1000, 0, 0];
            },
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'position': function(windowSize) {
                var px = Math.floor(Math.random() * windowSize[0]);
                var py = Math.floor(Math.random() * windowSize[1]);
                return [px, py];
            }
        },
        '.surface': {
            'style': function($every, key, value) {
                var hue = Math.floor(Math.random() * 240) + 140;
                return {
                    'color': 'white',
                    'text-align': 'center',
                    'font-family': 'Helvetica',
                    'font-weight': 'bold',
                    'background-color': 'hsla(' + hue + ', 80%, 60%, 0.8)',
                    'border': '1px solid black',
                    'padding-top': '20px'
                };
            }
        },

        '#circle-component' : {
            'handle-click' : function(_circleClickEvent) {
                return '_circleClickEvent';
            }
        },

    },
    events: {
        public: {
            'circle-click': function(state, event) {
                state.set('_circleClickEvent', event);
                state.chain('_isAnimating').flip();
            }
        }
    },
    states: {
        size: 130,
        windowSize: [window.innerWidth * .9, window.innerHeight * .9],
        _isAnimating: true,
        _circleClickEvent: null
    }
});
