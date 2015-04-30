var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var NODE_UID_PREFIX = 'node';
var EMPTY_STRING = '';
var REPEAT_INFO_KEY = 'repeat-info';
var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';

function Tree(rootNode, treeString, parentNode) {
    this.rootNode = rootNode;
    VirtualDOM.addNode(this.rootNode, parentNode);

    this.blueprint = VirtualDOM.clone(this.rootNode);
    blueprintChildrenWrapper = VirtualDOM.parse(treeString || EMPTY_STRING);
    VirtualDOM.transferChildNodes(blueprintChildrenWrapper, this.blueprint);
    Tree.assignChildUIDs(this.blueprint);

    this.expandedBlueprint = null; // Set via event after $if/$repeat
    this.childrenRoot = null; // Set via event after $yield
}

Tree.prototype.getBlueprint = function getBlueprint() {
    return this.blueprint;
};

Tree.prototype.setExpandedBlueprint = function setExpandedBlueprint(expandedBlueprint) {
    this.expandedBlueprint = expandedBlueprint;
};

Tree.prototype.getExpandedBlueprint = function getExpandedBlueprint() {
    return this.expandedBlueprint;
};

Tree.prototype.setChildrenRoot = function setChildrenRoot(childrenRoot) {
    this.childrenRoot = childrenRoot;
};

Tree.prototype.getChildrenRoot = function getChildrenRoot() {
    return this.childrenRoot;
};

Tree.prototype.getRootNode = function getRootNode() {
    return this.rootNode;
}

Tree.prototype.eachChild = function eachChild(cb) {
    for (var i = 0; i < this.childrenRoot.children.length; i++) {
        cb(this.childrenRoot.children[i]);
    }
};

Tree.isUnknownElement = function isUnknownElement(element) {
    return element instanceof HTMLUnknownElement;
};

Tree.setUID = function(node) {
    VirtualDOM.setUID(node, UID.generate(NODE_UID_PREFIX))
}

Tree.assignChildUIDs = function assignChildUIDs(parent) {
    for (var i = 0; i < parent.children.length; i++) {
        var child = parent.children[i];
        // BEST component DOM nodes are instances of `HTMLUnknownElement`;
        // we use this to detect whether we have entered a leaf node.
        if (Tree.isUnknownElement(child)) {
            Tree.setUID(child);
            Tree.assignChildUIDs(parent.children[i]);
        }
    }
};

Tree.removeAttributes= function removeAttributes(nodes, attrName) {
    for (var i = 0; i < nodes.length; i++) {
        nodes[i].removeAttribute(attrName)
    }
}

Tree.prototype.stripExpandedBlueprintMessages = function stripExpandedBlueprintMessages() {
    var targets;
    targets = VirtualDOM.queryAttribute(this.expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
    Tree.removeAttributes(targets, CONTROL_FLOW_ACTION_KEY);
    targets = VirtualDOM.queryAttribute(this.expandedBlueprint, REPEAT_INFO_KEY);
    Tree.removeAttributes(targets, REPEAT_INFO_KEY);
}

Tree.prototype.findBehaviorTargets = function findBehaviorTargets(selector) {
    // TODO --> run selector on expanded blueprint
};

module.exports = Tree;
