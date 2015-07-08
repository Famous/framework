'use strict';

/*
 * We aren't actually using true virtual DOM yet, but we plan to incorporate it
 * in the near future. For now we are simply using a detached DOM tree. TODO
 */

var UID = require('./../utilities/uid');

var FAMOUS_FRAMEWORK_ROOT = document.createElement('famous-framework-root');
var COMPONENT_DELIM = ':';
var DO_CLONE_ATTRIBUTES = true;
var DOM_PARSER = new DOMParser();
var ESCAPED_COLON = '\\\:';
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_TEXT = 3;
var NODE_UID_PREFIX = 'node';
var PARSE_TYPE = 'text/html';
var SELF_KEY = '$self';
var TAG_KEY = 'tag';
var UID_KEY = 'uid';
var UNKNOWN_ELEMENT_NAME = 'HTMLUnknownElement';
var VALID_HTML_TAGS = [
    '<a>', '<abbr>', '<address>', '<area>', '<article>', '<aside>', '<audio>', '<b>',
    '<base>', '<bdi>', '<bdo>', '<blockquote>', '<body>', '<br>', '<button>', '<canvas>',
    '<caption>', '<cite>', '<code>', '<col>', '<colgroup>', '<command>', '<content>', '<data>',
    '<datalist>', '<dd>', '<del>', '<details>', '<dfn>', '<div>', '<dl>', '<dt>', '<element>',
    '<em>', '<embed>', '<fieldset>', '<figcaption>', '<figure>', '<font>', '<footer>', '<form>',
    '<h1>', '<h2>', '<h3>', '<h4>', '<h5>', '<h6>', '<head>', '<header>', '<hgroup>', '<hr>', '<html>',
    '<i>', '<iframe>', '<image>', '<img>', '<input>', '<ins>', '<kbd>', '<keygen>', '<label>', '<legend>',
    '<li>', '<link>', '<main>', '<map>', '<mark>', '<menu>', '<menuitem>', '<meta>', '<meter>', '<nav>',
    '<noframes>', '<noscript>', '<object>', '<ol>', '<optgroup>', '<option>', '<output>', '<p>', '<param>',
    '<picture>', '<pre>', '<progress>', '<q>', '<rp>', '<rt>', '<rtc>', '<ruby>', '<s>', '<samp>', '<script>',
    '<section>', '<select>', '<shadow>', '<small>', '<source>', '<span>', '<strong>', '<style>', '<sub>',
    '<summary>', '<sup>', '<table>', '<tbody>', '<td>', '<template>', '<textarea>', '<tfoot>', '<th>',
    '<thead>', '<time>', '<title>', '<tr>', '<track>', '<u>', '<ul>', '<var>', '<video>', '<wbr>'
];
var WHITE_SPACE_REGEX = /^\s*$/g;
var WRAPPER_NAME = 'wrapper';

function create(str) {
    return document.createElement(str);
}
 function addNode(childNode, parentNode) {
    parentNode.appendChild(childNode);
}

function getBaseNode() {
    return FAMOUS_FRAMEWORK_ROOT;
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

    // Behavior of DOMParser in IE is subtly different than other
    // browsers. If the string is empty then the body will end up
    // as null, so we check here to decide if there is anything to
    // transfer over before bothering to call transferChildNodes
    if (parsed) {
        transferChildNodes(parsed, wrapper);
    }

    return wrapper;
}

function clone(node) {
    return node.cloneNode(DO_CLONE_ATTRIBUTES);
}

function query(node, selector) {
    if (selector === SELF_KEY) {
        return [node];
    }
    else {
        if (selector.indexOf(COMPONENT_DELIM) !== -1) {
            // Strings like 'foo:bar:baz' aren't supported by
            // querySelector/querySelectorAll unless the colon
            // is escaped using a backslash.
            selector = selector.split(COMPONENT_DELIM).join(ESCAPED_COLON);
        }
        return node.querySelectorAll(selector);
    }
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
    // Attributes cannot be attached to text nodes
    if (node.nodeType === NODE_TYPE_TEXT) {
        return;
    }

    var info = JSON.stringify(json);
    node.setAttribute(key, info);
}

function getAttribute(node, attrName) {
    if (node.nodeType === 3) {
        return null;
    }
    else {
        return node.getAttribute(attrName);
    }
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

function setUID(node) {
    node.setAttribute(UID_KEY, UID.generate(NODE_UID_PREFIX));
}

function assignChildUIDs(parentNode) {
    var i;
    var child;
    for (i = 0; i < parentNode.children.length; i++) {
        child = parentNode.children[i];
        if (!isValidHTMLElement(child)) {
            setUID(child);
            assignChildUIDs(child);
        }
    }
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

function isValidHTMLElement(domNode) {
    if (domNode.constructor.name === UNKNOWN_ELEMENT_NAME || isTextNode(domNode) || domNode.nodeType === NODE_TYPE_COMMENT) {
        return false;
    }
    else {
        var tag = '<' + domNode.tagName.toLowerCase() + '>';
        return VALID_HTML_TAGS.indexOf(tag) !== -1;
    }
}

function isTextNode(node) {
    return node.nodeType === NODE_TYPE_TEXT;
}

function isElementNode(node) {
    return node.nodeType === NODE_TYPE_ELEMENT;
}

function stripHTMLElements(domNode) {
    var htmlElements = [];
    var nodesToProcess = domNode.childNodes.length;
    var processCount = 0;
    var childIndex = 0;
    var child;
    while (processCount < nodesToProcess) {
        child = domNode.childNodes[childIndex];
        if (isTextNode(child) || isValidHTMLElement(child)) {
            htmlElements.push(domNode.removeChild(child));
        }
        else {
            childIndex++;
        }
        processCount++;
    }
    return htmlElements;
}

function removeAttribute(domNode, name) {
    domNode.removeAttribute(name);
    return domNode;
}

function removeAttributeFromDescendants(domNode, name) {
    domNode.removeAttribute(name);
    for (var i = 0; i < domNode.children.length; i++) {
        removeAttributeFromDescendants(domNode.children[i], name)
    }
}

function doNodesHaveContent(nodes) {
    if (nodes.length === 0) {
        return false;
    }
    else {
        var node;
        for (var i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (node.nodeType === NODE_TYPE_ELEMENT) {
                return true;
            }
            else if (node.nodeType === NODE_TYPE_TEXT) {
                if (node.textContent.match(WHITE_SPACE_REGEX) === null) {
                    return true;
                }
            }
        }
        return false;
    }
}

function isElementNode(node) {
    return node.nodeType === NODE_TYPE_ELEMENT;
}

module.exports = {
    addNode: addNode,
    attachAttributeFromJSON: attachAttributeFromJSON,
    assignChildUIDs: assignChildUIDs,
    clone: clone,
    create: create,
    deleteNode: deleteNode,
    doNodesHaveContent: doNodesHaveContent,
    eachNode: eachNode,
    getAttribute: getAttribute,
    getBaseNode: getBaseNode,
    getNodeByUID: getNodeByUID,
    getParentUID: getParentUID,
    getTag: getTag,
    getUID: getUID,
    isDescendant: isDescendant,
    isElementNode: isElementNode,
    isValidHTMLElement: isValidHTMLElement,
    parse: parse,
    query: query,
    queryAttribute: queryAttribute,
    removeAttribute: removeAttribute,
    removeAttributeFromDescendants: removeAttributeFromDescendants,
    removeChildNodes: removeChildNodes,
    removeNodeByUID: removeNodeByUID,
    setTag: setTag,
    setUID: setUID,
    stripHTMLElements: stripHTMLElements,
    transferChildNodes: transferChildNodes
};
