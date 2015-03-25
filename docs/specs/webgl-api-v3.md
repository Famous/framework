```javascript
// App
'imti:app'
    tree:
        <famous:view>
            <farhad:sun>
        </famous:view>

// ----------------------------------------------------------------------------------

'farhad:sun'
    tree:
        <famous:webgl:mesh>
            <famous:webgl:geometries:sphere id="sun-geometry" />
            <famous:webgl:material id="sun-material" />
        </famous:webgl:mesh>

    behaviors:
        #sun-geometry
            vertex-buffer: (buffer) ->
                return buffer.attributes
        #sun-material
            uniform: (buffer) ->
                return buffer.uniforms
            defaults: (defaults) ->
                return defaults
            shaders: (shaders) ->
                return shaders

    events:

    states:
        frame: 0
        amplitude: 1
        displacement: [1, 2, 3, 4, 5]
        defaults:
            attributes:
                a_Displacement: 1
            uniforms:
                u_Amplitude: 1
            varyings:
                v_Displacement: 1
        buffer:
            attributes:
                a_Displacement: displacement
            uniforms:
                u_Amplitude: amplitude
        shaders: [
            name: 'sunFragment'
            type: 'fragment'
            glsl:
                `vec3(
                    clamp(v_Displacement * u_Amplitude * 3.0 - 0.0, 0.0, 1.0),
                    clamp(v_Displacement * u_Amplitude * 3.0 - 1.0, 0.0, 1.0),
                    clamp(v_Displacement * u_Amplitude * 3.0 - 2.0, 0.0, 1.0)
                )`

            name: 'sunVertex'
            type: 'vertex'
            glsl:
                `vec3 sunDisplacement() {
                    v_Displacement = a_Displacement;
                    return normals * vec3(a_Displacement * 10.0 * u_Amplitude);
                `}
        ]

// ----------------------------------------------------------------------------------

'webgl:red-box'
    tree:
        <famous:webgl:mesh>
            <famous:webgl:geometries:box id="geometry" />
            <famous:webgl:materials:red id="material" />
        </famous:webgl:mesh>

    behaviors:
        behaviors:
        events:

// ----------------------------------------------------------------------------------

'webgl:geometries:box'
    tree:
        <famous:webgl:geometry id="geometry" />

    behaviors:
        #geometry:
            shape: 'Box'
            detail: 123
    events:
        public:
            detail: (state, message) ->
                state.set('detail', message)

// ----------------------------------------------------------------------------------

'webgl:materials:red'
    tree:
        <famous:webgl:material id="material" />
    behaviors:
        #material:
            color: 'red'

'webgl:geometry'
    // Done by Matthew
'webgl:material'
    // not a clue...
```
