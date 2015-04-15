'use strict';

var PARSE_TYPE = 'text/html';
var UID_KEY = 'uid';
var COMPONENT_DELIM = ':';
var COMPONENT_DELIM_RE = /:/g;
var ESCAPED_COLON = '\\:';
var DO_CLONE_ATTRIBUTES = true;
var DOM_PARSER = new DOMParser();

var WRAPPER_NAME = 'wrapper';
var LEAF_NODES = {
    'famous:core:dom-element': true,
    'famous:core:ui-element': true
};

function create(str) {
    return document.createElement(str);
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

function clone(domNode) {
    return domNode.cloneNode(DO_CLONE_ATTRIBUTES);
}

function query(domNode, selector) {
    if (selector.indexOf(COMPONENT_DELIM) !== -1) {
        // Strings like 'foo:bar:baz' aren't supported by
        // querySelector/querySelectorAll unless the colon
        // is escaped using a backslash.
        selector = selector.replace(COMPONENT_DELIM_RE, ESCAPED_COLON);
    }
    return domNode.querySelectorAll(selector);
}

function empty(domNode) {
    while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
    }
}

function getUID(domNode) {
    return domNode.getAttribute(UID_KEY);
}

function attachAttributeToNodes(domNode, key, value) {
    domNode.setAttribute(key, value);
    var name = domNode.tagName.toLowerCase();
    if (!(name in LEAF_NODES)) {
        for (var i = 0; i < domNode.children.length; i++) {
            attachAttributeToNodes(domNode.children[i], key, value);
        }
    }
}

module.exports = {
    create: create,
    parse: parse,
    clone: clone,
    query: query,
    empty: empty,
    transferChildNodes: transferChildNodes,
    getUID: getUID,
    attachAttributeToNodes: attachAttributeToNodes
};
