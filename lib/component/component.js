var Behaviors = require('./../behaviors/behaviors');
var ControlFlow = require('./../control-flow/control-flow');
var DataStore = require('./../data-store/data-store');
var Events = require('./../events/events');
var FamousConnector = require('./../famous-connector/famous-connector');
var States = require('./../states/states');
var Tree = require('./../tree/tree');
var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var BehaviorRouter = require('./../behaviors/behavior-router');

var NODE_UID_PREFIX = 'node';
var YIELD_KEY = '$yield';
var STATE_AUTOTRIGGER_RE = /^[a-zA-Z0-9].*/i;

function Component(domNode, surrogateRoot, parent) {
    this.name = domNode.tagName.toLowerCase();
    this.uid = VirtualDOM.getUID(domNode);
    this.definition = DataStore.getModule(this.name);
    this.surrogateRoot = surrogateRoot;
    this.tree = new Tree(domNode, this.definition.tree, parent.tree.rootNode);
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlow = new ControlFlow(this.behaviors.getBehaviorList());
    this.events = new Events(this.definition.events, this.name);
    this.states = new States(this.definition.states);

    DataStore.registerComponent(this.uid, this);

    this.setEventListeners();
    this.initialize();
}

Component.prototype.handleBehaviorUpdate = function handleBehaviorUpdate(behavior) {
    BehaviorRouter.route(behavior, this);
};

Component.prototype.initialize = function initialize() {
    var self = this;

    this.processControlFlow();

    this.behaviors.eachListItem(function(item) {
        self.states.createBehaviorListener(item);
    });

    this.events.initializeDescendantEvents(this.tree.getExpandedBlueprint(), this.uid);

    this.states.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
}

Component.prototype.processControlFlow = function processControlFlow() {
    this.controlFlow.processSelfContainedFlows(this.tree.getBlueprint());

    // Check for default '$yield' overwrite via public events to minimize
    // ControlFlow's concerns
    if (this.events.getPublicEvent(YIELD_KEY)) {
        this.events.triggerPublicEvent(YIELD_KEY, {
            surrogateRoot: this.surrogateRoot
        }, this.uid);
    }
    else {
        this.controlFlow.processParentDefinedFlows(
            this.tree.getExpandedBlueprint(), this.surrogateRoot
        );
    }
}

Component.prototype.updateChildren = function updateChildren(childrenRoot) {
    var self = this;
    this.tree.setChildrenRoot(childrenRoot);

    // TODO --> Implement some type of diff
    var baseNode;
    this.tree.eachChild(function(node) {
        baseNode = VirtualDOM.clone(node);
        VirtualDOM.removeChildNodes(baseNode);
        childComponent = new Component(baseNode, node, self);
    });
}

Component.prototype.setEventListeners = function setEventListeners() {
    this.controlFlow.on('setExpandedBlueprint', this.tree.setExpandedBlueprint.bind(this.tree));
    this.controlFlow.on('setChildrenRoot', this.updateChildren.bind(this));
    this.states.on('behavior-update', this.handleBehaviorUpdate.bind(this));
}

Component.prototype.getRootNode = function getRootNode() {
    return this.tree.rootNode;
}

Component.executeComponent = function executeComponent(name, selector) {
    // Shim tree to match Component Constructor API
    var wrapperNode = VirtualDOM.create('parent-tree:' + name);
    var topLevelTree = new Tree(wrapperNode, '', VirtualDOM.getBaseNode());

    var baseNode = VirtualDOM.create(name);
    VirtualDOM.setUID(baseNode, UID.generate(NODE_UID_PREFIX));

    return new Component(baseNode, null, {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
