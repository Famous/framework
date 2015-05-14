'use strict';

var Behaviors = require('./../behaviors/behaviors');
var ControlFlow = require('./../control-flow/control-flow');
var ControlFlowData = require('./../control-flow/control-flow-data');
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
var Utilities = require('./../utilities/utilities');
var ObjectUtils = require('framework-utilities/object');

var NODE_UID_PREFIX = 'node';
var YIELD_KEY = '$yield';
var REPEAT_INFO_KEY = 'repeat-info';
var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var INDEX_KEY = '$index';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var PRELOAD_KEY = 'pre-load';
var POSTLOAD_KEY = 'post-load';
var PREUNLOAD_KEY = 'pre-unload';
var POSTUNLOAD_KEY = 'post-unload';

function Component(domNode, surrogateRoot, parent) {
    this.name = domNode.tagName.toLowerCase();
    this.uid = VirtualDOM.getUID(domNode);
    this.tag = VirtualDOM.getTag(domNode);
    this.dependencies = DataStore.getDependencies(this.name, this.tag);
    this.definition = DataStore.getModule(this.name, this.tag);
    this.timelineSpec = DataStore.getTimelines(this.name, this.tag);
    this.config = DataStore.getConfig(this.name, this.tag);
    this.attachments = DataStore.getAttachments(this.name, this.tag);
    if (!this.definition) {
        console.error('No module found for `' + this.name + ' (' + this.tag + ')`');
    }
    this.surrogateRoot = surrogateRoot;
    this.tree = new Tree(domNode, this.definition.tree, this.dependencies, parent.tree.rootNode);
    this.famousNode = FamousConnector.addChild(parent.famousNode);

    this.states = new States(this.definition.states);
    this.timelines = new Timelines(this.timelineSpec, this.states);

    var timelineBehaviors = this.timelines.getBehaviors();
    var definitionBehaviors = ObjectUtils.clone(this.definition.behaviors);
    var behaviorObject = Timelines.mergeBehaviors(definitionBehaviors, timelineBehaviors);

    this.behaviors = new Behaviors(behaviorObject);
    // this.controlFlow = new ControlFlow(this.behaviors.getBehaviorList());
    this.controlFlowData = new ControlFlowData(this.behaviors.getBehaviorList());
    this.blockControlFlow = false;

    this.events = new Events(this.definition.events, this.name, this.dependencies, this.getRootNode());

    DataStore.registerComponent(this.uid, this);

    this._setEventListeners();
    this._initialize();
}

/*-----------------------------------------------------------------------------------------*/
// Initialization
/*-----------------------------------------------------------------------------------------*/

Component.prototype._initialize = function _initialize() {
    var self = this;
    this.events.triggerLifecycleEvent(PRELOAD_KEY, this.uid);
    this._initializeControlFlow();
    this._processDOMMessages();
    this._runBehaviors();
    this._executeAttachments();
    this.events.initializeDescendantEvents(this.tree.getExpandedBlueprint(), this.uid);
    this.events.triggerLifecycleEvent(POSTLOAD_KEY, this.uid);
};

Component.prototype._processDOMMessages = function _processDOMMessages() {
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

    this.tree.stripExpandedBlueprintMessages();
};

