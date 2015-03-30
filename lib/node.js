'use strict';

var Args = require('./helpers/args');
var BehaviorConduit = require('./behavior-conduit');
var Bundle = require('./bundle');
var EventConduit = require('./event-conduit');
var EventManager = require('./event-manager');
var NodeStore = require('./node-store');
var StateManager = require('./state-manager');
var VirtualDOM = require('./virtual-dom');

var EMPTY_TREE = '';
var ALL_SELECTOR = '*';
var MESSAGES_ATTR_KEY = 'data-messages';
var STATE_AUTOTRIGGER_RE = /^[a-zA-Z0-9].*/i;
var ELEMENT_NODE_TYPE = 1;

function Node(domNode) {
    this.domNode = domNode;
    this.name = this.domNode.tagName.toLowerCase();
    this.definition = Bundle.getDefinition(this.name);
    this.isComponent = !!this.definition; // For e.g. <p> tags
    if (this.isComponent) {
        NodeStore.saveNode(this);
        this.statesObject = Bundle.getStates(this.name);
        this.eventsObject = Bundle.getEvents(this.name);
        this.publicEvents = Bundle.getPublicEvents(this.name);
        this.handlerEvents = Bundle.getHandlerEvents(this.name);
        this.stateManager = StateManager.create(this.statesObject);
        this.eventManager = EventManager.create(this);
        this.treeString = this.definition.tree || EMPTY_TREE;
        this.signatureRoot = VirtualDOM.parse(this.treeString);
        this.childrenRoot = VirtualDOM.clone(this.signatureRoot);
        this.surrogateRoot = VirtualDOM.clone(this.domNode);
        this.behaviorConduit = new BehaviorConduit(this);
        this.eventConduit = new EventConduit(this);
    }
}

Node.prototype.prepare = function(famous) {
    this.famousNode = famous.addChild();
    this.clearChildren();
    this.behaviorConduit.prepareControlFlow();
    this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
    this.behaviorConduit.prepareNormalBehaviors();
    this.buildChildren();
    this.eventConduit.prepare();
    this.processMessages();
    this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
};

Node.prototype.processMessages = function() {
    var messageStr = this.domNode.getAttribute(MESSAGES_ATTR_KEY);
    if (messageStr) {
        var messageHash = JSON.parse(messageStr);
        this.eventManager.sendMessages(messageHash);
    }
};

Node.prototype.buildChildren = function() {
    while (this.childrenRoot.childNodes[0]) {
        var child = this.childrenRoot.childNodes[0];
        this.domNode.appendChild(child);
        if (child.nodeType === ELEMENT_NODE_TYPE) {
            var bestNode = new Node(child);
            bestNode.prepare(this.famousNode);
        }
        var clone = VirtualDOM.clone(child);
        this.signatureRoot.appendChild(clone);
    }
};

Node.prototype.clearChildren = function() {
    var descendants = VirtualDOM.query(this.domNode, ALL_SELECTOR);
    for (var i = 0; i < descendants.length; i++) {
        var descendant = descendants[i];
        if (descendant.nodeType === ELEMENT_NODE_TYPE) {
            var descendantUID = VirtualDOM.getUID(descendant);
            if (descendantUID) {
                var descendantNode = NodeStore.findNode(descendantUID);
                descendantNode.teardown();
            }
        }
    }
    VirtualDOM.empty(this.signatureRoot);
    VirtualDOM.empty(this.domNode);
};

Node.prototype.teardown = function() {
    //
    // TODO
    //
};

module.exports = Node;
