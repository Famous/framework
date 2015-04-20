var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom/virtual-dom');

var UID_KEY = 'uid';
var NODE_UID_PREFIX = 'node';
var EMPTY_STRING = '';

function Tree(name, uid, treeString, parentNode) {
    this.rootNode = VirtualDOM.addNode(name, uid, parentNode);
    this.treeBlueprint = VirtualDOM.parse(treeString || EMPTY_STRING);
    this.expandedBlueprint = VirtualDOM.clone(this.treeBlueprint);

    Tree.assignChildUIDs(this.treeBlueprint);
}

Tree.prototype.getBlueprint = function getBlueprint() {
    return this.treeBlueprint;
};

Tree.prototype.getExpandedBlueprint = function getExpandedBlueprint() {
    return this.expandedBlueprint;
};

Tree.prototype.eachBlueprintChild = function eachBlueprintChild(cb) {
    var node;
    var name;
    var uid;
    for (var i = 0; i < this.treeBlueprint.children.length; i++) {
        node = this.treeBlueprint.children[i];
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
    //console.log(selector);
};

module.exports = Tree;
