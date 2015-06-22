var Mesh = FamousFramework.FamousEngine.webglRenderables.Mesh;
var Material = FamousFramework.FamousEngine.webglMaterials.Material;

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
FamousFramework.attach('#webgl-node', function(node) {
    var mesh = new Mesh(node)
            .setGeometry('GeodesicSphere')
            .setBaseColor(Material.normal());
});
