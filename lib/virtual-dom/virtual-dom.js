var PARSE_TYPE = 'text/html';
var WRAPPER_NAME = 'wrapper';
var DOM_PARSER = new DOMParser();
var BEST_ROOT = document.createElement('best-root');
var DO_CLONE_ATTRIBUTES = true;

function create(str) {
    return document.createElement(str);
}

function addNode(name, uid, parentNode) {
    var childNode = create(name);
    childNode.setAttribute('uid', uid);
    parentNode.appendChild(childNode);
    return childNode;
}

function getBaseNode() {
    return BEST_ROOT;
}

function transferChildNodes(from, to) {
    while (from.childNodes[0]) {
        to.appendChild(from.childNodes[0]);
    }
}

function parse(str) {
    var parsed = DOM_PARSER.parseFromString(str, PARSE_TYPE).body;
    var wrapper = create(WRAPPER_NAME);
    transferChildNodes(parsed, wrapper);
    return wrapper;
}

function clone(node) {
    return node.cloneNode(DO_CLONE_ATTRIBUTES);
}

module.exports = {
    addNode: addNode,
    getBaseNode: getBaseNode,
    parse: parse,
    clone: clone
};
