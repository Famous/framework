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
        '.my-point-light': {
            'color': function(pointLightColor) {
                return pointLightColor;
            },
            'position': function(pointLightPos) {
                return [0, 0, 0]
            }
        },
        '.my-ambient-light': {
            'color': function(ambientLightColor) {
                return ambientLightColor;
            }
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
        geometry: 'Icosahedron',
        position: [window.innerWidth * 0.5, window.innerHeight * 0.5],
        pointLightColor: 'white',
        ambientLightColor: 'blue',
        canvasSize: [200, 200, 200],
    }
});
