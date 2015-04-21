var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var UID_KEY = 'uid';
var NODE_UID_PREFIX = 'node';
var EMPTY_STRING = '';

function Tree(name, uid, treeString, parentNode) {
    this.rootNode = VirtualDOM.addNode(name, uid, parentNode);
    this.blueprint = VirtualDOM.parse(treeString || EMPTY_STRING);
    Tree.assignChildUIDs(this.blueprint);

    this.expandedBlueprint = null;
    this.childrenRoot = null;
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
}

Tree.prototype.getChildrenRoot = function getChildrenRoot() {
    return this.childrenRoot;
}

Tree.prototype.eachChildrootNode = function eachChildrootNode(cb) {
    var node;
    var name;
    var uid;
    for (var i = 0; i < this.childrenRoot.children.length; i++) {
        node = this.childrenRoot.children[i];
        name = node.tagName.toLowerCase();
        uid = node.getAttribute(UID_KEY);
        cb(node, name, uid);
    }
};

Tree.isUnknownElement = function isUnknownElement(element) {
    return element instanceof HTMLUnknownElement;
};

Tree.assignChildUIDs = function assignChildUIDs(parent) {
    for (var i = 0; i < parent.children.length; i++) {
        var child = parent.children[i];
        // BEST component DOM nodes are instances of `HTMLUnknownElement`;
        // we use this to detect whether we have entered a leaf node.
        if (Tree.isUnknownElement(child)) {
            child.setAttribute(UID_KEY, UID.generate(NODE_UID_PREFIX));
            Tree.assignChildUIDs(parent.children[i]);
        }
    }
};

Tree.prototype.findBehaviorTargets = function findBehaviorTargets(selector) {
    // TODO --> run selector on expanded blueprint
};

module.exports = Tree;
