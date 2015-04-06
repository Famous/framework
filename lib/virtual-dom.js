'use strict';

var PARSE_TYPE = 'text/html';
var UID_KEY = 'uid';
var DO_CLONE_ATTRIBUTES = true;
var DOM_PARSER = new DOMParser();

function create(str) {
    return document.createElement(str);
}

function parse(str) {
    return DOM_PARSER.parseFromString(str, PARSE_TYPE).body;
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

function transferChildNodes(from, to) {
    while (from.childNodes[0]) {
        to.appendChild(from.childNodes[0]);
    }
}

function getUID(domNode) {
    return domNode.getAttribute(UID_KEY);
}

function attachAttributeToNodes(domNode, key, value) {
    domNode.setAttribute(key, value);
    for (var i = 0; i < domNode.children.length; i++) {
        attachAttributeToNodes(domNode.children[i], key, value);
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
