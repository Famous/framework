var Behaviors = require('./../behaviors/behaviors');
var ControlFlow = require('./../control-flow/control-flow');
var DataStore = require('./../data-store/data-store');
var Events = require('./../events/events');
var FamousConnector = require('./../famous-connector/famous-connector');
var States = require('./../states/states');
var Tree = require('./../tree/tree');
var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var NODE_UID_PREFIX = 'node';
var YIELD_KEY = '$yield';

function Component(name, uid, surrogateRoot, parent) {
    this.name = name;
    this.definition = DataStore.getModule(name);
    this.surrogateRoot = surrogateRoot;
    this.tree = new Tree(name, uid, this.definition.tree, parent.tree.rootNode);
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlow = new ControlFlow(this.behaviors.getBehaviorList());
    this.events = new Events(this.definition.events);
    this.states = new States(this.definition.states);

    DataStore.registerComponent(uid, this);

    this.setEventListeners();
    this.initialize();
}

Component.prototype.handleBehaviorUpdate = function handleBehaviorUpdate(behaviorDefinition) {
    var behaviorTargets = this.tree.findBehaviorTargets(behaviorDefinition.selector);
};

Component.prototype.initialize = function initialize() {
    var self = this;

    // Set up behavior listeners
    this.behaviors.eachListItem(function(item){
        self.states.createBehaviorListener(item);
    });

    this.processControlFlow();
}

Component.prototype.processControlFlow = function processControlFlow() {
    this.controlFlow.processSelfContainedFlows(this.tree.getBlueprint());

    // Check for default '$yield' overwrite via public events to minimize
    // ControlFlow's concerns
    var publicEvents = this.events.getPublicEvents();
    if (publicEvents[YIELD_KEY]) {
        console.log(this.name);
    }
    else {
        this.controlFlow.processParentDefinedFlows(this.tree.getExpandedBlueprint(), this.surrogateRoot);
    }
}

Component.prototype.setChildrenRoot = function setChildrenRoot(childrenRoot) {
    var self = this;
    this.tree.setChildrenRoot(childrenRoot);

    // TODO --> Implement some type of diff
    this.tree.eachChildrootNode(function(node, name, uid) {
        childComponent = new Component(name, uid, node, self);
    });
}

Component.prototype.setEventListeners = function setEventListeners() {
    this.controlFlow.on('setExpandedBlueprint', this.tree.setExpandedBlueprint.bind(this.tree));
    this.controlFlow.on('setChildrenRoot', this.setChildrenRoot.bind(this));
    this.states.on('behavior-update', this.handleBehaviorUpdate.bind(this));
}

Component.executeComponent = function executeComponent(name, selector) {
    var topLevelTree = new Tree('parent-tree:' + name, UID.generate(NODE_UID_PREFIX), '', VirtualDOM.getBaseNode());

    return new Component(name, UID.generate(NODE_UID_PREFIX), null, {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
