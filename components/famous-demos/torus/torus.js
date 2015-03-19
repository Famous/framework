BEST.component('famous-demos:torus', {
    tree: 'torus.html',
    behaviors: {
        '.my-mesh-container': {
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'size': function(canvasSize) {
                return canvasSize;
            },
            'position': function(position) {
                return [position[0], position[1]];
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
    states: {
        color: '#3cf',
        geometry: 'Torus',
        position: [window.innerWidth * 0.25, window.innerHeight * 0.80],
        canvasSize: [200, 200, 200],
    }
});
