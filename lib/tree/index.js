var UID = require('framework-utilities/uid');
var VirtualDOM = require('./../virtual-dom');

function Tree(name, uid, treeString, parentNode) {
    this.rootNode = VirtualDOM.addNode(name, uid, parentNode);
    this.snapshotTree = VirtualDOM.parse(treeString);
    Tree.assignChildUIDs(this.snapshotTree);
}

Tree.prototype.getSnapshot = function() {
    return this.snapshotTree;
};

Tree.isUnknownElement = function(element) {
    return element instanceof HTMLUnknownElement;
};

Tree.assignChildUIDs = function(parent) {
    for (var i = 0; i < parent.children.length; i++) {
        var child = parent.children[i];
        // BEST component DOM nodes are instances of `HTMLUnknownElement`;
        // we use this to detect whether we have entered a leaf node.
        if (Tree.isUnknownElement(child)) {
            child.setAttribute('uid', UID.generate());    
            Tree.assignChildUIDs(parent.children[i]);
        }
    }
};

Tree.prototype.findBehaviorTargets = function(selector) {
    //console.log(selector);
};

module.exports = Tree;
