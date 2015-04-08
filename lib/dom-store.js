'use strict';

var VirtualDOM = require('./virtual-dom');
var PruneTree = require('./helpers/prune-tree');

var TREE_SIG_ATTR_KEY = 'tree_sig';
var EMPTY_TREE = '';

function DomStore(bestNode) {
    this.bestNode = bestNode;
    this.domNode = bestNode.domNode;
    this.treeString = bestNode.definition.tree || EMPTY_TREE;
    this.childrenRoot = VirtualDOM.parse(this.treeString);
    this.surrogateRoot = VirtualDOM.clone(this.domNode);
    VirtualDOM.attachAttributeToNodes(
        this.childrenRoot,
        TREE_SIG_ATTR_KEY,
        VirtualDOM.getUID(this.domNode)
    );
}

DomStore.prototype.buildTreeSignature = function() {
    this.treeSignature = VirtualDOM.clone(this.domNode);

    PruneTree.pruneByAttribute(
        this.treeSignature,
        TREE_SIG_ATTR_KEY,
        VirtualDOM.getUID(this.domNode)
    );
};

module.exports = DomStore;
