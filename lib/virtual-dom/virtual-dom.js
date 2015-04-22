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

function addNode(childNode, parentNode) {
    parentNode.appendChild(childNode);
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

function setUID(node, uid) {
    node.setAttribute(UID_KEY, uid);
}

function getUID(node) {
    return node.getAttribute(UID_KEY);
}

module.exports = {
    create: create,
    addNode: addNode,
    getBaseNode: getBaseNode,
    parse: parse,
    clone: clone,
    query: query,
    removeChildNodes: removeChildNodes,
    transferChildNodes: transferChildNodes,
    setUID: setUID,
    getUID: getUID
};
