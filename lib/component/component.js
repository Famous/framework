'use strict';

var Behaviors = require('./../behaviors/behaviors');
var ControlFlow = require('./../control-flow/control-flow');
var DataStore = require('./../data-store/data-store');
var Events = require('./../events/events');
var FamousConnector = require('./../famous-connector/famous-connector');
var States = require('./../states/states');
var Timelines = require('./../timelines/timelines');
var Tree = require('./../tree/tree');
var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');
var BehaviorRouter = require('./../behaviors/behavior-router');
var ArrayUtils = require('framework-utilities/array');

var NODE_UID_PREFIX = 'node';
var YIELD_KEY = '$yield';
var REPEAT_INFO_KEY = 'repeat-info';
var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';

function Component(domNode, surrogateRoot, parent) {
    this.name = domNode.tagName.toLowerCase();
    this.uid = VirtualDOM.getUID(domNode);
    this.definition = DataStore.getModule(this.name);
    this.surrogateRoot = surrogateRoot;
    this.tree = new Tree(domNode, this.definition.tree, parent.tree.rootNode);
    this.famousNode = FamousConnector.addChild(parent.famousNode);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlow = new ControlFlow(this.behaviors.getBehaviorList());
    this.blockControlFlow = false;
    this.events = new Events(this.definition.events, this.name, this.getRootNode());
    this.states = new States(this.definition.states);
    this.timelines = new Timelines(this.definition.timelines, this.states);

    DataStore.registerComponent(this.uid, this);

    this.setEventListeners();
    this.initialize();
}

Component.prototype.handleBehaviorUpdate = function handleBehaviorUpdate(behavior) {
    BehaviorRouter.route(behavior, this);
};

Component.prototype.processDynamicRepeat = function processDynamicRepeat(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    this.controlFlow.processRepeatBehavior(
        behavior, expandedBlueprint, this.uid
    );

    this.processControlFlowMessages();
};

Component.prototype.processDynamicIf = function processDynamicIf(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    var blueprint = this.tree.getBlueprint();

    this.controlFlow.processIfBehavior(
        behavior, blueprint, expandedBlueprint, this.uid
    );

    this.processControlFlowMessages();
};

Component.prototype.processControlFlowMessages = function processControlFlowMessages() {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    var nodes = VirtualDOM.queryAttribute(expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
    var newComponentCreated = false;
    var result;
    for (var i = 0; i < nodes.length; i++) {
        result = Component.processControlFlowMessage(nodes[i]);
        if (!newComponentCreated) {
            newComponentCreated = result;
        }
        nodes[i].removeAttribute(CONTROL_FLOW_ACTION_KEY);
    }

    // Potentially can be optimized by only running behaviors on the
    // newly created components
    if (newComponentCreated) {
        this.runBehaviors();
    }
};

Component.processControlFlowMessage = function processControlFlowMessage(node) {
    var info = node.getAttribute(CONTROL_FLOW_ACTION_KEY);
    if (info) {
        info = JSON.parse(info);
        if (info.message === CREATE_KEY) {
            var baseNode = VirtualDOM.clone(node);
            VirtualDOM.removeChildNodes(baseNode);
            baseNode.removeAttribute(CONTROL_FLOW_ACTION_KEY);
            return new Component(baseNode, node, DataStore.getComponent(info.parentUID));
        }
        else if (info.message === DELETE_KEY) {
            var component = DataStore.getComponent(VirtualDOM.getUID(node));
            component.remove();
        }
    }
    return null;
};

Component.prototype.initialize = function initialize() {
    var self = this;

    this.processControlFlow(this.uid);

    this.behaviors.eachListItem(function(item) {
        self.states.createBehaviorListener(item);
    });

    this.events.initializeDescendantEvents(this.tree.getExpandedBlueprint(), this.uid);

    this.processDOMMessages();
    this.tree.stripExpandedBlueprintMessages();
    this.runBehaviors();
};

Component.prototype.processDOMMessages = function processDOMMessages() {
    var node = this.getRootNode();
    var messageStr = node.getAttribute(REPEAT_INFO_KEY);
    var index;
    var repeatPayload;
    if (messageStr) {
        var messageObj = JSON.parse(messageStr);
        index = messageObj[INDEX_KEY];
        repeatPayload = messageObj[REPEAT_PAYLOAD_KEY];
        this.events.sendMessages(repeatPayload, this.uid);
        node.removeAttribute(REPEAT_INFO_KEY);
    }
    else {
        index = 0;
        repeatPayload = null;
    }

    this.states.set(INDEX_KEY, index);
    this.states.set(REPEAT_PAYLOAD_KEY, repeatPayload);
};

Component.prototype.runBehaviors = function runBehaviors() {
    this.blockControlFlow = true;
    var behaviorList = this.behaviors.getBehaviorList();
    var stateNames = this.states.getNames();
    var behavior;
    for (var i = 0; i < behaviorList.length; i++) {
        behavior = behaviorList[i];

        // Only run behaviors whose params share a name with a
        // piece of state or have no params because otherwise
        // undefined values will accidently be introduced into system.
        if (behavior.params.length === 0 || ArrayUtils.shareValue(stateNames, behavior.params)) {
            BehaviorRouter.route(behaviorList[i], this);
        }
    }
    this.blockControlFlow = false;
};

Component.prototype.processControlFlow = function processControlFlow(uid) {
    this.controlFlow.processSelfContainedFlows(this.tree.getBlueprint(), uid);

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

    this.tree.getRootNode().removeAttribute(CONTROL_FLOW_ACTION_KEY);
};

function createChild(domNode, surrogateRoot, parent) {
    return new Component(domNode, surrogateRoot, parent);
}

Component.prototype.updateChildren = function updateChildren(childrenRoot) {
    var self = this;
    this.tree.setChildrenRoot(childrenRoot);

    var baseNode;
    this.tree.eachChild(function(node) {
        baseNode = VirtualDOM.clone(node);
        VirtualDOM.removeChildNodes(baseNode);
        createChild(baseNode, node, self);
    });
};

Component.prototype.setEventListeners = function setEventListeners() {
    this.controlFlow.on('setExpandedBlueprint', this.tree.setExpandedBlueprint.bind(this.tree));
    this.controlFlow.on('setChildrenRoot', this.updateChildren.bind(this));
    this.states.on('behavior-update', this.handleBehaviorUpdate.bind(this));
};

Component.prototype.sendMessage = function sendMessage(key, message) {
    this.events.sendMessage(key, message, this.uid);
};

Component.prototype.getRootNode = function getRootNode() {
    return this.tree.rootNode;
};

Component.prototype.getParentComponent = function getParentComponent() {
    return DataStore.getComponent(VirtualDOM.getParentUID(this.getRootNode()));
};

Component.prototype.remove = function remove() {
    var parentComponent = this.getParentComponent();

    var rootNode = this.tree.getRootNode();
    if (rootNode.parentNode) {
        rootNode.parentNode.removeChild(rootNode);
    }

    var parentExpandedBlueprint = parentComponent.tree.getExpandedBlueprint();
    var targetNode = VirtualDOM.getNodeByUID(parentExpandedBlueprint, this.uid);
    // Target node may not be in parent's expanded blueprint if it was yielded
    // in by a grandparent
    if (targetNode) {
        parentExpandedBlueprint.removeChild(targetNode);
    }

    parentComponent.famousNode.removeChild(this.famousNode);

    // TODO --> Remove all listeners
    // TODO --> Recursively remove any children
    // TODO --> Remove from DataStore
};

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
