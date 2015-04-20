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

function Component(name, uid, parent) {
    this.name = name;
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.definition = DataStore.getModule(name);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlow = new ControlFlow(this.behaviors.getBehaviorList());
    this.events = new Events(this.definition.events);
    this.states = new States(this.definition.states);
    this.tree = new Tree(name, uid, this.definition.tree, parent.tree.rootNode);
    DataStore.registerComponent(uid, this);

    this.initialize();
}

Component.prototype.handleBehaviorUpdate = function(behaviorDefinition) {
    var behaviorTargets = this.tree.findBehaviorTargets(behaviorDefinition.selector);
};

Component.prototype.initialize = function initialize() {
    var childComponent;
    var self = this;
    this.tree.eachBlueprintChild(function(node, name, uid) {
        childComponent = new Component(name, uid, self);
        childComponent.handleSurrogates(node.children);
    });

    this.states.on('behavior-update', this.handleBehaviorUpdate.bind(this));

    this.behaviors.eachListItem(function(item){
        self.states.createBehaviorListener(item);
    });
}

Component.prototype.handleSurrogates = function handleSurrogates(surrogateNodes) {
    this.controlFlow.processYield(this.tree.getExpandedBlueprint(), surrogateNodes);
}

Component.executeComponent = function executeComponent(name, selector) {
    var topLevelTree = new Tree('parent-tree:' + name, UID.generate(NODE_UID_PREFIX), '', VirtualDOM.getBaseNode());

    return new Component(name, UID.generate(NODE_UID_PREFIX), {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
