'use strict';

var ArrayUtils = require('./../utilities/array');
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
var PREUNLOAD_KEY = 'pre-unload';
var REPEAT_INFO_KEY = 'repeat-info';
var REPEAT_PAYLOAD_KEY = '$repeatPayload';
var ROUTE_KEY = '$route';
var WRAPPER_NODE_KEY = 'wrapper-node';
var YIELD_KEY = '$yield';

function Component(domNode, surrogateRoot, parent, runtimeConfiguration, cb) {
    // Identifying data
    this.name = domNode.tagName.toLowerCase();
    this.uid = VirtualDOM.getUID(domNode);
    this.tag = VirtualDOM.getTag(domNode);
    this.rootSelector = parent.rootSelector;

    // Content
    this.dependencies = DataStore.getDependencies(this.name, this.tag);
    this.definition = DataStore.getModuleDefinition(this.name, this.tag);
    this.timelineSpec = DataStore.getTimelines(this.name, this.tag);
    this.config = DataStore.getConfig(this.name, this.tag);
    this.runtimeConfiguration = runtimeConfiguration || {};
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
    this.states = new States(this.famousNode, this.definition.states);
    this.timelines = new Timelines(this.timelineSpec, this.states);
    this.behaviors = new Behaviors(this.definition.behaviors);
    this.controlFlowDataMngr = new ControlFlowDataManager(this.behaviors.getBehaviorList());
    this.blockControlFlow = false;
    this.events = new Events(this.definition.events, this.name, this.dependencies, this.getRootNode());

    DataStore.registerFamousFrameworkComponent(this.uid, this);
    this._setEventListeners();
    this._initialize();

    if (cb) {
        return cb(this);
    }
}

/*-----------------------------------------------------------------------------------------*/
// Initialization
/*-----------------------------------------------------------------------------------------*/

