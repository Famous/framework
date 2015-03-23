## Proposal In Progress: WebGL API
Task: translate [Farhad’s sun example](https://github.famo.us/platform/seed/blob/develop/src/examples/solarSystem/Sun.js) into BEST.

### JavaScript
```javascript
// sun.js
BEST.component('famous-demos:sun', {
    tree: 'sun.html',
    behaviors: {
        '.sun-container': {
            'size': function(size) {
                return size;
            },
            'align': function(align) {
                return align;
            },
            'origin': function(origin) {
                return origin;
            },
            'position-z': function(positionZ) {
                return positionZ;
            },
            'rotation-y': function(rotationY) {
                return rotationY;
            }
        },
        '.sun-mesh': {
            'dynamic-geometry': function(dynamicGeometry) {
                return dynamicGeometry
            }
        }
    },
    events: {
        // internal engine event to hook into famous' clock
        'famous.clock': {
            // 'tick' runs on every clock tick
            'tick': function(state) {
                var frame = state.get('frame');
                var delta = Date.now() * 0.0003;
                var newAmplitude = (0.1 * Math.sin(frame * 0.25) + 0.7);

                state
                    .set('rotationY', delta)
                    .set('dynamicGeometry.amplitude', newAmplitude)
                    .set('dynamicGeometry.frame', frame + 0.1);
            }
        }
    },
    states: {
        // sun container states
        size: [75, 75, 75],
        align: [0.5, 0.5, 0.5],
        origin: [0.5, 0.5, 0.5],
        rotationY: 0,
        positionZ: 100,

        // sun mesh states (nesting is pretty necessary...)
        dynamicGeometry: {
            // basic geometry data
            shape: 'Sphere',
            detail: 100,

            // data used to animate geometry on every tick
            frame: 0,
            amplitude: 0,

            // random position displacement for each vertex in our sphere
            // TODO: find best way to get number of vertices and loop
            //
            // number of vertices is equal to the length of the dynamicGeometry,
            // so we'll first have to create the dynamicGeometry and set
            // the shape and detail until we can get the numVertices.
            displacement: [Math.random(), Math.random(), Math.random()...],

            // sun vertex states
            vertex: {
                name: 'sunVertex',
                glsl:
                    // could be defined in another file like:
                    // "#{FILE_INLINE('../my-cool-vertex')}"
                    'vec3('                                                           +
                        'v_Displacement = a_Displacement;'                            +
                        'return normals * vec3(a_Displacement * 10.0 * u_Amplitude);' +
                    ')'
            },

            // sun fragment states
            fragment: {
                name: 'sunFragment',
                glsl:
                    // could be defined in another file like:
                    // "#{FILE_INLINE('../my-cool-fragment')}"
                    'vec3('                                                          +
                        'clamp(v_Displacement * u_Amplitude * 3.0 - 0.0, 0.0, 1.0),' +
                        'clamp(v_Displacement * u_Amplitude * 3.0 - 1.0, 0.0, 1.0),' +
                        'clamp(v_Displacement * u_Amplitude * 3.0 - 2.0, 0.0, 1.0),' +
                    ')'
            },

            // gl variables to be set
            glData: {
                // variables to send to the buffer.
                //
                // eg. a_displacement would be replaced with our
                // displacement state (likewise for u_amplitude)
                // in the buffer.
                buffer: {
                    vertex:  { a_displacement:  'displacement' },
                    uniform: { u_amplitude:     'amplitude'    }
                },

                // glsl header defaults
                //
                // (might be handled in platform by inferring values,
                // we could also do some inference in the framework)
                //
                // number represents data type:
                // 1 - float - number
                // 2 - vec2  - 2d array
                // 3 - vec3  - 3d array
                defaults: {
                    uniforms:   { u_Amplitude:    1 },
                    varyings:   { v_Displacement: 1 },
                    attributes: { a_Displacement: 1 }
                }
            }
        }
    }
});
```

### Tree
```html
!-- sun.html --!
<famous:view>
    <famous:view class="sun-container">
        <famous:webgl-mesh class="sun-mesh">
        <famous:webgl-mesh>
    <famous:view>
<famous:view>
```
