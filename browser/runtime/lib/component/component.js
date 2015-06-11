'use strict';

var ArrayUtils = require('./../../../utilities/array');
var BehaviorRouter = require('./../behaviors/behavior-router');
var Behaviors = require('./../behaviors/behaviors');
var ControlFlow = require('./../control-flow/control-flow');
var ControlFlowDataManager = require('./../control-flow/control-flow-data-manager');
var DataStore = require('./../data-store/data-store');
var Events = require('./../events/events');
var FamousConnector = require('./../famous-connector/famous-connector');
var States = require('./../states/states');
var Timelines = require('./../timelines/timelines');
var Tree = require('./../tree/tree');
var Utilities = require('./../utilities/utilities');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';
var CREATE_KEY = 'create';
var DELETE_KEY = 'delete';
var INDEX_KEY = '$index';
var POSTLOAD_KEY = 'post-load';
var POSTUNLOAD_KEY = 'post-unload';
var PRELOAD_KEY = 'pre-load';
var PREUNLOAD_KEY = 'pre-unload';
var REPEAT_INFO_KEY = 'repeat-info';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var SET_HTML_KEY = 'set-html';
var YIELD_KEY = '$yield';
var ROUTE_KEY = '$route';

function Component(domNode, surrogateRoot, parent) {
    this.name = domNode.tagName.toLowerCase();
    this.uid = VirtualDOM.getUID(domNode);
    this.tag = VirtualDOM.getTag(domNode);
    this.dependencies = DataStore.getDependencies(this.name, this.tag);
    this.definition = DataStore.getModuleDefinition(this.name, this.tag);
    this.timelineSpec = DataStore.getTimelines(this.name, this.tag);
    this.config = DataStore.getConfig(this.name, this.tag);
    this.attachments = DataStore.getAttachments(this.name, this.tag);
    if (!this.definition) {
        throw new Error('No module found for `' + this.name + ' (' + this.tag + ')`');
    }
    this.surrogateRoot = surrogateRoot;
    this.tree = new Tree(domNode, this.definition.tree, this.dependencies, parent.tree.rootNode);

    var famousNodeConstructorName = DataStore.getModuleOptions(this.name, this.tag).famousNodeConstructorName;
    var famousNodeConstructor = famousNodeConstructorName ?
                                    DataStore.getCustomFamousNodeConstructor(famousNodeConstructorName) :
                                    null;
    this.famousNode = FamousConnector.addChild(parent.famousNode, famousNodeConstructor);

    this.states = new States(this.definition.states);
    this.timelines = new Timelines(this.timelineSpec, this.states);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlowDataMngr = new ControlFlowDataManager(this.behaviors.getBehaviorList());
    this.blockControlFlow = false;
    this.events = new Events(this.definition.events, this.name, this.dependencies, this.getRootNode());

    DataStore.registerComponent(this.uid, this);
    this._setEventListeners();
    this._initialize();
    this._createExpandedBlueprintObserver(this.tree.getExpandedBlueprint());
}

/*-----------------------------------------------------------------------------------------*/
// Initialization
/*-----------------------------------------------------------------------------------------*/

Component.prototype._initialize = function _initialize() {
    this.events.triggerLifecycleEvent(PRELOAD_KEY, this.uid);
    this._initializeControlFlow();
    this._processDOMMessages();
    this._processRoute();
    this._runBehaviors();
    this._executeAttachments();
    this.events.initializeDescendantEvents(this.tree.getExpandedBlueprint(), this.uid);
    this.events.triggerLifecycleEvent(POSTLOAD_KEY, this.uid);
};

// Create a MutationObserver that will trigger a callback whenever nodes are added or removed
// from the component's expanded blueprint. Whenever nodes are added, initializeDescendantEvents
// is retriggered with a white list of node uids in order to add events to the newly created components
// without re-adding events to unchanged components.
Component.prototype._createExpandedBlueprintObserver = function _createExpandedBlueprintObserver(expandedBlueprint) {
    var _this = this;
    var mutation;
    var addedNodesUIDs = [];
    this._observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            mutation = mutations[i];

            // Record newly added node UIDs
            if (mutation.addedNodes.length > 0) {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    if (VirtualDOM.isValidHTMLElement(mutation.addedNodes[j])) {
                        addedNodesUIDs.push(VirtualDOM.getUID(mutation.addedNodes[j]));
                    }
                }
            }
        }

        // Initialize events on new components
        if (addedNodesUIDs.length > 0) {
            _this.events.initializeDescendantEvents(expandedBlueprint, _this.uid, addedNodesUIDs);
            addedNodesUIDs = [];
        }
    });
    this._observer.observe(expandedBlueprint, {childList: true, subtree: true});
};


