BEST.module('famous:examples:demos:shiny-button', {
    tree: 'shiny-button.html',
    behaviors: {
        '#button-container': {
            'size': function(buttonSize) {
                return buttonSize;
            },
            'position': function(buttonPosition) {
                return buttonPosition;
            }
        },
        '#button-text': {
            'style':  {
                'z-index': '100',
                'color': 'whitesmoke',
                'background-color': 'transparent',
                'border-radius': '15px',
                'text-align': 'center',
                'lineHeight': '50px',
                'fontFamily': 'Lato',
                'fontSize': '30px',
                'cursor': 'pointer'
            },
            'unselectable': 'true'
        },
        '#geometry': {
            'shape': function(shape) {
                return shape;
            }
        },
        '#fragment': {
            'glsl': function(glsl) {
                return glsl
            }
        },
        '#material': {
            'entry-point': function(entryPoint) {
                return entryPoint;
            }
        }
    },
    events: {
        '#button-text': {
            'famous:events:click': function($state, $payload) {
                $state
                    .set('buttonSize', [400, 100], { duration:1000, curve:'outBounce' })
                    .set('buttonPosition', [10, 500], { duration:1500 })
                    .thenSet('buttonPosition', [500, 100], { duration:200, curve:'easeInOut' })
                    .thenSet('buttonPosition', [100, 500], { duration:200, curve:'easeInOut' })
                    .thenSet('buttonPosition', [500, 100], { duration:200, curve:'easeInOut' })
                    .thenSet('buttonPosition', [0, 0], { duration:200, curve:'easeInOut' })
                    .thenSet('buttonSize', [200, 50], { duration:1000, curve:'outBounce' });
            }
        }
    },
    states: {
        'buttonSize': [200, 50],
        'buttonPosition': [0, 0],
        'shape': 'Plane',
        'entryPoint': 'background();',
        'glsl': `
            float length2(vec2 p) { return dot(p, p); }

            float noise(vec2 p){
                return fract(sin(fract(sin(p.x) * (4313.13311)) + p.y) * 3131.0011);
            }

            float worley(vec2 p) {
                float d = 1e30;
                for (int xo = -1; xo <= 1; ++xo)
                for (int yo = -1; yo <= 1; ++yo) {
                    vec2 tp = floor(p) + vec2(xo, yo);
                    d = min(d, length2(p - tp - vec2(noise(tp))));
                }
                return 3.*exp(-4.*abs(2.*d - .1));
            }

            float fworley(vec2 p) {
                return sqrt(sqrt(sqrt(
                    pow(worley(p - time), 2.) *
                    worley(p*2. + 1.3 + time*.5) *
                    worley(p*4. + 2.3 + time*-.25) *
                    worley(p*8. + 3.3 + time*.125) *
                    worley(p*32. + 4.3 + time*.125) *
                    sqrt(worley(p * 64. + 5.3 + time * -.0625)) *
                    sqrt(sqrt(worley(p * -128. + 7.3))))));
            }

            vec3 background() {
                vec2 uv = v_TextureCoordinate / 10.0 + .2;
                float t = fworley(uv * resolution.xy / 1800.);
                t *= exp(-length2(abs(2.*uv - 1.)));
                float r = length(abs(2.*uv - 1.) * resolution.xy);
                return .5 * vec3(1.8*t, 1.8*t, .1 + pow(t, 2.-t));
            }
          `
    }
});
