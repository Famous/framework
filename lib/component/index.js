var Behaviors = require('./../behaviors');
var ControlFlow = require('./../control-flow');
var DataStore = require('./../data-store');
var Events = require('./../events');
var FamousConnector = require('./../famous-connector');
var States = require('./../states');
var Tree = require('./../tree');
var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom');

function Component(name, parent) {
    this.uid = UID.generate();
    this.node = VirtualDOM.addNode(name, this.uid, parent.node);
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.definition = DataStore.getModule(name);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.events = new Events(this.definition.events);
    this.states = new States(this.definition.states);
    this.tree = new Tree(this.definition.tree);
    DataStore.registerComponent(this.uid, this);

    this.initialize();
}

Component.prototype.initialize = function initialize() {
    var behaviorList = this.behaviors.getBehaviorList();
    for (var i = 0; i < behaviorList.length; i++) {
        console.log(behaviorList[i]);
    }
}

Component.executeComponent = function executeComponent(name, selector) {
    return new Component(name, {
        node: VirtualDOM.getBaseNode(),
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