Component.prototype._processDOMMessages = function _processDOMMessages() {
    var node = this.getRootNode();
    var messageStr = VirtualDOM.getAttribute(node, REPEAT_INFO_KEY);
    var index;
    var repeatPayload;
    if (messageStr) {
        var messageObj = JSON.parse(messageStr);
        index = messageObj[INDEX_KEY];
        repeatPayload = messageObj[REPEAT_PAYLOAD_KEY];
        this.events.sendMessages(repeatPayload, this.uid);
        VirtualDOM.removeAttribute(node, REPEAT_INFO_KEY);
    }
    else {
        index = 0;
        repeatPayload = null;
    }

    this.states.set(INDEX_KEY, index);
    this.states.set(REPEAT_PAYLOAD_KEY, repeatPayload);

    this.tree.stripExpandedBlueprintMessages();
};

Component.prototype._processRoute = function _processRoute() {
    // turns http://localhost:1618/?ff=famous-tests%3Arouter-test/home/page1 -> /home/page1
    this.states.set(ROUTE_KEY, '/' + window.location.href.split('/').slice(4).join('/'));
};

Component.prototype._runBehaviors = function _runBehaviors(runControlFlow, blackList) {
    blackList = blackList || [];

    if (!runControlFlow) {
        this.blockControlFlow = true;
    }
    var behaviorList = this.behaviors.getBehaviorList();
    var stateNames = this.states.getNames();
    var behavior;
    for (var i = 0; i < behaviorList.length; i++) {
        behavior = behaviorList[i];

        // Only run behaviors whose params share a name with a
        // piece of state or have no params because otherwise
        // undefined values will accidently be introduced into system.
        if (behavior.params.length === 0 || ArrayUtils.shareValue(stateNames, behavior.params)) {
            if (blackList.indexOf(behavior) === -1) {
                BehaviorRouter.route(behavior, this);
            }
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

    for (var i = 0; i < attachments.length; i++) {
        attachment = attachments[i];
        selector = attachment.selector;
        executable = attachment.executable;
        VirtualDOM.eachNode(nodeToQuery, selector, function (node) {
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
    var blueprint = this.tree.getBlueprint();
    var expandedBlueprint = ControlFlow.initializeSelfContainedFlows(
        blueprint, this.uid, this.controlFlowDataMngr
    );
    this.tree.setExpandedBlueprint(expandedBlueprint);

    // Check for default '$yield' overwrite via public events to minimize
    // ControlFlow's concerns
    if (this.events.getPublicEvent(YIELD_KEY)) {
        this.events.sendMessage(YIELD_KEY, {
            surrogateRoot: this.surrogateRoot
        }, this.uid);
    }
    else {
        var childrenRoot = VirtualDOM.clone(expandedBlueprint);
        ControlFlow.initializeParentDefinedFlows(
            expandedBlueprint, childrenRoot, this.surrogateRoot, this.controlFlowDataMngr
        );
        this._updateChildren(childrenRoot);
    }

    VirtualDOM.removeAttribute(this.getRootNode(), CONTROL_FLOW_ACTION_KEY);
};

// The children root has a mix of HTML and Framework Components. The HTML needs
// to be parsed out, and applied as content to the Component's Famous Node's DOMElement;
// the components need to be initialized.
Component.prototype._updateChildren = function _updateChildren(childrenRoot) {
    var self = this;
    this.tree.setChildrenRoot(childrenRoot);
    var baseNode;
    var domElements = [];
    this.tree.eachChild(function(node) {
        if (VirtualDOM.isValidHTMLElement(node)) {
            domElements.push(node);
        }
        else {
            // process Framework component
            baseNode = VirtualDOM.clone(node);
            VirtualDOM.removeChildNodes(baseNode);
            return new Component(baseNode, node, self);
        }
    });

    if (domElements.length) {
        self._attachDOMWrapper(domElements);
    }
};

Component.prototype._attachDOMWrapper = function _attachDOMWrapper(domNodes) {
    var wrapperNode = FamousConnector.addChild(this.famousNode);
    var content = '';
    for (var i = 0; i < domNodes.length; i++) {
        content += domNodes[i].outerHTML;
    }
    var famousDomElement = FamousConnector.attachDOMElement(wrapperNode, content);
    DataStore.registerDOMWrapper(this.uid, famousDomElement);
};

Component.prototype._setHTMLContent = function _setHTMLContent(htmlElements) {
    if (htmlElements.length && this.events.getPublicEvent(SET_HTML_KEY)) {
        this.events.sendMessage(SET_HTML_KEY, htmlElements, this.uid);
    }
};

Component.prototype.processDynamicRepeat = function processDynamicRepeat(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    ControlFlow.processRepeatBehavior(
        behavior, expandedBlueprint, this.uid, this.controlFlowDataMngr
    );

    this._processControlFlowMessages(behavior);
};

Component.prototype.processDynamicIf = function processDynamicIf(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();

    ControlFlow.processIfBehavior(
        behavior, expandedBlueprint, this.uid, this.controlFlowDataMngr
    );

    this._processControlFlowMessages(behavior);
};

Component.prototype._processControlFlowMessages = function _processControlFlowMessages(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    var nodes = VirtualDOM.queryAttribute(expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
    var newComponentCreated = false;
    var result;
    for (var i = 0; i < nodes.length; i++) {
        result = Component._processControlFlowMessage(nodes[i], expandedBlueprint);
        if (!newComponentCreated) {
            newComponentCreated = result;
        }
        VirtualDOM.removeAttribute(nodes[i], CONTROL_FLOW_ACTION_KEY);
    }

    // Potentially can be optimized by only running behaviors on the
    // newly created components
    if (newComponentCreated) {
        // Control-flow behaviors should also be run because due to cascading behaviors
        // For example, a dynamic $if could re-introduce a parent element whose children
        // should be repeated. However, the behavior that triggered the current processing
        // of control flow messages should not be re-triggered.
        this._runBehaviors(true, [behavior]);
    }
};

Component._processControlFlowMessage = function _processControlFlowMessage(node, progenitorExpandedBlueprint) {
    var info = VirtualDOM.getAttribute(node, CONTROL_FLOW_ACTION_KEY);
    var baseNode;

    if (info) {
        info = JSON.parse(info);
        if (info.message === CREATE_KEY) {
            baseNode = VirtualDOM.clone(node);
            VirtualDOM.removeChildNodes(baseNode);
            VirtualDOM.removeAttribute(baseNode, CONTROL_FLOW_ACTION_KEY);
            return new Component(baseNode, node, DataStore.getComponent(info.parentUID));
        }
        else if (info.message === DELETE_KEY) {
            // Remove the node from its progenitor (i.e., component that defined control flow behavior)
            // because node._remove only removes the node from the rootNode.
            VirtualDOM.removeNodeByUID(progenitorExpandedBlueprint, VirtualDOM.getUID(node));
            Utilities.getComponent(node)._remove();
        }
        else {
            throw new Error('`' + info.message + '` is not a valid Control Flow Message');
        }
    }
    return null;
};

/*-----------------------------------------------------------------------------------------*/
// Public methods
/*-----------------------------------------------------------------------------------------*/

Component.prototype.sendMessage = function sendMessage(key, message) {
    this.events.sendMessage(key, message, this.uid);
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

// Removes node from the singular rootNode chain and from the Famo.us scene graph.
// Any removal from expandedBlueprints should be done by outside of this method since
// an individual component does not know how many copied representations of itself exist
// in outside components.
Component.prototype._remove = function _remove() {
    this.events.triggerLifecycleEvent(PREUNLOAD_KEY, this.uid);

    // Get parent component before removing root node from virtual-dom tree
    var parentComponent = this.getParentComponent();

    var rootNode = this.getRootNode();
    if (rootNode.parentNode) {
        rootNode.parentNode.removeChild(rootNode);
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
    VirtualDOM.setUID(baseNode);
    return new Component(baseNode, null, {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector)
    });
};

module.exports = Component;
