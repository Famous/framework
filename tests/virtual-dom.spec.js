'use strict';

var test = require('tape');
var VirtualDOM = require('../lib/virtual-dom/virtual-dom');

var PARENT_ID = 'PARENT';
var FIRST_CHILD_CLASS_NAME = 'FIRST_CHILD';
var GRANDCHILD_NAME = 'grandchild:element';
var GRANDCHILDREN_COUNT = 3;
var CHILD_COUNT = 6;
var UID_KEY = 'uid';
/*
wrapper
    parent:element#PARENT
        child:element.FIRST_CHILD(uid=0)
            grandchild:element
        child:element(uid=1)
            grandchild:element
        child:element(uid=2)
            grandchild:element
        child:element(uid=3)
        child:element(uid=4)
        child:element(uid=5)
 */

function createVirtualDOMTree () {
    var wrapper = document.createElement('wrapper');
    var parent = document.createElement('parent:element');
    parent.id = PARENT_ID;
    wrapper.appendChild(parent);

    var child
    var grandchild;
    for(var i = 0; i < CHILD_COUNT; i++) {
        child = document.createElement('child:element');
        child.setAttribute(UID_KEY, i);
        parent.appendChild(child);
        if (i === 0) {
            child.className = FIRST_CHILD_CLASS_NAME;
        }
        if (i < GRANDCHILDREN_COUNT) {
            grandchild = document.createElement(GRANDCHILD_NAME);
            child.appendChild(grandchild);
        }
    }

    return wrapper;
}

test('---- Virtual DOM', function(t) {
    t.plan(4);

    t.test('exports', function(st){
        st.plan(1);
        st.ok(VirtualDOM, 'VirtaulDOM exports');
    });

    t.test('query', function(st) {
        st.plan(5);

        var domTree = createVirtualDOMTree();

        var parentById = VirtualDOM.query(domTree, '#' + PARENT_ID);
        var children = parentById[0].children;
        st.ok(parentById[0] && children.length === CHILD_COUNT, 'query by id');

        var firstChild = VirtualDOM.query(domTree, '.' + FIRST_CHILD_CLASS_NAME)[0];
        st.ok(firstChild === children[0], 'query by class');

        var grandchildren = VirtualDOM.query(domTree, GRANDCHILD_NAME);
        st.ok(grandchildren.length === GRANDCHILDREN_COUNT, 'query by name [name:subname]');

        var childrenFromAttribute = VirtualDOM.queryAttribute(domTree, UID_KEY);
        st.ok(childrenFromAttribute.length === CHILD_COUNT, 'query by attribute name');

        var firstChildFromAttributeValue = VirtualDOM.queryAttribute(domTree, UID_KEY, '0');
        st.ok(firstChild === firstChildFromAttributeValue[0], 'query by attribute value');
    });

    t.test('parse', function(st) {
        st.plan(1);
        var str = '' +
            '<div id="parent">' +
            '   <div class="child"></div>' +
            '   <div class="child"></div>' +
            '   <div class="child"></div>' +
            '</div>';
        var el = VirtualDOM.parse(str);
        st.ok(el.children[0].children.length === 3, 'parses string into DOM Element');
    });

    t.test('transfer child nodes', function(st) {
        st.plan(1);

        var domTree = createVirtualDOMTree();
        var newParent = document.createElement('new-parent');
        VirtualDOM.transferChildNodes(domTree.children[0], newParent);
        st.ok(domTree.children[0].children.length === 0 && newParent.children.length === CHILD_COUNT, 'transfers child nodes between elements');
    });
});
