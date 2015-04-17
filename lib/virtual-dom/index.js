var BEST_ROOT = document.createElement('best-root');

function addNode(name, uid, parentNode) {
    var childNode = document.createElement(name);
    childNode.setAttribute('uid', uid);
    parentNode.appendChild(childNode);
    return childNode;
}

function getBaseNode() {
    return BEST_ROOT;
}

module.exports = {
    addNode: addNode,
    getBaseNode: getBaseNode
};
