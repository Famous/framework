'use strict';

var PARSE_TYPE = 'text/html';
var UID_KEY = 'uid';
var DO_CLONE_ATTRIBUTES = true;
var DOM_PARSER = new DOMParser();

var WRAPPER_NAME = 'wrapper';
var LEAF_NODES = {
    'famous:html-element': true
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
