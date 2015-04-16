'use strict';

var Famous = require('famous');
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
    return FamousThread.createContext(selector);
}

function attachAttributes(bestNode, domComponent) {
    var id = bestNode.domNode.id;
    if (id) {
        domComponent.setId(id);
    }

    var classes = bestNode.domNode.classList;
    for (var i = 0; i < classes.length; i++) {
        domComponent.addClass(classes[i]);
    }
}

function decorateNode(bestNode, decoratorType) {
    var renderNode = bestNode.famousNode;
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
            attachAttributes(bestNode, renderNode[componentName]);
        }
    }
    return renderNode[componentName];
}

function everyFrame(fn) {
    engine.update({ update: fn });
}

function getClock() {
    return Core.Famous.getClock();
}

function getCoreFamous() {
    return Core.Famous;
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
    getCoreFamous: getCoreFamous,
    getTransitionable: getTransitionable
};
