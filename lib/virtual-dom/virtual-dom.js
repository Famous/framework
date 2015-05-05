'use strict';

var PARSE_TYPE = 'text/html';
var WRAPPER_NAME = 'wrapper';
var DOM_PARSER = new DOMParser();
var DO_CLONE_ATTRIBUTES = true;
var COMPONENT_DELIM = ':';
var ESCAPED_COLON = '\:';
var ESCAPED_BACKSLASH_COLON = '\\\:';

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

function deleteNode(node) {
    removeChildNodes(node);
    node.parentNode.removeChild(node);
    node = null;
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
        selector = selector.replace(ESCAPED_COLON, ESCAPED_BACKSLASH_COLON);
    }
    return node.querySelectorAll(selector);
}

function queryAttribute(node, attributeName, value) {
    var selector;
    if (typeof value !== 'undefined') {
        selector = '[' + attributeName + '="' + value + '"]';
    }
    else {
        selector = '[' + attributeName + ']';
    }
    return query(node, selector);
}

function setUID(node, uid) {
    node.setAttribute(UID_KEY, uid);
}

function getUID(node) {
    return node.getAttribute(UID_KEY);
}

function getParentUID(node) {
    return getUID(node.parentNode);
}

function getNodeByUID(root, uid) {
    return query(root, '[' + UID_KEY + '="' + uid + '"]')[0];
}

module.exports = {
    create: create,
    addNode: addNode,
    getBaseNode: getBaseNode,
    parse: parse,
    clone: clone,
    query: query,
    queryAttribute: queryAttribute,
    removeChildNodes: removeChildNodes,
    transferChildNodes: transferChildNodes,
    setUID: setUID,
    getUID: getUID,
    getParentUID: getParentUID,
    getNodeByUID: getNodeByUID,
    deleteNode: deleteNode
};
