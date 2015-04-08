'use strict';

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
var TREE_SIG_ATTR_KEY = 'tree_sig';
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
        this.descendantEvents = Bundle.getDescendantEvents(this.name);
        this.handlerEvents = Bundle.getHandlerEvents(this.name);
        this.stateManager = StateManager.create(this.statesObject);
        this.eventManager = EventManager.create(this);
        this.behaviorConduit = new BehaviorConduit(this);
        this.eventConduit = new EventConduit(this);

        this.treeString = this.definition.tree || EMPTY_TREE;
        this.childrenRoot = VirtualDOM.parse(this.treeString);
        this.surrogateRoot = VirtualDOM.clone(this.domNode);
        VirtualDOM.attachAttributeToNodes(
            this.childrenRoot,
            TREE_SIG_ATTR_KEY,
            VirtualDOM.getUID(this.domNode)
        );
    }
}

Node.prototype.prepare = function(famous) {
    this.famousNode = famous.addChild();
    this.clearChildren();
    this.behaviorConduit.prepareControlFlow();
    this.behaviorConduit.prepareNormalBehaviors();
    this.buildChildren();
    this.buildTreeSignature();
    this.eventConduit.prepare();
    this.processMessages();

    // Lock control flow behaviors since they have already been
    // triggered from BehaviorConduit.prepareControlFlow
    this.lockControlFlow = true;
    this.stateManager.triggerGlobalChange(STATE_AUTOTRIGGER_RE);
    this.lockControlFlow = false;
};

Node.prototype.processMessages = function() {
    var messageStr = this.domNode.getAttribute(MESSAGES_ATTR_KEY);
    if (messageStr) {
        var messageHash = JSON.parse(messageStr);
        this.eventManager.sendMessages(messageHash);
        this.domNode.removeAttribute(MESSAGES_ATTR_KEY);
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
    VirtualDOM.empty(this.domNode);
    if (this.treeSignature) {
        VirtualDOM.empty(this.treeSignature);
    }
};

function isUIDMatch(node, UID) {
    return node.getAttribute(TREE_SIG_ATTR_KEY) === UID;
}

function pruneTree(node, matchUID) {
    var parent;
    var grandparent;

    // Process children first
    if (node.children.length > 0) {
        for (var i = 0; i < node.children.length; i++) {
            pruneTree(node.children[i], matchUID);
        }
    }

    parent = node.parentNode;

    // Remove node is UID doesn't match
    if (!isUIDMatch(node, matchUID)) {
        if (parent) {
            parent.removeChild(node);
        }
        node = null;
    }
    else {
        // Move child to grandparent if parent's UID doesn't match
        // since the parent will get pruned
        if (parent && !isUIDMatch(parent, matchUID)) {
            grandparent = parent.parentNode;
            if (grandparent) {
                grandparent.appendChild(node);
            }
        }
    }
}

Node.prototype.buildTreeSignature = function() {
    this.treeSignature = VirtualDOM.clone(this.domNode);
    pruneTree(this.treeSignature, VirtualDOM.getUID(this.domNode));
};

Node.prototype.teardown = function() {
    //
    // TODO
    //
};

module.exports = Node;
