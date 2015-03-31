'use strict';

var NodeStore = require('./node-store');
var VirtualDOM = require('./virtual-dom');

var ROOT_SELECTOR = '$root';

function Messager(graph) {
    this.graph = graph;
}

Messager.prototype.send = function(selector, key, message) {
    var bestNode;
    var targets;
    if (selector === ROOT_SELECTOR) {
        bestNode = this.graph.rootNode;
        bestNode.eventManager.sendMessage(key, message);
    }
    else {
        targets = this.graph.virtualDOM.querySelectorAll(selector);
        for (var i = 0; i < targets.length; i++) {
            bestNode = NodeStore.findNode(VirtualDOM.getUID(targets[i]));
            bestNode.eventManager.sendMessage(key, message);
        }
    }
};

module.exports = Messager;
