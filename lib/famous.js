'use strict';

var Famous = require('famous');
var Core = Famous.core;
var Components = Famous.components;
var DOMRenderables = Famous.domRenderables;
var WebGLRenderables = Famous.webglRenderables;
var Renderers = Famous.renderers;
var Engine = Famous.engine;
var Transitions = Famous.transitions;

var FamousThread = Core.Famous;
var Context = Core.Context;
var Compositor = Renderers.Compositor;
var ThreadManager = Renderers.ThreadManager;
var Transitionable = Transitions.Transitionable;

var COMPONENT_PREFIX = '__best-';

var RENDERING_COMPONENTS = {
    'HTMLElement': DOMRenderables.HTMLElement,
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
    'PointLight': WebGLRenderables.PointLight,
    'AmbientLight': WebGLRenderables.AmbientLight
};

var compositor = new Compositor();
var thread = new ThreadManager(FamousThread, compositor);
var engine = new Engine();
engine.update(thread);

function buildRenderNode(context) {
    var renderNode = context.addChild();
    context.removeChild(renderNode);
    return renderNode;
}

function createContext(selector) {
    return new Context(selector);
}

function decorateNode(bestNode, decoratorType) {
    var renderNode = bestNode.famousNode;
    var componentName = COMPONENT_PREFIX + decoratorType;
    if (!renderNode[componentName]) {
        var Ctor = RENDERING_COMPONENTS[decoratorType];
        var dispatch = renderNode.getDispatch();
        renderNode[componentName] = new Ctor(dispatch);
    }
    return renderNode[componentName];
}

function everyFrame(fn) {
    engine.update({
        update: fn
    });
}

function getClock() {
    return Core.Famous.getClock();
}

function getTransitionable() {
    return Transitionable;
}

module.exports = {
    buildRenderNode: buildRenderNode,
    createContext: createContext,
    decorateNode: decorateNode,
    everyFrame: everyFrame,
    getClock: getClock,
    getTransitionable: getTransitionable
};