Component.prototype._initialize = function _initialize() {
    this._initializeControlFlow();
    this._processDOMMessages();
    this._processRoute();
    this._runBehaviors();
    this._executeAttachments();

    var expandedBlueprint = this.tree.getExpandedBlueprint();
    this.events.initializeDescendantEvents(expandedBlueprint, this.uid);
    this._createExpandedBlueprintObserver(expandedBlueprint);
    this._maybeExposeStates();
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
        var addedNode;
        var addedNodeUID;
        for (var i = 0; i < mutations.length; i++) {
            mutation = mutations[i];

            // Record newly added node UIDs
            if (mutation.addedNodes.length > 0) {
                for (var j = 0; j < mutation.addedNodes.length; j++) {
                    addedNode = mutation.addedNodes[j];
                    if (VirtualDOM.isElementNode(addedNode) && !VirtualDOM.isValidHTMLElement(addedNode)) {
                        addedNodeUID = VirtualDOM.getUID(addedNode);

                        // In cases where we're setting the content of bare DOM elements in the
                        // tree, those mutation nodes don't have a UID, and there's no point
                        // to adding them to this list, because that results in the same events
                        // being added over and over again
                        if (addedNodeUID !== null && addedNodeUID !== undefined) {
                            addedNodesUIDs.push(addedNodeUID);
                        }
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

// Process messages that get attached to the node via the processing of $if/$repeat behaviors
// by the control flow conduit. The message attached to the node corresponds to a set of
// payloads that the parent would like to send to the component's public events. The message
// also contains the component's index with respect to its parent's children (e.g. `parentNode.children`)
// array. That $index/$repeatPayload get saved to the component's state manager and can be accessed
// using `$state.get`.
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

// This method runs all the behaviors defined by a component that either have no paramaters (i.e.,
// static behaviors that should be run on initialization) or have parameters whose names match
// a piece of definted state.
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

// Runs the callback passed to `FamousFramework.attach`. This callback can
// inject `$famousNode` which enables a pass through from FamousEngine to FamousEngine
// as the FamousEngine can create a scene graph and attach itself to the FamousEngine node
// associated with the component.
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

// Apply the $if/$repeat/$yield behaviors to the component's tree. The side effect
// of this function is an updated expanded blueprint based on the result of the $if/$repeat
// behaviors. This update ensures that behaviors will properly target child components.
// The other side effect of this function is that after the $yield conduit runs, the set of
// child components are definted and instantiated before the current component is fully done
// loading. This is a bottom-up approach to building out the scene graph.
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

    // Remove the control flow action message since the components are added to the
    // scene graph via the _updateChildren method.
    VirtualDOM.removeAttribute(this.getRootNode(), CONTROL_FLOW_ACTION_KEY);
    VirtualDOM.removeAttributeFromDescendants(expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
};

// Parses the children root then creates child components and renders valid HTML.
// The child components are created out of the unrecognized HTML nodes (i.e., the
// ones that correspond to FamousFramework components). A DOM wrapper made out of
// FamousEngine's DOMElement is created to render the valid HTML content.
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

// Creates a FamousEngine DOMElement in order to properly render valid HTML
// that is inserted as a child of the current component.
Component.prototype._attachDOMWrapper = function _attachDOMWrapper(domNodes) {
    var wrapperNode = FamousConnector.addChild(this.famousNode);
    var content = '';
    for (var i = 0; i < domNodes.length; i++) {
        content += domNodes[i].outerHTML;
    }
    var famousDomElement = FamousConnector.attachDOMElement(wrapperNode, content);
    DataStore.registerDOMWrapper(this.uid, famousDomElement);
};

// Updates the expanded blueprint and scene graph based on post-instantation
// triggering of the $repeat beavhior.
Component.prototype.processDynamicRepeat = function processDynamicRepeat(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();
    ControlFlow.processRepeatBehavior(
        behavior, expandedBlueprint, this.uid, this.controlFlowDataMngr
    );
    this._processControlFlowMessages(behavior);
};

// Updates the expanded blueprint and scene graph based on post-instantation
// triggering of the $if beavhior.
Component.prototype.processDynamicIf = function processDynamicIf(behavior) {
    var expandedBlueprint = this.tree.getExpandedBlueprint();

    ControlFlow.processIfBehavior(
        behavior, expandedBlueprint, this.uid, this.controlFlowDataMngr
    );

    this._processControlFlowMessages(behavior);
};

// Collects all of the component's children that have a control flow message, processes the message,
// and then triggers a re-run of the component's behaviors if new nodes are added so that they can
// be properly instantiated with properties passed down from the parent.
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

// Creates or deletes nodes from the expanded blueprint and components in the scene graph
// based on the value of the control flow message.
Component._processControlFlowMessage = function _processControlFlowMessage(node, progenitorExpandedBlueprint) {
    var info = VirtualDOM.getAttribute(node, CONTROL_FLOW_ACTION_KEY);
    if (info) {
        info = JSON.parse(info);

        if (info.parentUID) {
            var parentComponent = DataStore.getComponent(info.parentUID);
            var parentExpandedBlueprint = parentComponent.tree.getExpandedBlueprint();
        }

        if (info.message === CREATE_KEY) {
            var parentControlFlowDataMngr = parentComponent.controlFlowDataMngr;

            // Dynamic $yield processes the newly added node and creates a wrapper for it when necessary (i.e., when
            // $yield is applied to a descendant and wrapper nodes are created for each yielded element to enable
            // layout components.) The parent UID stored in the info object may be overwritten.
            var newNode = ControlFlow.processDynamicYield(node, parentExpandedBlueprint, parentControlFlowDataMngr);
            var parentUID = JSON.parse(VirtualDOM.getAttribute(newNode, CONTROL_FLOW_ACTION_KEY)).parentUID;
            var baseNode = VirtualDOM.clone(newNode);
            VirtualDOM.removeChildNodes(baseNode);
            VirtualDOM.removeAttribute(baseNode, CONTROL_FLOW_ACTION_KEY);
            return new Component(baseNode, newNode, DataStore.getComponent(parentUID));
        }
        else if (info.message === DELETE_KEY) {
            // Check to see if parent node is a 'wrapper' node that should be remove
            var component = DataStore.getComponent(VirtualDOM.getUID(node));
            var wrapperNode = component.tree.getRootNode().parentNode;
            if (VirtualDOM.getAttribute(wrapperNode, WRAPPER_NODE_KEY)) {
                var wrapperNodeUID = VirtualDOM.getUID(wrapperNode);
                VirtualDOM.removeNodeByUID(parentExpandedBlueprint, wrapperNodeUID);
            }
            else {
                wrapperNode = null;
            }

            // Remove the node from its progenitor (i.e., component that defined control flow behavior)
            // because node._remove only removes the node from the rootNode.
            VirtualDOM.removeNodeByUID(progenitorExpandedBlueprint, VirtualDOM.getUID(node));
            Utilities.getComponent(node)._remove();
            if (wrapperNode) Utilities.getComponent(wrapperNode)._remove();
        }
        else {
            throw new Error('`' + info.message + '` is not a valid Control Flow Message');
        }
    }
    return null;
};

Component.prototype._maybeExposeStates = function() {
    if (this.config.expose) {
        var fieldsExposed = [];

        if (this.config.expose.constructor === Array) {
            var explicitFields = this.config.expose;
            for (var i = 0; i < explicitFields.length; i++) {
                var explicitField = explicitFields[i];
                var stateManagerValue = this.states.get(explicitField.key);
                var finalValue = (stateManagerValue !== undefined) ? stateManagerValue : explicitField.default;
                var fieldToExpose = {};
                fieldToExpose.key = explicitField.key;
                fieldToExpose.name = explicitField.name || explicitField.key;
                fieldToExpose.value = finalValue;
                if (explicitField.type) {
                    fieldToExpose.type = explicitField.type;
                }
                if (explicitField.range) {
                    fieldToExpose.range = explicitField.range;
                }
                if (explicitField.step) {
                    fieldToExpose.step = explicitField.step;
                }
                fieldsExposed.push(fieldToExpose);
            }
        }
        else if (this.config.expose === true) {
            var stateObj = this.states.getStateObject();
            for (var stateKey in stateObj) {
                var stateVal = stateObj[stateKey];
                if (typeof stateVal === 'string') {
                    fieldsExposed.push({
                        key: stateKey,
                        value: stateVal
                    });
                }
                else if (typeof stateVal === 'number') {
                    fieldsExposed.push({
                        key: stateKey,
                        value: stateVal,
                        type: 'int'
                    });
                }
            }
        }

        this.events.dispatcher.subscribe('$states-configured', function(key, payload) {
            if (payload && this.uid === payload.uid) {
                this.states.set(payload.key, payload.value);
            }
        }.bind(this));

        // The setTimeout here is a hack to ensure that all of the
        // listeners are registered before we actually emit the states
        setTimeout(function() {
            this.events.dispatcher.publish('$states-exposed', {
                uid: this.uid,
                name: this.name,
                fields: fieldsExposed
            });
        }.bind(this), 0);
    }
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

    // TODO --> Remove all listeners
    // TODO --> Recursively remove any children
    // TODO --> Remove from DataStore
};

/*-----------------------------------------------------------------------------------------*/
// Class methods
/*-----------------------------------------------------------------------------------------*/

// Creates a new Famous Scene and builds the scene graph based on the deployed component's
// tree and control flow behaviors.
Component.executeComponent = function executeComponent(name, tag, selector, configuration, cb) {
    var wrapperNode = VirtualDOM.create('parent-tree:' + name);
    var dependencies = DataStore.getDependencies(name, tag);
    var topLevelTree = new Tree(wrapperNode, '', dependencies, VirtualDOM.getBaseNode()); // Shim tree to match Component Constructor API
    var baseNode = VirtualDOM.create(name);
    VirtualDOM.setTag(baseNode, tag);
    VirtualDOM.setUID(baseNode);
    return new Component(baseNode, null, {
        tree: topLevelTree,
        famousNode: FamousConnector.createRoot(selector),
        rootSelector: selector
    }, configuration, cb);
};

module.exports = Component;
