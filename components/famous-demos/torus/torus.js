BEST.component('famous-demos:torus', {
    tree: 'torus.html',
    behaviors: {
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
            },
            'rotation': function($time) {
                return [$time / 1000, $time / 1000, $time / 1000];
            },
        },
        '.my-webgl-mesh': {
            'geometry': function(geometry) {
                return geometry;
            },
            'color': function(color) {
                return color;
            },
        }
    },
    events: {},
    states: {
        color: '#3cf',
        geometry: 'Torus',
        canvasSize: [200, 200, 200],
    }
});
