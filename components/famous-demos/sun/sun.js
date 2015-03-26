BEST.component('famous-demos:sun', {
    tree: 'sun.html',
    behaviors: {
        '#view': {
            'size': [0.5, 0.5, 0.5],
            'align': [0.5, 0.5, 0.5],
            'origin': [0.5, 0.5, 0.5],
            'position-z': 100,
            'rotation-y': function($now) {
                return $now * 0.0003;
            }
        },
        '#mesh': {
            'flat-shading': true
        },
        '#geometry': {
            'shape': 'sphere',
            'detail': 100,
            'vertex-buffer': {
                'a_disp': function($vertices, $random) {
                    return $vertices.map(function(index) {
                        return $random[index];
                    });
                }
            }
        },
        '#vertex': {
            'inputs': [],
            'attributes': { a_disp: 1 },
            'uniforms': { u_ampl: 1 },
            'varyings': { v_disp: 1 },
            'u_ampl': function($frame) {
                return 0.1 * Math.sin($frame * 0.25) + 0.7;
            }
        }
    }
});
