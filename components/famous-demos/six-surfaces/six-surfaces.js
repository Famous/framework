BEST.component('famous-demos:six-surfaces', {
    tree: 'six-surfaces.html',
    behaviors: {
        '.square': {
            'size': function(size, $time) {
                var chg = (Math.sin($time / 1000) / 2) + 1;
                return [chg * size, chg * size];
            },
            'rotation-z': function($time) {
                return $time / 1000;
            },
            'origin': [0.5, 0.5],
            'position': function() {
                var wih = window.innerHeight * 0.75;
                var wiw = window.innerWidth * 0.75;
                var px = Math.floor(Math.random() * wiw);
                var py = Math.floor(Math.random() * wih);
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
        '.my-mesh-container': {
            'mount-point': function() {
                return [0.5, 0.5]
            },
            'size': function(canvasSize) {
                return canvasSize;
            },
            'position': function() {
                var xPosition = window.innerWidth * 0.25;
                var yPosition = window.innerHeight * 0.85;
                return [xPosition, yPosition];
            }
        },
        '.my-webgl-mesh': {
            'geometry': function(geometry) {
                return geometry;
            },
            'color': function(color) {
                return color;
            },
        },
        '#circle-component' : {
            'handle-click' : function(_circleClickEvent) {
                return '_circleClickEvent';
            }
        }
    },
    events: {
        public: {
            'circle-click': function(state, event) {
                state.set('_circleClickEvent', event);
            }
        }
    },
    states: {
        size: 130,
        color: '#3cf',
        geometry: 'Torus',
        canvasSize: [200, 200],
        _circleClickEvent: null
    }
});
