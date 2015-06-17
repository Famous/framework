'use strict';

var DataStore = require('./../data-store/data-store');
var FamousEngine = require('famous');
var Camera = FamousEngine.components.Camera;
// This beautiful variable name differentiates the Famous Engine library
// from the Famous Engine module that the Famous Engine library contains.
var FamousEngineCoreFamousEngine = FamousEngine.core.FamousEngine;

FamousEngineCoreFamousEngine.init();

var COMPONENT_PREFIX = '__famousFramework-';

var RENDERING_COMPONENTS = {
    'DOMElement': require('famous/dom-renderables/DOMElement'),
    'Mesh': require('famous/webgl-renderables/Mesh')
};

function addChild(famousNode, Constructor) {
    if (Constructor) {
        return famousNode.addChild(new Constructor());
    }
    else {
        return famousNode.addChild();
    }
}

/**
 * Creates the root node for a context.
 * @method  createRoot
 * @param   {String}    selector  The query selector used to create the root Scene.
 */
function createRoot(selector) {
     var scene = FamousEngineCoreFamousEngine.createScene(selector);
     DataStore.registerRootScene(selector, scene);
     return scene.addChild();
}

/**
 * Get the camera in the scene. There is 0 or 1 camera's attached to each
 * executed component. If a camera doesn't exist, one will be attached.
 *
 * @method  getCamera
 * @return  {Camera}   A Famous Camera instance.
 */
function getCamera(famousFrameworkComponent) {
    var rootSelector = famousFrameworkComponent.rootSelector;
    if (!DataStore.getCamera(rootSelector)) {
        var rootScene = DataStore.getRootScene(rootSelector);
        var camera = new Camera(rootScene);
        DataStore.registerCamera(rootSelector, camera);
    }
    return DataStore.getCamera(rootSelector);
}

function attachAttributes(famousFrameworkComponent, domComponent) {
    var domNode = famousFrameworkComponent.getRootNode();
    var id = domNode.id;
    if (id) {
        domComponent.setId(id);
    }

    var classes = domNode.classList;
    for (var i = 0; i < classes.length; i++) {
        domComponent.addClass(classes[i]);
    }
}

function attachDOMElement(famousNode, content) {
    var domElement = new RENDERING_COMPONENTS.DOMElement(famousNode);
    domElement.setContent(content);
    return domElement;
}

function decorateComponent(famousFrameworkComponent, decoratorType) {
    var renderNode = famousFrameworkComponent.famousNode;
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
            attachAttributes(famousFrameworkComponent, renderNode[componentName]);
        }
    }
    return renderNode[componentName];
}

module.exports = {
    addChild: addChild,
    attachDOMElement: attachDOMElement,
    createRoot: createRoot,
    decorateComponent: decorateComponent,
    FamousEngine: FamousEngine, // The root of the Famous Engine library
    FamousEngineCoreFamousEngine: FamousEngineCoreFamousEngine,
    getCamera: getCamera,
    Transitionable: require('famous/transitions/Transitionable'),
    Curves: require('famous/transitions/Curves'),
    GestureHandler: require('famous/components/GestureHandler')
};
