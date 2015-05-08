'use strict';

var Famous = require('famous');

var Core = Famous.core;
var Components = Famous.components;
var DOMRenderables = Famous.domRenderables;
var WebGLRenderables = Famous.webglRenderables;
var WebGLGeometries = Famous.webglGeometries;
var WebGLMaterials = Famous.webglMaterials;
var Renderers = Famous.renderers;
var Engine = Famous.engine.Engine;
var Transitions = Famous.transitions;

var FamousThread = Core.Famous;
var Compositor = Renderers.Compositor;
var ThreadManager = Renderers.ThreadManager;
var Transitionable = Transitions.Transitionable;
Transitionable.Clock = FamousThread.getClock();

var compositor = new Compositor();
var thread = new ThreadManager(FamousThread.getChannel(), compositor, new Engine());

var COMPONENT_PREFIX = '__best-';

var RENDERING_COMPONENTS = {
    'DOMElement': DOMRenderables.DOMElement,
    'Camera': Components.Camera,
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

function attachAttributes(bestComponent, domComponent) {
    var domNode = bestComponent.getRootNode();
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
    coreFamous: Core.Famous,
    Transitionable: Transitionable,
    decorateComponent: decorateComponent,
    Curves: Transitions.Curves
};
