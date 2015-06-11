'use strict';

window.Famous = require('famous');
var FamousEngine = window.FamousEngine = require('famous/core/FamousEngine');

FamousEngine.init();

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

function createRoot(selector) {
    var context = FamousEngine.createScene(selector);
    return context.addChild();
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
    FamousEngine: FamousEngine,
    Transitionable: require('famous/transitions/Transitionable'),
    Curves: require('famous/transitions/Curves')
};
