'use strict';

var VirtualDOM = require('./../virtual-dom/virtual-dom');

var CONTROL_FLOW_ACTION_KEY = 'control-flow-action';
var EMPTY_STRING = '';
var REPEAT_INFO_KEY = 'repeat-info';

function Tree(rootNode, treeString, dependencies, parentNode) {
    this.rootNode = rootNode;
    VirtualDOM.addNode(this.rootNode, parentNode);

    this.blueprint = VirtualDOM.clone(this.rootNode);
    var blueprintChildrenWrapper = VirtualDOM.parse(treeString || EMPTY_STRING);

    VirtualDOM.transferChildNodes(blueprintChildrenWrapper, this.blueprint);
    VirtualDOM.assignChildUIDs(this.blueprint);
    Tree.assignDependencyTags(this.blueprint, dependencies);

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
};

Tree.prototype.eachChild = function eachChild(cb) {
    for (var i = 0; i < this.childrenRoot.children.length; i++) {
        cb(this.childrenRoot.children[i]);
    }
};

Tree.assignDependencyTags = function assignDependencyTags(node, dependencies) {
    var allNodes = VirtualDOM.query(node, '*');
    for (var i = 0; i < allNodes.length; i++) {
        var subNode = allNodes[i];
        var tagName = subNode.tagName.toLowerCase();
        if (dependencies[tagName]) {
            VirtualDOM.setTag(subNode, dependencies[tagName]);
        }
    }
};

Tree.removeAttributes = function removeAttributes(nodes, attrName) {
    for (var i = 0; i < nodes.length; i++) {
        VirtualDOM.removeAttribute(nodes[i], attrName);
    }
};

Tree.prototype.stripExpandedBlueprintMessages = function stripExpandedBlueprintMessages() {
    var targets;
    targets = VirtualDOM.queryAttribute(this.expandedBlueprint, CONTROL_FLOW_ACTION_KEY);
    Tree.removeAttributes(targets, CONTROL_FLOW_ACTION_KEY);
    targets = VirtualDOM.queryAttribute(this.expandedBlueprint, REPEAT_INFO_KEY);
    Tree.removeAttributes(targets, REPEAT_INFO_KEY);
};

module.exports = Tree;
