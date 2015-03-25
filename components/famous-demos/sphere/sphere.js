BEST.component('famous-demos:sphere', {
    tree: 'sphere.html',
    behaviors: {
        '.sphere-container': {
            'origin': [0.5, 0.5],
            'mount-point': [0.5, 0.5],
            'size': function(canvasSize) {
                return canvasSize;
            },
            'position': function(position) {
                return [position[0], position[1]];
            },
            'rotation': function($time) {
                return [-$time / 1000, -$time / 1000, -$time / 1000];
            },
        },
        '.point-light': {
            'color': function(pointLightColor) {
                return pointLightColor;
            },
            'position': function(pointLightPosition) {
                return pointLightPosition;
            }
        },
        '.sphere-mesh': {
            'geometry': function(geometry) {
                return geometry;
            },
            'color': function(color) {
                return color;
            },
        }
    },
    states: {
        color: 'white',
        geometry: 'GeodesicSphere',
        position: [window.innerWidth * 0.5, window.innerHeight * 0.5],
        canvasSize: [200, 200, 200],
        pointLightColor: '#3cf',
        pointLightPosition: [0, 0, 0]
    }
});
