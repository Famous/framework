var Behaviors = require('./../behaviors');
var ControlFlow = require('./../control-flow');
var DataStore = require('./../data-store');
var Events = require('./../events');
var FamousConnector = require('./../famous-connector');
var States = require('./../states');
var Tree = require('./../tree');
var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom');

function Component(name, uid, parent) {
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.definition = DataStore.getModule(name);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.events = new Events(this.definition.events);
    this.states = new States(this.definition.states);
    this.tree = new Tree(name, uid, this.definition.tree, parent.node);
    DataStore.registerComponent(uid, this);

    this.initialize();
}

Component.prototype.handleBehaviorUpdate = function(behaviorDefinition) {
    var behaviorTargets = this.tree.findBehaviorTargets(behaviorDefinition.selector);

};

Component.prototype.initialize = function initialize() {
    var treeSnapshot = this.tree.getSnapshot();
    for (var i = 0; i < treeSnapshot.children.length; i++) {
        var childNode = treeSnapshot.children[i];
        var childComponent = new Component(
            childNode.tagName.toLowerCase(),
            childNode.getAttribute('uid'),
            this
        );
        childComponent.handleSurrogates(childNode.children);
    }

    this.states.on('behavior-update', this.handleBehaviorUpdate.bind(this));

    var behaviorList = this.behaviors.getBehaviorList();
    for (var i = 0; i < behaviorList.length; i++) {
        this.states.createBehaviorListener(behaviorList[i]);
    }
}

Component.executeComponent = function executeComponent(name, selector) {
    return new Component(name, UID.generate(), {
        node: VirtualDOM.getBaseNode(),
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
