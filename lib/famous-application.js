'use strict';

require('famous-stylesheets');

var Core = require('famous-core');
var Components = require('famous-components');
var DOMRenderables = require('famous-dom-renderables');
var Renderers = require('famous-renderers');
var Engine = require('famous-engine');

//var Famous = Core.Famous;
//var Context = Core.Context;
//var Node = Core.Node;
//var Compositor = Renderers.Compositor;
//var ThreadManager = Renderers.ThreadManager;
//
//var RENDERING_COMPONENTS = {
//    'HTMLElement': DOMRenderables.HTMLElement,
//    'MountPoint': Components.MountPoint,
//    'Align': Components.Align,
//    'Camera': Components.Camera,
//    'Opacity': Components.Opacity,
//    'Origin': Components.Origin,
//    'Position': Components.Position,
//    'Rotation': Components.Rotation,
//    'Scale': Components.Scale,
//    'Size': Components.Size
//};
//
//function FamousApplication(selector) {
//    this.selector = selector;
//    this.compositor = new Compositor();
//    this.context = new Context(this.selector);
//    this.thread = new ThreadManager(Famous, this.compositor);
//    this.engine = new Engine();
//    this.engine.update(this.thread);
//    this.root = this.context.addChild();
//}
//
//FamousApplication.prototype.buildNode = function() {
//    var node = this.context.addChild();
//    this.context.removeChild(node);
//    return node;
//};
//
//FamousApplication.prototype.attachComponent = function(node, componentType) {
//    var ctor = RENDERING_COMPONENTS[componentType];
//    var dispatch = node.getDispatch();
//    return new ctor(dispatch);
//};

module.exports = {}//FamousApplication;
