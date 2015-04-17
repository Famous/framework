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
    this.behaviors = new Behaviors(this);
    this.controlFlow = new ControlFlow(this);
    this.events = new Events(this);
    this.states = new States(this);
    this.tree = new Tree(this);
    DataStore.registerComponent(this.uid, this);
}

Component.executeComponent = function(name, selector) {
    return new Component(name, {
        node: VirtualDOM.getBaseNode(),
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
