var DependencyLoader = require('./dependency-loader');
var FamousApplication = require('./famous-application');
var BehaviorConduit = require('./behavior-conduit');
var EventManager = require('./event-manager');
var EventConduit = require('./event-conduit');
var YieldConduit = require('./yield-conduit');
var ObjUtils = require('framework-utilities/object');
var StateManager = require('best-state-manager');
var FunctionParser = require('best-function-parser');
var getParameterNames = FunctionParser.getParameterNames;
var createBehaviorList = require('./support/create-behavior-list');
var DOM_PARSER = new DOMParser();

var STATE_AUTOTRIGGER_RE = /^[a-zA-Z0-9].*/i;
var PUBLIC_EVENTS_KEY = 'public';
var HANDLER_EVENTS_KEY = 'handlers';
var TREE_DATA_TYPE = 'text/html';
var COMPONENT_DELIM = ':';
var DO_CLONE_ATTRIBUTES = true;
var ELEMENT_NODE_TYPE = 1;
var EMPTY_TREE = '';
var UID_KEY = 'uid';
var SELF_KEY = '$self';
var PAYLOAD_KEY = '$payload';
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
var YIELD_KEY = '$yield';

function BestApplication(name, selector) {
    this.name = name;
    this.selector = selector;
    this.bestNodes = {};
    this.bundle = {};
    this.loader = new DependencyLoader();
    this.famous = new FamousApplication(this.selector);
    this.DOMNode = document.createElement(this.name);
    this.loader.load(name, this.initialize.bind(this));
}

BestApplication.deploy = function(name, selector) {
    return new BestApplication(name, selector);
};

BestApplication.prototype.initialize = function(bundle) {
    this.bundle = ObjUtils.merge(this.bundle, bundle);
    this.processDOMNodes([this.DOMNode]);
    this.setupSceneGraph(this.DOMNode, this.famous.root);
};

BestApplication.prototype.send = function(selector, key, message) {
    var targetElements = this.DOMNode.querySelectorAll(selector);
    for (var i = 0; i < targetElements.length; i++) {
        var bestNode = this.bestNodes[targetElements[i].bestUID];
        bestNode.eventManager.send(key, message);
    }
};

BestApplication.prototype.processDOMNodes = function(DOMNodes, parentBestNode) {
    for (var i = 0; i < DOMNodes.length; i++) {
        var bestDOMNode = DOMNodes[i];
        if (bestDOMNode.nodeType !== ELEMENT_NODE_TYPE) continue;
        if (bestDOMNode.getAttribute(UID_KEY)) continue;
        var bestNodeUID = Math.random().toString(36).slice(2);
        bestDOMNode.setAttribute(UID_KEY, bestNodeUID);
        bestDOMNode.bestUID = bestNodeUID; // Easier access
        var bestNodeName = bestDOMNode.tagName.toLowerCase();
        var bestNodeDefinition = this.bundle[bestNodeName];
        if (!bestNodeDefinition) continue; // For e.g. <p> elements
        var behaviorList = createBehaviorList(ObjUtils.clone(bestNodeDefinition.behaviors || {}));
        var statesObject = ObjUtils.clone(bestNodeDefinition.states || {});
        var eventsObject = ObjUtils.clone(bestNodeDefinition.events || {});
        var publicEvents = ObjUtils.clone(eventsObject[PUBLIC_EVENTS_KEY] || {});
        var handlerEvents = ObjUtils.clone(eventsObject[HANDLER_EVENTS_KEY] || {});
        var treeString = bestNodeDefinition.tree || EMPTY_TREE;
        var childrenRoot = DOM_PARSER.parseFromString(treeString, TREE_DATA_TYPE).body;
        var surrogateRoot = bestDOMNode.cloneNode(DO_CLONE_ATTRIBUTES);
        var stateManager = new StateManager(statesObject, this.famous.Clock, this.famous.Transitionable);
        var eventManager = new EventManager(stateManager, publicEvents);
        var famousNode = this.famous.buildNode();
        var bestNode = this.bestNodes[bestNodeUID] = {
            uid: bestNodeUID,
            name: bestNodeName,
            DOMNode: bestDOMNode,
            parentNode: parentBestNode,
            publicEvents: publicEvents,
            handlerEvents: handlerEvents,
            childrenRoot: childrenRoot,
            behaviorList: behaviorList,
            stateManager: stateManager,
            eventManager: eventManager,
            famousNode: famousNode
        };
        this.processDOMNodes(childrenRoot.childNodes, bestNode);
        this.processDOMNodes(surrogateRoot.childNodes, bestNode);
        bestNode.eventConduit = new EventConduit(this, bestNode);
        bestNode.behaviorConduit = new BehaviorConduit(this, bestNode);
        while (bestDOMNode.firstChild) bestDOMNode.removeChild(bestDOMNode.firstChild);
        while (childrenRoot.childNodes[0]) bestDOMNode.appendChild(childrenRoot.childNodes[0]);

        // Handle yield
        if (surrogateRoot.childNodes.length) { // add a check that also scans node type
            if (publicEvents[YIELD_KEY]) {
                eventManager.send(YIELD_KEY, surrogateRoot.childNodes);
            }
            else {
                YieldConduit.handleYield(bestNode, surrogateRoot);
            }
        }

        stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
    }
};

BestApplication.prototype.setupSceneGraph = function(DOMNode, parent) {
    if (DOMNode.nodeType !== ELEMENT_NODE_TYPE) return;
    var elementUID = DOMNode.bestUID;
    var bestNode = this.bestNodes[elementUID];
    var famousNode = bestNode.famousNode;
    parent._children.push(famousNode); // Hack to re-add an orphan node
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
    if (!behaviorHandler) { throw new Error('Unknown behavior handler `' + behaviorName + '`'); }
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
            case HTML_ELEMENT_KEY:
                var htmlElement = this.famous.attachComponent(bestNode.famousNode, 'HTMLElement');
                htmlElement.attribute(UID_KEY, bestNode.uid); // For debugging purposes
                handlerArgs.push(htmlElement);
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
}

module.exports = BestApplication;
