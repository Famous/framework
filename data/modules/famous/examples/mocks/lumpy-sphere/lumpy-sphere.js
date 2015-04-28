BEST.module('famous:examples:mocks:lumpy-sphere', {
    tree: 'lumpy-sphere.html',
    behaviors: {
        '#container': {
            'size': function(containerSize) {
                return containerSize;
            }
        },
        '#geometry': {
            'shape': 'GeodesicSphere'
        },
        '#material': {
            'color': 'rgb(0.5, 0.5, 0.5)'
        },
        '#vertex': {
            'glsl': function(glsl) {
                return glsl;
            }
        }
    },
    states: {
        'containerSize': [100, 100, 100],
        'glsl': 'vec3(sin(time)*10., cos(time)*10., sin(time)*10.);'
    }
});