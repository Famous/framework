'use strict';

var UID = require('./helpers/uid');

var UID_KEY = 'uid';
var UID_PREFIX = 'node';
var NODES = {};

function saveNode(node) {
    node.uid = UID.generate(UID_PREFIX);
    node.domNode.setAttribute(UID_KEY, node.uid);
    NODES[node.uid] = node;
}

function findNode(uid) {
    return NODES[uid];
}

module.exports = {
    NODES: NODES,
    findNode: findNode,
    saveNode: saveNode
};
