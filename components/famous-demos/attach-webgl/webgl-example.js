var Size = Famous.components.Size;
var Position = Famous.components.Position;
var Rotation = Famous.components.Rotation;
var Origin = Famous.components.Origin;
var Align = Famous.components.Align;
var MountPoint = Famous.components.MountPoint;

var Mesh = Famous.webglRenderables.Mesh;
var PointLight = Famous.webglRenderables.PointLight;
var AmbientLight = Famous.webglRenderables.AmbientLight;
var Sphere = Famous.webglGeometries.Sphere;
var DynamicGeometry = Famous.webglGeometries.DynamicGeometry;
var Material = Famous.webglMaterials.Material;
var Color = Famous.utilities.Color;

/**
 * Attach:
 *      To attach raw engine code to a component,
 *      simply pass in the component, version and
 *      the context that it'll live in.
 *
 *      Inside of our executable function, we'll
 *      have access to the node of that context
 *      and can use it with
 */
FamousFramework.attach('#webgl', function(node) {
    /**
     * Create a dynamic geometry from a sphere
     */
    var sunGeometry = new DynamicGeometry();
    sunGeometry.fromGeometry(new Sphere({ detail: 100 }));


    /**
     * Fill displacement buffer with the same number of values
     * as the indices of the geometry.
     */
    var displacement = [];
    var vertexLength = sunGeometry.getLength();
    for(var i = 0; i < vertexLength; i++) {
        displacement.push(Math.random());
    }

    /**
     * Insert the displacement values into the buffer
     */
    sunGeometry.setVertexBuffer('a_Displacement', displacement, 1);


    /**
     * Custom expression for the vertex shader
     */
    var shader =
        `vec3 sunDisplacement() {
            v_Displacement = a_Displacement;
            return a_normals * vec3(a_Displacement * 10.0 * u_Amplitude);
        }`;

    /**
     * Register the custom expression inside of the material graph
     */
    Material.registerExpression('sunVertex', {
        glsl: 'sunDisplacement();',
        defines: shader,
        output: 3
    });

    /**
     * Set the various variables' default values and types
     * E.g. 1 is the value as well as it being a float (scalar)
     *      [1, 1] represents a vec2(1.0, 1.0)
     */

    var sunVertex = Material.sunVertex(null, {
        attributes: {
            a_Displacement: 1
        },
        uniforms: {
            u_Amplitude: 1
        },
        varyings: {
            v_Displacement: 1
        }
    });


    /**
     * Custom expression for the fragment shader.
     * The amplitude uniform (u_Amplitude) is being used
     * to clamp the color values.
     */
    Material.registerExpression('sunFragment', {
        glsl:
            `vec4(
                clamp(v_Displacement * u_Amplitude * 3.0 - 0.0, 0.0, 1.0),
                clamp(v_Displacement * u_Amplitude * 3.0 - 1.0, 0.0, 1.0),
                clamp(v_Displacement * u_Amplitude * 3.0 - 2.0, 0.0, 1.0), 1
            );`,
        output: 4
    });


    /**
     * Variables for helping animate the geometry on every 'tick'
     */
    var frame = 0;
    var amplitude = 0;

    /**
     * Construct the Sun
     */

    function Sun(node) {
        this.dispatch = node;
        this.dispatch.setSizeMode(1, 1, 1);
        this._id = node.addComponent(this);

        this.mesh = new Mesh(this.dispatch);
        this.rotation = new Rotation(this.dispatch);
        this.position = new Position(this.dispatch);
        this.size = new Size(this.dispatch);
        this.align = new Align(this.dispatch);
        this.origin = new Origin(this.dispatch);
        this.mountPoint = new MountPoint(this.dispatch);
        this.pointLight = new PointLight(this.dispatch);

        this.pointLight.setColor(new Color('yellow'));

        this.mesh.setFlatShading(true);
        this.mesh.setGeometry(sunGeometry);
        this.mesh.setPositionOffset(sunVertex);
        this.mesh.setBaseColor(Material.sunFragment());

        this.size.setAbsolute(75, 75, 75);
        this.align.set(0.5, 0.5, 0.5);
        this.origin.set(0.5, 0.5, 0.5);
        this.mountPoint.set(0.5, 0.5, 0.5);
        this.position.setZ(100);

        this.dispatch.requestUpdate(this._id);
    }

    Sun.prototype.onUpdate = function onUpdate() {
        var delta = Date.now() * 0.0003;
        this.rotation.setY(delta);
        amplitude = (0.1 * Math.sin(frame * 0.25) + 0.7);
        sunVertex.setUniform('u_Amplitude', amplitude);
        frame += 0.1;

        this.dispatch.requestUpdateOnNextTick(this._id);
    }

    new Sun(node);
});
