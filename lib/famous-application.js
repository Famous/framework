'use strict';

var Core = Famous.Core;
var Components = Famous.Components;
var DOMRenderables = Famous.DOMRenderables;
var WebGLRenderables = Famous.WebGLRenderables;
var WebGLGeometries = Famous.WebGLGeometries;
var Renderers = Famous.Renderers;
var Engine = Famous.Engine;

var FamousThread = Core.Famous;
var Context = Core.Context;
var Node = Core.Node;
var Compositor = Renderers.Compositor;
var ThreadManager = Renderers.ThreadManager;

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
    'Box': WebGLGeometries.Box,
};

/**
 * Wrapper for a complete Famous application. One of these is created
 * for every `BEST.deploy` call.
 */
function FamousApplication(selector) {
    this.selector = selector;
    this.compositor = new Compositor();
    this.context = new Context(this.selector);
    this.thread = new ThreadManager(FamousThread, this.compositor);
    this.engine = new Engine();
    this.engine.update(this.thread);
    this.root = this.context.addChild();
}

/**
 * Create and return an orphan Famous node. (HACK|TODO: This method just
 * creates a node, then immediately detaches it from the root context.)
 */
FamousApplication.prototype.buildNode = function() {
    var node = this.context.addChild();
    this.context.removeChild(node);
    return node;
};

/**
 * Attach a rendering component of the given type to the given
 * Famous node, and return that component instance.
 */
FamousApplication.prototype.attachComponent = function(node, componentType) {
    if (componentType === 'Box') { console.log("ATTACHING BOX COMPONENT"); }
    var ctor = RENDERING_COMPONENTS[componentType];
    var dispatch = node.getDispatch();
    return new ctor(dispatch);
};

module.exports = FamousApplication;
