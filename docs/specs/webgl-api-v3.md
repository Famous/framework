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
    // https://github.famo.us/gist/matthew/8de8153c19afa07be113

'webgl:material'
    // first pass
    behaviors:
            $self:
                $self:uniformBuffer: (uniformBuffer) ->
                    return uniformBuffer
                $self:defaultBuffer: (defaultBuffer) ->
                    return defaultBuffer
                $self:shaders: (shaders) ->
                    return shaders
    events:
        public:
            uniformBuffer: (state, message) ->
                state.set('uniformBuffer', message)
            defaultBuffer: (state, message) ->
                state.set('defaultBuffer', message)
            shaders: (state, message) ->
                state.set('shaders', message)
        handlers:
            uniformBuffer: ($Material, $state, $payload) ->
                var vertexName = $state.get('__vertexName')
                $Material[vertexName].setUniform($payload)
            shaders: ($Material, $state, $payload) ->
                // IMPORTANT: must be run first to save reference to shader names
                // maybe we can offload this to the public events...
                var name, type, glsl, entryPoint;

                // for each shader
                forEach($payload, (shader) ->
                    type = shader.type
                    glsl = shader.glsl

                    // Let's not worry about multi-function glsl for now
                    // if (shader.type === 'vertex')
                    //     entryPoint = shader.entryPoint

                    // save reference to shader names for internal use
                    $state.set('__' + type + 'Name', name)

                    // register each glsl expression
                    $Material.registerExpression(name, glsl)
                )
            defaultBuffer: ($Material, $state, $payload) ->
                var vertexName = $state.get('__vertexName')
                $Material[vertexName](null, $payload)
```
