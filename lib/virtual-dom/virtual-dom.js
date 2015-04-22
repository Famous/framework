var PARSE_TYPE = 'text/html';
var WRAPPER_NAME = 'wrapper';
var DOM_PARSER = new DOMParser();
var DO_CLONE_ATTRIBUTES = true;
var COMPONENT_DELIM = ':';

var BEST_ROOT = document.createElement('best-root');
var UID_KEY = 'uid';

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

function removeChildNodes(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
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

function query(node, selector) {
    if (selector.indexOf(COMPONENT_DELIM) !== -1) {
        // Strings like 'foo:bar:baz' aren't supported by
        // querySelector/querySelectorAll unless the colon
        // is escaped using a backslash.
        selector = selector.replace(COMPONENT_DELIM_RE, ESCAPED_COLON);
    }
    return node.querySelectorAll(selector);
}

function getUID(node) {
    return node.getAttribute(UID_KEY);
}

module.exports = {
    addNode: addNode,
    getBaseNode: getBaseNode,
    parse: parse,
    clone: clone,
    query: query,
    removeChildNodes: removeChildNodes,
    transferChildNodes: transferChildNodes,
    getUID: getUID
};
