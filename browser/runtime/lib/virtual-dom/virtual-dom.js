'use strict';

var PARSE_TYPE = 'text/html';
var WRAPPER_NAME = 'wrapper';
var DOM_PARSER = new DOMParser();
var DO_CLONE_ATTRIBUTES = true;
var COMPONENT_DELIM = ':';
var ESCAPED_COLON = '\\\:';

var BEST_ROOT = document.createElement('best-root');
var UID_KEY = 'uid';
var TAG_KEY = 'tag';

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
        selector = selector.split(COMPONENT_DELIM).join(ESCAPED_COLON);
    }
    return node.querySelectorAll(selector);
}

// Calls a callback on each target that matches a query. Passes the
// node to the callback function.
function eachNode(node, selector, cb) {
    var targets = query(node, selector);
    for (var i = 0; i < targets.length; i++) {
        cb(targets[i]);
    }
}

function attachAttributeFromJSON(node, json, key) {
    var info = JSON.stringify(json);
    node.setAttribute(key, info);
}

function getAttribute(node, attrName) {
    return node.getAttribute(attrName);
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

function setTag(node, tag) {
    node.setAttribute(TAG_KEY, tag);
}

function getTag(node) {
    return node.getAttribute(TAG_KEY);
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

function removeNodeByUID(tree, uid) {
    var node = getNodeByUID(tree, uid);
    if (!node) {
        throw new Error('Node with UID `' + uid + '` does not exist in the given subtree.');
    }
    node.parentNode.removeChild(node);
}

// TODO --> optimize this function so that it doesn't always
// traverse every node;
function isDescendant(desendant, progenitor) {
    var result = false;
    eachNode(progenitor, '*', function(node){
        if (node === desendant) {
            result = true;
        }
    });
    return result;
}

module.exports = {
    create: create,
    addNode: addNode,
    getBaseNode: getBaseNode,
    parse: parse,
    clone: clone,
    query: query,
    eachNode: eachNode,
    attachAttributeFromJSON: attachAttributeFromJSON,
    getAttribute: getAttribute,
    queryAttribute: queryAttribute,
    removeChildNodes: removeChildNodes,
    transferChildNodes: transferChildNodes,
    removeNodeByUID: removeNodeByUID,
    setTag: setTag,
    getTag: getTag,
    setUID: setUID,
    getUID: getUID,
    getParentUID: getParentUID,
    getNodeByUID: getNodeByUID,
    deleteNode: deleteNode,
    isDescendant: isDescendant
};
