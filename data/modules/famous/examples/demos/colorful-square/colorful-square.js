BEST.module('famous:examples:demos:colorful-square', 'HEAD', {
    tree: 'colorful-square.html',
    behaviors: {
        '.square-container': {
            'origin': function(origin) {
                return origin;
            },
            'size': function(size, $random1, $random2) {
                return [$random1 * size[0], $random2 * size[1]];
            },
            'position': function(position, $random1, $random2) {
                return [$random1 * position[0], $random2 * position[1]];
            },
            'rotation': function($time) {
                return [$time / 1000, $time / 1000, $time / 1000];
            },
            '$yield': true
        },
        '.square': {
            'style': function(opacity, $random1, $random2, $random3, $random4, $random5) {
                var hue = Math.floor($random1 * 240) + 200;
                var border = 50;
                return {
                    'background-color': 'hsla(' + hue + ', 80%, 60%, 0.8)',
                    'border-top': $random2 * border + 'px solid #f2c9c9',
                    'border-left': $random3 * border + 'px solid #83ddd6',
                    'border-bottom': $random4 * border + 'px solid #aca74',
                    'border-right': $random5 * border + 'px solid #f7f396',
                    'opacity': opacity
                };
            }
        }
    },
    events: {
        '.square': {
            'famous:events:click': function($state) {
                $state.set('opacity', 0.4 * Math.random());
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
