'use strict';

function pruneByAttribute(node, attrName, matchValue) {
    /*------- Process children -------*/
    var childrenCount = node.children.length;
    var childIndex = 0;
    var wasChildRemoved;

    while (childIndex < childrenCount) {
        wasChildRemoved = pruneByAttribute(node.children[childIndex], attrName, matchValue);
        if (wasChildRemoved) {
            childrenCount--;
        }
        else {
            childIndex++;
        }
    }
    /*--------------------------------*/

    var parent = node.parentNode;

    // Remove node if UID doesn't match
    if (node.getAttribute(attrName) !== matchValue) {
        if (parent) {
            parent.removeChild(node);
            node = null;
            return true;
        }
    }
    else if (parent && parent.getAttribute(attrName) !== matchValue) {
        // Ensure node is attached to parent w/ attribue that's equal to matchValue
        while (parent && parent.getAttribute(attrName) !== matchValue) {
            parent = parent.parentNode;
        }
        if (parent) {
            parent.appendChild(node);
            return true;
        }
    }
    else {
        return false;
    }
}

module.exports = {
    pruneByAttribute: pruneByAttribute
};