Component.prototype._runBehaviors = function _runBehaviors() {
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

Component.prototype._executeAttachments = function _executeAttachments() {
    var nodeToQuery = this.tree.getExpandedBlueprint();
    var attachments = this.attachments;
    var attachment;
    var selector;
    var executable;
    var component;

    for (var i = 0; i < attachments.length; i++) {
        attachment = attachments[i];
        selector = attachment.selector;
        executable = attachment.executable;
        component;
        VirtualDOM.eachNode(nodeToQuery, selector, function (node){
            Utilities.getComponent(node).sendMessage('attach', executable);
        });
    }
};

/*-----------------------------------------------------------------------------------------*/
// Events & EventHandlers
/*-----------------------------------------------------------------------------------------*/

Component.prototype._setEventListeners = function _setEventListeners() {
    var self = this;
    this.states.on('behavior-update', this._handleBehaviorUpdate.bind(this));
    this.behaviors.eachListItem(function(item) {
        self.states.createBehaviorListener(item);
    });
};

Component.prototype._handleBehaviorUpdate = function _handleBehaviorUpdate(behavior) {
    BehaviorRouter.route(behavior, this);
};

/*-----------------------------------------------------------------------------------------*/
// Control flow logic
/*-----------------------------------------------------------------------------------------*/

Component.prototype._initializeControlFlow = function _initializeControlFlow() {
    var expandedBlueprint = ControlFlow.processSelfContainedFlows(
        this.tree.getBlueprint(), this.uid, this.controlFlowData
    );
    this.tree.setExpandedBlueprint(expandedBlueprint);

    // Check for default '$yield' overwrite via public events to minimize
    // ControlFlow's concerns
    if (this.events.getPublicEvent(YIELD_KEY)) {
        this.events.triggerPublicEvent(YIELD_KEY, {
            surrogateRoot: this.surrogateRoot
        }, this.uid);
    }
    else {
        var childrenRoot = ControlFlow.processParentDefinedFlows(
            this.tree.getExpandedBlueprint(), this.surrogateRoot, this.controlFlowData
        );
        this._updateChildren(childrenRoot);
    }

    this.getRootNode().removeAttribute(CONTROL_FLOW_ACTION_KEY);
};

Component.prototype._updateChildren = function _updateChildren(childrenRoot) {
    var self = this;
    this.tree.setChildrenRoot(childrenRoot);

    var baseNode;
    this.tree.eachChild(function(node) {
        baseNode = VirtualDOM.clone(node);
        VirtualDOM.removeChildNodes(baseNode);
        createChild(baseNode, node, self);
    });
};

Component.prototype.processDynamicRepeat = function processDynamicRepeat(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    ControlFlow.processRepeatBehavior(
        behavior, expandedBlueprint, this.uid, this.tree.getBlueprint(), this.controlFlowData
    );

    this._processControlFlowMessages();
};

Component.prototype.processDynamicIf = function processDynamicIf(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    var blueprint = this.tree.getBlueprint();

    ControlFlow.processIfBehavior(
        behavior, blueprint, expandedBlueprint, this.uid, this.controlFlowData
    );

    this._processControlFlowMessages();
};

Component.prototype._processControlFlowMessages = function _processControlFlowMessages() {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    var nodes = VirtualDOM.queryAttribute(expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
    var newComponentCreated = false;
    var result;
    for (var i = 0; i < nodes.length; i++) {
        result = Component._processControlFlowMessage(nodes[i]);
        if (!newComponentCreated) {
            newComponentCreated = result;
        }
        nodes[i].removeAttribute(CONTROL_FLOW_ACTION_KEY);
    }

    // Potentially can be optimized by only running behaviors on the
    // newly created components
    if (newComponentCreated) {
        this._runBehaviors();
    }
};

/*-----------------------------------------------------------------------------------------*/
// Public methods
/*-----------------------------------------------------------------------------------------*/

function createChild(domNode, surrogateRoot, parent) {
    return new Component(domNode, surrogateRoot, parent);
}

Component.prototype.sendMessage = function sendMessage(key, message) {
    this.events.sendMessage(key, message, this.uid);
    this.events.processPassThroughEvents(key, message, this.tree.getExpandedBlueprint());
};

Component.prototype.getRootNode = function getRootNode() {
    return this.tree.getRootNode();
};

Component.prototype.getParentComponent = function getParentComponent() {
    return Utilities.getParentComponent(this.getRootNode());
};

/*-----------------------------------------------------------------------------------------*/
// Removal
/*-----------------------------------------------------------------------------------------*/

Component.prototype._remove = function _remove() {
    this.events.triggerLifecycleEvent(PREUNLOAD_KEY, this.uid);

    // Get parent component before removing root node from virtual-dom tree
    var parentComponent = this.getParentComponent();

    var rootNode = this.getRootNode();
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
    this.events.triggerLifecycleEvent(POSTUNLOAD_KEY, this.uid);

    // TODO --> Remove all listeners
    // TODO --> Recursively remove any children
    // TODO --> Remove from DataStore
};

/*-----------------------------------------------------------------------------------------*/
// Class methods
/*-----------------------------------------------------------------------------------------*/

Component.executeComponent = function executeComponent(name, tag, selector) {
    var wrapperNode = VirtualDOM.create('parent-tree:' + name);
    var dependencies = DataStore.getDependencies(name, tag);
    var topLevelTree = new Tree(wrapperNode, '', dependencies, VirtualDOM.getBaseNode()); // Shim tree to match Component Constructor API
    var baseNode = VirtualDOM.create(name);
    VirtualDOM.setTag(baseNode, tag);
    VirtualDOM.setUID(baseNode, UID.generate(NODE_UID_PREFIX));
    return new Component(baseNode, null, {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector)
    });
};

Component._processControlFlowMessage = function _processControlFlowMessage(node) {
    var info = node.getAttribute(CONTROL_FLOW_ACTION_KEY);
    var baseNode;
    var component;

    if (info) {
        info = JSON.parse(info);
        if (info.message === CREATE_KEY) {
            baseNode = VirtualDOM.clone(node);
            VirtualDOM.removeChildNodes(baseNode);
            baseNode.removeAttribute(CONTROL_FLOW_ACTION_KEY);
            return new Component(baseNode, node, DataStore.getComponent(info.parentUID));
        }
        else if (info.message === DELETE_KEY) {
            Utilities.getComponent(node)._remove();
        }
        else {
            throw new Error('`' + info.message + '` is not a valid Control Flow Message');
        }
    }
    return null;
};

module.exports = Component;
