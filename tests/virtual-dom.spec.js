'use strict';

var test = require('tape');
var VirtualDOM = require('../lib/virtual-dom/virtual-dom');
var VirtualDomStub = require('./helpers/virtual-dom-stub');

/*
Virtual DOM Stub One:

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

test('----- Virtual DOM', function(t) {
    t.plan(4);

    t.test('exports', function(st){
        st.plan(1);
        st.ok(VirtualDOM, 'VirtaulDOM exports');
    });

    t.test('query', function(st) {
        st.plan(5);

        var domTree = VirtualDomStub.getStubOne();
        var info = VirtualDomStub.stubOneInfo;

        var parentById = VirtualDOM.query(domTree, '#' + info.PARENT_ID);
        var children = parentById[0].children;
        st.ok(parentById[0] && children.length === info.CHILD_COUNT, 'query by id');

        var firstChild = VirtualDOM.query(domTree, '.' + info.FIRST_CHILD_CLASS_NAME)[0];
        st.ok(firstChild === children[0], 'query by class');

        var grandchildren = VirtualDOM.query(domTree, info.GRANDCHILD_NAME);
        st.ok(grandchildren.length === info.GRANDCHILDREN_COUNT, 'query by name [name:subname]');

        var childrenFromAttribute = VirtualDOM.queryAttribute(domTree, info.UID_KEY);
        st.ok(childrenFromAttribute.length === info.CHILD_COUNT, 'query by attribute name');

        var firstChildFromAttributeValue = VirtualDOM.queryAttribute(domTree, info.UID_KEY, '0');
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

        var domTree = VirtualDomStub.getStubOne();
        var info = VirtualDomStub.stubOneInfo;
        var newParent = document.createElement('new-parent');
        VirtualDOM.transferChildNodes(domTree.children[0], newParent);
        st.ok(domTree.children[0].children.length === 0 && newParent.children.length === info.CHILD_COUNT, 'transfers child nodes between elements');
    });
});
