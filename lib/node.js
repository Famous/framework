'use strict';

var BehaviorConduit = require('./behavior-conduit');
var Bundle = require('./bundle');
var Dispatcher = require('./dispatcher');
var DomStore = require('./dom-store');
var EventChannel = require('./event-channel');
var NodeStore = require('./node-store');
var StateManager = require('./state-manager');
var VirtualDOM = require('./virtual-dom');

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
        this.dispatcher = new Dispatcher(this);
        this.stateManager = StateManager.create(Bundle.getStates(this.name));
        this.eventChannel = new EventChannel(this);
        this.behaviorConduit = new BehaviorConduit(this);
        this.domStore = new DomStore(this);
    }
}

Node.prototype.prepare = function(famous) {
    this.famousNode = famous.addChild();
    this.clearChildren();
    this.behaviorConduit.prepareControlFlow();
    this.buildChildren();
    this.domStore.buildTreeSignature();

    this.behaviorConduit.prepareNormalBehaviors();
    this.eventChannel.prepare();
    this.processMessages();

    // Lock control flow behaviors since they have already been
    // triggered from BehaviorConduit.prepareControlFlow
    this.triggerGlobalChange(true);
};

Node.prototype.processMessages = function() {
    var domNode = this.domStore.domNode;
    var messageStr = domNode.getAttribute(MESSAGES_ATTR_KEY);
    if (messageStr) {
        var messageHash = JSON.parse(messageStr);
        this.eventChannel.sendMessages(messageHash);
        domNode.removeAttribute(MESSAGES_ATTR_KEY);
    }
};

Node.prototype.buildChildren = function() {
    var childrenRoot = this.domStore.childrenRoot;
    var domNode = this.domStore.domNode;

    while (childrenRoot.childNodes[0]) {
        var child = childrenRoot.childNodes[0];
        domNode.appendChild(child);

        if (child.nodeType === ELEMENT_NODE_TYPE) {
            var bestNode = new Node(child);
            bestNode.prepare(this.famousNode);
        }
    }
};

Node.prototype.clearChildren = function() {
    var domNode = this.domStore.domNode;
    var treeSignature = this.domStore.treeSignature;
    var descendants = VirtualDOM.query(domNode, ALL_SELECTOR);
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
    VirtualDOM.empty(domNode);
    if (treeSignature) {
        VirtualDOM.empty(treeSignature);
    }
};

Node.prototype.triggerGlobalChange = function(blockControlFlow) {
    if (blockControlFlow) {
        this.lockControlFlow = true;
        this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
        this.lockControlFlow = false;
    }
    else {
        this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
    }
};

Node.prototype.getParent = function() {
    return NodeStore.findNode(VirtualDOM.getUID(this.domNode.parentNode));
};

Node.prototype.teardown = function() {
    var parentBestNode = this.getParent();
    if (parentBestNode) {
        parentBestNode.famousNode.removeChild(this.famousNode);
    }
    if (this.domNode.parentNode) {
        this.domNode.parentNode.removeChild(this.domNode);
    }
};

module.exports = Node;
