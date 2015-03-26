'use strict';

var DependencyLoader = require('./dependency-loader');
var FamousApplication = require('./famous-application');
var ObjUtils = require('framework-utilities/object');
var Mustache = require('mustache');
var BestNode = require('./best-node');

var DEFAULT_SELECTOR = 'body';
var COMPONENT_DELIM = ':';
var DO_CLONE_ATTRIBUTES = true;
var ELEMENT_NODE_TYPE = 1;
var UID_KEY = 'uid';
var SELF_KEY = '$self';
var PAYLOAD_KEY = '$payload';
var STATE_MANAGER_KEY = '$state';
var BEST_NODE_KEY = '$node';
var PARENT_BEST_NODE_KEY = '$parent';
var BEST_DOM_NODE_KEY = '$domNode';
var HTML_ELEMENT_KEY = '$HTMLElement';
var MOUNT_POINT_KEY = '$mountPoint';
var ALIGN_KEY = '$align';
var CAMERA_KEY = '$camera';
var OPACITY_KEY = '$opacity';
var ORIGIN_KEY = '$origin';
var POSITION_KEY = '$position';
var ROTATION_KEY = '$rotation';
var SCALE_KEY = '$scale';
var SIZE_KEY = '$size';
var WEBGL_MESH_KEY = '$webGLMesh';
var POINT_LIGHT_KEY = '$pointLight';
var AMBIENT_LIGHT_KEY = '$ambientLight';
var MUSTACHE_KEY = '$mustache';

function BestApplication(name, selector, ready) {
    this.name = name;
    if (!selector) {
        console.warn('No selector given. Defaulting to `' + DEFAULT_SELECTOR + '`');
        this.selector = DEFAULT_SELECTOR;
    }
    else {
        this.selector = selector;
    }
    this.initialized = false;
    this.bestNodes = {};
    this.bundle = {};
    this.loader = new DependencyLoader();
    this.famous = new FamousApplication(this.selector);
    this.DOMNode = document.createElement(this.name);
    this.loader.load(name, function(bundle) {
        this.initialize(bundle);
        if (ready) {
            ready(this);
        }
    }.bind(this));
}

BestApplication.deploy = function(name, selector, ready) {
    return new BestApplication(name, selector, ready);
};

BestApplication.prototype.initialize = function(bundle) {
    this.bundle = ObjUtils.merge(this.bundle, bundle);
    this.processDOMNodes([this.DOMNode]);
    this.setupSceneGraph(this.DOMNode, this.famous.root, 'root');
    this.initialized = true;
};

BestApplication.prototype.send = function(selector, key, message) {
    var bestNode;
    if (selector === '$root') {
        bestNode = this.bestNodes[this.DOMNode.getAttribute(UID_KEY)];
        bestNode.eventManager.send(key, message);
    }
    else {
        var _wrapper = document.createElement('_wrapper');
        var clonedNode = this.DOMNode.cloneNode(DO_CLONE_ATTRIBUTES);
        _wrapper.appendChild(clonedNode);
        var targetElements = _wrapper.querySelectorAll(selector);
        for (var i = 0; i < targetElements.length; i++) {
            bestNode = this.bestNodes[targetElements[i].getAttribute(UID_KEY)];
            bestNode.eventManager.send(key, message);
        }
    }

    return this;
};

BestApplication.prototype.getBestNode = function(uid) {
    return this.bestNodes[uid];
};

BestApplication.prototype.processDOMNodes = function(DOMNodes, parentBestNode, copyID) {
    var bestNodes = [];
    for (var i = 0; i < DOMNodes.length; i++) {
        var bestDOMNode = DOMNodes[i];
        if (bestDOMNode.nodeType !== ELEMENT_NODE_TYPE) {
            continue;
        }
        if (bestDOMNode.getAttribute(UID_KEY)) {
            continue;
        }
        var name = bestDOMNode.tagName.toLowerCase();
        var componentDefinition = this.bundle[name];
        var bestNode = new BestNode(name, bestDOMNode, parentBestNode, componentDefinition, this.famous);
        this.bestNodes[bestNode.uid] = bestNode;

        if (bestNode.isComponent) {
            if (copyID && parentBestNode.treeSignature.childNodes[i]) {
                parentBestNode.treeSignature.childNodes[i].setAttribute(UID_KEY, bestNode.uid);
            }

            this.processDOMNodes(bestNode.childrenRoot.childNodes, bestNode, true);
            this.processDOMNodes(bestNode.surrogateRoot.childNodes, bestNode);

            bestNode.addEventConduit(this);
            bestNode.addBehaviorConduit(this);
            bestNode.handleYield();
            bestNode.initialize();
        }
        bestNodes.push(bestNode);
    }

    return bestNodes;
};

