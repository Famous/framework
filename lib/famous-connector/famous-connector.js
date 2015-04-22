var Core = Famous.core;
var Components = Famous.components;
var DOMRenderables = Famous.domRenderables;
var WebGLRenderables = Famous.webglRenderables;
var WebGLGeometries = Famous.webglGeometries;
var WebGLMaterials = Famous.webglMaterials;
var Renderers = Famous.renderers;
var Engine = Famous.engine;
var Transitions = Famous.transitions;

var FamousThread = Core.Famous;
var Compositor = Renderers.Compositor;
var ThreadManager = Renderers.ThreadManager;
var Transitionable = Transitions.Transitionable;

var compositor = new Compositor();
var thread = new ThreadManager(FamousThread, compositor);
var engine = new Engine();
engine.update(thread);

var COMPONENT_PREFIX = '__best-';

var RENDERING_COMPONENTS = {
    'DOMElement': DOMRenderables.DOMElement,
    'MountPoint': Components.MountPoint,
    'Align': Components.Align,
    'Camera': Components.Camera,
    'Opacity': Components.Opacity,
    'Origin': Components.Origin,
    'Position': Components.Position,
    'Rotation': Components.Rotation,
    'Scale': Components.Scale,
    'Size': Components.Size,
    'WebGLMesh': WebGLRenderables.Mesh,
    'Geometry': WebGLGeometries.Geometry,
    'Material': WebGLMaterials.Material,
    'PointLight': WebGLRenderables.PointLight,
    'AmbientLight': WebGLRenderables.AmbientLight
};

function addChild(famousNode) {
    return famousNode.addChild();
}

function createRoot(selector) {
    var context = FamousThread.createContext(selector);
    return context.addChild();
}

function getCoreFamous() {
    return Core.Famous;
}

function getTransitionable() {
    return Transitionable;
}

function attachAttributes(bestComponent, domComponent) {
    var domNode = bestComponent.getRootNode()
    var id = domNode.id;
    if (id) {
        domComponent.setId(id);
    }

    var classes = domNode.classList;
    for (var i = 0; i < classes.length; i++) {
        domComponent.addClass(classes[i]);
    }
}

function decorateComponent(bestComponent, decoratorType) {
    var renderNode = bestComponent.famousNode;
    var componentName = COMPONENT_PREFIX + decoratorType;
    if (!renderNode[componentName]) {
        var Ctor = RENDERING_COMPONENTS[decoratorType];
        if (decoratorType === 'Material') {
            renderNode[componentName] = Ctor;
        }
        else {
            renderNode[componentName] = new Ctor(renderNode);
        }

        if (decoratorType === 'DOMElement') {
            attachAttributes(bestComponent, renderNode[componentName]);
        }
    }
    return renderNode[componentName];
}

module.exports = {
    addChild: addChild,
    createRoot: createRoot,
    getCoreFamous: getCoreFamous,
    getTransitionable: getTransitionable,
    decorateComponent: decorateComponent
};
