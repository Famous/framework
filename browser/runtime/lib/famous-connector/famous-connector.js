'use strict';

window.Famous = require('famous');
var FamousEngine = window.FamousEngine = require('famous/core/FamousEngine');

FamousEngine.init();

var COMPONENT_PREFIX = '__best-';

var RENDERING_COMPONENTS = {
    'DOMElement': require('famous/dom-renderables/DOMElement')
};

function addChild(famousNode) {
    return famousNode.addChild();
}

function createRoot(selector) {
    var context = FamousEngine.createScene(selector);
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
    decorateComponent: decorateComponent,
    FamousEngine: FamousEngine,
    Transitionable: require('famous/transitions/Transitionable'),
    Curves: require('famous/transitions/Curves')
};
