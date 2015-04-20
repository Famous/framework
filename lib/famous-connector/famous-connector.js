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

module.exports = {
    addChild: addChild,
    createRoot: createRoot,
    getCoreFamous: getCoreFamous,
    getTransitionable: getTransitionable
};