BestApplication.prototype.setupSceneGraph = function(DOMNode, parentFamousNode) {
    if (DOMNode.nodeType !== ELEMENT_NODE_TYPE) {
        return;
    }
    var elementUID = DOMNode.bestUID;
    var bestNode = this.bestNodes[elementUID];
    var famousNode = bestNode.famousNode;
    parentFamousNode._children.push(famousNode); // Hack to re-add an orphan node
    var childDOMNodes = DOMNode.childNodes;
    for (var i = 0; i < childDOMNodes.length; i++) {
        this.setupSceneGraph(childDOMNodes[i], famousNode);
    }
};

BestApplication.prototype.fetchBehaviorHandler = function(behaviorName, clientBestNode) {
    var lastDelimIdx = behaviorName.lastIndexOf(COMPONENT_DELIM);
    var behaviorComponentName = behaviorName.slice(0, lastDelimIdx);
    var behaviorHandlerName = behaviorName.slice(lastDelimIdx + 1, behaviorName.length);
    var behaviorHandler = (behaviorComponentName === SELF_KEY)
        ? clientBestNode.handlerEvents[behaviorHandlerName]
        : this.bundle[behaviorComponentName].events.handlers[behaviorHandlerName];
    if (!behaviorHandler) {
        throw new Error('Unknown behavior handler `' + behaviorName + '`');
    }
    return behaviorHandler;
};

BestApplication.prototype.fetchDependencies = function(handlerDeps, behaviorPayload, bestNode) {
    var handlerArgs = [];
    for (var j = 0; j < handlerDeps.length; j++) {
        var handlerDep = handlerDeps[j];
        switch (handlerDep) {
            case PAYLOAD_KEY: handlerArgs.push(behaviorPayload); break;
            case BEST_DOM_NODE_KEY: handlerArgs.push(bestNode.DOMNode); break;
            case BEST_NODE_KEY: handlerArgs.push(bestNode); break;
            case PARENT_BEST_NODE_KEY: handlerArgs.push(bestNode.parentNode); break;
            case MOUNT_POINT_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'MountPoint')); break;
            case ALIGN_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Align')); break;
            case CAMERA_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Camera')); break;
            case OPACITY_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Opacity')); break;
            case ORIGIN_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Origin')); break;
            case POSITION_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Position')); break;
            case ROTATION_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Rotation')); break;
            case SCALE_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Scale')); break;
            case SIZE_KEY: handlerArgs.push(this.famous.attachComponent(bestNode.famousNode, 'Size')); break;
            case STATE_MANAGER_KEY: handlerArgs.push(bestNode.stateManager); break;
            case MUSTACHE_KEY: handlerArgs.push(Mustache.render); break;
            case HTML_ELEMENT_KEY:
                var htmlElement = this.famous.attachComponent(bestNode.famousNode, 'HTMLElement');
                htmlElement.attribute(UID_KEY, bestNode.uid); // For debugging purposes
                handlerArgs.push(htmlElement);
                break;
            case POINT_LIGHT_KEY:
                var pointLight = this.famous.attachComponent(bestNode.famousNode, 'PointLight');
                handlerArgs.push(pointLight);
                break;
            case AMBIENT_LIGHT_KEY:
                var ambientLight = this.famous.attachComponent(bestNode.famousNode, 'AmbientLight');
                handlerArgs.push(ambientLight);
                break;
            case WEBGL_MESH_KEY:
                var webGLMesh = this.famous.attachComponent(bestNode.famousNode, 'WebGLMesh');
                handlerArgs.push(webGLMesh);
                break;
            default:
                throw new Error('No such dependency `' + handlerDep + '`');
        }
    }
    return handlerArgs;
};

module.exports = BestApplication;
