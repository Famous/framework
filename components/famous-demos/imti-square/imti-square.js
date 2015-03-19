BEST.component('famous-demos:imti-square', {
    tree: 'imti-square.html',
    behaviors: {
        '.square-container': {
            'origin': function(origin) {
                return origin;
            },
            'size': function(size) {
                return [Math.random() * size[0], Math.random() * size[1]];
            },
            'position': function(position) {
                return [Math.random() * position[0], Math.random() * position[1]];
            },
            'rotation': function($time) {
                return [$time / 1000, $time / 1000, $time / 1000];
            },
            '$yield': true
        },
        '.square': {
            'style': function(opacity) {
                var hue = Math.floor(Math.random() * 240) + 200;
                var border = 50;
                return {
                    'background-color': 'hsla(' + hue + ', 80%, 60%, 0.8)',
                    'border-top': Math.random() * border + 'px solid #f2c9c9',
                    'border-left': Math.random() * border + 'px solid #83ddd6',
                    'border-bottom': Math.random() * border + 'px solid #aca74',
                    'border-right': Math.random() * border + 'px solid #f7f396',
                    'opacity': opacity,
                }
            }
        }
    },
    events: {
        public: {
            'shimmer': function(state) {
                state.set('opacity', 0.4 * Math.random());
            }
        }
    },
    states: {
        size: [300, 300],
        origin: [0.5, 0.5],
        opacity: 0.4,
        position: [window.innerWidth * 0.85, window.innerHeight * 0.85]
    }
});
